// src/modules/article/dto/reorder-articles.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderArticleItemDto {
  @ApiProperty({ example: 'uuid-article-id', description: 'ID của bài viết' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị của bài viết' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderArticlesDto {
  @ApiProperty({
    type: [ReorderArticleItemDto],
    description: 'Danh sách các bài viết và thứ tự hiển thị mới',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderArticleItemDto)
  items: ReorderArticleItemDto[];
}
