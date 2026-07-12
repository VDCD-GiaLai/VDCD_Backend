// src/modules/article/article.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectRepository(Article) private repo: Repository<Article>,
    private readonly uploadService: UploadService,
  ) {}

  private async makeSlug(title: string, excludeId?: string) {
    let slug = slugify(title, { lower: true, locale: 'vi' });
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing && existing.id !== excludeId) slug = `${slug}-${Date.now()}`;
    return slug;
  }

  async findAll(dto: ArticleFilterDto) {
    const { page = 1, limit = 10, category, tags } = dto;
    const qb = this.repo.createQueryBuilder('a').where('a.is_published = true');
    if (category) qb.andWhere('a.category = :category', { category });
    if (tags) qb.andWhere('a.tags ILIKE :tags', { tags: `%${tags}%` });
    qb.orderBy('a.published_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findAllAdmin(dto: ArticleFilterDto) {
    const { page = 1, limit = 10, category, isPublished } = dto;
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.project', 'project')
      .leftJoinAndSelect('a.program', 'program')
      .leftJoinAndSelect('a.solution', 'solution');
    if (category) qb.andWhere('a.category = :category', { category });
    if (isPublished !== undefined)
      qb.andWhere('a.is_published = :isPublished', { isPublished });
    qb.orderBy('a.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOneBySlug(slug: string, adminMode = false) {
    const where: any = { slug };
    if (!adminMode) where.isPublished = true;
    const article = await this.repo.findOne({
      where,
      relations: {
        project: true,
        program: true,
        solution: true,
      },
    });
    if (!article)
      throw new NotFoundException(`Không tìm thấy bài viết '${slug}'`);

    const relatedArticles = await this.repo.find({
      where: { category: article.category, isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        publishedAt: true,
      },
      order: { publishedAt: 'DESC' },
      take: 4,
    });

    return {
      ...article,
      relatedArticles: relatedArticles.filter((a) => a.id !== article.id),
    };
  }

  async create(dto: CreateArticleDto) {
    const slug = dto.slug || (await this.makeSlug(dto.title));
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException('Slug đã tồn tại');

    const article = this.repo.create({
      title: dto.title,
      slug,
      content: dto.content,
      thumbnail: dto.thumbnail,
      thumbnailFileId: dto.thumbnailFileId,
      category: dto.category,
      tags: dto.tags,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      isPublished: dto.isPublished ?? false,
      publishedAt: dto.isPublished ? (dto.publishedAt ?? new Date()) : null,
      ...(dto.projectId ? { project: { id: dto.projectId } } : {}),
      ...(dto.programId ? { program: { id: dto.programId } } : {}),
      ...(dto.solutionId ? { solution: { id: dto.solutionId } } : {}),
    });
    return this.repo.save(article);
  }

  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException();

    if (dto.slug && dto.slug !== article.slug) {
      const exists = await this.repo.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException('Slug đã tồn tại');
    }

    if (
      dto.thumbnail &&
      dto.thumbnail !== article.thumbnail &&
      article.thumbnailFileId
    ) {
      this.uploadService
        .deleteFile(article.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old thumbnail: ${article.thumbnailFileId}`,
            err,
          ),
        );
    }

    Object.assign(article, dto);
    if (dto.projectId !== undefined)
      article.project = dto.projectId ? ({ id: dto.projectId } as any) : null;
    if (dto.programId !== undefined)
      article.program = dto.programId ? ({ id: dto.programId } as any) : null;
    if (dto.solutionId !== undefined)
      article.solution = dto.solutionId
        ? ({ id: dto.solutionId } as any)
        : null;

    return this.repo.save(article);
  }

  async togglePublish(id: string, isPublished: boolean) {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException();
    const publishedAt =
      isPublished && !article.publishedAt ? new Date() : article.publishedAt;
    await this.repo.update(id, { isPublished, publishedAt });
    return { id, isPublished, publishedAt };
  }

  async remove(id: string) {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException();

    if (article.thumbnailFileId) {
      this.uploadService
        .deleteFile(article.thumbnailFileId)
        .catch((err) =>
          this.logger.warn('Failed to delete thumbnail from ImageKit', err),
        );
    }

    await this.repo.remove(article);
    return { message: 'Deleted successfully' };
  }
}
