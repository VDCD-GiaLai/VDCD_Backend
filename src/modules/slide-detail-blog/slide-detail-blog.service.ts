// src/modules/slide-detail-blog/slide-detail-blog.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { SlideDetailBlog } from './entities/slide-detail-blog.entity';
import { Slide } from '../slide/entities/slide.entity';
import { CreateSlideDetailBlogDto } from './dto/create-slide-detail-blog.dto';
import { UpdateSlideDetailBlogDto } from './dto/update-slide-detail-blog.dto';
import { SlideDetailBlogFilterDto } from './dto/slide-detail-blog-filter.dto';
import { UploadService } from '../upload/upload.service';
import {
  validateBlogContent,
  extractImageFileIds,
} from './validators/content.validator';
import { BlogContent } from './types/blog-content.types';

@Injectable()
export class SlideDetailBlogService {
  private readonly logger = new Logger(SlideDetailBlogService.name);

  constructor(
    @InjectRepository(SlideDetailBlog)
    private repo: Repository<SlideDetailBlog>,
    @InjectRepository(Slide)
    private slideRepo: Repository<Slide>,
    private readonly uploadService: UploadService,
  ) {}

  // ── Helpers ──────────────────────────────────────────────────────

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
          this.logger.warn(`Failed to delete image: ${fileId}`, err),
        );
    }
  }

  /** Fields exposed in public API responses */
  private static readonly PUBLIC_SELECT = {
    id: true,
    title: true,
    slug: true,
    subtitle: true,
    excerpt: true,
    heroImageUrl: true,
    seoTitle: true,
    metaDescription: true,
    content: true,
    publishedAt: true,
  } as const;

  // ── Public (read) ────────────────────────────────────────────────

  /**
   * Get published blog by slug. Public access.
   */
  async findBySlug(slug: string): Promise<Partial<SlideDetailBlog>> {
    const blog = await this.repo.findOne({
      where: { slug, isPublished: true },
      select: SlideDetailBlogService.PUBLIC_SELECT,
    });
    if (!blog) {
      throw new NotFoundException(`Không tìm thấy bài viết '${slug}'`);
    }
    return blog;
  }

  /**
   * Get published blog by slideId. Public access.
   */
  async findBySlideId(slideId: string): Promise<Partial<SlideDetailBlog>> {
    const blog = await this.repo.findOne({
      where: { slideId, isPublished: true },
      select: SlideDetailBlogService.PUBLIC_SELECT,
    });
    if (!blog) {
      throw new NotFoundException(
        'Slide chưa có bài viết chi tiết hoặc chưa được publish',
      );
    }
    return blog;
  }

  // ── Admin (read) ─────────────────────────────────────────────────

  /**
   * Get blog by ID (admin — returns any status).
   */
  async findById(id: string): Promise<SlideDetailBlog> {
    const blog = await this.repo.findOne({
      where: { id },
      relations: { slide: true },
    });
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }
    return blog;
  }

  /**
   * Get blog by slideId (admin — returns any status including draft).
   * Used by admin UI to navigate from slide management to its detail blog.
   */
  async findBySlideIdAdmin(slideId: string): Promise<SlideDetailBlog> {
    // Validate slide exists
    const slide = await this.slideRepo.findOne({ where: { id: slideId } });
    if (!slide) {
      throw new NotFoundException('Không tìm thấy slide');
    }

    const blog = await this.repo.findOne({
      where: { slideId },
      relations: { slide: true },
    });
    if (!blog) {
      throw new NotFoundException('Slide chưa có bài viết chi tiết');
    }
    return blog;
  }

  /**
   * Admin list — paginated, search, filter. Excludes heavy `content` field.
   */
  async findAllAdmin(dto: SlideDetailBlogFilterDto) {
    const { page = 1, limit = 10, search, isPublished } = dto;
    const qb = this.repo
      .createQueryBuilder('b')
      .select([
        'b.id',
        'b.slideId',
        'b.title',
        'b.subtitle',
        'b.slug',
        'b.excerpt',
        'b.heroImageUrl',
        'b.isPublished',
        'b.publishedAt',
        'b.createdAt',
        'b.updatedAt',
      ])
      .leftJoinAndSelect('b.slide', 'slide');

    if (isPublished !== undefined) {
      qb.andWhere('b.is_published = :isPublished', { isPublished });
    }
    if (search) {
      qb.andWhere('b.title ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('b.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      items: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ── Create ───────────────────────────────────────────────────────

  async create(dto: CreateSlideDetailBlogDto): Promise<SlideDetailBlog> {
    // Validate slide exists
    const slide = await this.slideRepo.findOne({
      where: { id: dto.slideId },
    });
    if (!slide) {
      throw new NotFoundException(`Slide '${dto.slideId}' không tồn tại`);
    }

    // Validate unique slideId
    const existingBySlide = await this.repo.findOne({
      where: { slideId: dto.slideId },
    });
    if (existingBySlide) {
      throw new ConflictException('Slide đã có bài viết chi tiết');
    }

    // Validate + generate slug
    const slug = dto.slug || (await this.makeSlug(dto.title));
    if (dto.slug) {
      const existingBySlug = await this.repo.findOne({
        where: { slug: dto.slug },
      });
      if (existingBySlug) {
        throw new ConflictException('Slug đã tồn tại');
      }
    }

    // Validate content if provided
    let content: BlogContent = { version: 1, blocks: [] };
    if (dto.content) {
      content = validateBlogContent(dto.content);
    }

    const blog = this.repo.create({
      slideId: dto.slideId,
      title: dto.title,
      subtitle: dto.subtitle ?? null,
      slug,
      excerpt: dto.excerpt ?? null,
      heroImageUrl: dto.heroImageUrl ?? null,
      heroImageFileId: dto.heroImageFileId ?? null,
      seoTitle: dto.seoTitle ?? null,
      metaDescription: dto.metaDescription ?? null,
      content,
      isPublished: dto.isPublished ?? false,
      publishedAt: dto.isPublished ? new Date() : null,
    });

    const saved = await this.repo.save(blog);

    // Confirm hero image upload
    if (dto.heroImageFileId) {
      this.uploadService
        .confirmUpload(dto.heroImageFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to confirm upload: ${dto.heroImageFileId}`,
            err,
          ),
        );
    }

    return saved;
  }

  // ── Update ───────────────────────────────────────────────────────

  async update(
    id: string,
    dto: UpdateSlideDetailBlogDto,
  ): Promise<SlideDetailBlog> {
    const blog = await this.repo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Slug uniqueness check
    if (dto.slug && dto.slug !== blog.slug) {
      const existingBySlug = await this.repo.findOne({
        where: { slug: dto.slug },
      });
      if (existingBySlug) {
        throw new ConflictException('Slug đã tồn tại');
      }
    }

    // Hero image change — delete old from ImageKit
    if (
      dto.heroImageUrl &&
      dto.heroImageUrl !== blog.heroImageUrl &&
      blog.heroImageFileId
    ) {
      this.uploadService
        .deleteFile(blog.heroImageFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old hero image: ${blog.heroImageFileId}`,
            err,
          ),
        );
    }

    // Content change — validate + cleanup orphan images
    if (dto.content) {
      const newContent = validateBlogContent(dto.content);
      const oldContent = blog.content as BlogContent;

      // Diff image fileIds to clean up orphans
      const oldImageIds = extractImageFileIds(oldContent);
      const newImageIds = new Set(extractImageFileIds(newContent));
      const orphanIds = oldImageIds.filter((fid) => !newImageIds.has(fid));
      if (orphanIds.length > 0) {
        this.cleanupImages(orphanIds);
      }

      blog.content = newContent;
    }

    // Apply other fields
    if (dto.title !== undefined) blog.title = dto.title;
    if (dto.subtitle !== undefined) blog.subtitle = dto.subtitle ?? null;
    if (dto.slug !== undefined) blog.slug = dto.slug;
    if (dto.excerpt !== undefined) blog.excerpt = dto.excerpt ?? null;
    if (dto.heroImageUrl !== undefined)
      blog.heroImageUrl = dto.heroImageUrl ?? null;
    if (dto.heroImageFileId !== undefined)
      blog.heroImageFileId = dto.heroImageFileId ?? null;
    if (dto.seoTitle !== undefined) blog.seoTitle = dto.seoTitle ?? null;
    if (dto.metaDescription !== undefined)
      blog.metaDescription = dto.metaDescription ?? null;

    const saved = await this.repo.save(blog);

    // Confirm new hero image upload
    if (dto.heroImageFileId && dto.heroImageFileId !== blog.heroImageFileId) {
      this.uploadService
        .confirmUpload(dto.heroImageFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to confirm upload: ${dto.heroImageFileId}`,
            err,
          ),
        );
    }

    return saved;
  }

  // ── Publish / Unpublish ──────────────────────────────────────────

  async togglePublish(id: string, isPublished: boolean) {
    const blog = await this.repo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Validate content before publish
    if (isPublished) {
      const content = blog.content as BlogContent;
      if (!content || !content.blocks || content.blocks.length === 0) {
        throw new BadRequestException(
          'Không thể publish bài viết chưa có nội dung',
        );
      }
      if (!blog.title || blog.title.trim() === '') {
        throw new BadRequestException(
          'Không thể publish bài viết chưa có tiêu đề',
        );
      }
    }

    // Set publishedAt only on first publish
    const publishedAt =
      isPublished && !blog.publishedAt ? new Date() : blog.publishedAt;

    await this.repo.update(id, { isPublished, publishedAt });
    return { id, isPublished, publishedAt };
  }

  // ── Delete ───────────────────────────────────────────────────────

  async remove(id: string) {
    const blog = await this.repo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Cleanup hero image
    const fileIdsToDelete: string[] = [];
    if (blog.heroImageFileId) {
      fileIdsToDelete.push(blog.heroImageFileId);
    }

    // Cleanup content images
    const contentImages = extractImageFileIds(blog.content as BlogContent);
    fileIdsToDelete.push(...contentImages);

    // Hard delete
    await this.repo.remove(blog);

    // Fire-and-forget image cleanup
    if (fileIdsToDelete.length > 0) {
      this.cleanupImages(fileIdsToDelete);
    }

    return { message: 'Deleted successfully' };
  }
}
