import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    example: 'VDCD',
    description: 'Name of the organization',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Nâng tầm giá trị Việt',
    description: 'Tagline of the organization',
  })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional({
    example: 'Mô tả chi tiết về tổ chức...',
    description: 'Description of the organization',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Sứ mệnh của chúng tôi...',
    description: 'Mission statement of the organization',
  })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiPropertyOptional({
    example: 'Tầm nhìn phát triển tương lai...',
    description: 'Vision of the organization',
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiPropertyOptional({
    example: 'Chất lượng - Sáng tạo - Trách nhiệm',
    description: 'Core values of the organization',
  })
  @IsOptional()
  @IsString()
  coreValues?: string;

  @ApiPropertyOptional({
    example: 2015,
    description: 'The year the organization was founded',
  })
  @IsOptional()
  @IsInt()
  foundedYear?: number;

  @ApiPropertyOptional({
    example: { projects: 120, members: 45 },
    description: 'Statistics or metrics of the organization',
  })
  @IsOptional()
  @IsObject()
  stats?: Record<string, any>;

  @ApiPropertyOptional({
    example: {
      facebook: 'https://fb.com/vdcd',
      youtube: 'https://youtube.com/vdcd',
    },
    description: 'Social media links of the organization',
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, any>;
}
