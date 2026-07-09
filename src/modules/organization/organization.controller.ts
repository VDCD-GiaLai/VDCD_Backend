// src/modules/organization/organization.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Organization } from './entities/organization.entity';

@ApiTags('Organization')
@Controller('organization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationController {
  constructor(private service: OrganizationService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get organization details',
    description: 'Retrieve general organization metadata. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization metadata retrieved successfully.',
    type: Organization,
  })
  get() {
    return this.service.get();
  }

  @Put()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update organization details',
    description:
      'Update organization metadata like description, vision, mission, and social links. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization metadata updated successfully.',
    type: Organization,
  })
  update(@Body() dto: UpdateOrganizationDto) {
    return this.service.update(dto);
  }
}
