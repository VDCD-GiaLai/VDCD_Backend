import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class JobFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'frontend',
    description:
      'Search jobs by keyword (case-insensitive match on title, description, department)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'full-time',
    description: 'Filter jobs by employment type',
    enum: ['full-time', 'part-time', 'intern', 'contract'],
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
    example: 'Kỹ thuật',
    description: 'Filter jobs by department (exact match)',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    example: '1 - 3 năm',
    description: 'Filter jobs by experience requirement (substring match)',
  })
  @IsOptional()
  @IsString()
  experience?: string;

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
