import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleSlideDto {
  @ApiProperty({ example: true, description: 'Whether the slide is active' })
  @IsBoolean()
  isActive: boolean;
}
