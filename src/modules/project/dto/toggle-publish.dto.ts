import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class TogglePublishDto {
  @ApiProperty({
    example: true,
    description: 'Whether the project is published or not',
  })
  @IsBoolean()
  isPublished: boolean;
}
