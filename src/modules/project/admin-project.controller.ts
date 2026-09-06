import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';
import { AddImagesDto } from './dto/add-images.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { FileUploadDto } from '../upload/dto/file-upload.dto';

const memoryUpload = () =>
  FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  });

@ApiTags('Admin Projects')
@Controller('admin/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get()
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get all projects (Admin)',
    description:
      'Retrieve a list of all projects (including drafts) with filtering and pagination. Accessible by superadmin, editor, and viewer.',
  })
  @ApiResponse({
    status: 200,
    description: 'All projects retrieved successfully.',
  })
  findAll(@Query() dto: ProjectFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get(':id')
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get project details by ID (Admin)',
    description:
      'Retrieve full project details by ID regardless of publish status. Accessible by superadmin, editor, and viewer.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the project' })
  @ApiResponse({
    status: 200,
    description: 'Project details retrieved successfully.',
    type: Project,
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a project (Admin)',
    description:
      'Create a new project record supporting unified Document Model. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully.',
    type: Project,
  })
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Replace/update a project (Admin)',
    description:
      'Full update of project details by ID. Supports Document Model content. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project to update' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully.',
    type: Project,
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  replace(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Partial update of a project (Admin)',
    description:
      'Update project details by ID. Supports patching content via { "content": { "version": 1, "blocks": [] } }. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project to update' })
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
    summary: 'Toggle project publish status (Admin)',
    description:
      'Publish or unpublish a project by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiBody({ type: TogglePublishDto })
  @ApiResponse({
    status: 200,
    description: 'Project publish status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  togglePublish(@Param('id') id: string, @Body() dto: TogglePublishDto) {
    return this.service.togglePublish(id, dto.isPublished);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a project (Admin)',
    description:
      'Permanently delete a project by ID and cleanup ImageKit media. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project to delete' })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/upload-image')
  @Roles('superadmin', 'editor')
  @UseInterceptors(memoryUpload())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload single image for project (Admin)',
    description:
      'Uploads an image for a project by ID. Destination folder is resolved strictly server-side (/vdcd/projects/{slug}). Client cannot specify folder.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the project' })
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully.',
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.service.uploadImageForProject(id, file, req?.user?.id);
  }

  @Post(':id/images')
  @Roles('superadmin', 'editor')
  @UseInterceptors(FilesInterceptor('files', 20, { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Add images to project gallery (Admin)',
    description:
      'Upload multiple images to project gallery resolving folder strictly via project ID -> slug. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the project' })
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
    return this.service.addImages(id, files, parsedCaptions, req?.user?.id);
  }

  @Patch(':id/images/reorder')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Reorder project images (Admin)',
    description:
      'Reorder the display positions of project gallery images. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project' })
  @ApiBody({ type: ReorderImagesDto })
  @ApiResponse({ status: 200, description: 'Images reordered successfully.' })
  reorderImages(@Param('id') id: string, @Body() dto: ReorderImagesDto) {
    return this.service.reorderImages(id, dto.items);
  }

  @Delete(':id/images/:imageId')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Remove image from project gallery (Admin)',
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
