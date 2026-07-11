// src/modules/job/job.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';

@Injectable()
export class JobService {
  constructor(@InjectRepository(Job) private repo: Repository<Job>) {}

  private async makeSlug(title: string, excludeId?: string) {
    let slug = slugify(title, { lower: true, locale: 'vi' });
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing && existing.id !== excludeId) slug = `${slug}-${Date.now()}`;
    return slug;
  }

  async findAll(dto: JobFilterDto) {
    const { page = 1, limit = 10, type, location } = dto;
    const qb = this.repo.createQueryBuilder('j').where('j.is_active = true');
    if (type) qb.andWhere('j.type = :type', { type });
    if (location)
      qb.andWhere('j.location ILIKE :location', { location: `%${location}%` });
    qb.orderBy('j.is_urgent', 'DESC')
      .addOrderBy('j.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findAllAdmin(dto: JobFilterDto) {
    const { page = 1, limit = 10, type, isActive } = dto;
    const qb = this.repo.createQueryBuilder('j');
    if (type) qb.andWhere('j.type = :type', { type });
    if (isActive !== undefined)
      qb.andWhere('j.is_active = :isActive', { isActive });
    qb.orderBy('j.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOneBySlug(slug: string) {
    const job = await this.repo.findOne({ where: { slug, isActive: true } });
    if (!job)
      throw new NotFoundException(`Không tìm thấy vị trí tuyển dụng '${slug}'`);

    const otherJobs = await this.repo.find({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        department: true,
        location: true,
      },
      order: { createdAt: 'DESC' },
      take: 4,
    });

    return { ...job, otherJobs: otherJobs.filter((j) => j.id !== job.id) };
  }

  async create(dto: CreateJobDto) {
    const slug = dto.slug || (await this.makeSlug(dto.title));
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException('Slug đã tồn tại');
    const job = this.repo.create({ ...dto, slug });
    return this.repo.save(job);
  }

  async update(id: string, dto: UpdateJobDto) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) throw new NotFoundException();
    if (dto.slug && dto.slug !== job.slug) {
      const exists = await this.repo.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException('Slug đã tồn tại');
    }
    Object.assign(job, dto);
    return this.repo.save(job);
  }

  async toggleActive(id: string, isActive: boolean) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) throw new NotFoundException();
    await this.repo.update(id, { isActive });
    return { id, isActive };
  }

  async remove(id: string) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) throw new NotFoundException();
    await this.repo.remove(job);
    return { message: 'Deleted successfully' };
  }
}
