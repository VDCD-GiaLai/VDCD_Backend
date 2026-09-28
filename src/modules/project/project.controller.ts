// src/modules/project/project.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { AddImagesDto } from './dto/add-images.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { ReorderProjectsDto } from './dto/reorder-projects.dto';
import { UpdateProjectImageDto } from './dto/update-project-image.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get list of published projects',
    description:
      'Retrieve a list of public/published projects with pagination and optional filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'Published projects retrieved successfully.',
  })
  findAll(@Query() dto: ProjectFilterDto) {
    return this.service.findAll(dto);
  }

  @Get('all')
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get list of all projects (Admin)',
    description:
      'Retrieve a list of all projects (published and unpublished) with filtering. Restricted to superadmin, editor, and viewer.',
  })
  @ApiResponse({
    status: 200,
    description: 'All projects retrieved successfully.',
  })
  findAllAdmin(@Query() dto: ProjectFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get('admin/:id')
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get project details by ID (Admin)',
    description:
      'Retrieve project details by ID regardless of publish status. Accessible by superadmin, editor, and viewer.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the project' })
  @ApiResponse({
    status: 200,
    description: 'Project details retrieved successfully.',
    type: Project,
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOneAdmin(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get project by slug',
    description:
      'Retrieve project details and related articles/projects by slug. Public access.',
  })
  @ApiParam({
    name: 'slug',
    description: 'The unique slug or ID of the project',
  })
  @ApiResponse({
    status: 200,
    description: 'Project details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOne(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new project',
    description:
      'Create a new project record supporting unified Document Model. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully.',
    type: Project,
  })
  @ApiResponse({ status: 409, description: 'Slug already exists.' })
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @Patch('reorder')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Reorder projects',
    description:
      'Reorder display positions of projects. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: ReorderProjectsDto })
  @ApiResponse({ status: 200, description: 'Projects reordered successfully.' })
  reorder(@Body() dto: ReorderProjectsDto) {
    return this.service.reorder(dto.items);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update an existing project',
    description:
      'Update project details by ID. Supports updating document content via { "content": { "version": 1, "blocks": [] } }. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully.',
    type: Project,
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Toggle project publish status',
    description:
      'Change the isPublished status of a project. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiBody({ type: TogglePublishDto })
  @ApiResponse({
    status: 200,
    description: 'Publish status toggled successfully.',
  })
  togglePublish(@Param('id') id: string, @Body() dto: TogglePublishDto) {
    return this.service.togglePublish(id, dto.isPublished);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a project',
    description:
      'Permanently delete a project by ID and cleanup associated ImageKit media. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project to delete' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/images')
  @Roles('superadmin', 'editor')
  @UseInterceptors(FilesInterceptor('files', 20, { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Add images to a project',
    description:
      'Add multiple images to a project gallery. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiBody({ type: AddImagesDto })
  @ApiResponse({
    status: 201,
    description: 'Images added successfully.',
    type: [ProjectImage],
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  addImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: AddImagesDto,
    @Req() req: any,
  ) {
    let parsedCaptions: string[] = [];
    if (dto.captions) {
      if (typeof dto.captions === 'string') {
        try {
          parsedCaptions = JSON.parse(dto.captions);
        } catch {
          parsedCaptions = [dto.captions];
        }
      } else if (Array.isArray(dto.captions)) {
        parsedCaptions = dto.captions;
      }
    }
    return this.service.addImages(
      id,
      files,
      parsedCaptions,
      req?.user?.id as string | undefined,
    );
  }

  @Patch(':id/images/reorder')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Reorder project images',
    description:
      'Reorder the display positions of project gallery images. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiBody({ type: ReorderImagesDto })
  @ApiResponse({ status: 200, description: 'Images reordered successfully.' })
  reorderImages(@Param('id') id: string, @Body() dto: ReorderImagesDto) {
    return this.service.reorderImages(id, dto.items);
  }

  @Patch(':id/images/:imageId')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update project image metadata',
    description:
      'Update caption or display size of a project image. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiParam({ name: 'imageId', description: 'The ID of the image to update' })
  @ApiBody({ type: UpdateProjectImageDto })
  @ApiResponse({ status: 200, description: 'Image updated successfully.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  updateImage(
    @Param('imageId') imageId: string,
    @Body() dto: UpdateProjectImageDto,
  ) {
    return this.service.updateImage(imageId, dto);
  }

  @Delete(':id/images/:imageId')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Remove image from a project',
    description:
      'Remove a specific image by its ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiParam({ name: 'imageId', description: 'The ID of the image to remove' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  removeImage(@Param('imageId') imageId: string) {
    return this.service.removeImage(imageId);
  }
}
