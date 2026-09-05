// src/modules/program/program.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Article } from '../article/entities/article.entity';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { AdminProgramController } from './admin-program.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Program, Article]), UploadModule],
  providers: [ProgramService],
  controllers: [ProgramController, AdminProgramController],
  exports: [ProgramService],
})
export class ProgramModule {}
