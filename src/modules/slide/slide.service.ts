// src/modules/slide/slide.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide } from './entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class SlideService {
  private readonly logger = new Logger(SlideService.name);

  constructor(
    @InjectRepository(Slide) private repo: Repository<Slide>,
    private readonly uploadService: UploadService,
  ) {}

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

    if (dto.imageUrl && dto.imageUrl !== slide.imageUrl && slide.imageFileId) {
      this.uploadService
        .deleteFile(slide.imageFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old slide image: ${slide.imageFileId}`,
            err,
          ),
        );
    }

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

    if (slide.imageFileId) {
      this.uploadService
        .deleteFile(slide.imageFileId)
        .catch((err) =>
          this.logger.warn(`Failed to delete slide image from ImageKit`, err),
        );
    }

    await this.repo.remove(slide);
    return { message: 'Deleted successfully' };
  }
}
