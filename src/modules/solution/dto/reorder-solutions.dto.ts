// src/modules/solution/dto/reorder-solutions.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderSolutionItemDto {
  @ApiProperty({ example: 'uuid-solution-id', description: 'ID của giải pháp' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị của giải pháp' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderSolutionsDto {
  @ApiProperty({
    type: [ReorderSolutionItemDto],
    description: 'Danh sách các mục giải pháp và thứ tự mới',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderSolutionItemDto)
  items: ReorderSolutionItemDto[];
}
