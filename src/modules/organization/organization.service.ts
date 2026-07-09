// src/modules/organization/organization.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private repo: Repository<Organization>,
  ) {}

  async get() {
    const orgs = await this.repo.find({ take: 1 });
    if (!orgs.length) {
      // Auto create default organization if not exists
      const org = this.repo.create({ name: 'VDCD' });
      return this.repo.save(org);
    }
    return orgs[0];
  }

  async update(dto: UpdateOrganizationDto) {
    const org = await this.get();
    Object.assign(org, dto);
    return this.repo.save(org);
  }
}
