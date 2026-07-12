import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { Article } from '../article/entities/article.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
    @InjectRepository(ProjectImage) private imageRepo: Repository<ProjectImage>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    private readonly uploadService: UploadService,
  ) {}

  private async generateSlug(
    title: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = slugify(title, { lower: true, locale: 'vi' });
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing && existing.id !== excludeId) {
      slug = `${slug}-${Date.now()}`;
    }
    return slug;
  }

  async findAll(dto: ProjectFilterDto) {
    const { page = 1, limit = 12, fieldId, provinceId, year } = dto;
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.field', 'field')
      .leftJoinAndSelect('p.province', 'province')
      .where('p.is_published = true');
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    if (provinceId) qb.andWhere('province.id = :provinceId', { provinceId });
    if (year) qb.andWhere('p.year = :year', { year });
    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findAllAdmin(dto: ProjectFilterDto) {
    const {
      page = 1,
      limit = 12,
      fieldId,
      provinceId,
      year,
      isPublished,
    } = dto;
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.field', 'field')
      .leftJoinAndSelect('p.province', 'province');
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    if (provinceId) qb.andWhere('province.id = :provinceId', { provinceId });
    if (year) qb.andWhere('p.year = :year', { year });
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

    const project = await this.repo.findOne({
      where,
      relations: {
        field: true,
        province: true,
        images: true,
      },
      order: { images: { order: 'ASC' } },
    });
    if (!project) throw new NotFoundException(`Không tìm thấy dự án '${slug}'`);

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

    const relatedProjects = await this.repo.find({
      where: { isPublished: true },
      relations: {
        field: true,
      },
      take: 3,
      order: { createdAt: 'DESC' },
    });

    return {
      ...project,
      relatedArticles,
      relatedProjects: relatedProjects.filter((p) => p.id !== project.id),
    };
  }

  async create(dto: CreateProjectDto) {
    const slug = dto.slug || (await this.generateSlug(dto.title));
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException('Slug đã tồn tại');

    const project = this.repo.create({
      title: dto.title,
      slug,
      overview: dto.overview,
      thumbnail: dto.thumbnail,
      thumbnailFileId: dto.thumbnailFileId,
      year: dto.year,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      isPublished: dto.isPublished ?? false,
      ...(dto.fieldId ? { field: { id: dto.fieldId } } : {}),
      ...(dto.provinceId ? { province: { id: dto.provinceId } } : {}),
    });
    const saved = await this.repo.save(project);

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

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.repo.findOne({ where: { id } });
    if (!project) throw new NotFoundException();
    if (dto.slug && dto.slug !== project.slug) {
      const exists = await this.repo.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException('Slug đã tồn tại');
    }
    // If thumbnail changed → delete old thumbnail from ImageKit
    if (
      dto.thumbnail &&
      dto.thumbnail !== project.thumbnail &&
      project.thumbnailFileId
    ) {
      this.uploadService
        .deleteFile(project.thumbnailFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old thumbnail: ${project.thumbnailFileId}`,
            err,
          ),
        );
    }
    Object.assign(project, dto);
    if (dto.fieldId !== undefined)
      project.field = dto.fieldId ? ({ id: dto.fieldId } as any) : null;
    if (dto.provinceId !== undefined)
      project.province = dto.provinceId
        ? ({ id: dto.provinceId } as any)
        : null;
    const saved = await this.repo.save(project);

    // Confirm new file if any
    if (
      dto.thumbnailFileId &&
      dto.thumbnailFileId !== project.thumbnailFileId
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
    await this.repo.update(id, { isPublished });
    return { id, isPublished };
  }

  async remove(id: string) {
    const project = await this.repo.findOne({
      where: { id },
      relations: { images: true },
    });
    if (!project) throw new NotFoundException();

    // delete image from image kit
    const fileIds = [
      project.thumbnailFileId,
      ...(project.images?.map((img) => img.fileId) ?? []),
    ].filter(Boolean);

    if (fileIds.length) {
      Promise.all(
        fileIds.map((fid) => this.uploadService.deleteFile(fid)),
      ).catch((err) =>
        this.logger.warn('Failed to delete project files from ImageKit', err),
      );
    }

    await this.repo.remove(project);
    return { message: 'Deleted successfully' };
  }

  async addImages(
    projectId: string,
    files: Express.Multer.File[],
    captions: string[] = [],
    uploadedBy?: string,
  ) {
    const project = await this.repo.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException();

    // Upload all files to ImageKit parallel
    const uploadResults = await Promise.all(
      files.map((file) =>
        this.uploadService.uploadProjectImage(file, uploadedBy),
      ),
    );

    // Save to DB
    const entities = uploadResults.map((result, i) =>
      this.imageRepo.create({
        project,
        url: result.url,
        fileId: result.fileId,
        caption: captions[i] ?? null,
        order: i,
      }),
    );

    const saved = await this.imageRepo.save(entities);

    // DB save success → confirm all files, no orphan risk
    Promise.all(
      uploadResults.map((r) => this.uploadService.confirmUpload(r.fileId)),
    ).catch((err) => this.logger.warn('Failed to confirm image uploads', err));

    return saved;
  }

  async reorderImages(
    projectId: string,
    items: { id: string; order: number }[],
  ) {
    await Promise.all(
      items.map(({ id, order }) => this.imageRepo.update(id, { order })),
    );
    return { message: 'Reordered successfully' };
  }

  async removeImage(imageId: string) {
    const img = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!img) throw new NotFoundException();

    // Delete from ImageKit
    if (img.fileId) {
      this.uploadService
        .deleteFile(img.fileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete image ${img.fileId} from ImageKit`,
            err,
          ),
        );
    }

    await this.imageRepo.remove(img);
    return { message: 'Deleted successfully' };
  }
}
