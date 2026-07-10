// src/modules/province/province.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';

@Injectable()
export class ProvinceService {
  constructor(@InjectRepository(Province) private repo: Repository<Province>) {}

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findByCode(code: string) {
    const province = await this.repo.findOne({ where: { code } });
    if (!province) throw new NotFoundException(`Không tìm thấy tỉnh '${code}'`);
    return province;
  }

  async create(dto: CreateProvinceDto) {
    const exists = await this.repo.findOne({ where: { code: dto.code } });
    if (exists) {
      throw new ConflictException(`Mã tỉnh '${dto.code}' đã tồn tại`);
    }
    const province = this.repo.create(dto);
    return this.repo.save(province);
  }

  async update(id: string, dto: UpdateProvinceDto) {
    const province = await this.repo.findOne({ where: { id } });
    if (!province) throw new NotFoundException();
    Object.assign(province, dto);
    return this.repo.save(province);
  }

  async remove(id: string) {
    const province = await this.repo.findOne({ where: { id } });
    if (!province)
      throw new NotFoundException(`Không tìm thấy tỉnh với ID '${id}'`);
    await this.repo.remove(province);
    return { message: 'Deleted successfully' };
  }
}
