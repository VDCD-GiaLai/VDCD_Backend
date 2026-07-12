// src/modules/program/program.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Program } from './entities/program.entity';
import { Article } from '../article/entities/article.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramFilterDto } from './dto/program-filter.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProgramService {
  private readonly logger = new Logger(ProgramService.name);

  constructor(
    @InjectRepository(Program) private repo: Repository<Program>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    private readonly uploadService: UploadService,
  ) {}

  private async makeSlug(title: string, excludeId?: string) {
    let slug = slugify(title, { lower: true, locale: 'vi' });
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing && existing.id !== excludeId) slug = `${slug}-${Date.now()}`;
    return slug;
  }

  async findAll(dto: ProgramFilterDto) {
    const { page = 1, limit = 10, fieldId } = dto;
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.field', 'field')
      .where('p.is_published = true');
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findAllAdmin(dto: ProgramFilterDto) {
    const { page = 1, limit = 10, fieldId, isPublished } = dto;
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.field', 'field');
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    if (isPublished !== undefined)
      qb.andWhere('p.is_published = :isPublished', { isPublished });
    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOneBySlug(slug: string, adminMode = false) {
    const where: any = { slug };
    if (!adminMode) where.isPublished = true;
    const program = await this.repo.findOne({
      where,
      relations: { field: true },
    });
    if (!program)
      throw new NotFoundException(`Không tìm thấy chương trình '${slug}'`);

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

  async create(dto: CreateProgramDto) {
    const slug = dto.slug || (await this.makeSlug(dto.title));
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException('Slug đã tồn tại');

    const program = this.repo.create({
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

    const saved = await this.repo.save(program);

    // DB save successfully -> confirm file
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

  async update(id: string, dto: UpdateProgramDto) {
    const program = await this.repo.findOne({ where: { id } });
    if (!program) throw new NotFoundException();

    if (dto.slug && dto.slug !== program.slug) {
      const exists = await this.repo.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException('Slug đã tồn tại');
    }

    if (
      dto.thumbnail &&
      dto.thumbnail !== program.thumbnail &&
      program.thumbnailFileId
    ) {
      this.uploadService
        .deleteFile(program.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old thumbnail: ${program.thumbnailFileId}`,
            err,
          ),
        );
    }

    Object.assign(program, dto);
    if (dto.fieldId !== undefined)
      program.field = dto.fieldId ? ({ id: dto.fieldId } as any) : null;

    const saved = await this.repo.save(program);

    // Confirm new file
    if (
      dto.thumbnailFileId &&
      dto.thumbnailFileId !== program.thumbnailFileId
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
    const program = await this.repo.findOne({ where: { id } });
    if (!program) throw new NotFoundException();
    await this.repo.update(id, { isPublished });
    return { id, isPublished };
  }

  async remove(id: string) {
    const program = await this.repo.findOne({ where: { id } });
    if (!program) throw new NotFoundException();

    if (program.thumbnailFileId) {
      this.uploadService
        .deleteFile(program.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(`Failed to delete thumbnail from ImageKit`, err),
        );
    }

    await this.repo.remove(program);
    return { message: 'Deleted successfully' };
  }
}
