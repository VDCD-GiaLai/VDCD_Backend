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

export class CreateSolutionDto {
  @ApiProperty({
    example: 'Giải pháp nông nghiệp thông minh',
    description: 'Tiêu đề của giải pháp',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'giai-phap-nong-nghiep-thong-minh',
    description: 'Slug của giải pháp (nếu trống sẽ tự sinh từ tiêu đề)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({
    example: 'solution-temp-8f9a2b',
    description:
      'Temporary folder key used when uploading images before slug was created',
  })
  @IsOptional()
  @IsString()
  tempFolderKey?: string;

  @ApiPropertyOptional({
    example: 'uuid-thumbnail-file-id',
    description: 'ID của file thumbnail giải pháp',
  })
  @IsOptional()
  @IsString()
  thumbnailFileId?: string;

  @ApiPropertyOptional({
    example: 'Giới thiệu về giải pháp nông nghiệp thông minh của VDCD...',
    description: 'Mô tả ngắn gọn của giải pháp',
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
          text: 'Nội dung chi tiết giải pháp...',
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
    example: 'https://example.com/images/thumbnail.jpg',
    description: 'Thumbnail URL của giải pháp',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    example: 'https://bimv.vn/',
    description: 'Website URL của giải pháp (nếu có)',
  })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({
    example: 'uuid-field-id',
    description: 'ID của lĩnh vực hoạt động liên quan',
  })
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional({
    example: 'Nông nghiệp thông minh VDCD',
    description: 'Meta Title phục vụ SEO (tối đa 255 ký tự)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'Giải pháp nông nghiệp thông minh ứng dụng công nghệ IoT...',
    description: 'Meta Description phục vụ SEO (tối đa 255 ký tự)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaDescription?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Trạng thái xuất bản của giải pháp',
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
