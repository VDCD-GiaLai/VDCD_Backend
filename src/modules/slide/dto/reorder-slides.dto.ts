import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderSlideItemDto {
  @ApiProperty({ example: 'uuid-slide-id', description: 'ID of the slide' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 1, description: 'Display order position' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderSlidesDto {
  @ApiProperty({
    type: [ReorderSlideItemDto],
    description: 'List of slide order items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderSlideItemDto)
  items: ReorderSlideItemDto[];
}
