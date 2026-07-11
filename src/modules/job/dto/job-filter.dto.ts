import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class JobFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'full-time',
    description: 'Filter jobs by employment type',
    enum: ['full-time', 'part-time', 'intern'],
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    example: 'Gia Lai',
    description: 'Filter jobs by location (case-insensitive substring match)',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter jobs by active status',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
