import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ProgramFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'uuid-field-id',
    description: 'Filter by field ID',
  })
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by published status',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublished?: boolean;
}
