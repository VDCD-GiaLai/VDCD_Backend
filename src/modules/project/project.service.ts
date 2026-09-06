// src/modules/project/project.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import slugify from 'slugify';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { Article } from '../article/entities/article.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { ProjectRepository } from './repositories/project.repository';
import { UploadService } from '../upload/upload.service';
import {
  validateProjectDocument,
  extractImageFileIds,
} from './validators/project-content.validator';
import { convertProjectToBlocks } from './utils/project-to-blocks.util';
import { DocumentContent } from '../../common/types/document-content.types';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly projectRepo: ProjectRepository,
    @InjectRepository(Project) private readonly rawRepo: Repository<Project>,
    @InjectRepository(ProjectImage)
    private readonly imageRepo: Repository<ProjectImage>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Generates a unique, URL-safe slug from title.
   */
  private async generateSlug(
    title: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = slugify(title, { lower: true, locale: 'vi', strict: true });
    const existing = await this.rawRepo.findOne({ where: { slug } });
    if (existing && existing.id !== excludeId) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }
    return slug;
  }

  /**
   * Check if an image fileId is used across other projects, solutions, programs, or articles.
   */
  private async isMediaShared(
    fileId: string,
    excludeProjectId?: string,
  ): Promise<boolean> {
    if (!fileId) return false;

    try {
      // 1. Check other projects
      const qbProj = this.rawRepo.createQueryBuilder('p');
      qbProj.where(
        'p.thumbnail_file_id = :fileId OR p.content::text LIKE :filePattern OR p.challenge_image_file_id = :fileId OR p.transformation_before_file_id = :fileId OR p.transformation_after_file_id = :fileId',
        {
          fileId,
          filePattern: `%"${fileId}"%`,
        },
      );
      if (excludeProjectId) {
        qbProj.andWhere('p.id != :excludeProjectId', { excludeProjectId });
      }
      const otherProjCount = await qbProj.getCount();
      if (otherProjCount > 0) return true;

      // 2. Check other entities via dataSource if available
      if (this.dataSource?.query) {
        const articleCount = await this.dataSource.query(
          `SELECT count(*)::int as count FROM "article" WHERE thumbnail_file_id = $1 OR content::text LIKE $2`,
          [fileId, `%"${fileId}"%`],
        );
        if (articleCount && articleCount[0]?.count > 0) return true;

        const solutionCount = await this.dataSource.query(
          `SELECT count(*)::int as count FROM "solution" WHERE thumbnail_file_id = $1 OR content::text LIKE $2`,
          [fileId, `%"${fileId}"%`],
        );
        if (solutionCount && solutionCount[0]?.count > 0) return true;

        const programCount = await this.dataSource.query(
          `SELECT count(*)::int as count FROM "program" WHERE thumbnail_file_id = $1 OR content::text LIKE $2`,
          [fileId, `%"${fileId}"%`],
        );
        if (programCount && programCount[0]?.count > 0) return true;
      }

      return false;
    } catch (err) {
      this.logger.warn(
        `Error checking shared media for ${fileId}, defaulting to preserve: ${err}`,
      );
      return true;
    }
  }

  /**
   * Clean up images from ImageKit with shared asset protection.
   */
  private async cleanupImages(
    fileIds: string[],
    excludeProjectId?: string,
  ): Promise<void> {
    for (const fileId of fileIds) {
      if (!fileId) continue;
      try {
        const shared = await this.isMediaShared(fileId, excludeProjectId);
        if (shared) {
          this.logger.log(
            `Preserving shared media asset on ImageKit: ${fileId}`,
          );
          continue;
        }
        await this.uploadService.deleteFile(fileId);
      } catch (err) {
        this.logger.warn(
          `Failed to process project image cleanup: ${fileId}`,
          err,
        );
      }
    }
  }

  /**
   * Rewrites image URLs when moving from old folder key/slug to new slug.
   */
  private rewriteProjectUrls(
    oldKey: string,
    newKey: string,
    project: Project,
  ): void {
    if (!oldKey || !newKey || oldKey === newKey) return;
    const oldPattern = new RegExp(`/(projects)/${oldKey}/`, 'g');
    const newReplacement = `/$1/${newKey}/`;

    if (project.thumbnail && oldPattern.test(project.thumbnail)) {
      project.thumbnail = project.thumbnail.replace(oldPattern, newReplacement);
    }
    if (project.challengeImage && oldPattern.test(project.challengeImage)) {
      project.challengeImage = project.challengeImage.replace(
        oldPattern,
        newReplacement,
      );
    }
    if (
      project.transformationBefore &&
      oldPattern.test(project.transformationBefore)
    ) {
      project.transformationBefore = project.transformationBefore.replace(
        oldPattern,
        newReplacement,
      );
    }
    if (
      project.transformationAfter &&
      oldPattern.test(project.transformationAfter)
    ) {
      project.transformationAfter = project.transformationAfter.replace(
        oldPattern,
        newReplacement,
      );
    }

    if (project.content && Array.isArray((project.content as any).blocks)) {
      const contentStr = JSON.stringify(project.content);
      if (oldPattern.test(contentStr)) {
        project.content = JSON.parse(
          contentStr.replace(oldPattern, newReplacement),
        );
      }
    }

    if (Array.isArray(project.images)) {
      for (const img of project.images) {
        if (img.url && oldPattern.test(img.url)) {
          img.url = img.url.replace(oldPattern, newReplacement);
        }
      }
    }
  }

  /**
   * Safely migrates an ImageKit folder by renaming it (or fallback to moveFolder).
   */
  private async migrateImageKitFolder(
    sourceKey: string,
    targetSlug: string,
  ): Promise<void> {
    if (!sourceKey || !targetSlug || sourceKey === targetSlug) return;
    try {
      let renamed = false;
      if (typeof this.uploadService?.renameFolder === 'function') {
        renamed = await this.uploadService.renameFolder(
          `/vdcd/projects/${sourceKey}`,
          targetSlug,
        );
      }
      if (!renamed && typeof this.uploadService?.moveFolder === 'function') {
        await this.uploadService.moveFolder(
          `/vdcd/projects/${sourceKey}`,
          `/vdcd/projects/${targetSlug}`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Failed ImageKit folder migration from ${sourceKey} to ${targetSlug}: ${err}`,
      );
    }
  }

  /**
   * Public list — paginated, filtered.
   */
  async findAll(dto: ProjectFilterDto) {
    const [data, total] = await this.projectRepo.findPublished(dto);
    const { page = 1, limit = 12 } = dto;
    return { data, total, page, limit };
  }

  /**
   * Admin list — paginated, all statuses.
   */
  async findAllAdmin(dto: ProjectFilterDto) {
    const [data, total] = await this.projectRepo.findAllAdmin(dto);
    const { page = 1, limit = 12 } = dto;
    return { data, total, page, limit };
  }

  /**
   * Public or admin single project retrieval by slug (with UUID fallback).
   */
  async findOneBySlug(slug: string, adminMode = false) {
    let project = await this.projectRepo.findOneBySlug(slug, adminMode);

    // Fallback: Check if identifier is a UUID
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug,
      );
    if (!project && isUuid) {
      project = await this.projectRepo.findById(slug);
      if (project && !adminMode && !project.isPublished) {
        project = null;
      }
    }

    if (!project) {
      throw new NotFoundException(`Không tìm thấy dự án '${slug}'`);
    }

    const relatedArticles = await this.articleRepo.find({
      where: { project: { id: project.id }, isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        publishedAt: true,
      },
      order: { publishedAt: 'DESC' },
      take: 5,
    });

    const relatedProjects = await this.rawRepo.find({
      where: { isPublished: true },
      relations: { field: true },
      take: 4,
      order: { createdAt: 'DESC' },
    });

    return {
      ...project,
      relatedArticles,
      relatedProjects: relatedProjects.filter((p) => p.id !== project.id),
    };
  }

  /**
   * Admin single project retrieval by ID.
   */
  async findById(id: string): Promise<Project> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundException(`Không tìm thấy dự án ID '${id}'`);
    }
    return project;
  }

  /**
   * Create project supporting unified Document Model with fallback conversion and ImageKit confirmation.
   */
  async create(dto: CreateProjectDto): Promise<Project> {
    const slug = dto.slug || (await this.generateSlug(dto.title));
    const exists = await this.projectRepo.findBySlug(slug);
    if (exists) {
      throw new ConflictException('Slug đã tồn tại');
    }

    // 1. Resolve DocumentContent
    let content: DocumentContent;
    if (dto.content) {
      content = validateProjectDocument(dto.content);
    } else if (
      dto.overview ||
      dto.challenge ||
      dto.services ||
      dto.transformationBefore ||
      dto.transformationAfter ||
      dto.technicalHighlights
    ) {
      // Automatic conversion of legacy fields into standard DocumentContent
      content = convertProjectToBlocks({
        id: slug,
        title: dto.title,
        overview: dto.overview,
        challenge: dto.challenge,
        challengeImage: dto.challengeImage,
        challengeImageFileId: dto.challengeImageFileId,
        services: dto.services,
        transformationBefore: dto.transformationBefore,
        transformationBeforeFileId: dto.transformationBeforeFileId,
        transformationAfter: dto.transformationAfter,
        transformationAfterFileId: dto.transformationAfterFileId,
        technicalHighlights: dto.technicalHighlights,
      });
    } else {
      content = { version: 1, blocks: [] };
    }

    // 2. Legacy snapshot backup
    const legacyBackup = JSON.stringify({
      overview: dto.overview,
      challenge: dto.challenge,
      challenge_image: dto.challengeImage,
      challenge_image_file_id: dto.challengeImageFileId,
      services: dto.services,
      transformation_before: dto.transformationBefore,
      transformation_before_file_id: dto.transformationBeforeFileId,
      transformation_after: dto.transformationAfter,
      transformation_after_file_id: dto.transformationAfterFileId,
      technical_highlights: dto.technicalHighlights,
    });

    const project = this.projectRepo.create({
      title: dto.title,
      slug,
      content,
      contentHtmlBackup: legacyBackup,
      overview: dto.overview,
      thumbnail: dto.thumbnail,
      thumbnailFileId: dto.thumbnailFileId,
      year: dto.year,
      challenge: dto.challenge,
      challengeImage: dto.challengeImage,
      challengeImageFileId: dto.challengeImageFileId,
      services: dto.services,
      discipline: dto.discipline,
      transformationBefore: dto.transformationBefore,
      transformationBeforeFileId: dto.transformationBeforeFileId,
      transformationAfter: dto.transformationAfter,
      transformationAfterFileId: dto.transformationAfterFileId,
      technicalHighlights: dto.technicalHighlights,
      nextProjectSlug: dto.nextProjectSlug,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      isPublished: dto.isPublished ?? false,
      ...(dto.fieldId ? { field: { id: dto.fieldId } as any } : {}),
      ...(dto.provinceId ? { province: { id: dto.provinceId } as any } : {}),
    });

    // 3. Temporary folder migration & URL rewriting before persisting
    if (dto.tempFolderKey && dto.tempFolderKey !== slug) {
      this.rewriteProjectUrls(dto.tempFolderKey, slug, project);
      await this.migrateImageKitFolder(dto.tempFolderKey, slug);
    }

    const saved = await this.projectRepo.save(project);

    // 4. Confirm all uploaded files in ImageKit
    const fileIdsToConfirm = [
      dto.thumbnailFileId,
      dto.challengeImageFileId,
      dto.transformationBeforeFileId,
      dto.transformationAfterFileId,
      ...extractImageFileIds(saved.content as DocumentContent),
    ].filter(Boolean) as string[];

    if (fileIdsToConfirm.length) {
      Promise.all(
        fileIdsToConfirm.map((fid) => this.uploadService.confirmUpload(fid)),
      ).catch((err) =>
        this.logger.warn('Failed to confirm project file uploads', err),
      );
    }

    return saved;
  }

  /**
   * Update project with atomic transaction, Document Model diffing, and image lifecycle tracking.
   */
  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    return await this.dataSource.transaction(async (manager) => {
      const project = await manager.findOne(Project, {
        where: { id },
        relations: { field: true, province: true, images: true },
      });
      if (!project) {
        throw new NotFoundException(`Không tìm thấy dự án ID '${id}'`);
      }

      // Check slug uniqueness
      const oldSlug = project.slug;
      if (dto.slug && dto.slug !== oldSlug) {
        const exists = await manager.findOne(Project, {
          where: { slug: dto.slug },
        });
        if (exists && exists.id !== id) {
          throw new ConflictException('Slug đã tồn tại');
        }
      }

      // 1. Handle Document Content update
      if (dto.content !== undefined) {
        const newContent = validateProjectDocument(dto.content);
        const oldContent = project.content as DocumentContent;

        const oldImageIds = extractImageFileIds(oldContent);
        const newImageIds = new Set(extractImageFileIds(newContent));

        // Delete orphan images removed from document content
        const removedImageIds = oldImageIds.filter(
          (fid) => !newImageIds.has(fid),
        );
        if (removedImageIds.length > 0) {
          await this.cleanupImages(removedImageIds, id);
        }

        // Confirm new images added to content
        for (const fileId of newImageIds) {
          if (!oldImageIds.includes(fileId)) {
            this.uploadService
              .confirmUpload(fileId)
              .catch((err) =>
                this.logger.warn(
                  `Failed to confirm new project content image: ${fileId}`,
                  err,
                ),
              );
          }
        }

        project.content = newContent;
      }

      // 2. Handle Thumbnail update
      if (
        dto.thumbnail &&
        dto.thumbnail !== project.thumbnail &&
        project.thumbnailFileId
      ) {
        await this.cleanupImages([project.thumbnailFileId], id);
      }
      if (
        dto.thumbnailFileId &&
        dto.thumbnailFileId !== project.thumbnailFileId
      ) {
        this.uploadService
          .confirmUpload(dto.thumbnailFileId)
          .catch((err) =>
            this.logger.warn(
              `Failed to confirm new thumbnail: ${dto.thumbnailFileId}`,
              err,
            ),
          );
      }

      // 3. Update fields
      const updatePayload = { ...dto };
      delete updatePayload.content;
      delete updatePayload.fieldId;
      delete updatePayload.provinceId;
      delete updatePayload.tempFolderKey;
      Object.assign(project, updatePayload);

      if (dto.fieldId !== undefined) {
        project.field = dto.fieldId ? ({ id: dto.fieldId } as any) : null;
      }
      if (dto.provinceId !== undefined) {
        project.province = dto.provinceId
          ? ({ id: dto.provinceId } as any)
          : null;
      }

      // 4. Folder migration & URL rewriting
      if (dto.slug && dto.slug !== oldSlug) {
        this.rewriteProjectUrls(oldSlug, dto.slug, project);
        await this.migrateImageKitFolder(oldSlug, dto.slug);
      }

      const targetSlug = project.slug;
      if (dto.tempFolderKey && dto.tempFolderKey !== targetSlug) {
        this.rewriteProjectUrls(dto.tempFolderKey, targetSlug, project);
        await this.migrateImageKitFolder(dto.tempFolderKey, targetSlug);
      }

      if (Array.isArray(project.images) && project.images.length > 0) {
        await manager.save(ProjectImage, project.images);
      }

      const saved = await manager.save(Project, project);

      return saved;
    });
  }

  /**
   * Toggle publish status.
   */
  async togglePublish(id: string, isPublished: boolean) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundException();
    await this.projectRepo.update(id, { isPublished });
    return { id, isPublished };
  }

  /**
   * Delete a project with safe ImageKit media cleanup.
   */
  async remove(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundException();

    // Collect all associated file IDs to clean up
    const fileIds = [
      project.thumbnailFileId,
      project.challengeImageFileId,
      project.transformationBeforeFileId,
      project.transformationAfterFileId,
      ...(project.images?.map((img) => img.fileId) ?? []),
      ...extractImageFileIds(project.content as DocumentContent),
    ].filter(Boolean);

    if (fileIds.length) {
      await this.cleanupImages(fileIds, id);
    }

    await this.projectRepo.remove(project);
    return { message: 'Deleted successfully' };
  }

  /**
   * Upload an image specifically for a project by resolving project ID -> slug.
   * Client only provides projectId and file; backend resolves folder strictly server-side.
   */
  async uploadImageForProject(
    projectId: string,
    file: Express.Multer.File,
    uploadedBy?: string,
  ) {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Không tìm thấy dự án ID '${projectId}'`);
    }
    return this.uploadService.uploadProjectImage(
      file,
      uploadedBy,
      project.slug,
    );
  }

  // ── Gallery Operations ──────────────────────────────────────────

  async addImages(
    projectId: string,
    files: Express.Multer.File[],
    captions: string[] = [],
    uploadedBy?: string,
  ) {
    const project = await this.projectRepo.findById(projectId);
    if (!project) throw new NotFoundException();

    // Upload all files to ImageKit parallel into project folder (/vdcd/projects/{slug})
    const uploadResults = await Promise.all(
      files.map((file) =>
        this.uploadService.uploadProjectImage(file, uploadedBy, project.slug),
      ),
    );

    // Save to DB
    const entities = uploadResults.map((result, i) =>
      this.imageRepo.create({
        project,
        url: result.url,
        fileId: result.fileId,
        caption: captions[i] ?? null,
        order: (project.images?.length ?? 0) + i,
      }),
    );

    const saved = await this.imageRepo.save(entities);

    // Confirm all uploaded files
    Promise.all(
      uploadResults.map((r) => this.uploadService.confirmUpload(r.fileId)),
    ).catch((err) => this.logger.warn('Failed to confirm image uploads', err));

    return saved;
  }

  async reorderImages(
    _projectId: string,
    items: { id: string; order: number }[],
  ) {
    await Promise.all(
      items.map(({ id, order }) => this.imageRepo.update(id, { order })),
    );
    return { message: 'Reordered successfully' };
  }

  async updateImage(imageId: string, dto: { caption?: string; size?: string }) {
    const img = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!img) throw new NotFoundException('Image not found');

    if (dto.caption !== undefined) {
      img.caption = dto.caption;
    }
    if (dto.size !== undefined) {
      img.size = dto.size;
    }

    return this.imageRepo.save(img);
  }

  async removeImage(imageId: string) {
    const img = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!img) throw new NotFoundException();

    if (img.fileId) {
      await this.cleanupImages([img.fileId]);
    }

    await this.imageRepo.remove(img);
    return { message: 'Deleted successfully' };
  }
}
