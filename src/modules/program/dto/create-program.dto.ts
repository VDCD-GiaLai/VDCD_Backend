import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({
    example: 'Chương trình phát triển Năng lượng xanh',
    description: 'Tiêu đề của chương trình',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'chuong-trinh-phat-trien-nang-luong-xanh',
    description: 'Slug của chương trình (nếu trống sẽ tự sinh từ tiêu đề)',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Mô tả ngắn gọn về chương trình phát triển năng lượng xanh...',
    description: 'Mô tả ngắn của chương trình',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    example: 'uuid-thumbnail-file-id',
    description: 'ID của file thumbnail chương trình',
  })
  @IsOptional()
  @IsString()
  thumbnailFileId?: string;

  @ApiPropertyOptional({
    example: 'Nội dung chi tiết của chương trình...',
    description: 'Nội dung chi tiết của chương trình',
  })
  @IsOptional()
  @IsString()
  content?: string;

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
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'Thông tin chi tiết về chương trình năng lượng xanh của VDCD...',
    description: 'Meta Description phục vụ SEO (tối đa 255 ký tự)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaDescription?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Trạng thái xuất bản của chương trình',
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
