// src/modules/project/project.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { Article } from '../article/entities/article.entity';
import { ProjectService } from './project.service';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectController } from './project.controller';
import { AdminProjectController } from './admin-project.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectImage, Article]),
    UploadModule,
  ],
  providers: [ProjectService, ProjectRepository],
  controllers: [ProjectController, AdminProjectController],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
