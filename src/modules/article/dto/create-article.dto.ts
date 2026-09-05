// src/modules/article/dto/create-article.dto.ts
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
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Giới thiệu về Hiệp hội VDCD Gia Lai',
    description: 'The title of the article',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'Hợp tác phát triển hạ tầng dữ liệu số khu vực Tây Nguyên',
    description: 'Subtitle / lead paragraph of the article',
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({
    example: 'gioi-thieu-vdcd-gia-lai',
    description:
      'Custom slug for the article. If not provided, it will be auto-generated from the title.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({
    example: 'Tóm tắt nội dung bài viết phục vụ SEO và card preview...',
    description: 'Short excerpt or summary of the article',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    example: {
      version: 1,
      blocks: [
        {
          id: 'blk-1',
          type: 'paragraph',
          text: 'Nội dung chi tiết bài viết...',
        },
      ],
    },
    description:
      'Block-based structured JSON document content. Validated by document-content validator.',
  })
  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: 'https://example.com/images/thumbnail.png',
    description: 'Thumbnail image URL for the article',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Thumbnail file ID for the article',
  })
  @IsOptional()
  @IsString()
  thumbnailFileId?: string;

  @ApiPropertyOptional({
    example: 'Tin tức',
    description: 'Category name of the article',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({
    example: 'vdcd,gialai,tintuc',
    description: 'Comma-separated tags for the article',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  tags?: string;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Associated project ID',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({
    example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    description: 'Associated program ID',
  })
  @IsOptional()
  @IsUUID()
  programId?: string;

  @ApiPropertyOptional({
    example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    description: 'Associated solution ID',
  })
  @IsOptional()
  @IsUUID()
  solutionId?: string;

  @ApiPropertyOptional({
    example: 'Giới thiệu VDCD Gia Lai',
    description: 'SEO Meta Title (max 255 chars)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'Chi tiết giới thiệu về Hiệp hội Phát triển dữ liệu số Gia Lai',
    description: 'SEO Meta Description (max 500 chars)',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the article is published',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    example: '2026-07-11T00:00:00.000Z',
    description:
      'Publication date. Defaults to current date if published and not provided.',
  })
  @IsOptional()
  @Type(() => Date)
  publishedAt?: Date;
}
