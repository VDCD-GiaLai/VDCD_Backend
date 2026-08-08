import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OperationFieldItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class DevelopmentOrientationItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    example: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
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
    example: '4101443823',
    description: 'Business license number (Giấy CNĐKKD)',
  })
  @IsOptional()
  @IsString()
  businessLicenseNo?: string;

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
    example: '123 Đường ABC, Phường X, Quận Y, TP Z',
    description: 'Address of the organization',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: {
      staff: 1500,
      experts: 250,
      provinces: 30,
      projects: 100,
    },
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

  @ApiPropertyOptional({
    example: [
      {
        title: 'Công nghệ số & Chuyển đổi số',
        description: 'Nghiên cứu phát triển...',
      },
    ],
    description:
      'Operation fields displayed on the About Us page (Lĩnh vực hoạt động)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperationFieldItemDto)
  operationFields?: OperationFieldItemDto[];

  @ApiPropertyOptional({
    example:
      'Trung tâm kế thừa năng lực công nghệ, đội ngũ chuyên gia và mạng lưới triển khai của hệ sinh thái VDCD Group...',
    description:
      'Ecosystem capabilities inherited from VDCD (Năng lực kế thừa)',
  })
  @IsOptional()
  @IsString()
  ecosystemCapabilities?: string;

  @ApiPropertyOptional({
    example: [
      {
        title: 'Phát triển hạ tầng dữ liệu và công nghệ dùng chung',
        description: '',
      },
    ],
    description: 'Development orientations (Định hướng phát triển)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevelopmentOrientationItemDto)
  developmentOrientations?: DevelopmentOrientationItemDto[];
}
