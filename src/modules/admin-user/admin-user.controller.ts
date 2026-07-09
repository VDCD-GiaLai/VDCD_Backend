// src/modules/admin-user/admin-user.controller.ts
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { AdminUserService } from './admin-user.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUser } from './entities/admin-user.entity';
import { AdminUserPaginationResponseDto } from './dto/admin-user-pagination-response.dto';
import { AdminUserDeleteResponseDto } from './dto/admin-user-delete-response.dto';

class AdminFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter admin users by role',
    enum: ['superadmin', 'editor', 'viewer'],
  })
  @IsOptional()
  @IsString()
  role?: string;
}

@ApiTags('Admin Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class AdminUserController {
  constructor(private service: AdminUserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get list of admin users',
    description:
      'Retrieve admin users with pagination and optional role filtering. Restricted to superadmin.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of admin users retrieved successfully.',
    type: AdminUserPaginationResponseDto,
  })
  findAll(@Query() dto: AdminFilterDto) {
    return this.service.findAll(dto);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new admin user',
    description:
      'Create a new admin user with details and role. Restricted to superadmin.',
  })
  @ApiResponse({
    status: 201,
    description: 'Admin user created successfully.',
    type: AdminUser,
  })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  create(@Body() dto: CreateAdminUserDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an admin user',
    description:
      'Update account details, role, status, or password of an admin user. Restricted to superadmin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin user updated successfully.',
    type: AdminUser,
  })
  @ApiResponse({ status: 404, description: 'Admin user not found.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  update(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an admin user',
    description:
      'Permanently delete an admin user account. Restricted to superadmin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin user deleted successfully.',
    type: AdminUserDeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Admin user not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
