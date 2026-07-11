// src/modules/operation-field/operation-field.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationField } from './entities/operation-field.entity';
import slugify from 'slugify';
import { CreateOperationFieldDto } from './dto/create-operation-field.dto';
import { UpdateOperationFieldDto } from './dto/update-operation-field.dto';

@Injectable()
export class OperationFieldService {
  constructor(
    @InjectRepository(OperationField)
    private repo: Repository<OperationField>,
  ) {}

  findAll() {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  async findBySlug(slug: string) {
    const field = await this.repo.findOne({ where: { slug } });
    if (!field) {
      throw new NotFoundException(
        `Không tìm thấy lĩnh vực hoạt động với slug '${slug}'`,
      );
    }
    return field;
  }

  async create(dto: CreateOperationFieldDto) {
    const slug = dto.slug || slugify(dto.name, { lower: true, locale: 'vi' });
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException('Slug đã tồn tại');
    const field = this.repo.create({ ...dto, slug });
    return this.repo.save(field);
  }

  async update(id: string, dto: UpdateOperationFieldDto) {
    const field = await this.repo.findOne({ where: { id } });
    if (!field) throw new NotFoundException();
    if (dto.slug && dto.slug !== field.slug) {
      const exists = await this.repo.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException('Slug đã tồn tại');
    }
    Object.assign(field, dto);
    return this.repo.save(field);
  }

  async remove(id: string) {
    const field = await this.repo.findOne({ where: { id } });
    if (!field) throw new NotFoundException();
    await this.repo.remove(field);
    return { message: 'Deleted successfully' };
  }
}
