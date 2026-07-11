// src/modules/job/job.controller.ts
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
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { ToggleActiveDto } from './dto/toggle-active.dto';
import { Job } from './entities/job.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobController {
  constructor(private service: JobService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get active jobs',
    description:
      'Retrieve a paginated list of active jobs with optional filtering by type or location. Ordered by urgency and creation date.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active jobs retrieved successfully.',
  })
  findAll(@Query() dto: JobFilterDto) {
    return this.service.findAll(dto);
  }

  @Get('all')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all jobs (Admin)',
    description:
      'Retrieve a paginated list of all jobs (including inactive ones). Restricted to superadmin and editor.',
  })
  @ApiResponse({
    status: 200,
    description: 'All jobs retrieved successfully.',
  })
  findAllAdmin(@Query() dto: JobFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get job by slug',
    description:
      'Retrieve details of an active job opening by slug. Public access.',
  })
  @ApiParam({ name: 'slug', description: 'The unique slug of the job posting' })
  @ApiResponse({
    status: 200,
    description: 'Job opening retrieved successfully.',
    type: Job,
  })
  @ApiResponse({ status: 404, description: 'Job opening not found.' })
  findOne(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new job posting',
    description:
      'Create a new job posting. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({
    status: 201,
    description: 'Job posting created successfully.',
    type: Job,
  })
  @ApiResponse({ status: 409, description: 'Slug already exists.' })
  create(@Body() dto: CreateJobDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update job posting details',
    description:
      'Update an existing job posting. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the job posting to update' })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({
    status: 200,
    description: 'Job posting updated successfully.',
    type: Job,
  })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  @ApiResponse({ status: 409, description: 'Slug already exists.' })
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/toggle')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Toggle job active status',
    description:
      'Activate or deactivate a job posting. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the job posting' })
  @ApiBody({ type: ToggleActiveDto })
  @ApiResponse({
    status: 200,
    description: 'Job active status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  toggleActive(@Param('id') id: string, @Body() dto: ToggleActiveDto) {
    return this.service.toggleActive(id, dto.isActive);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a job posting',
    description:
      'Permanently delete a job posting by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the job posting to delete' })
  @ApiResponse({
    status: 200,
    description: 'Job posting deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Job posting not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
