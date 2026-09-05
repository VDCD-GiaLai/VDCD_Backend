// src/modules/program/dto/create-program.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgramDto {
  @ApiProperty({
    example: 'Chương trình phát triển Năng lượng xanh',
    description: 'Tiêu đề của chương trình',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'chuong-trinh-phat-trien-nang-luong-xanh',
    description: 'Slug của chương trình (nếu trống sẽ tự sinh từ tiêu đề)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({
    example: 'Mô tả ngắn gọn về chương trình phát triển năng lượng xanh...',
    description: 'Mô tả ngắn của chương trình',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    example: {
      version: 1,
      blocks: [
        {
          id: 'blk-1',
          type: 'paragraph',
          text: 'Nội dung chi tiết chương trình...',
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
    example: 'uuid-thumbnail-file-id',
    description: 'ID của file thumbnail chương trình',
  })
  @IsOptional()
  @IsString()
  thumbnailFileId?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/thumbnail.jpg',
    description: 'Thumbnail URL của chương trình',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    example: 'uuid-field-id',
    description: 'ID của lĩnh vực hoạt động liên quan',
  })
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional({
    example: 'Năng lượng xanh VDCD',
    description: 'Meta Title phục vụ SEO (tối đa 255 ký tự)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'Thông tin chi tiết về chương trình năng lượng xanh của VDCD...',
    description: 'Meta Description phục vụ SEO (tối đa 255 ký tự)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaDescription?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Trạng thái xuất bản của chương trình',
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
