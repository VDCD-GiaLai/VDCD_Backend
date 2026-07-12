import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSlideDto {
  @ApiProperty({
    example: 'VDCD Green Energy',
    description: 'Title of the slide',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'Leading provider of sustainable power solutions.',
    description: 'Description of the slide',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Learn More',
    description: 'CTA button text',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ctaText?: string;

  @ApiPropertyOptional({
    example: 'FILE_ID_12345',
    description: 'File ID of the slide image',
  })
  @IsOptional()
  @IsString()
  imageFileId?: string;

  @ApiPropertyOptional({
    example: 'https://vdcd.vn/about',
    description: 'CTA URL',
  })
  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @ApiProperty({
    example: 'https://example.com/images/slide1.jpg',
    description: 'Image URL of the slide',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Display order of the slide',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Is slide active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
