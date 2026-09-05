// src/modules/article/article.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import slugify from 'slugify';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { UploadService } from '../upload/upload.service';
import {
  validateDocumentContent,
  extractImageFileIds,
} from '../../common/validators/document-content.validator';
import { DocumentContent } from '../../common/types/document-content.types';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectRepository(Article) private repo: Repository<Article>,
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
   * Delete a list of image fileIds from ImageKit (fire-and-forget).
   */
  private cleanupImages(fileIds: string[]): void {
    for (const fileId of fileIds) {
      this.uploadService
        .deleteFile(fileId)
        .catch((err) =>
          this.logger.warn(`Failed to delete article image: ${fileId}`, err),
        );
    }
  }

  /**
   * Public list — paginated, filtered, excludes heavy `content` jsonb for performance.
   */
  async findAll(dto: ArticleFilterDto) {
    const { page = 1, limit = 10, category, tags, search } = dto;
    const qb = this.repo
      .createQueryBuilder('a')
      .select([
        'a.id',
        'a.title',
        'a.subtitle',
        'a.slug',
        'a.excerpt',
        'a.thumbnail',
        'a.category',
        'a.tags',
        'a.isPublished',
        'a.publishedAt',
        'a.createdAt',
        'a.updatedAt',
      ])
      .where('a.is_published = true');

    if (category) {
      qb.andWhere('a.category ILIKE :category', { category: `%${category}%` });
    }
    if (tags) {
      qb.andWhere('a.tags ILIKE :tags', { tags: `%${tags}%` });
    }
    if (search) {
      qb.andWhere(
        '(a.title ILIKE :search OR a.category ILIKE :search OR a.tags ILIKE :search OR a.content::text ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('a.published_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      items: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Admin list — paginated, filtered, includes relations, and includes full `content` jsonb for editor.
   */
  async findAllAdmin(dto: ArticleFilterDto) {
    const { page = 1, limit = 10, category, tags, isPublished, search } = dto;
    const qb = this.repo
      .createQueryBuilder('a')
      .select([
        'a.id',
        'a.title',
        'a.subtitle',
        'a.slug',
        'a.excerpt',
        'a.thumbnail',
        'a.thumbnailFileId',
        'a.category',
        'a.tags',
        'a.content',
        'a.metaTitle',
        'a.metaDescription',
        'a.isPublished',
        'a.publishedAt',
        'a.createdAt',
        'a.updatedAt',
      ])
      .leftJoinAndSelect('a.project', 'project')
      .leftJoinAndSelect('a.program', 'program')
      .leftJoinAndSelect('a.solution', 'solution');

    if (category) {
      qb.andWhere('a.category ILIKE :category', { category: `%${category}%` });
    }
    if (tags) {
      qb.andWhere('a.tags ILIKE :tags', { tags: `%${tags}%` });
    }
    if (isPublished !== undefined) {
      qb.andWhere('a.is_published = :isPublished', { isPublished });
    }
    if (search) {
      qb.andWhere(
        '(a.title ILIKE :search OR a.category ILIKE :search OR a.tags ILIKE :search OR a.content::text ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('a.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    const items = data.map((item) => {
      if (!item.content || typeof item.content !== 'object') {
        item.content = { version: 1, blocks: [] };
      }
      return item;
    });

    return {
      data: items,
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single article by slug or ID (public read — published only unless adminMode is true).
   */
  async findOneBySlug(slug: string, adminMode = false) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug,
      );

    let article: Article | null = null;
    if (isUuid) {
      const where: any = adminMode
        ? [{ id: slug }, { slug }]
        : [
            { id: slug, isPublished: true },
            { slug, isPublished: true },
          ];
      article = await this.repo.findOne({
        where,
        relations: {
          project: true,
          program: true,
          solution: true,
        },
      });
    } else {
      const where: any = { slug };
      if (!adminMode) where.isPublished = true;
      article = await this.repo.findOne({
        where,
        relations: {
          project: true,
          program: true,
          solution: true,
        },
      });
    }

    if (!article) {
      throw new NotFoundException(`Không tìm thấy bài viết '${slug}'`);
    }

    if (!article.content || typeof article.content !== 'object') {
      article.content = { version: 1, blocks: [] };
    }

    const relatedArticles = article.category
      ? await this.repo.find({
          where: { category: article.category, isPublished: true },
          select: {
            id: true,
            title: true,
            subtitle: true,
            slug: true,
            excerpt: true,
            thumbnail: true,
            publishedAt: true,
          },
          order: { publishedAt: 'DESC' },
          take: 4,
        })
      : [];

    return {
      ...article,
      relatedArticles: (relatedArticles || []).filter(
        (a) => a.id !== article.id,
      ),
    };
  }

  /**
   * Get article by ID (admin read — returns drafts or published).
   */
  async findById(id: string): Promise<Article> {
    const article = await this.repo.findOne({
      where: { id },
      relations: {
        project: true,
        program: true,
        solution: true,
      },
    });
    if (!article) {
      throw new NotFoundException(`Không tìm thấy bài viết ID '${id}'`);
    }
    if (!article.content || typeof article.content !== 'object') {
      article.content = { version: 1, blocks: [] };
    }
    return article;
  }

  /**
   * Create new article with validated block document and ImageKit tracking.
   */
  async create(dto: CreateArticleDto): Promise<Article> {
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

    const article = this.repo.create({
      title: dto.title,
      subtitle: dto.subtitle ?? null,
      slug,
      excerpt: dto.excerpt ?? null,
      content,
      thumbnail: dto.thumbnail ?? null,
      thumbnailFileId: dto.thumbnailFileId ?? null,
      category: dto.category ?? null,
      tags: dto.tags ?? null,
      metaTitle: dto.metaTitle ?? null,
      metaDescription: dto.metaDescription ?? null,
      isPublished: dto.isPublished ?? false,
      publishedAt: dto.isPublished ? (dto.publishedAt ?? new Date()) : null,
      ...(dto.projectId ? { project: { id: dto.projectId } } : {}),
      ...(dto.programId ? { program: { id: dto.programId } } : {}),
      ...(dto.solutionId ? { solution: { id: dto.solutionId } } : {}),
    });

    const saved = await this.repo.save(article);

    // Confirm thumbnail upload in ImageKit
    if (dto.thumbnailFileId) {
      this.uploadService
        .confirmUpload(dto.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to confirm thumbnail upload: ${dto.thumbnailFileId}`,
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

    return saved;
  }

  /**
   * Update article with atomic transaction, block document diffing, orphan cleanup, and relation handling.
   */
  async update(id: string, dto: UpdateArticleDto): Promise<Article> {
    return await this.dataSource.transaction(async (manager) => {
      const article = await manager.findOne(Article, { where: { id } });
      if (!article) {
        throw new NotFoundException(`Không tìm thấy bài viết ID '${id}'`);
      }

      if (dto.slug && dto.slug !== article.slug) {
        const exists = await manager.findOne(Article, {
          where: { slug: dto.slug },
        });
        if (exists) {
          throw new ConflictException('Slug đã tồn tại');
        }
      }

      let oldThumbnailToDelete: string | null = null;
      if (
        dto.thumbnail &&
        dto.thumbnail !== article.thumbnail &&
        article.thumbnailFileId
      ) {
        oldThumbnailToDelete = article.thumbnailFileId;
      }

      let orphanIds: string[] = [];
      if (dto.content !== undefined) {
        const newContent = validateDocumentContent(dto.content);
        const oldContent = article.content as DocumentContent;

        const oldImageIds = extractImageFileIds(oldContent);
        const newImageIds = new Set(extractImageFileIds(newContent));
        orphanIds = oldImageIds.filter((fid) => !newImageIds.has(fid));

        article.content = {
          version: newContent.version || 1,
          blocks: [...newContent.blocks],
        };
      }

      const oldThumbnailFileId = article.thumbnailFileId;

      // Apply metadata fields
      if (dto.title !== undefined) article.title = dto.title;
      if (dto.subtitle !== undefined) article.subtitle = dto.subtitle ?? null;
      if (dto.slug !== undefined) article.slug = dto.slug;
      if (dto.excerpt !== undefined) article.excerpt = dto.excerpt ?? null;
      if (dto.thumbnail !== undefined)
        article.thumbnail = dto.thumbnail ?? null;
      if (dto.thumbnailFileId !== undefined)
        article.thumbnailFileId = dto.thumbnailFileId ?? null;
      if (dto.category !== undefined) article.category = dto.category ?? null;
      if (dto.tags !== undefined) article.tags = dto.tags ?? null;
      if (dto.metaTitle !== undefined)
        article.metaTitle = dto.metaTitle ?? null;
      if (dto.metaDescription !== undefined)
        article.metaDescription = dto.metaDescription ?? null;

      if (dto.projectId !== undefined)
        article.project = dto.projectId ? ({ id: dto.projectId } as any) : null;
      if (dto.programId !== undefined)
        article.program = dto.programId ? ({ id: dto.programId } as any) : null;
      if (dto.solutionId !== undefined)
        article.solution = dto.solutionId
          ? ({ id: dto.solutionId } as any)
          : null;

      const saved = await manager.save(article);

      // Post-commit side effects:
      if (oldThumbnailToDelete) {
        this.uploadService
          .deleteFile(oldThumbnailToDelete)
          .catch((err) =>
            this.logger.warn(
              `Failed to delete old thumbnail: ${oldThumbnailToDelete}`,
              err,
            ),
          );
      }
      if (orphanIds.length > 0) {
        this.cleanupImages(orphanIds);
      }
      if (dto.thumbnailFileId && dto.thumbnailFileId !== oldThumbnailFileId) {
        this.uploadService
          .confirmUpload(dto.thumbnailFileId)
          .catch((err) =>
            this.logger.warn(
              `Failed to confirm upload: ${dto.thumbnailFileId}`,
              err,
            ),
          );
      }
      const newContentImageIds = extractImageFileIds(
        saved.content as DocumentContent,
      );
      for (const fileId of newContentImageIds) {
        this.uploadService
          .confirmUpload(fileId)
          .catch((err) =>
            this.logger.warn(`Failed to confirm content image: ${fileId}`, err),
          );
      }

      return saved;
    });
  }

  /**
   * Publish article: validates title & non-empty blocks, sets is_published = true, published_at = now().
   */
  async publish(id: string) {
    const article = await this.findById(id);

    if (!article.title || article.title.trim() === '') {
      throw new BadRequestException(
        'Không thể xuất bản bài viết chưa có tiêu đề',
      );
    }
    const content = article.content as DocumentContent;
    if (!content || !content.blocks || content.blocks.length === 0) {
      throw new BadRequestException(
        'Không thể xuất bản bài viết chưa có nội dung',
      );
    }

    const publishedAt = new Date();
    await this.repo.update(id, { isPublished: true, publishedAt });
    return { id, isPublished: true, publishedAt };
  }

  /**
   * Unpublish article: sets is_published = false, preserves existing published_at.
   */
  async unpublish(id: string) {
    const article = await this.findById(id);

    await this.repo.update(id, { isPublished: false });
    return { id, isPublished: false, publishedAt: article.publishedAt };
  }

  /**
   * Toggle publish status (delegates cleanly to publish/unpublish).
   */
  async togglePublish(id: string, isPublished: boolean) {
    if (isPublished) {
      return this.publish(id);
    } else {
      return this.unpublish(id);
    }
  }

  /**
   * Hard delete article and clean up all associated images from ImageKit.
   */
  async remove(id: string) {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Không tìm thấy bài viết ID '${id}'`);
    }

    const fileIdsToDelete: string[] = [];
    if (article.thumbnailFileId) {
      fileIdsToDelete.push(article.thumbnailFileId);
    }

    const contentImages = extractImageFileIds(
      article.content as DocumentContent,
    );
    fileIdsToDelete.push(...contentImages);

    await this.repo.remove(article);

    if (fileIdsToDelete.length > 0) {
      this.cleanupImages(fileIdsToDelete);
    }

    return { message: 'Deleted successfully' };
  }
}
