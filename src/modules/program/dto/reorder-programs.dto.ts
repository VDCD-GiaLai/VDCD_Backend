// src/modules/program/dto/reorder-programs.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderProgramItemDto {
  @ApiProperty({ example: 'uuid-program-id', description: 'ID của hoạt động' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị của hoạt động' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderProgramsDto {
  @ApiProperty({
    type: [ReorderProgramItemDto],
    description: 'Danh sách các mục hoạt động và thứ tự mới',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderProgramItemDto)
  items: ReorderProgramItemDto[];
}
