// src/modules/program/admin-program.controller.ts
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
import { ProgramService } from './program.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramFilterDto } from './dto/program-filter.dto';
import { TogglePublishDto } from './dto/toggle-publish.dto';

@ApiTags('Admin Programs')
@Controller('admin/programs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminProgramController {
  constructor(private readonly service: ProgramService) {}

  @Get()
  @Roles('superadmin', 'editor', 'viewer')
  @ApiOperation({
    summary: 'Get all programs (Admin)',
    description:
      'Retrieve a list of all programs (including drafts) with filtering and pagination. Accessible by superadmin, editor, and viewer.',
  })
  @ApiResponse({
    status: 200,
    description: 'All programs retrieved successfully.',
  })
  findAll(@Query() dto: ProgramFilterDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get(':id')
  @Roles('superadmin', 'editor', 'viewer')
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
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new program (Admin)',
    description:
      'Create a new program with block-based Document Content. Restricted to superadmin and editor.',
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

  @Put(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a program with PUT (Admin)',
    description:
      'Update program details and block document by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the program to update' })
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
  @ApiOperation({
    summary: 'Update a program with PATCH (Admin)',
    description:
      'Update program details and block document by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the program to update' })
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
  @ApiOperation({
    summary: 'Toggle program publish status (Admin)',
    description:
      'Publish or unpublish a program by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the program' })
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
  @ApiOperation({
    summary: 'Delete a program (Admin)',
    description:
      'Permanently delete a program and clean up all media from ImageKit. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the program to delete' })
  @ApiResponse({ status: 200, description: 'Program deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Program not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
