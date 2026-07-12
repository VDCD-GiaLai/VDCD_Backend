// src/modules/partner/partner.controller.ts
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
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ReorderPartnersDto } from './dto/reorder-partners.dto';
import { TogglePartnerDto } from './dto/toggle-partner.dto';
import { PartnerService } from './partner.service';

@ApiTags('Partners')
@Controller('partners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PartnerController {
  constructor(private service: PartnerService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get active partners',
    description:
      'Retrieve a list of active partners ordered by order. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active partners retrieved successfully.',
    type: [Partner],
  })
  findActive() {
    return this.service.findActive();
  }

  @Get('all')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Get all partners (Admin)',
    description:
      'Retrieve a list of all partners (active and inactive) ordered by order. Restricted to superadmin and editor.',
  })
  @ApiResponse({
    status: 200,
    description: 'All partners retrieved successfully.',
    type: [Partner],
  })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new partner',
    description:
      'Create a new partner record. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreatePartnerDto })
  @ApiResponse({
    status: 201,
    description: 'Partner created successfully.',
    type: Partner,
  })
  create(@Body() dto: CreatePartnerDto) {
    return this.service.create(dto);
  }

  @Patch('reorder')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Reorder partners',
    description:
      'Reorder display positions of partners. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: ReorderPartnersDto })
  @ApiResponse({
    status: 200,
    description: 'Partners reordered successfully.',
  })
  reorder(@Body() dto: ReorderPartnersDto) {
    return this.service.reorder(dto.items);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a partner',
    description:
      'Update partner details by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the partner to update' })
  @ApiBody({ type: UpdatePartnerDto })
  @ApiResponse({
    status: 200,
    description: 'Partner updated successfully.',
    type: Partner,
  })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  update(@Param('id') id: string, @Body() dto: UpdatePartnerDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/toggle')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Toggle partner active status',
    description:
      'Activate or deactivate a partner by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the partner' })
  @ApiBody({ type: TogglePartnerDto })
  @ApiResponse({
    status: 200,
    description: 'Partner active status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  toggle(@Param('id') id: string, @Body() dto: TogglePartnerDto) {
    return this.service.toggle(id, dto.isActive);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a partner',
    description:
      'Permanently delete a partner by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the partner to delete' })
  @ApiResponse({ status: 200, description: 'Partner deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
