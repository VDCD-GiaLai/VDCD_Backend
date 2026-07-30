import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ProjectFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'uuid-field-id',
    description: 'Filter by field ID',
  })
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional({
    example: 'uuid-province-id',
    description: 'Filter by province ID',
  })
  @IsOptional()
  @IsUUID()
  provinceId?: string;

  @ApiPropertyOptional({ example: 2026, description: 'Filter by project year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by published status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublished?: boolean;
}
