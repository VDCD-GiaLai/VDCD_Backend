import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Optional,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import slugify from 'slugify';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { UploadTemp } from './entities/upload-temp.entity';

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  filePath: string;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly imagekit: ImageKit;

  private readonly IMAGE_MAX_SIZE = 10 * 1024 * 1024;
  private readonly FILE_MAX_SIZE = 10 * 1024 * 1024;

  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  private readonly ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  constructor(
    @InjectRepository(UploadTemp)
    private readonly uploadTempRepo: Repository<UploadTemp>,
    private readonly config: ConfigService,
    @Optional()
    private readonly dataSource?: DataSource,
  ) {
    this.imagekit = new ImageKit({
      publicKey: config.getOrThrow<string>('imagekit.publicKey'),
      privateKey: config.getOrThrow<string>('imagekit.privateKey'),
      urlEndpoint: config.getOrThrow<string>('imagekit.urlEndpoint'),
    });
  }

  // ── Upload image ────────────────────────────────────────────────
  async uploadImage(
    file: Express.Multer.File,
    folder = 'images',
    uploadedBy?: string,
  ): Promise<UploadResult> {
    this.validateMimetype(
      file,
      this.ALLOWED_IMAGE_TYPES,
      'jpg, png, webp, gif',
    );
    this.validateSize(file, this.IMAGE_MAX_SIZE, '10MB');
    return this.doUpload(file, folder, uploadedBy);
  }

  async uploadThumbnail(file: Express.Multer.File, uploadedBy?: string) {
    return this.uploadImage(file, 'thumbnails', uploadedBy);
  }

  /**
   * Upload a project image (thumbnail, gallery, or content block image) to ImageKit.
   * Server strictly enforces folder structure: /vdcd/projects/{slug-or-stable-key}.
   * Backend is the sole source of truth:
   *  - If a UUID is provided (projectId), it queries the DB to resolve project.slug.
   *    If project is not found, throws NotFoundException.
   *  - If a slug is provided, it is strictly sanitized to prevent traversal.
   *  - If missing, a stable random session key (project-{random8}) is generated.
   * Client folder overrides or arbitrary path traversal are stripped and forbidden.
   */
  async uploadProjectImage(
    file: Express.Multer.File,
    uploadedBy?: string,
    keyOrSlugOrProjectId?: string,
  ): Promise<UploadResult> {
    let cleanKey = '';

    if (keyOrSlugOrProjectId && typeof keyOrSlugOrProjectId === 'string') {
      const trimmed = keyOrSlugOrProjectId.trim();
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          trimmed,
        );

      if (isUuid) {
        if (this.dataSource?.query) {
          const rows = await this.dataSource.query(
            `SELECT id, slug FROM "project" WHERE "id" = $1 LIMIT 1`,
            [trimmed],
          );
          if (!rows || rows.length === 0) {
            throw new NotFoundException(
              `Không tìm thấy dự án với ID cung cấp: ${trimmed}`,
            );
          }
          cleanKey = rows[0].slug;
        } else {
          cleanKey = trimmed;
        }
      } else {
        // Path traversal, directory separator, or empty protection
        cleanKey = this.sanitizeSubfolder(trimmed);
        cleanKey = cleanKey
          .replace(/\.\./g, '')
          .replace(/^\/+|\/+$/g, '')
          .replace(/\//g, '-')
          .trim();
      }
    }

    if (!cleanKey) {
      cleanKey = `project-${randomUUID().replace(/-/g, '').slice(0, 8)}`;
    }
    const folder = `projects/${cleanKey}`;
    return this.uploadImage(file, folder, uploadedBy);
  }

  /**
   * Sanitize a subfolder string to be URL and CDN safe on ImageKit.
   * Converts accents to ASCII, removes special characters, and prevents path traversal.
   * Example: "bài-viết" -> "bai-viet", "Bài viết mới 2026!" -> "bai-viet-moi-2026"
   */
  sanitizeSubfolder(subfolder?: string): string {
    if (!subfolder) return '';
    return subfolder
      .split('/')
      .map((part) =>
        slugify(part, { lower: true, locale: 'vi', strict: true, trim: true }),
      )
      .filter(Boolean)
      .join('/');
  }

  async uploadSlideImage(
    file: Express.Multer.File,
    uploadedBy?: string,
    subfolder?: string,
  ) {
    const cleanSubfolder = this.sanitizeSubfolder(subfolder);
    const folder = cleanSubfolder ? `slides/${cleanSubfolder}` : 'slides';
    return this.uploadImage(file, folder, uploadedBy);
  }

  async uploadSlideDetailBlogImage(
    file: Express.Multer.File,
    uploadedBy?: string,
    subfolder?: string,
  ) {
    const cleanSubfolder = this.sanitizeSubfolder(subfolder);
    const folder = cleanSubfolder
      ? `slides/${cleanSubfolder}`
      : 'slides/detail-blogs';
    return this.uploadImage(file, folder, uploadedBy);
  }

  /**
   * Upload an article image (thumbnail or content block image) to ImageKit.
   * Folder structure: vdcd/articles/<slug>
   * If slug/title is not provided or empty, a random string is generated for the subfolder.
   */
  async uploadArticleImage(
    file: Express.Multer.File,
    uploadedBy?: string,
    slugOrTitle?: string,
  ): Promise<UploadResult> {
    let cleanSlug = this.sanitizeSubfolder(slugOrTitle);
    if (!cleanSlug) {
      cleanSlug = randomUUID().replace(/-/g, '').slice(0, 10);
    }
    const folder = `articles/${cleanSlug}`;
    return this.uploadImage(file, folder, uploadedBy);
  }

  /**
   * Upload a program image (thumbnail or content block image) to ImageKit.
   * Folder structure: vdcd/programs/<slug>
   * If slug/title is not provided or empty, a random string is generated for the subfolder.
   */
  async uploadProgramImage(
    file: Express.Multer.File,
    uploadedBy?: string,
    slugOrTitle?: string,
  ): Promise<UploadResult> {
    let cleanSlug = this.sanitizeSubfolder(slugOrTitle);
    if (!cleanSlug) {
      cleanSlug = randomUUID().replace(/-/g, '').slice(0, 10);
    }
    const folder = `programs/${cleanSlug}`;
    return this.uploadImage(file, folder, uploadedBy);
  }

  /**
   * Upload a solution image (thumbnail or content block image) to ImageKit.
   * Server strictly enforces folder structure: /vdcd/solutions/{slug-or-stable-key}.
   * Client folder overrides or arbitrary path traversal are stripped and forbidden.
   */
  async uploadSolutionImage(
    file: Express.Multer.File,
    uploadedBy?: string,
    keyOrSlug?: string,
  ): Promise<UploadResult> {
    let cleanKey = this.sanitizeSubfolder(keyOrSlug);
    // Path traversal, directory separator, or empty protection
    cleanKey = cleanKey
      .replace(/\.\./g, '')
      .replace(/^\/+|\/+$/g, '')
      .replace(/\//g, '-')
      .trim();
    if (!cleanKey) {
      cleanKey = `solution-${randomUUID().replace(/-/g, '').slice(0, 8)}`;
    }
    const folder = `solutions/${cleanKey}`;
    return this.uploadImage(file, folder, uploadedBy);
  }

  /**
   * Safely rename a folder on ImageKit using their Bulk Job API:
   * POST https://api.imagekit.io/v1/bulkJobs/renameFolder
   * Non-blocking error handling with boolean result for safe fallback.
   */
  async renameFolder(
    folderPath: string,
    newFolderName: string,
    purgeCache = true,
  ): Promise<boolean> {
    try {
      const privateKey = this.config.getOrThrow<string>('imagekit.privateKey');
      const authHeader =
        'Basic ' + Buffer.from(privateKey + ':').toString('base64');

      const response = await fetch(
        'https://api.imagekit.io/v1/bulkJobs/renameFolder',
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folderPath,
            newFolderName,
            purgeCache,
          }),
        },
      );

      if (response.ok) {
        const data = (await response.json()) as { jobId?: string };
        this.logger.log(
          `Renamed ImageKit folder from ${folderPath} to ${newFolderName} (jobId: ${data?.jobId})`,
        );
        return true;
      }

      const errorText = await response.text();
      this.logger.warn(
        `Failed to rename ImageKit folder ${folderPath} to ${newFolderName}: HTTP ${response.status} ${errorText}. Fallback: existing URLs remain intact.`,
      );
      return false;
    } catch (err) {
      this.logger.warn(
        `Failed to rename ImageKit folder from ${folderPath} to ${newFolderName}. Fallback: existing URLs remain intact.`,
        err,
      );
      return false;
    }
  }

  /**
   * Safely move folder in ImageKit if supported, with non-blocking error handling and fallback.
   */
  async moveFolder(
    sourceFolderPath: string,
    destinationPath: string,
  ): Promise<boolean> {
    try {
      await this.imagekit.moveFolder({
        sourceFolderPath,
        destinationPath,
      });
      this.logger.log(
        `Moved folder from ${sourceFolderPath} to ${destinationPath}`,
      );
      return true;
    } catch (err) {
      this.logger.warn(
        `Failed to move ImageKit folder from ${sourceFolderPath} to ${destinationPath}. Fallback: existing URLs remain intact.`,
        err,
      );
      return false;
    }
  }

  async uploadPartnerLogo(file: Express.Multer.File, uploadedBy?: string) {
    return this.uploadImage(file, 'partners', uploadedBy);
  }

  // ── Upload file ────────────────────────────────────────
  async uploadFile(
    file: Express.Multer.File,

    uploadedBy?: string,
  ): Promise<UploadResult> {
    this.validateMimetype(
      file,
      this.ALLOWED_FILE_TYPES,
      'pdf, doc, docx, jpg, png, webp, gif',
    );
    this.validateSize(file, this.FILE_MAX_SIZE, '10MB');
    return this.doUpload(file, 'attachments', uploadedBy);
  }

  // ── Confirm: mark file as saved to DB successfully ────────
  async confirmUpload(fileId: string): Promise<void> {
    await this.uploadTempRepo.update({ fileId }, { confirmed: true });
    await this.uploadTempRepo.delete({ fileId });
  }

  // ── Delete file from ImageKit ──────────────────────────────────────
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.imagekit.deleteFile(fileId);
      // Delete from temp table if exists
      await this.uploadTempRepo.delete({ fileId });
      this.logger.log(`Deleted file: ${fileId}`);
    } catch (err) {
      this.logger.warn(`Failed to delete file ${fileId} from ImageKit`, err);
    }
  }

  // ── Cleanup orphan files ──────────────────────────
  async cleanOrphanFiles(): Promise<void> {
    // Delete files uploaded more than 24 hours ago that haven't been confirmed
    const expiredAt = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const orphans = await this.uploadTempRepo.find({
      where: {
        confirmed: false,
        createdAt: LessThan(expiredAt),
      },
    });

    if (!orphans.length) return;

    this.logger.log(`Found ${orphans.length} orphan file(s), cleaning...`);

    const results = await Promise.allSettled(
      orphans.map(async (record) => {
        await this.imagekit.deleteFile(record.fileId);
        await this.uploadTempRepo.delete(record.id);
        return record.fileId;
      }),
    );

    const deleted = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(`Orphan cleanup: ${deleted} deleted, ${failed} failed`);
  }

  // ── Transform URL ────────────────────────────────────────────────
  getTransformedUrl(
    filePath: string,
    transforms: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpg' | 'png' | 'auto';
    } = {},
  ): string {
    const { width, height, quality = 80, format = 'auto' } = transforms;
    return this.imagekit.url({
      path: filePath,
      transformation: [
        {
          ...(width ? { width: String(width) } : {}),
          ...(height ? { height: String(height) } : {}),
          quality: String(quality),
          format,
        },
      ],
    });
  }

  getAuthParams() {
    return this.imagekit.getAuthenticationParameters();
  }

  // ── Private ──────────────────────────────────────────────────────
  private async doUpload(
    file: Express.Multer.File,
    folder: string,
    uploadedBy?: string,
  ): Promise<UploadResult> {
    const fileName = this.buildFileName(file);

    try {
      const response = await this.imagekit.upload({
        file: file.buffer,
        fileName,
        folder: `/vdcd/${folder}`,
        useUniqueFileName: false,
        tags: ['vdcd', ...folder.split('/')],
      });

      // Save to temp table, confirmed = false
      await this.uploadTempRepo.save(
        this.uploadTempRepo.create({
          fileId: response.fileId,
          url: response.url,
          filePath: response.filePath,
          confirmed: false,
          uploadedBy,
        }),
      );

      this.logger.log(
        `Uploaded (unconfirmed): ${response.fileId} — ${response.url}`,
      );

      return {
        url: response.url,
        fileId: response.fileId,
        name: response.name,
        size: response.size,
        width: response.width,
        height: response.height,
        filePath: response.filePath,
      };
    } catch (err) {
      this.logger.error('ImageKit upload failed', err);
      throw new InternalServerErrorException(
        'Upload thất bại, vui lòng thử lại',
      );
    }
  }

  private validateMimetype(
    file: Express.Multer.File,
    allowed: string[],
    label: string,
  ) {
    if (!file) throw new BadRequestException('Không có file nào được gửi lên');
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        `Chỉ chấp nhận ${label}. Nhận được: ${file.mimetype}`,
      );
    }
  }

  private validateSize(
    file: Express.Multer.File,
    maxSize: number,
    label: string,
  ) {
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File không được vượt quá ${label}. Hiện tại: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }
  }

  private buildFileName(file: Express.Multer.File): string {
    const ext = extname(file.originalname).toLowerCase();
    const uuid = randomUUID().replace(/-/g, '').slice(0, 12);
    return `${Date.now()}-${uuid}${ext}`;
  }
}
