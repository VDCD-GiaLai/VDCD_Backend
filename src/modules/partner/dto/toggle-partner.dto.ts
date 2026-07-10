import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class TogglePartnerDto {
  @ApiProperty({ example: true, description: 'Whether the partner is active' })
  @IsBoolean()
  isActive: boolean;
}
