import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({
    description: 'The search keyword',
    example: 'nông nghiệp',
  })
  @IsString()
  @IsNotEmpty()
  q: string;

  @ApiProperty({
    description: 'Comma-separated list of entities to search',
    example: 'programs,projects',
    required: false,
  })
  @IsString()
  @IsOptional()
  types?: string;
}
