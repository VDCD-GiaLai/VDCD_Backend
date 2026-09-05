// src/modules/solution/solution.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import slugify from 'slugify';
import { Solution } from './entities/solution.entity';
import { Article } from '../article/entities/article.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { SolutionFilterDto } from './dto/solution-filter.dto';
import { UploadService } from '../upload/upload.service';
import {
  validateDocumentContent,
  extractImageFileIds,
} from '../../common/validators/document-content.validator';
import { DocumentContent } from '../../common/types/document-content.types';

@Injectable()
export class SolutionService {
  private readonly logger = new Logger(SolutionService.name);

  constructor(
    @InjectRepository(Solution) private repo: Repository<Solution>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
  ) {}

  private async makeSlug(title: string, excludeId?: string): Promise<string> {
    let slug = slugify(title, { lower: true, locale: 'vi', strict: true });
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing && existing.id !== excludeId) {
      slug = `${slug}-${Date.now()}`;
    }
    return slug;
  }

  /**
   * Check if a media fileId is still referenced by other entities (articles, programs, or other solutions).
   * Prevents accidental deletion of shared media assets from ImageKit.
   */
  async isMediaShared(
    fileId: string,
    excludeSolutionId?: string,
  ): Promise<boolean> {
    if (!fileId) return false;
    try {
      // 1. Check other solutions
      if (this.repo?.createQueryBuilder) {
        const qbSol = this.repo.createQueryBuilder('s');
        if (qbSol && typeof qbSol.where === 'function') {
          qbSol.where(
            '(s.thumbnail_file_id = :fileId OR s.content::text LIKE :filePattern)',
            {
              fileId,
              filePattern: `%"${fileId}"%`,
            },
          );
          if (excludeSolutionId && typeof qbSol.andWhere === 'function') {
            qbSol.andWhere('s.id != :excludeSolutionId', { excludeSolutionId });
          }
          if (typeof qbSol.getCount === 'function') {
            const otherSolCount = await qbSol.getCount();
            if (otherSolCount > 0) return true;
          }
        }
      }

      // 2. Check articles & programs if dataSource is available
      if (this.dataSource?.query) {
        const articleCount = await this.dataSource.query(
          `SELECT count(*)::int as count FROM "article" WHERE thumbnail_file_id = $1 OR content::text LIKE $2`,
          [fileId, `%"${fileId}"%`],
        );
        if (articleCount && articleCount[0]?.count > 0) return true;

        const programCount = await this.dataSource.query(
          `SELECT count(*)::int as count FROM "program" WHERE thumbnail_file_id = $1 OR content::text LIKE $2`,
          [fileId, `%"${fileId}"%`],
        );
        if (programCount && programCount[0]?.count > 0) return true;
      }

      return false;
    } catch (err) {
      this.logger.warn(
        `Error checking shared media for ${fileId}, defaulting to preserving`,
        err,
      );
      return true; // Fail-safe: preserve media
    }
  }

  /**
   * Delete a list of image fileIds from ImageKit (fire-and-forget),
   * verifying orphan policy and preserving any media shared with other entities.
   */
  private async cleanupImages(
    fileIds: string[],
    currentSolutionId?: string,
  ): Promise<void> {
    for (const fileId of fileIds) {
      try {
        const shared = await this.isMediaShared(fileId, currentSolutionId);
        if (shared) {
          this.logger.log(
            `Preserving shared media asset on ImageKit: ${fileId}`,
          );
          continue;
        }
        await this.uploadService.deleteFile(fileId);
      } catch (err) {
        this.logger.warn(
          `Failed to process solution image cleanup: ${fileId}`,
          err,
        );
      }
    }
  }

  /**
   * Public list — paginated, filtered, excludes heavy `content` jsonb for performance.
   * Only returns published solutions.
   */
  async findAll(dto: SolutionFilterDto) {
    const { page = 1, limit = 10, fieldId } = dto;
    const qb = this.repo
      .createQueryBuilder('s')
      .select([
        's.id',
        's.title',
        's.slug',
        's.shortDescription',
        's.content',
        's.thumbnail',
        's.thumbnailFileId',
        's.websiteUrl',
        's.isPublished',
        's.publishedAt',
        's.createdAt',
        's.updatedAt',
      ])
      .leftJoinAndSelect('s.field', 'field')
      .where('s.is_published = true');

    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });

    qb.orderBy('s.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Admin list — paginated, filtered by publish status and field, excludes heavy `content` jsonb.
   */
  async findAllAdmin(dto: SolutionFilterDto) {
    const { page = 1, limit = 10, fieldId, isPublished } = dto;
    const qb = this.repo
      .createQueryBuilder('s')
      .select([
        's.id',
        's.title',
        's.slug',
        's.shortDescription',
        's.content',
        's.thumbnail',
        's.thumbnailFileId',
        's.websiteUrl',
        's.isPublished',
        's.publishedAt',
        's.createdAt',
        's.updatedAt',
      ])
      .leftJoinAndSelect('s.field', 'field');

    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    if (isPublished !== undefined) {
      qb.andWhere('s.is_published = :isPublished', { isPublished });
    }

    qb.orderBy('s.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Public detail by slug — returns full solution with block document and related articles.
   */
  async findOneBySlug(slug: string, adminMode = false) {
    const where: any = { slug };
    if (!adminMode) where.isPublished = true;
    const solution = await this.repo.findOne({
      where,
      relations: { field: true },
    });
    if (!solution) {
      throw new NotFoundException(`Không tìm thấy giải pháp '${slug}'`);
    }

    const relatedArticles = await this.articleRepo.find({
      where: { solution: { id: solution.id }, isPublished: true },
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

    return { ...solution, relatedArticles };
  }

  /**
   * Admin detail by ID — returns full solution with block document regardless of publish status.
   */
  async findById(id: string): Promise<Solution> {
    const solution = await this.repo.findOne({
      where: { id },
      relations: { field: true },
    });
    if (!solution) {
      throw new NotFoundException(`Không tìm thấy giải pháp ID '${id}'`);
    }
    return solution;
  }

  /**
   * Create solution with block-based document content, server-side slug, and ImageKit confirmation.
   */
  async create(dto: CreateSolutionDto): Promise<Solution> {
    const slug = dto.slug || (await this.makeSlug(dto.title));
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) {
      throw new ConflictException('Slug đã tồn tại');
    }

    // Validate block-based content
    let content: DocumentContent = { version: 1, blocks: [] };
    if (dto.content) {
      content = validateDocumentContent(dto.content);
    }

    const isPublished = dto.isPublished ?? false;
    const publishedAt = isPublished ? (dto.publishedAt ?? new Date()) : null;

    const solution = this.repo.create({
      title: dto.title,
      slug,
      shortDescription: dto.shortDescription ?? null,
      content,
      thumbnail: dto.thumbnail ?? null,
      thumbnailFileId: dto.thumbnailFileId ?? null,
      websiteUrl: dto.websiteUrl ?? null,
      metaTitle: dto.metaTitle ?? null,
      metaDescription: dto.metaDescription ?? null,
      isPublished,
      publishedAt,
      ...(dto.fieldId ? { field: { id: dto.fieldId } } : {}),
    });

    const saved = await this.repo.save(solution);

    // Confirm thumbnail upload in ImageKit
    if (dto.thumbnailFileId) {
      this.uploadService
        .confirmUpload(dto.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to confirm solution thumbnail: ${dto.thumbnailFileId}`,
            err,
          ),
        );
    }

    // Confirm all inline images inside content blocks
    const contentImageIds = extractImageFileIds(
      saved.content as DocumentContent,
    );
    for (const fileId of contentImageIds) {
      this.uploadService
        .confirmUpload(fileId)
        .catch((err) =>
          this.logger.warn(`Failed to confirm content image: ${fileId}`, err),
        );
    }

    // Handle ImageKit folder move if temporary folder key was used
    if (dto.tempFolderKey && dto.tempFolderKey !== slug) {
      this.uploadService
        .moveFolder(
          `/vdcd/solutions/${dto.tempFolderKey}`,
          `/vdcd/solutions/${slug}`,
        )
        .catch((err) =>
          this.logger.warn(
            `ImageKit moveFolder fallback for tempKey ${dto.tempFolderKey}`,
            err,
          ),
        );
    }

    return saved;
  }

  /**
   * Update solution with atomic transaction, block document diffing, orphan cleanup, and folder migration.
   */
  async update(id: string, dto: UpdateSolutionDto): Promise<Solution> {
    return await this.dataSource.transaction(async (manager) => {
      const solution = await manager.findOne(Solution, { where: { id } });
      if (!solution) {
        throw new NotFoundException(`Không tìm thấy giải pháp ID '${id}'`);
      }

      const oldSlug = solution.slug;

      if (dto.slug && dto.slug !== solution.slug) {
        const exists = await manager.findOne(Solution, {
          where: { slug: dto.slug },
        });
        if (exists) {
          throw new ConflictException('Slug đã tồn tại');
        }
      }

      let oldThumbnailToDelete: string | null = null;
      if (
        dto.thumbnail &&
        dto.thumbnail !== solution.thumbnail &&
        solution.thumbnailFileId
      ) {
        oldThumbnailToDelete = solution.thumbnailFileId;
      }

      let orphanIds: string[] = [];
      if (dto.content !== undefined) {
        const newContent = validateDocumentContent(dto.content);
        const oldContent = solution.content as DocumentContent;

        const oldImageIds = extractImageFileIds(oldContent);
        const newImageIds = new Set(extractImageFileIds(newContent));
        orphanIds = oldImageIds.filter((fid) => !newImageIds.has(fid));

        solution.content = {
          version: newContent.version || 1,
          blocks: [...newContent.blocks],
          ...((newContent as unknown as Record<string, unknown>).heroMeta
            ? {
                heroMeta: (newContent as unknown as Record<string, unknown>)
                  .heroMeta,
              }
            : {}),
        };
      }

      const oldThumbnailFileId = solution.thumbnailFileId;

      // Apply metadata fields
      if (dto.title !== undefined) solution.title = dto.title;
      if (dto.slug !== undefined) solution.slug = dto.slug;
      if (dto.shortDescription !== undefined)
        solution.shortDescription = dto.shortDescription ?? null;
      if (dto.thumbnail !== undefined)
        solution.thumbnail = dto.thumbnail ?? null;
      if (dto.thumbnailFileId !== undefined)
        solution.thumbnailFileId = dto.thumbnailFileId ?? null;
      if (dto.websiteUrl !== undefined)
        solution.websiteUrl = dto.websiteUrl ?? null;
      if (dto.metaTitle !== undefined)
        solution.metaTitle = dto.metaTitle ?? null;
      if (dto.metaDescription !== undefined)
        solution.metaDescription = dto.metaDescription ?? null;

      if (dto.isPublished !== undefined) {
        solution.isPublished = dto.isPublished;
        if (dto.isPublished) {
          solution.publishedAt =
            dto.publishedAt ?? solution.publishedAt ?? new Date();
        } else {
          solution.publishedAt = null;
        }
      } else if (dto.publishedAt !== undefined) {
        solution.publishedAt = dto.publishedAt;
      }

      if (dto.fieldId !== undefined) {
        solution.field = dto.fieldId ? ({ id: dto.fieldId } as any) : null;
      }

      const saved = await manager.save(solution);

      // Confirm newly uploaded thumbnail
      if (dto.thumbnailFileId && dto.thumbnailFileId !== oldThumbnailFileId) {
        this.uploadService
          .confirmUpload(dto.thumbnailFileId)
          .catch((err) =>
            this.logger.warn(
              `Failed to confirm new thumbnail: ${dto.thumbnailFileId}`,
              err,
            ),
          );
      }

      // Delete replaced thumbnail
      if (oldThumbnailToDelete) {
        await this.cleanupImages([oldThumbnailToDelete], id);
      }

      // Confirm new content images and cleanup orphans
      if (dto.content !== undefined) {
        const contentImageIds = extractImageFileIds(
          saved.content as DocumentContent,
        );
        for (const fileId of contentImageIds) {
          this.uploadService
            .confirmUpload(fileId)
            .catch((err) =>
              this.logger.warn(
                `Failed to confirm content image: ${fileId}`,
                err,
              ),
            );
        }
        if (orphanIds.length > 0) {
          await this.cleanupImages(orphanIds, id);
        }
      }

      // Handle ImageKit folder move if slug was updated
      if (dto.slug && dto.slug !== oldSlug) {
        this.uploadService
          .moveFolder(
            `/vdcd/solutions/${oldSlug}`,
            `/vdcd/solutions/${dto.slug}`,
          )
          .catch((err) =>
            this.logger.warn(
              `ImageKit moveFolder fallback when renaming slug from ${oldSlug} to ${dto.slug}`,
              err,
            ),
          );
      }

      return saved;
    });
  }

  /**
   * Toggle publish status and update publishedAt timestamp consistently.
   */
  async togglePublish(id: string, isPublished: boolean, publishedAt?: Date) {
    const solution = await this.repo.findOne({ where: { id } });
    if (!solution) throw new NotFoundException();

    const updateData: Partial<Solution> = { isPublished };
    if (isPublished) {
      updateData.publishedAt =
        publishedAt ?? solution.publishedAt ?? new Date();
    } else {
      updateData.publishedAt = null;
    }

    await this.repo.update(id, updateData);
    return { id, isPublished, publishedAt: updateData.publishedAt };
  }

  /**
   * Remove solution and clean up all media (thumbnail and inline block images) from ImageKit.
   */
  async remove(id: string) {
    const solution = await this.repo.findOne({ where: { id } });
    if (!solution) throw new NotFoundException();

    const filesToDelete: string[] = [];
    if (solution.thumbnailFileId) {
      filesToDelete.push(solution.thumbnailFileId);
    }

    if (solution.content) {
      const contentImages = extractImageFileIds(
        solution.content as DocumentContent,
      );
      filesToDelete.push(...contentImages);
    }

    if (filesToDelete.length > 0) {
      await this.cleanupImages(filesToDelete, solution.id);
    }

    await this.repo.remove(solution);
    return { message: 'Deleted successfully' };
  }
}
