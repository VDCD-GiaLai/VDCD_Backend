import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderPartnerItemDto {
  @ApiProperty({ example: 'uuid-partner-id', description: 'ID of the partner' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 1, description: 'Display order position' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class ReorderPartnersDto {
  @ApiProperty({
    type: [ReorderPartnerItemDto],
    description: 'List of partner order items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderPartnerItemDto)
  items: ReorderPartnerItemDto[];
}
