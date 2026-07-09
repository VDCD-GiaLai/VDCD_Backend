import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderItemDto {
  @ApiProperty({
    example: 'uuid-image-id',
    description: 'ID of the project image',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 2, description: 'New order position' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderImagesDto {
  @ApiProperty({
    type: [ReorderItemDto],
    description: 'List of images with their new order positions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
