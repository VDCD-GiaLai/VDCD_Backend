import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class ArticleFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'Tin tức',
    description: 'Filter articles by category name',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'vdcd',
    description: 'Filter articles by tag (case-insensitive substring match)',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter articles by publication status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublished?: boolean;
}
