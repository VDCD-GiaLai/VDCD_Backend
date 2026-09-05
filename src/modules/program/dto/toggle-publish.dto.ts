// src/modules/program/dto/toggle-publish.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TogglePublishDto {
  @ApiProperty({
    example: true,
    description: 'Trạng thái xuất bản của chương trình',
  })
  @IsBoolean()
  isPublished: boolean;

  @ApiPropertyOptional({
    example: '2026-07-11T00:00:00.000Z',
    description:
      'Ngày xuất bản (nếu xuất bản mà không truyền sẽ tự động lấy thời điểm hiện tại)',
  })
  @IsOptional()
  @Type(() => Date)
  publishedAt?: Date;
}
