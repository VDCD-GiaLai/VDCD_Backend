// src/modules/article/article.controller.ts
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
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Articles')
@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticleController {
  constructor(private service: ArticleService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get published articles',
    description:
      'Retrieve a paginated list of published articles with optional filters by category or tags.',
  })
  @ApiResponse({
    status: 200,
    description: 'Published articles retrieved successfully.',
  })
  findAll(@Query() dto: ArticleFilterDto) {
    return this.service.findAll(dto);
  }

  @Get('all')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all articles (Admin)',
    description:
      'Retrieve a paginated list of all articles (including drafts). Restricted to superadmin and editor.',
  })
  @ApiResponse({
    status: 200,
    description: 'All articles retrieved successfully.',
  })
  findAllAdmin(@Query() dto: ArticleFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get article by slug',
    description:
      'Retrieve details of a single article by its slug. Public access.',
  })
  @ApiParam({ name: 'slug', description: 'The unique slug of the article' })
  @ApiResponse({
    status: 200,
    description: 'Article retrieved successfully.',
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  findOne(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new article',
    description: 'Create a new article. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully.',
    type: Article,
  })
  @ApiResponse({ status: 409, description: 'Slug already exists.' })
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an article',
    description:
      'Update article details by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the article to update' })
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    status: 200,
    description: 'Article updated successfully.',
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @ApiResponse({ status: 409, description: 'Slug already exists.' })
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Toggle article publish status',
    description:
      'Publish or unpublish an article by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the article' })
  @ApiBody({ type: TogglePublishDto })
  @ApiResponse({
    status: 200,
    description: 'Article publication status toggled successfully.',
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  togglePublish(@Param('id') id: string, @Body() dto: TogglePublishDto) {
    return this.service.togglePublish(id, dto.isPublished);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an article',
    description:
      'Permanently delete an article by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the article to delete' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
