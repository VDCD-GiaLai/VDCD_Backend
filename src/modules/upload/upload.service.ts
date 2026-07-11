import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import { randomUUID } from 'crypto';
import { extname } from 'path';

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

  // Limit file
  private readonly IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly FILE_MAX_SIZE = 10 * 1024 * 1024; // 10MB

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
  ];

  constructor(private readonly config: ConfigService) {
    this.imagekit = new ImageKit({
      publicKey: config.getOrThrow<string>('imagekit.publicKey'),
      privateKey: config.getOrThrow<string>('imagekit.privateKey'),
      urlEndpoint: config.getOrThrow<string>('imagekit.urlEndpoint'),
    });
  }

  // ── Upload image ──────────────────────────────────────────────────
  async uploadImage(
    file: Express.Multer.File,
    folder = 'images',
  ): Promise<UploadResult> {
    this.validateMimetype(
      file,
      this.ALLOWED_IMAGE_TYPES,
      'jpg, png, webp, gif',
    );
    this.validateSize(file, this.IMAGE_MAX_SIZE, '5MB');

    const fileName = this.buildFileName(file);

    try {
      const response = await this.imagekit.upload({
        file: file.buffer,
        fileName,
        folder: `/vdcd/${folder}`,
        useUniqueFileName: false, // name is unique from buildFileName
        tags: ['vdcd', folder],
      });

      this.logger.log(`Image uploaded: ${response.url}`);

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
      throw new InternalServerErrorException('Upload image failed');
    }
  }

  // ── Upload image to specific folder ────────────────────────────────
  async uploadProjectImage(file: Express.Multer.File): Promise<UploadResult> {
    return this.uploadImage(file, 'projects');
  }

  async uploadThumbnail(file: Express.Multer.File): Promise<UploadResult> {
    return this.uploadImage(file, 'thumbnails');
  }

  async uploadSlideImage(file: Express.Multer.File): Promise<UploadResult> {
    return this.uploadImage(file, 'slides');
  }

  async uploadPartnerLogo(file: Express.Multer.File): Promise<UploadResult> {
    return this.uploadImage(file, 'partners');
  }

  // ── Upload file (PDF, DOCX) ────────────────────────────
  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    this.validateMimetype(file, this.ALLOWED_FILE_TYPES, 'pdf, doc, docx');
    this.validateSize(file, this.FILE_MAX_SIZE, '10MB');

    const fileName = this.buildFileName(file);

    try {
      const response = await this.imagekit.upload({
        file: file.buffer,
        fileName,
        folder: '/vdcd/attachments',
        useUniqueFileName: false,
        tags: ['vdcd', 'attachment'],
      });

      this.logger.log(`File uploaded: ${response.url}`);

      return {
        url: response.url,
        fileId: response.fileId,
        name: response.name,
        size: response.size,
        filePath: response.filePath,
      };
    } catch (err) {
      this.logger.error('ImageKit file upload failed', err);
      throw new InternalServerErrorException('Upload file failed');
    }
  }

  // ── Delete file from ImageKit ──────────────────────────────────────
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.imagekit.deleteFile(fileId);
      this.logger.log(`File deleted: ${fileId}`);
    } catch (err) {
      // Don't throw — delete fail should not block the main thread
      this.logger.warn(`Failed to delete file ${fileId} from ImageKit`, err);
    }
  }

  // ── Create URL with transform (resize, crop...) ──────────────────────
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

  // ── Create auth params for client-side upload ──────────────────────
  getAuthParams() {
    return this.imagekit.getAuthenticationParameters();
  }

  // ── Helpers ─────────────────────────────────────────────────────
  private validateMimetype(
    file: Express.Multer.File,
    allowed: string[],
    label: string,
  ) {
    if (!file) {
      throw new BadRequestException('Không có file nào được gửi lên');
    }
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        `Chỉ chấp nhận file ${label}. Nhận được: ${file.mimetype}`,
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
        `File không được vượt quá ${label}. Kích thước hiện tại: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }
  }

  private buildFileName(file: Express.Multer.File): string {
    const ext = extname(file.originalname).toLowerCase();
    const uuid = randomUUID().replace(/-/g, '').slice(0, 12);
    const timestamp = Date.now();
    return `${timestamp}-${uuid}${ext}`;
  }
}
