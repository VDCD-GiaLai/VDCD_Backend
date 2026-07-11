// src/modules/solution/solution.controller.ts
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
import { SolutionService } from './solution.service';
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
import { Solution } from './entities/solution.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { SolutionFilterDto } from './dto/solution-filter.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';

@ApiTags('Solutions')
@Controller('solutions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolutionController {
  constructor(private service: SolutionService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all published solutions',
    description:
      'Retrieve a list of public/published solutions with pagination. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Published solutions retrieved successfully.',
  })
  findAll(@Query() dto: SolutionFilterDto) {
    return this.service.findAll(dto);
  }

  @Get('all')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Get all solutions (Admin)',
    description:
      'Retrieve a list of all solutions (published and unpublished) with filtering. Restricted to superadmin and editor.',
  })
  @ApiResponse({
    status: 200,
    description: 'All solutions retrieved successfully.',
  })
  findAllAdmin(@Query() dto: SolutionFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get a solution by slug',
    description:
      'Retrieve solution details and its related articles by slug. Public access.',
  })
  @ApiParam({ name: 'slug', description: 'The slug of the solution' })
  @ApiResponse({
    status: 200,
    description: 'Solution details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  findOne(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new solution',
    description:
      'Create a new solution record. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateSolutionDto })
  @ApiResponse({
    status: 201,
    description: 'Solution created successfully.',
    type: Solution,
  })
  create(@Body() dto: CreateSolutionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a solution',
    description:
      'Update solution details by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the solution to update' })
  @ApiBody({ type: UpdateSolutionDto })
  @ApiResponse({
    status: 200,
    description: 'Solution updated successfully.',
    type: Solution,
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateSolutionDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Toggle solution publish status',
    description:
      'Publish or unpublish a solution by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the solution' })
  @ApiBody({ type: TogglePublishDto })
  @ApiResponse({
    status: 200,
    description: 'Solution publish status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  togglePublish(@Param('id') id: string, @Body() dto: TogglePublishDto) {
    return this.service.togglePublish(id, dto.isPublished);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a solution',
    description:
      'Permanently delete a solution by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the solution to delete' })
  @ApiResponse({
    status: 200,
    description: 'Solution deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
