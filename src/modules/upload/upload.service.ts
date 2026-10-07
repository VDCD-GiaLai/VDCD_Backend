import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
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

  /**
   * Upload an image for about-us / organization to ImageKit.
   * Folder structure: /vdcd/about-us or /vdcd/about-us/<subfolder>
   */
  async uploadAboutUsImage(
    file: Express.Multer.File,
    uploadedBy?: string,
    subfolder?: string,
  ): Promise<UploadResult> {
    const cleanSubfolder = this.sanitizeSubfolder(subfolder);
    const folder = cleanSubfolder ? `about-us/${cleanSubfolder}` : 'about-us';
    return this.uploadImage(file, folder, uploadedBy);
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

  // ── Rename file in ImageKit & sync database references ───────────────
  async renameFile(
    fileId: string,
    newFileName: string,
    syncDb = true,
  ): Promise<{
    fileId: string;
    name: string;
    filePath: string;
    url: string;
    updatedDbRecordsCount: number;
  }> {
    if (!fileId || typeof fileId !== 'string') {
      throw new BadRequestException('ID tệp không hợp lệ');
    }
    if (!newFileName || typeof newFileName !== 'string' || !newFileName.trim()) {
      throw new BadRequestException('Tên tệp mới không được để trống');
    }

    // 1. Fetch current file details from ImageKit
    let currentFile: Record<string, any>;
    try {
      currentFile = (await this.imagekit.getFileDetails(fileId)) as Record<string, any>;
    } catch (err: any) {
      this.logger.error(`Failed to get file details for fileId: ${fileId}`, err);
      throw new NotFoundException(`Không tìm thấy tệp với ID: ${fileId}`);
    }

    const oldFilePath = currentFile.filePath as string;
    const oldName = currentFile.name as string;
    const oldUrl = currentFile.url as string;
    const currentExt = extname(oldName).toLowerCase();

    // 2. Extract extension and base name
    const trimmedInput = newFileName.trim();
    const inputExt = extname(trimmedInput).toLowerCase();
    let baseName = inputExt ? trimmedInput.slice(0, -inputExt.length) : trimmedInput;

    // Sanitize base name using slugify (Vietnamese-friendly, safe for URL and CDN)
    baseName = slugify(baseName, {
      lower: true,
      locale: 'vi',
      strict: true,
      trim: true,
    });

    if (!baseName) {
      throw new BadRequestException('Tên tệp sau khi chuẩn hóa không hợp lệ');
    }

    const targetExt = inputExt || currentExt;
    const finalNewFileName = `${baseName}${targetExt}`;

    if (finalNewFileName === oldName) {
      return {
        fileId,
        name: oldName,
        filePath: oldFilePath,
        url: oldUrl,
        updatedDbRecordsCount: 0,
      };
    }

    // 3. Call ImageKit rename API
    try {
      await this.imagekit.renameFile({
        filePath: oldFilePath,
        newFileName: finalNewFileName,
        purgeCache: true,
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      this.logger.error(`ImageKit renameFile failed: ${errMsg}`, err);
      if (
        errMsg.toLowerCase().includes('already exists') ||
        errMsg.toLowerCase().includes('duplicate') ||
        err?.status === 409
      ) {
        throw new ConflictException(
          `Tệp có tên "${finalNewFileName}" đã tồn tại trong thư mục này`,
        );
      }
      throw new BadRequestException(`Không thể đổi tên tệp trên ImageKit: ${errMsg}`);
    }

    // 4. Retrieve refreshed file details from ImageKit
    let updatedDetails: { name: string; filePath: string; url: string };
    try {
      const refreshed = (await this.imagekit.getFileDetails(fileId)) as Record<string, any>;
      updatedDetails = {
        name: refreshed.name as string,
        filePath: refreshed.filePath as string,
        url: refreshed.url as string,
      };
    } catch {
      const folderPath = oldFilePath.substring(0, oldFilePath.lastIndexOf('/'));
      const newFilePath = `${folderPath}/${finalNewFileName}`;
      const newUrl = oldUrl.substring(0, oldUrl.lastIndexOf('/')) + `/${finalNewFileName}`;
      updatedDetails = {
        name: finalNewFileName,
        filePath: newFilePath,
        url: newUrl,
      };
    }

    const newUrl = updatedDetails.url;
    const newFilePath = updatedDetails.filePath;
    const newName = updatedDetails.name;

    // 5. Synchronize database references if requested
    let updatedDbRecordsCount = 0;
    if (syncDb && this.dataSource?.query) {
      try {
        const queries = [
          // 1. Article thumbnail
          this.dataSource.query(
            `UPDATE "article" SET "thumbnail" = $1 WHERE "thumbnail_file_id" = $2 OR "thumbnail" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 2. Project thumbnail
          this.dataSource.query(
            `UPDATE "project" SET "thumbnail" = $1 WHERE "thumbnail_file_id" = $2 OR "thumbnail" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 3. ProjectImage url
          this.dataSource.query(
            `UPDATE "project_image" SET "url" = $1 WHERE "file_id" = $2 OR "url" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 4. Program thumbnail
          this.dataSource.query(
            `UPDATE "program" SET "thumbnail" = $1 WHERE "thumbnail_file_id" = $2 OR "thumbnail" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 5. Solution thumbnail
          this.dataSource.query(
            `UPDATE "solution" SET "thumbnail" = $1 WHERE "thumbnail_file_id" = $2 OR "thumbnail" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 6. Slide image_url
          this.dataSource.query(
            `UPDATE "slide" SET "image_url" = $1 WHERE "image_file_id" = $2 OR "image_url" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 7. SlideDetailBlog hero_image_url
          this.dataSource.query(
            `UPDATE "slide_detail_blog" SET "hero_image_url" = $1 WHERE "hero_image_file_id" = $2 OR "hero_image_url" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 8. PageBanner image_url
          this.dataSource.query(
            `UPDATE "page_banner" SET "image_url" = $1 WHERE "image_file_id" = $2 OR "image_url" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 9. Partner logo
          this.dataSource.query(
            `UPDATE "partner" SET "logo" = $1 WHERE "logo_file_id" = $2 OR "logo" = $3`,
            [newUrl, fileId, oldUrl],
          ),
          // 10. UploadTemp
          this.dataSource.query(
            `UPDATE "upload_temp" SET "url" = $1, "file_path" = $2 WHERE "file_id" = $3`,
            [newUrl, newFilePath, fileId],
          ),
          // 11. Article content blocks (replace oldUrl with newUrl in jsonb)
          this.dataSource.query(
            `UPDATE "article" SET "content" = REPLACE("content"::text, $1, $2)::jsonb WHERE "content"::text LIKE '%' || $3 || '%'`,
            [oldUrl, newUrl, oldUrl],
          ),
          // 12. Project content blocks
          this.dataSource.query(
            `UPDATE "project" SET "content" = REPLACE("content"::text, $1, $2)::jsonb WHERE "content"::text LIKE '%' || $3 || '%'`,
            [oldUrl, newUrl, oldUrl],
          ),
          // 13. Solution content blocks
          this.dataSource.query(
            `UPDATE "solution" SET "content" = REPLACE("content"::text, $1, $2)::jsonb WHERE "content"::text LIKE '%' || $3 || '%'`,
            [oldUrl, newUrl, oldUrl],
          ),
          // 14. Program content blocks
          this.dataSource.query(
            `UPDATE "program" SET "content" = REPLACE("content"::text, $1, $2)::jsonb WHERE "content"::text LIKE '%' || $3 || '%'`,
            [oldUrl, newUrl, oldUrl],
          ),
          // 15. SlideDetailBlog content blocks
          this.dataSource.query(
            `UPDATE "slide_detail_blog" SET "content" = REPLACE("content"::text, $1, $2)::jsonb WHERE "content"::text LIKE '%' || $3 || '%'`,
            [oldUrl, newUrl, oldUrl],
          ),
        ];

        const results = await Promise.allSettled(queries);
        for (const res of results) {
          if (res.status === 'fulfilled' && res.value && res.value[1]) {
            updatedDbRecordsCount += Number(res.value[1]);
          }
        }

        this.logger.log(
          `Renamed file ${fileId} (${oldName} -> ${newName}). Updated ${updatedDbRecordsCount} DB reference(s).`,
        );
      } catch (dbErr) {
        this.logger.warn(`Failed to synchronize DB references after file rename: ${dbErr}`);
      }
    }

    return {
      fileId,
      name: newName,
      filePath: newFilePath,
      url: newUrl,
      updatedDbRecordsCount,
    };
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

  // ── Gallery: list files & folders from ImageKit ─────────────────

  async listGalleryFiles(options: {
    path?: string;
    searchQuery?: string;
    fileType?: string;
    limit?: number;
    skip?: number;
    sort?: string;
  }) {
    const listOptions: Record<string, unknown> = {
      limit: options.limit || 30,
      skip: options.skip || 0,
      sort: options.sort || 'DESC_CREATED',
    };

    // Only send fileType when it's not 'all' (ImageKit default is 'all')
    if (options.fileType && options.fileType !== 'all') {
      listOptions.fileType = options.fileType;
    }

    const queryParts: string[] = [];
    const folder = options.path || '/vdcd';

    // Always use ImageKit searchQuery `path : "<folder>"` for recursive listing.
    // This returns ALL files inside this folder AND all its subfolders.
    // The `:` operator in Lucene syntax enables recursive search.
    const cleanPath = folder.replace(/"/g, '\\"');
    queryParts.push(`path : "${cleanPath}"`);

    // Append additional search filters (e.g. createdAt, name)
    if (options.searchQuery && options.searchQuery.trim()) {
      queryParts.push(options.searchQuery.trim());
    }

    listOptions.searchQuery = queryParts.join(' AND ');

    try {
      const result = await this.imagekit.listFiles(listOptions);
      return (result as unknown[]).map((f: Record<string, unknown>) => ({
        fileId: f.fileId as string,
        name: f.name as string,
        url: f.url as string,
        filePath: f.filePath as string,
        size: f.size as number,
        width: (f.width as number) || undefined,
        height: (f.height as number) || undefined,
        createdAt: f.createdAt as string,
        thumbnail: (f.thumbnail as string) || (f.url as string),
        fileType: (f.fileType as string) || 'image',
        mime: (f.mime as string) || undefined,
      }));
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as Record<string, unknown>).message)
            : String(err);
      this.logger.error(`ImageKit listFiles failed: ${errorMsg}`, err);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách ảnh từ thư viện',
      );
    }
  }

  async listGalleryFolders(parentPath?: string) {
    try {
      const result = await this.imagekit.listFiles({
        path: parentPath || '/vdcd',
        type: 'folder',
      });
      return (result as unknown[]).map((f: Record<string, unknown>) => ({
        name: f.name as string,
        folderPath: f.folderPath as string,
      }));
    } catch (err) {
      this.logger.error('ImageKit listFolders failed', err);
      throw new InternalServerErrorException('Không thể lấy danh sách thư mục');
    }
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
