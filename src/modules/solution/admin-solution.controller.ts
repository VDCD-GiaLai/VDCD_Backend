// src/modules/solution/admin-solution.controller.ts
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SolutionService } from './solution.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Solution } from './entities/solution.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { SolutionFilterDto } from './dto/solution-filter.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';

@ApiTags('Admin Solutions')
@Controller('admin/solutions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminSolutionController {
  constructor(private readonly service: SolutionService) {}

  @Get()
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get all solutions (Admin)',
    description:
      'Retrieve a list of all solutions (including drafts) with filtering and pagination. Accessible by superadmin, editor, and viewer.',
  })
  @ApiResponse({
    status: 200,
    description: 'All solutions retrieved successfully.',
  })
  findAll(@Query() dto: SolutionFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get(':id')
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get solution details by ID (Admin)',
    description:
      'Retrieve full solution details by ID regardless of publish status. Accessible by superadmin, editor, and viewer.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the solution' })
  @ApiResponse({
    status: 200,
    description: 'Solution details retrieved successfully.',
    type: Solution,
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new solution (Admin)',
    description:
      'Create a new solution with block-based Document Content. Restricted to superadmin and editor.',
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

  @Put(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a solution with PUT (Admin)',
    description:
      'Update solution details and block document by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the solution to update' })
  @ApiBody({ type: UpdateSolutionDto })
  @ApiResponse({
    status: 200,
    description: 'Solution updated successfully.',
    type: Solution,
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  updatePut(@Param('id') id: string, @Body() dto: UpdateSolutionDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a solution with PATCH (Admin)',
    description:
      'Update solution details and block document by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the solution to update' })
  @ApiBody({ type: UpdateSolutionDto })
  @ApiResponse({
    status: 200,
    description: 'Solution updated successfully.',
    type: Solution,
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  updatePatch(@Param('id') id: string, @Body() dto: UpdateSolutionDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Toggle solution publish status (Admin)',
    description:
      'Publish or unpublish a solution by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the solution' })
  @ApiBody({ type: TogglePublishDto })
  @ApiResponse({
    status: 200,
    description: 'Solution publish status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  togglePublish(@Param('id') id: string, @Body() dto: TogglePublishDto) {
    return this.service.togglePublish(id, dto.isPublished, dto.publishedAt);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a solution (Admin)',
    description:
      'Permanently delete a solution and clean up all media from ImageKit. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the solution to delete' })
  @ApiResponse({ status: 200, description: 'Solution deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Solution not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
