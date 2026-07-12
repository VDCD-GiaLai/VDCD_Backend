import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
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

  private readonly IMAGE_MAX_SIZE = 5 * 1024 * 1024;
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
  ];

  constructor(
    @InjectRepository(UploadTemp)
    private readonly uploadTempRepo: Repository<UploadTemp>,
    private readonly config: ConfigService,
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
    this.validateSize(file, this.IMAGE_MAX_SIZE, '5MB');
    return this.doUpload(file, folder, uploadedBy);
  }

  async uploadThumbnail(file: Express.Multer.File, uploadedBy?: string) {
    return this.uploadImage(file, 'thumbnails', uploadedBy);
  }

  async uploadProjectImage(file: Express.Multer.File, uploadedBy?: string) {
    return this.uploadImage(file, 'projects', uploadedBy);
  }

  async uploadSlideImage(file: Express.Multer.File, uploadedBy?: string) {
    return this.uploadImage(file, 'slides', uploadedBy);
  }

  async uploadPartnerLogo(file: Express.Multer.File, uploadedBy?: string) {
    return this.uploadImage(file, 'partners', uploadedBy);
  }

  // ── Upload file ────────────────────────────────────────
  async uploadFile(
    file: Express.Multer.File,
    uploadedBy?: string,
  ): Promise<UploadResult> {
    this.validateMimetype(file, this.ALLOWED_FILE_TYPES, 'pdf, doc, docx');
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
    // Delete files uploaded more than 2 hours ago that haven't been confirmed
    const expiredAt = new Date(Date.now() - 2 * 60 * 60 * 1000);

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
        tags: ['vdcd', folder],
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
