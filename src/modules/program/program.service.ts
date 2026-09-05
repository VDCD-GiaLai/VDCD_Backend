// src/modules/program/program.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import slugify from 'slugify';
import { Program } from './entities/program.entity';
import { Article } from '../article/entities/article.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramFilterDto } from './dto/program-filter.dto';
import { UploadService } from '../upload/upload.service';
import {
  validateDocumentContent,
  extractImageFileIds,
} from '../../common/validators/document-content.validator';
import { DocumentContent } from '../../common/types/document-content.types';

@Injectable()
export class ProgramService {
  private readonly logger = new Logger(ProgramService.name);

  constructor(
    @InjectRepository(Program) private repo: Repository<Program>,
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
   * Delete a list of image fileIds from ImageKit (fire-and-forget).
   */
  private cleanupImages(fileIds: string[]): void {
    for (const fileId of fileIds) {
      this.uploadService
        .deleteFile(fileId)
        .catch((err) =>
          this.logger.warn(`Failed to delete program image: ${fileId}`, err),
        );
    }
  }

  /**
   * Public list — paginated, filtered, excludes heavy `content` jsonb for performance.
   * Only returns published programs.
   */
  async findAll(dto: ProgramFilterDto) {
    const { page = 1, limit = 10, fieldId } = dto;
    const qb = this.repo
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.slug',
        'p.shortDescription',
        'p.thumbnail',
        'p.thumbnailFileId',
        'p.isPublished',
        'p.publishedAt',
        'p.createdAt',
        'p.updatedAt',
      ])
      .leftJoinAndSelect('p.field', 'field')
      .where('p.is_published = true');

    if (fieldId) {
      qb.andWhere('field.id = :fieldId', { fieldId });
    }

    qb.orderBy('p.published_at', 'DESC', 'NULLS LAST')
      .addOrderBy('p.created_at', 'DESC')
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
   * Admin list — paginated, filtered, includes drafts and full details.
   */
  async findAllAdmin(dto: ProgramFilterDto) {
    const { page = 1, limit = 10, fieldId, isPublished } = dto;
    const qb = this.repo
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.slug',
        'p.shortDescription',
        'p.content',
        'p.thumbnail',
        'p.thumbnailFileId',
        'p.metaTitle',
        'p.metaDescription',
        'p.isPublished',
        'p.publishedAt',
        'p.createdAt',
        'p.updatedAt',
      ])
      .leftJoinAndSelect('p.field', 'field');

    if (fieldId) {
      qb.andWhere('field.id = :fieldId', { fieldId });
    }
    if (isPublished !== undefined) {
      qb.andWhere('p.is_published = :isPublished', { isPublished });
    }

    qb.orderBy('p.created_at', 'DESC')
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
   * Public single program by slug (or UUID).
   * Restricted to published only unless adminMode is explicitly true.
   */
  async findOneBySlug(slug: string, adminMode = false) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug,
      );

    let program: Program | null = null;
    if (isUuid) {
      const where: any = adminMode
        ? [{ id: slug }, { slug }]
        : [
            { id: slug, isPublished: true },
            { slug, isPublished: true },
          ];
      program = await this.repo.findOne({
        where,
        relations: { field: true },
      });
    } else {
      const where: any = { slug };
      if (!adminMode) where.isPublished = true;
      program = await this.repo.findOne({
        where,
        relations: { field: true },
      });
    }

    if (!program) {
      throw new NotFoundException(`Không tìm thấy chương trình '${slug}'`);
    }

    if (!program.content || typeof program.content !== 'object') {
      program.content = { version: 1, blocks: [] };
    }

    const relatedArticles = await this.articleRepo.find({
      where: { program: { id: program.id }, isPublished: true },
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

    return { ...program, relatedArticles };
  }

  /**
   * Admin read by ID — returns drafts or published programs.
   */
  async findById(id: string): Promise<Program> {
    const program = await this.repo.findOne({
      where: { id },
      relations: { field: true },
    });
    if (!program) {
      throw new NotFoundException(`Không tìm thấy chương trình ID '${id}'`);
    }
    if (!program.content || typeof program.content !== 'object') {
      program.content = { version: 1, blocks: [] };
    }
    return program;
  }

  /**
   * Create new program with validated block document and ImageKit tracking.
   */
  async create(dto: CreateProgramDto): Promise<Program> {
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

    const program = this.repo.create({
      title: dto.title,
      slug,
      shortDescription: dto.shortDescription ?? null,
      content,
      thumbnail: dto.thumbnail ?? null,
      thumbnailFileId: dto.thumbnailFileId ?? null,
      metaTitle: dto.metaTitle ?? null,
      metaDescription: dto.metaDescription ?? null,
      isPublished,
      publishedAt,
      ...(dto.fieldId ? { field: { id: dto.fieldId } } : {}),
    });

    const saved = await this.repo.save(program);

    // Confirm thumbnail upload in ImageKit
    if (dto.thumbnailFileId) {
      this.uploadService
        .confirmUpload(dto.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to confirm program thumbnail: ${dto.thumbnailFileId}`,
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
   * Update program with atomic transaction, block document diffing, orphan cleanup, and relation handling.
   */
  async update(id: string, dto: UpdateProgramDto): Promise<Program> {
    return await this.dataSource.transaction(async (manager) => {
      const program = await manager.findOne(Program, { where: { id } });
      if (!program) {
        throw new NotFoundException(`Không tìm thấy chương trình ID '${id}'`);
      }

      if (dto.slug && dto.slug !== program.slug) {
        const exists = await manager.findOne(Program, {
          where: { slug: dto.slug },
        });
        if (exists) {
          throw new ConflictException('Slug đã tồn tại');
        }
      }

      let oldThumbnailToDelete: string | null = null;
      if (
        dto.thumbnail &&
        dto.thumbnail !== program.thumbnail &&
        program.thumbnailFileId
      ) {
        oldThumbnailToDelete = program.thumbnailFileId;
      }

      let orphanIds: string[] = [];
      if (dto.content !== undefined) {
        const newContent = validateDocumentContent(dto.content);
        const oldContent = program.content as DocumentContent;

        const oldImageIds = extractImageFileIds(oldContent);
        const newImageIds = new Set(extractImageFileIds(newContent));
        orphanIds = oldImageIds.filter((fid) => !newImageIds.has(fid));

        program.content = {
          version: newContent.version || 1,
          blocks: [...newContent.blocks],
        };
      }

      const oldThumbnailFileId = program.thumbnailFileId;

      // Apply metadata fields
      if (dto.title !== undefined) program.title = dto.title;
      if (dto.slug !== undefined) program.slug = dto.slug;
      if (dto.shortDescription !== undefined)
        program.shortDescription = dto.shortDescription ?? null;
      if (dto.thumbnail !== undefined)
        program.thumbnail = dto.thumbnail ?? null;
      if (dto.thumbnailFileId !== undefined)
        program.thumbnailFileId = dto.thumbnailFileId ?? null;
      if (dto.metaTitle !== undefined)
        program.metaTitle = dto.metaTitle ?? null;
      if (dto.metaDescription !== undefined)
        program.metaDescription = dto.metaDescription ?? null;

      if (dto.isPublished !== undefined) {
        program.isPublished = dto.isPublished;
        if (dto.isPublished) {
          program.publishedAt =
            dto.publishedAt ?? program.publishedAt ?? new Date();
        } else {
          program.publishedAt = null;
        }
      } else if (dto.publishedAt !== undefined) {
        program.publishedAt = dto.publishedAt;
      }

      if (dto.fieldId !== undefined) {
        program.field = dto.fieldId ? ({ id: dto.fieldId } as any) : null;
      }

      const saved = await manager.save(program);

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
        this.cleanupImages([oldThumbnailToDelete]);
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
          this.cleanupImages(orphanIds);
        }
      }

      return saved;
    });
  }

  /**
   * Toggle publish status and update publishedAt timestamp consistently.
   */
  async togglePublish(id: string, isPublished: boolean, publishedAt?: Date) {
    const program = await this.repo.findOne({ where: { id } });
    if (!program) throw new NotFoundException();

    let newPublishedAt: Date | null = null;
    if (isPublished) {
      newPublishedAt = publishedAt ?? program.publishedAt ?? new Date();
    }

    await this.repo.update(id, {
      isPublished,
      publishedAt: newPublishedAt,
    });

    return { id, isPublished, publishedAt: newPublishedAt };
  }

  /**
   * Permanently delete program and clean up all associated ImageKit media.
   */
  async remove(id: string) {
    const program = await this.repo.findOne({ where: { id } });
    if (!program) throw new NotFoundException();

    const filesToDelete: string[] = [];
    if (program.thumbnailFileId) {
      filesToDelete.push(program.thumbnailFileId);
    }
    const contentImageIds = extractImageFileIds(
      program.content as DocumentContent,
    );
    filesToDelete.push(...contentImageIds);

    if (filesToDelete.length > 0) {
      this.cleanupImages(filesToDelete);
    }

    await this.repo.remove(program);
    return { message: 'Deleted successfully' };
  }
}
