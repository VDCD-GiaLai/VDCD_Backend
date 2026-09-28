// src/modules/project/dto/reorder-projects.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderProjectItemDto {
  @ApiProperty({ example: 'uuid-project-id', description: 'ID của dự án' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị của dự án' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderProjectsDto {
  @ApiProperty({
    type: [ReorderProjectItemDto],
    description: 'Danh sách các mục dự án và thứ tự mới',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderProjectItemDto)
  items: ReorderProjectItemDto[];
}
