import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
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
    example: 'A modern approach',
    description: 'Subtitle of the slide',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  subtitle?: string | null;

  @ApiPropertyOptional({
    example: 'Leading provider of sustainable power solutions.',
    description: 'Description of the slide',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    example: 'Learn More',
    description: 'CTA button text',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  @MaxLength(100)
  ctaText?: string | null;

  @ApiPropertyOptional({
    example: 'FILE_ID_12345',
    description: 'File ID of the slide image',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  imageFileId?: string | null;

  @ApiPropertyOptional({
    example: 'https://vdcd.vn/about',
    description: 'CTA URL',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  ctaUrl?: string | null;

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
