import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UploadService } from '../upload/upload.service';
import { BackupService } from '../backup/backup.service';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);

  constructor(
    private readonly uploadService: UploadService,
    private readonly backupService: BackupService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanOrphanFiles(): Promise<void> {
    this.logger.log('Starting scheduled cleanup of orphan files...');
    try {
      await this.uploadService.cleanOrphanFiles();
      this.logger.log(
        'Scheduled cleanup of orphan files completed successfully.',
      );
    } catch (error) {
      this.logger.error(
        'Error occurred during scheduled cleanup of orphan files:',
        error,
      );
    }
  }

  @Cron(process.env.BACKUP_CRON || '0 2 * * *')
  async backupDatabase(): Promise<void> {
    this.logger.log('Starting scheduled database backup...');
    const result = await this.backupService.runBackup();
    if (result.success) {
      this.logger.log(
        `Scheduled database backup completed: ${result.fileName}`,
      );
    } else {
      this.logger.error(`Scheduled database backup failed: ${result.error}`);
    }
  }
}
