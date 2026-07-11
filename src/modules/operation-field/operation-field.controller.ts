// src/modules/operation-field/operation-field.controller.ts
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
import { OperationFieldService } from './operation-field.service';
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
import { OperationField } from './entities/operation-field.entity';
import { CreateOperationFieldDto } from './dto/create-operation-field.dto';
import { UpdateOperationFieldDto } from './dto/update-operation-field.dto';

@ApiTags('Operation Fields')
@Controller('operation-fields')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OperationFieldController {
  constructor(private service: OperationFieldService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all operation fields',
    description:
      'Retrieve a list of all operation fields ordered by display order. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'All operation fields retrieved successfully.',
    type: [OperationField],
  })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new operation field',
    description:
      'Create a new operation field record. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateOperationFieldDto })
  @ApiResponse({
    status: 201,
    description: 'Operation field created successfully.',
    type: OperationField,
  })
  create(@Body() dto: CreateOperationFieldDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update an operation field',
    description:
      'Update operation field details by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the operation field to update',
  })
  @ApiBody({ type: UpdateOperationFieldDto })
  @ApiResponse({
    status: 200,
    description: 'Operation field updated successfully.',
    type: OperationField,
  })
  @ApiResponse({ status: 404, description: 'Operation field not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateOperationFieldDto) {
    return this.service.update(id, dto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get operation field by slug',
    description:
      'Retrieve operation field details by its unique slug. Public access.',
  })
  @ApiParam({ name: 'slug', description: 'The slug of the operation field' })
  @ApiResponse({
    status: 200,
    description: 'Operation field retrieved successfully.',
    type: OperationField,
  })
  @ApiResponse({ status: 404, description: 'Operation field not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete an operation field',
    description:
      'Permanently delete an operation field by ID. Restricted to superadmin.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the operation field to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Operation field deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Operation field not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
