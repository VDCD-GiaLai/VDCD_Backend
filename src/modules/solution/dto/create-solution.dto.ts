import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateSolutionDto {
  @ApiProperty({
    example: 'Giải pháp nông nghiệp thông minh',
    description: 'Tiêu đề của giải pháp',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'giai-phap-nong-nghiep-thong-minh',
    description: 'Slug của giải pháp (nếu trống sẽ tự sinh từ tiêu đề)',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Giới thiệu về giải pháp nông nghiệp thông minh của VDCD...',
    description: 'Mô tả ngắn gọn của giải pháp',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    example: 'Nội dung chi tiết của giải pháp...',
    description: 'Nội dung chi tiết của giải pháp',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/thumbnail.jpg',
    description: 'Thumbnail URL của giải pháp',
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
    example: 'Nông nghiệp thông minh VDCD',
    description: 'Meta Title phục vụ SEO (tối đa 60 ký tự)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'Giải pháp nông nghiệp thông minh ứng dụng công nghệ IoT...',
    description: 'Meta Description phục vụ SEO (tối đa 160 ký tự)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Trạng thái xuất bản của giải pháp',
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
