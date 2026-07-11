// src/modules/lead/lead.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  providers: [LeadService],
  controllers: [LeadController],
})
export class LeadModule {}
