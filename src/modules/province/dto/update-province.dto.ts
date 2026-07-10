import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProvinceDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Whether the province has any project',
  })
  @IsOptional()
  @IsBoolean()
  hasProject?: boolean;

  @ApiPropertyOptional({
    example: 2,
    description: 'Number of centers in the province',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  centerCount?: number;
}
