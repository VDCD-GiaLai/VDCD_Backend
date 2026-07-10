// src/modules/partner/partner.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entites/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(@InjectRepository(Partner) private repo: Repository<Partner>) {}

  findActive() {
    return this.repo.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  findAll() {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  async create(dto: CreatePartnerDto) {
    const partner = this.repo.create(dto);
    return this.repo.save(partner);
  }

  async update(id: string, dto: UpdatePartnerDto) {
    const partner = await this.repo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException();
    Object.assign(partner, dto);
    return this.repo.save(partner);
  }

  async toggle(id: string, isActive: boolean) {
    const partner = await this.repo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException();
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
    const partner = await this.repo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException();
    await this.repo.remove(partner);
    return { message: 'Deleted successfully' };
  }
}
