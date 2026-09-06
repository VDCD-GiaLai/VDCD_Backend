// src/modules/project/repositories/project.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectFilterDto } from '../dto/project-filter.dto';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  /**
   * Get public published projects with pagination and filters.
   */
  async findPublished(dto: ProjectFilterDto): Promise<[Project[], number]> {
    const { page = 1, limit = 12, search, fieldId, provinceId, year } = dto;
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.field', 'field')
      .leftJoinAndSelect('p.province', 'province')
      .where('p.is_published = true');

    if (search) qb.andWhere('p.title ILIKE :search', { search: `%${search}%` });
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    if (provinceId) qb.andWhere('province.id = :provinceId', { provinceId });
    if (year) qb.andWhere('p.year = :year', { year });

    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return qb.getManyAndCount();
  }

  /**
   * Get admin list of projects (drafts and published) with pagination and filters.
   */
  async findAllAdmin(dto: ProjectFilterDto): Promise<[Project[], number]> {
    const {
      page = 1,
      limit = 12,
      search,
      fieldId,
      provinceId,
      year,
      isPublished,
    } = dto;

    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.field', 'field')
      .leftJoinAndSelect('p.province', 'province');

    if (search) qb.andWhere('p.title ILIKE :search', { search: `%${search}%` });
    if (fieldId) qb.andWhere('field.id = :fieldId', { fieldId });
    if (provinceId) qb.andWhere('province.id = :provinceId', { provinceId });
    if (year) qb.andWhere('p.year = :year', { year });
    if (isPublished !== undefined)
      qb.andWhere('p.is_published = :isPublished', { isPublished });

    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return qb.getManyAndCount();
  }

  /**
   * Find project by slug with relations.
   */
  async findOneBySlug(
    slug: string,
    adminMode = false,
  ): Promise<Project | null> {
    const where: any = { slug };
    if (!adminMode) where.isPublished = true;

    return this.repo.findOne({
      where,
      relations: {
        field: true,
        province: true,
        images: true,
      },
      order: { images: { order: 'ASC' } },
    });
  }

  /**
   * Find project by ID with relations.
   */
  async findById(id: string): Promise<Project | null> {
    return this.repo.findOne({
      where: { id },
      relations: {
        field: true,
        province: true,
        images: true,
      },
      order: { images: { order: 'ASC' } },
    });
  }

  /**
   * Check if slug exists.
   */
  async findBySlug(slug: string): Promise<Project | null> {
    return this.repo.findOne({ where: { slug } });
  }

  create(entityLike: Partial<Project>): Project {
    return this.repo.create(entityLike);
  }

  async save(project: Project): Promise<Project> {
    return this.repo.save(project);
  }

  async update(id: string, partial: Partial<Project>): Promise<UpdateResult> {
    return this.repo.update(id, partial);
  }

  async remove(project: Project): Promise<Project> {
    return this.repo.remove(project);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }

  get rawRepo(): Repository<Project> {
    return this.repo;
  }
}
