// src/modules/program/program.controller.ts
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
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProgramService } from './program.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramFilterDto } from './dto/program-filter.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';
import { ReorderProgramsDto } from './dto/reorder-programs.dto';

@ApiTags('Programs')
@Controller('programs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgramController {
  constructor(private readonly service: ProgramService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all published programs',
    description:
      'Retrieve a list of public/published programs with pagination and filtering. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Published programs retrieved successfully.',
  })
  findAll(@Query() dto: ProgramFilterDto) {
    return this.service.findAll(dto);
  }

  @Get('all')
  @Roles('superadmin', 'editor', 'viewer')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all programs (Admin)',
    description:
      'Retrieve a list of all programs (published and unpublished) with filtering. Accessible by superadmin, editor, and viewer.',
  })
  @ApiResponse({
    status: 200,
    description: 'All programs retrieved successfully.',
  })
  findAllAdmin(@Query() dto: ProgramFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get('admin/:id')
  @Roles('superadmin', 'editor', 'viewer')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get program details by ID (Admin)',
    description:
      'Retrieve full program details by ID regardless of publish status. Accessible by superadmin, editor, and viewer.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the program' })
  @ApiResponse({
    status: 200,
    description: 'Program details retrieved successfully.',
    type: Program,
  })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get a published program by slug',
    description:
      'Retrieve program details and its related articles by slug. Only published programs are returned to the public.',
  })
  @ApiParam({ name: 'slug', description: 'The slug or UUID of the program' })
  @ApiResponse({
    status: 200,
    description: 'Program details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  findOne(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug, false);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new program',
    description:
      'Create a new program record with Block Document content. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateProgramDto })
  @ApiResponse({
    status: 201,
    description: 'Program created successfully.',
    type: Program,
  })
  create(@Body() dto: CreateProgramDto) {
    return this.service.create(dto);
  }

  @Patch('reorder')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reorder programs',
    description:
      'Reorder display positions of programs. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: ReorderProgramsDto })
  @ApiResponse({ status: 200, description: 'Programs reordered successfully.' })
  reorder(@Body() body: any) {
    const rawItems = Array.isArray(body) ? body : body?.items;
    if (!Array.isArray(rawItems)) {
      throw new BadRequestException('Danh sách sắp xếp (items) không hợp lệ');
    }
    const items = rawItems.map((item: any, index: number) => ({
      id: String(item.id),
      order: typeof item.order === 'number' ? item.order : index + 1,
    }));
    return this.service.reorder(items);
  }

  @Put(':id')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a program (PUT)',
    description:
      'Update program details and content document by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the program to update' })
  @ApiBody({ type: UpdateProgramDto })
  @ApiResponse({
    status: 200,
    description: 'Program updated successfully.',
    type: Program,
  })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  updatePut(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a program (PATCH)',
    description:
      'Update program details and content document by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the program to update' })
  @ApiBody({ type: UpdateProgramDto })
  @ApiResponse({
    status: 200,
    description: 'Program updated successfully.',
    type: Program,
  })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  updatePatch(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Toggle program publish status',
    description:
      'Publish or unpublish a program by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the program' })
  @ApiBody({ type: TogglePublishDto })
  @ApiResponse({
    status: 200,
    description: 'Program publish status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  togglePublish(@Param('id') id: string, @Body() dto: TogglePublishDto) {
    return this.service.togglePublish(id, dto.isPublished, dto.publishedAt);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a program',
    description:
      'Permanently delete a program and associated ImageKit media by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the program to delete' })
  @ApiResponse({ status: 200, description: 'Program deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
