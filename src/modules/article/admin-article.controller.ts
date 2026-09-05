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
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { UploadService } from '../upload/upload.service';
import { FileUploadDto } from '../upload/dto/file-upload.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin Articles')
@Controller('admin/articles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminArticleController {
  constructor(
    private readonly service: ArticleService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get all articles (Admin)',
    description:
      'Retrieve a paginated list of all articles (including drafts). Accessible by viewer, editor, and superadmin.',
  })
  @ApiResponse({
    status: 200,
    description: 'All articles retrieved successfully.',
  })
  findAll(@Query() dto: ArticleFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get(':id')
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get article by ID (Admin)',
    description:
      'Retrieve full article details by ID, including drafts, relations, and content blocks. Accessible by viewer, editor, and superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the article' })
  @ApiResponse({
    status: 200,
    description: 'Article retrieved successfully.',
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new article',
    description:
      'Create a new article with validated JSONB blocks. Restricted to editor and superadmin.',
  })
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully.',
    type: Article,
  })
  @ApiResponse({ status: 400, description: 'Invalid content blocks or input.' })
  @ApiResponse({ status: 409, description: 'Slug already exists.' })
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update an article (PUT)',
    description:
      'Atomically update article metadata and content blocks by ID. Restricted to editor and superadmin.',
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
  updatePut(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update an article (PATCH)',
    description:
      'Atomically update article metadata and content blocks by ID. Restricted to editor and superadmin.',
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
  updatePatch(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/publish')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Publish an article',
    description:
      'Publish an article by ID. Validates title and non-empty content blocks. Sets is_published = true, published_at = now(). Restricted to editor and superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the article' })
  @ApiResponse({
    status: 200,
    description: 'Article published successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot publish article without title or content.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  publish(@Param('id') id: string) {
    return this.service.publish(id);
  }

  @Post(':id/unpublish')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Unpublish an article',
    description:
      'Unpublish an article by ID. Sets is_published = false while preserving existing published_at. Restricted to editor and superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the article' })
  @ApiResponse({
    status: 200,
    description: 'Article unpublished successfully.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  unpublish(@Param('id') id: string) {
    return this.service.unpublish(id);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete an article',
    description:
      'Permanently delete an article by ID and clean up ImageKit media. Restricted to superadmin only.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the article to delete' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('upload-image')
  @Roles('superadmin', 'editor')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Upload image for article editor',
    description:
      'Upload an image to ImageKit under "vdcd/articles/<slug>". If slug/title is not provided, uses a random subfolder.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiQuery({
    name: 'slug',
    required: false,
    description: 'Article slug (e.g. "chuyen-doi-so-gia-lai")',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Article title to be slugified if slug is not provided',
  })
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Query('slug') slugQuery?: string,
    @Query('title') titleQuery?: string,
    @Body('slug') slugBody?: string,
    @Body('title') titleBody?: string,
  ) {
    const slugOrTitle = slugQuery || titleQuery || slugBody || titleBody;
    return this.uploadService.uploadArticleImage(
      file,
      req.user?.id as string | undefined,
      slugOrTitle,
    );
  }

  @Post(':id/upload-image')
  @Roles('superadmin', 'editor')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Upload image for a specific article ID',
    description:
      'Upload an image to ImageKit under "vdcd/articles/<article.slug>". Looks up article slug automatically.',
  })
  @ApiParam({ name: 'id', description: 'Article UUID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadImageForArticle(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    let slugOrTitle: string | undefined;
    try {
      const article = await this.service.findById(id);
      slugOrTitle = article.slug || article.title;
    } catch {
      // If article not found yet, fall back to random folder
    }
    return this.uploadService.uploadArticleImage(
      file,
      req.user?.id as string | undefined,
      slugOrTitle,
    );
  }
}
