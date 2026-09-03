// src/modules/slide-detail-blog/dto/create-slide-detail-blog.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsObject,
  MaxLength,
} from 'class-validator';

export class CreateSlideDetailBlogDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID of the associated Slide',
  })
  @IsUUID()
  @IsNotEmpty()
  slideId: string;

  @ApiProperty({
    example: 'SỐ HÓA DỮ LIỆU ĐẤT ĐAI',
    description: 'Title of the detail blog (H1)',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'Từ hiện trạng ngoài thực địa đến cơ sở dữ liệu đồng bộ',
    description: 'Subtitle / tagline',
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({
    example: 'so-hoa-du-lieu-dat-dai',
    description:
      'Custom slug. If not provided, it will be auto-generated from the title.',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example:
      'Ứng dụng UAV, AI và GIS để đo đạc hiện trạng, lập bản đồ địa chính.',
    description: 'Short excerpt for SEO / listing preview',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    example: 'https://ik.imagekit.io/vdcd/slides/uav-dat-dai.jpg',
    description: 'Hero image URL (ImageKit)',
  })
  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @ApiPropertyOptional({
    example: '6571a3b2c4d5e6f7',
    description: 'Hero image file ID (ImageKit)',
  })
  @IsOptional()
  @IsString()
  heroImageFileId?: string;

  @ApiPropertyOptional({
    example: 'Số hóa dữ liệu đất đai bằng UAV và AI | VDCD Gia Lai',
    description: 'SEO title tag (max 255 chars)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiPropertyOptional({
    example:
      'Ứng dụng UAV, AI và GIS để đo đạc hiện trạng, lập bản đồ địa chính.',
    description: 'SEO meta description (max 500 chars)',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;

  @ApiPropertyOptional({
    example: { version: 1, blocks: [] },
    description: 'Block-based content (JSONB). Validated at service level.',
  })
  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the blog is published',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
