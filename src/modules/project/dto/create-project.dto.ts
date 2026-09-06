import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TechnicalHighlightDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}

export class CreateProjectDto {
  @ApiProperty({ example: 'Dự án VDCD', description: 'Title of the project' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'du-an-vdcd',
    description: 'Unique slug of the project',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'project-temp-8f9a2b',
    description:
      'Temporary folder key used when uploading images before slug was created',
  })
  @IsOptional()
  @IsString()
  tempFolderKey?: string;

  @ApiPropertyOptional({
    example: {
      version: 1,
      blocks: [
        {
          id: 'blk-sec-overview-1',
          type: 'section',
          number: '01',
          title: 'Tổng quan',
          children: [
            {
              id: 'blk-ovw-p-1',
              type: 'paragraph',
              text: 'Nội dung tổng quan dự án...',
            },
          ],
        },
      ],
    },
    description:
      'Block-based structured JSON document content (DocumentContent / BlogDocument). Validated by document-content validator.',
  })
  @IsOptional()
  content?: Record<string, unknown>;

  /** @deprecated Use content document model */
  @ApiPropertyOptional({
    example: 'Overview of the project...',
    description: 'Overview description of the project (Legacy HTML)',
  })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiPropertyOptional({
    example: 'http://example.com/thumb.jpg',
    description: 'Thumbnail URL',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    example: 'thumbnail-file-id',
    description: 'File ID of the thumbnail',
  })
  @IsOptional()
  @IsString()
  thumbnailFileId?: string;

  @ApiPropertyOptional({
    example: 'uuid-field-id',
    description: 'ID of the operation field',
  })
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional({
    example: 'uuid-province-id',
    description: 'ID of the province',
  })
  @IsOptional()
  @IsUUID()
  provinceId?: string;

  @ApiPropertyOptional({ example: 2026, description: 'Year of the project' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  @Max(2100)
  year?: number;

  // ── Detail page fields ──────────────────────────────────────

  @ApiPropertyOptional({
    example: 'Bài toán thực tế của dự án...',
    description: 'Challenge description (HTML)',
  })
  @IsOptional()
  @IsString()
  challenge?: string;

  @ApiPropertyOptional({
    example: 'http://example.com/challenge.jpg',
    description: 'Challenge section image URL',
  })
  @IsOptional()
  @IsString()
  challengeImage?: string;

  @ApiPropertyOptional({ description: 'File ID of challenge image' })
  @IsOptional()
  @IsString()
  challengeImageFileId?: string;

  @ApiPropertyOptional({
    example: ['Khảo sát 2D', 'Giám sát tiến độ', 'Mô hình BIM'],
    description: 'List of services provided',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({
    example: 'Khảo sát & Giám sát số',
    description: 'Project discipline',
  })
  @IsOptional()
  @IsString()
  discipline?: string;

  @ApiPropertyOptional({
    example: 'http://example.com/before.jpg',
    description: 'Transformation "before" image URL',
  })
  @IsOptional()
  @IsString()
  transformationBefore?: string;

  @ApiPropertyOptional({ description: 'File ID of before image' })
  @IsOptional()
  @IsString()
  transformationBeforeFileId?: string;

  @ApiPropertyOptional({
    example: 'http://example.com/after.jpg',
    description: 'Transformation "after" image URL',
  })
  @IsOptional()
  @IsString()
  transformationAfter?: string;

  @ApiPropertyOptional({ description: 'File ID of after image' })
  @IsOptional()
  @IsString()
  transformationAfterFileId?: string;

  @ApiPropertyOptional({
    example: [
      { label: 'Diện tích', value: '120 ha' },
      { label: 'Công nghệ', value: 'Drone + LiDAR' },
    ],
    description: 'Technical highlights (key-value pairs)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnicalHighlightDto)
  technicalHighlights?: TechnicalHighlightDto[];

  @ApiPropertyOptional({
    example: 'lotte-mall-vo-chi-cong',
    description: 'Slug of the next project for navigation',
  })
  @IsOptional()
  @IsString()
  nextProjectSlug?: string;

  // ── SEO & Publishing ────────────────────────────────────────

  @ApiPropertyOptional({
    example: 'VDCD Project Title',
    description: 'Meta title for SEO',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'VDCD Project Description',
    description: 'Meta description for SEO',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaDescription?: string;

  @ApiPropertyOptional({ example: false, description: 'Is project published' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
