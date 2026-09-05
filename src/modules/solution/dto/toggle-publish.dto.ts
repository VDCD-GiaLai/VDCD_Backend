import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TogglePublishDto {
  @ApiProperty({
    example: true,
    description: 'Whether the solution is published',
  })
  @IsBoolean()
  isPublished: boolean;

  @ApiPropertyOptional({
    example: '2026-07-11T00:00:00.000Z',
    description:
      'Publication date. Defaults to current date if published and not provided.',
  })
  @IsOptional()
  @Type(() => Date)
  publishedAt?: Date;
}
