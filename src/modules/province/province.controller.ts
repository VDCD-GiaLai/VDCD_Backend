// src/modules/province/province.controller.ts
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
import { ProvinceService } from './province.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
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
import { Province } from './entities/province.entity';

@ApiTags('Provinces')
@Controller('provinces')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvinceController {
  constructor(private service: ProvinceService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all provinces',
    description:
      'Retrieve a list of all provinces in alphabetical order. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Provinces retrieved successfully.',
    type: [Province],
  })
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':code')
  @ApiOperation({
    summary: 'Get province by code',
    description:
      'Retrieve details of a specific province using its unique code. Public access.',
  })
  @ApiParam({
    name: 'code',
    description: 'The unique short code of the province',
  })
  @ApiResponse({
    status: 200,
    description: 'Province details retrieved successfully.',
    type: Province,
  })
  @ApiResponse({ status: 404, description: 'Province not found.' })
  findOne(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new province',
    description:
      'Create a new province record. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateProvinceDto })
  @ApiResponse({
    status: 201,
    description: 'Province created successfully.',
    type: Province,
  })
  @ApiResponse({ status: 409, description: 'Province code already exists.' })
  create(@Body() dto: CreateProvinceDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update province details',
    description:
      'Update hasProject status and centerCount for a province by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the province' })
  @ApiBody({ type: UpdateProvinceDto })
  @ApiResponse({
    status: 200,
    description: 'Province updated successfully.',
    type: Province,
  })
  @ApiResponse({ status: 404, description: 'Province not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateProvinceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Delete a province',
    description:
      'Permanently delete a province by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the province' })
  @ApiResponse({ status: 200, description: 'Province deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Province not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
