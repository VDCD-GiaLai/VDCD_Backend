// src/modules/program/program.controller.ts
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
import { ProgramService } from './program.service';
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
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramFilterDto } from './dto/program-filter.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';

@ApiTags('Programs')
@Controller('programs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgramController {
  constructor(private service: ProgramService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all published programs',
    description:
      'Retrieve a list of public/published programs with pagination. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Published programs retrieved successfully.',
  })
  findAll(@Query() dto: ProgramFilterDto) {
    return this.service.findAll(dto);
  }

  @Get('all')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Get all programs (Admin)',
    description:
      'Retrieve a list of all programs (published and unpublished) with filtering. Restricted to superadmin and editor.',
  })
  @ApiResponse({
    status: 200,
    description: 'All programs retrieved successfully.',
  })
  findAllAdmin(@Query() dto: ProgramFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get a program by slug',
    description:
      'Retrieve a program details and its related articles by slug. Public access.',
  })
  @ApiParam({ name: 'slug', description: 'The slug of the program' })
  @ApiResponse({
    status: 200,
    description: 'Program details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  findOne(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new program',
    description:
      'Create a new program record. Restricted to superadmin and editor.',
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

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a program',
    description:
      'Update program details by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the program to update' })
  @ApiBody({ type: UpdateProgramDto })
  @ApiResponse({
    status: 200,
    description: 'Program updated successfully.',
    type: Program,
  })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('superadmin', 'editor')
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
    return this.service.togglePublish(id, dto.isPublished);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a program',
    description:
      'Permanently delete a program by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the program to delete' })
  @ApiResponse({ status: 200, description: 'Program deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
