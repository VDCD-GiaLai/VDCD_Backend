// src/modules/page-banner/dto/create-page-banner.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PageBannerCtaButton } from '../entities/page-banner.entity';

export class CreatePageBannerDto {
  @ApiProperty({
    example: 'careers',
    description:
      'Unique key of the page (e.g. careers, projects, programs, news, contact, about, solutions)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  pageKey: string;

  @ApiProperty({
    example: 'Kiến tạo tương lai\nchuyển đổi số tại Gia Lai',
    description: 'Title of the page banner',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example:
      'Gia nhập VDCD Group để cùng xây dựng hệ sinh thái công nghệ tiên phong...',
    description: 'Subtitle of the banner',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  subtitle?: string | null;

  @ApiPropertyOptional({
    example: 'Tuyển dụng',
    description: 'Tag or category label of the banner',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  @MaxLength(100)
  tag?: string | null;

  @ApiProperty({
    example: 'https://picsum.photos/id/1/1920/1080',
    description: 'Background image URL of the banner',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({
    example: 'FILE_ID_12345',
    description: 'File ID of the banner image',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o, v) => v !== null)
  @IsString()
  imageFileId?: string | null;

  @ApiPropertyOptional({
    example: [
      {
        label: 'Xem vị trí',
        href: '#positions',
        variant: 'primary',
        ariaLabel: 'Xem các vị trí tuyển dụng',
      },
    ],
    description: 'CTA buttons list for the banner',
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  ctaButtons?: PageBannerCtaButton[] | null;

  @ApiPropertyOptional({ example: true, description: 'Is page banner active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
