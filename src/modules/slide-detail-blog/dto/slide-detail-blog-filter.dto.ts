// src/modules/slide-detail-blog/dto/slide-detail-blog-filter.dto.ts
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class SlideDetailBlogFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'đất đai',
    description: 'Search by title (case-insensitive)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by publication status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublished?: boolean;
}
