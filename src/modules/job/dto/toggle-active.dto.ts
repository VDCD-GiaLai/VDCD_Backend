import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleActiveDto {
  @ApiProperty({
    example: true,
    description: 'Whether the job posting is active',
  })
  @IsBoolean()
  isActive: boolean;
}
