import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ example: 'admin_user', description: 'Username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    example: 'admin@vdcd.vn',
    description: 'Email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'editor',
    description: 'Account role',
    enum: ['superadmin', 'editor', 'viewer'],
  })
  @IsOptional()
  @IsIn(['superadmin', 'editor', 'viewer'])
  role?: string;

  @ApiPropertyOptional({ example: 'password123', description: 'Password' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Active status of the user account',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
