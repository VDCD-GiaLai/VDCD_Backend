import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { google } from 'googleapis';

const execFileAsync = promisify(execFile);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly tmpDir = join(process.cwd(), 'tmp', 'backups');

  constructor(private readonly configService: ConfigService) {
    if (!existsSync(this.tmpDir)) {
      mkdirSync(this.tmpDir, { recursive: true });
    }
  }

  /**
   * Full backup flow: dump → compress → upload → cleanup
   */
  async runBackup(): Promise<{ success: boolean; fileName?: string; error?: string }> {
    const startTime = Date.now();
    let sqlFilePath: string | undefined;
    let gzFilePath: string | undefined;

    try {
      this.logger.log('🚀 Starting database backup...');

      // 1. Dump database to SQL file
      sqlFilePath = await this.dumpDatabase();
      this.logger.log(`✅ Database dumped: ${sqlFilePath}`);

      // 2. Compress the SQL file
      gzFilePath = await this.compressFile(sqlFilePath);
      this.logger.log(`✅ Compressed: ${gzFilePath}`);

      // 3. Upload to Google Drive
      const driveFileId = await this.uploadToDrive(gzFilePath);
      this.logger.log(`✅ Uploaded to Google Drive (fileId: ${driveFileId})`);

      // 4. Clean old backups on Drive
      const retainCount = this.configService.get<number>('BACKUP_RETAIN_COUNT', 30);
      const deletedCount = await this.cleanOldBackups(retainCount);
      if (deletedCount > 0) {
        this.logger.log(`🗑️  Cleaned ${deletedCount} old backup(s) from Drive`);
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const fileName = gzFilePath.split(/[\\/]/).pop();
      this.logger.log(`🎉 Backup completed in ${elapsed}s — ${fileName}`);

      return { success: true, fileName };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Backup failed: ${message}`, error instanceof Error ? error.stack : '');
      return { success: false, error: message };
    } finally {
      // Cleanup temp files
      await this.cleanTempFile(sqlFilePath);
      await this.cleanTempFile(gzFilePath);
    }
  }

  // ────────────────────────────────────────────────
  // 1. Dump PostgreSQL database using pg_dump
  // ────────────────────────────────────────────────
  private async dumpDatabase(): Promise<string> {
    const host = this.configService.getOrThrow<string>('database.host');
    const port = this.configService.getOrThrow<number>('database.port');
    const dbName = this.configService.getOrThrow<string>('database.name');
    const user = this.configService.getOrThrow<string>('database.user');
    const password = this.configService.getOrThrow<string>('database.password');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `${dbName}_${timestamp}.sql`;
    const filePath = join(this.tmpDir, fileName);

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    if (isProduction) {
      // Production: pg_dump is available directly (installed in Dockerfile)
      const env = { ...process.env, PGPASSWORD: password };
      await execFileAsync(
        'pg_dump',
        [
          '-h', host,
          '-p', String(port),
          '-U', user,
          '-d', dbName,
          '--no-owner',
          '--no-acl',
          '-f', filePath,
        ],
        { env, timeout: 120_000 },
      );
    } else {
      // Development: pg_dump via docker exec on the postgres container
      const containerName = process.env.BACKUP_PG_CONTAINER || 'vdcd-postgres';
      const { stdout } = await execFileAsync(
        'docker',
        [
          'exec',
          '-e', `PGPASSWORD=${password}`,
          containerName,
          'pg_dump',
          '-h', host,
          '-p', String(port),
          '-U', user,
          '-d', dbName,
          '--no-owner',
          '--no-acl',
        ],
        { timeout: 120_000, maxBuffer: 100 * 1024 * 1024 },
      );
      const { writeFile } = await import('fs/promises');
      await writeFile(filePath, stdout, 'utf-8');
    }

    return filePath;
  }

  // ────────────────────────────────────────────────
  // 2. Compress SQL file to .sql.gz
  // ────────────────────────────────────────────────
  private async compressFile(sqlFilePath: string): Promise<string> {
    const gzFilePath = `${sqlFilePath}.gz`;
    const source = createReadStream(sqlFilePath);
    const gzip = createGzip({ level: 9 });
    const destination = createWriteStream(gzFilePath);

    await pipeline(source, gzip, destination);
    return gzFilePath;
  }

  // ────────────────────────────────────────────────
  // 3. Upload file to Google Drive
  // ────────────────────────────────────────────────
  private async uploadToDrive(filePath: string): Promise<string> {
    const drive = this.getDriveClient();
    const folderId = this.configService.getOrThrow<string>('google-drive.folderId');
    const fileName = filePath.split(/[\\/]/).pop()!;

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        description: `VDCD Database backup — ${new Date().toISOString()}`,
      },
      media: {
        mimeType: 'application/gzip',
        body: createReadStream(filePath),
      },
      fields: 'id',
    });

    return response.data.id!;
  }

  // ────────────────────────────────────────────────
  // 4. Clean old backups beyond retention count
  // ────────────────────────────────────────────────
  async cleanOldBackups(retainCount: number): Promise<number> {
    const drive = this.getDriveClient();
    const folderId = this.configService.getOrThrow<string>('google-drive.folderId');

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      orderBy: 'createdTime desc',
      fields: 'files(id, name, createdTime)',
      pageSize: 1000,
    });

    const files = response.data.files ?? [];
    if (files.length <= retainCount) return 0;

    const toDelete = files.slice(retainCount);
    for (const file of toDelete) {
      await drive.files.delete({ fileId: file.id! });
      this.logger.debug(`Deleted old backup: ${file.name} (${file.id})`);
    }

    return toDelete.length;
  }

  // ────────────────────────────────────────────────
  // Helper: get authenticated Google Drive client
  // Supports OAuth2 (personal accounts) and Service Account (Shared Drive)
  // ────────────────────────────────────────────────
  private getDriveClient() {
    const refreshToken = this.configService.get<string>('google-drive.refreshToken');

    if (refreshToken) {
      // OAuth2 approach — works with personal Google accounts
      const clientId = this.configService.getOrThrow<string>('google-drive.clientId');
      const clientSecret = this.configService.getOrThrow<string>('google-drive.clientSecret');

      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({ refresh_token: refreshToken });

      return google.drive({ version: 'v3', auth: oauth2Client });
    }

    // Service Account approach — works with Shared Drives (Google Workspace)
    const keyBase64 = this.configService.getOrThrow<string>('google-drive.serviceAccountKeyBase64');
    const keyJson = JSON.parse(Buffer.from(keyBase64, 'base64').toString('utf-8'));

    const auth = new google.auth.GoogleAuth({
      credentials: keyJson,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    return google.drive({ version: 'v3', auth });
  }

  // ────────────────────────────────────────────────
  // Helper: safely remove temp file
  // ────────────────────────────────────────────────
  private async cleanTempFile(filePath?: string): Promise<void> {
    if (!filePath) return;
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch {
      this.logger.warn(`Failed to clean temp file: ${filePath}`);
    }
  }
}
