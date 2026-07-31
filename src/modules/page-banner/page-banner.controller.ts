// src/modules/page-banner/page-banner.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PageBannerService } from './page-banner.service';
import { CreatePageBannerDto } from './dto/create-page-banner.dto';
import { UpdatePageBannerDto } from './dto/update-page-banner.dto';
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
} from '@nestjs/swagger';
import { PageBanner } from './entities/page-banner.entity';

@ApiTags('Page Banners')
@Controller('page-banners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PageBannerController {
  constructor(private service: PageBannerService) {}

  @Public()
  @Get(':pageKey')
  @ApiOperation({
    summary: 'Get page banner by page key',
    description:
      'Retrieve active banner details for a specific page key (e.g. careers, projects, programs, news, contact, about, solutions). Public access.',
  })
  @ApiParam({ name: 'pageKey', description: 'Page key slug' })
  @ApiResponse({
    status: 200,
    description: 'Page banner retrieved successfully.',
    type: PageBanner,
  })
  @ApiResponse({ status: 404, description: 'Page banner not found.' })
  findByPageKey(@Param('pageKey') pageKey: string) {
    return this.service.findByPageKey(pageKey);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all page banners',
    description: 'Retrieve a list of all page banners. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'All page banners retrieved successfully.',
    type: [PageBanner],
  })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create or upsert a page banner',
    description:
      'Create or update a page banner record. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreatePageBannerDto })
  @ApiResponse({
    status: 201,
    description: 'Page banner created/upserted successfully.',
    type: PageBanner,
  })
  create(@Body() dto: CreatePageBannerDto) {
    return this.service.upsert(dto);
  }

  @Patch(':pageKey')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a page banner by page key',
    description:
      'Update page banner details by pageKey. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'pageKey', description: 'Page key slug' })
  @ApiBody({ type: UpdatePageBannerDto })
  @ApiResponse({
    status: 200,
    description: 'Page banner updated successfully.',
    type: PageBanner,
  })
  @ApiResponse({ status: 404, description: 'Page banner not found.' })
  update(
    @Param('pageKey') pageKey: string,
    @Body() dto: UpdatePageBannerDto,
  ) {
    return this.service.update(pageKey, dto);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a page banner',
    description:
      'Permanently delete a page banner by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the banner to delete' })
  @ApiResponse({ status: 200, description: 'Page banner deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Page banner not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
