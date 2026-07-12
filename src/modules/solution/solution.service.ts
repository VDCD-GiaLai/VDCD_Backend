// src/modules/solution/solution.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Solution } from './entities/solution.entity';
import { Article } from '../article/entities/article.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { SolutionFilterDto } from './dto/solution-filter.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class SolutionService {
  private readonly logger = new Logger(SolutionService.name);

  constructor(
    @InjectRepository(Solution) private repo: Repository<Solution>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    private readonly uploadService: UploadService,
  ) {}

  private async makeSlug(title: string, excludeId?: string) {
    let slug = slugify(title, { lower: true, locale: 'vi' });
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing && existing.id !== excludeId) slug = `${slug}-${Date.now()}`;
    return slug;
  }

  async findAll(dto: SolutionFilterDto) {
    const { page = 1, limit = 10, fieldId } = dto;
    const qb = this.repo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.field', 'field')
      .where('s.is_published = true');
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    qb.orderBy('s.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findAllAdmin(dto: SolutionFilterDto) {
    const { page = 1, limit = 10, fieldId, isPublished } = dto;
    const qb = this.repo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.field', 'field');
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    if (isPublished !== undefined)
      qb.andWhere('s.is_published = :isPublished', { isPublished });
    qb.orderBy('s.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOneBySlug(slug: string, adminMode = false) {
    const where: any = { slug };
    if (!adminMode) where.isPublished = true;
    const solution = await this.repo.findOne({
      where,
      relations: { field: true },
    });
    if (!solution)
      throw new NotFoundException(`Không tìm thấy giải pháp '${slug}'`);
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

  async create(dto: CreateSolutionDto) {
    const slug = dto.slug || (await this.makeSlug(dto.title));
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException('Slug đã tồn tại');
    const solution = this.repo.create({
      title: dto.title,
      slug,
      shortDescription: dto.shortDescription,
      content: dto.content,
      thumbnail: dto.thumbnail,
      thumbnailFileId: dto.thumbnailFileId,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      isPublished: dto.isPublished ?? false,
      ...(dto.fieldId ? { field: { id: dto.fieldId } } : {}),
    });
    const saved = await this.repo.save(solution);

    // Confirm file if exists
    if (dto.thumbnailFileId) {
      this.uploadService
        .confirmUpload(dto.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to confirm upload: ${dto.thumbnailFileId}`,
            err,
          ),
        );
    }

    return saved;
  }

  async update(id: string, dto: UpdateSolutionDto) {
    const solution = await this.repo.findOne({ where: { id } });
    if (!solution) throw new NotFoundException();

    if (dto.slug && dto.slug !== solution.slug) {
      const exists = await this.repo.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException('Slug đã tồn tại');
    }

    if (
      dto.thumbnail &&
      dto.thumbnail !== solution.thumbnail &&
      solution.thumbnailFileId
    ) {
      this.uploadService
        .deleteFile(solution.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old thumbnail: ${solution.thumbnailFileId}`,
            err,
          ),
        );
    }

    Object.assign(solution, dto);
    if (dto.fieldId !== undefined)
      solution.field = dto.fieldId ? ({ id: dto.fieldId } as any) : null;

    const saved = await this.repo.save(solution);

    // Confirm new file if any
    if (
      dto.thumbnailFileId &&
      dto.thumbnailFileId !== solution.thumbnailFileId
    ) {
      this.uploadService
        .confirmUpload(dto.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to confirm upload: ${dto.thumbnailFileId}`,
            err,
          ),
        );
    }

    return saved;
  }

  async togglePublish(id: string, isPublished: boolean) {
    const solution = await this.repo.findOne({ where: { id } });
    if (!solution) throw new NotFoundException();
    await this.repo.update(id, { isPublished });
    return { id, isPublished };
  }

  async remove(id: string) {
    const solution = await this.repo.findOne({ where: { id } });
    if (!solution) throw new NotFoundException();

    if (solution.thumbnailFileId) {
      this.uploadService
        .deleteFile(solution.thumbnailFileId)
        .catch((err) =>
          this.logger.warn('Failed to delete thumbnail from ImageKit', err),
        );
    }

    await this.repo.remove(solution);
    return { message: 'Deleted successfully' };
  }
}
