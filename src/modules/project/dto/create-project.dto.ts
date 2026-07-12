import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

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
    example: 'Overview of the project...',
    description: 'Overview description of the project',
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
