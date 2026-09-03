// src/modules/slide-detail-blog/slide-detail-blog.controller.ts
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SlideDetailBlogService } from './slide-detail-blog.service';
import { CreateSlideDetailBlogDto } from './dto/create-slide-detail-blog.dto';
import { UpdateSlideDetailBlogDto } from './dto/update-slide-detail-blog.dto';
import { SlideDetailBlogFilterDto } from './dto/slide-detail-blog-filter.dto';
import { ToggleBlogPublishDto } from './dto/toggle-publish.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Slide Detail Blogs')
@Controller('slide-detail-blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlideDetailBlogController {
  constructor(private service: SlideDetailBlogService) {}

  // ── Admin routes (must come before :slug to avoid route conflicts) ──

  @Get('all')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all slide detail blogs (Admin)',
    description:
      'Paginated list of all blogs including drafts. Excludes content field for performance.',
  })
  @ApiResponse({ status: 200, description: 'List retrieved successfully.' })
  findAllAdmin(@Query() dto: SlideDetailBlogFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get('admin/:id')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get slide detail blog by ID (Admin)',
    description: 'Get full blog including content and draft status.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('admin/by-slide/:slideId')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get blog by Slide ID (Admin)',
    description:
      'Get the detail blog for a given slide regardless of publish status. Used by admin UI to navigate from slide management.',
  })
  @ApiParam({ name: 'slideId', description: 'Slide UUID' })
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Slide not found or has no blog.' })
  findBySlideIdAdmin(@Param('slideId') slideId: string) {
    return this.service.findBySlideIdAdmin(slideId);
  }

  @Get('by-slide/:slideId')
  @Public()
  @ApiOperation({
    summary: 'Get published blog by Slide ID',
    description:
      'Get the published detail blog for a given slide. Used by frontend CTA.',
  })
  @ApiParam({ name: 'slideId', description: 'Slide UUID' })
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Slide has no published detail blog.',
  })
  findBySlideId(@Param('slideId') slideId: string) {
    return this.service.findBySlideId(slideId);
  }

  // ── Write routes ─────────────────────────────────────────────────

  @Post()
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a slide detail blog',
    description:
      'Create a new detail blog linked to a slide. Slide must exist and not already have a blog.',
  })
  @ApiBody({ type: CreateSlideDetailBlogDto })
  @ApiResponse({ status: 201, description: 'Blog created successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Slide not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug already exists or slide already has a blog.',
  })
  create(@Body() dto: CreateSlideDetailBlogDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a slide detail blog',
    description: 'Update blog fields. slideId is not updatable.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiBody({ type: UpdateSlideDetailBlogDto })
  @ApiResponse({ status: 200, description: 'Blog updated successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  @ApiResponse({ status: 409, description: 'Slug already exists.' })
  update(@Param('id') id: string, @Body() dto: UpdateSlideDetailBlogDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publish or unpublish a slide detail blog',
    description:
      'Toggle publication status. Publish validates content (must not be empty). Sets publishedAt on first publish.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiBody({ type: ToggleBlogPublishDto })
  @ApiResponse({ status: 200, description: 'Status toggled successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Cannot publish blog without content.',
  })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  togglePublish(@Param('id') id: string, @Body() dto: ToggleBlogPublishDto) {
    return this.service.togglePublish(id, dto.isPublished);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a slide detail blog',
    description:
      'Permanently delete a blog and clean up all images from ImageKit.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ── Public read (must come LAST — :slug is a catch-all param) ────

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get published blog by slug',
    description: 'Public access. Only returns published blogs.',
  })
  @ApiParam({ name: 'slug', description: 'Blog slug (URL path)' })
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}
