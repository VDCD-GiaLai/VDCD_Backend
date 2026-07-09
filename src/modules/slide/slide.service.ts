// src/modules/slide/slide.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide } from './entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

@Injectable()
export class SlideService {
  constructor(@InjectRepository(Slide) private repo: Repository<Slide>) {}

  findActive() {
    return this.repo.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  findAll() {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  async create(dto: CreateSlideDto) {
    const slide = this.repo.create(dto);
    return this.repo.save(slide);
  }

  async update(id: string, dto: UpdateSlideDto) {
    const slide = await this.repo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException();
    Object.assign(slide, dto);
    return this.repo.save(slide);
  }

  async toggle(id: string, isActive: boolean) {
    const slide = await this.repo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException();
    await this.repo.update(id, { isActive });
    return { id, isActive };
  }

  async reorder(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map(({ id, order }) => this.repo.update(id, { order })),
    );
    return { message: 'Reordered successfully' };
  }

  async remove(id: string) {
    const slide = await this.repo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException();
    await this.repo.remove(slide);
    return { message: 'Deleted successfully' };
  }
}
