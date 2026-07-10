import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProvinceDto {
  @ApiProperty({ example: 'Gia Lai', description: 'Name of the province' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'GL',
    description: 'Unique short code of the province',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the province has any project',
  })
  @IsOptional()
  @IsBoolean()
  hasProject?: boolean;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of centers in the province',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  centerCount?: number;
}
