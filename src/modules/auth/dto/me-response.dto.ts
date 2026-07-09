import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class MeResponseDto extends UserResponseDto {
  @ApiProperty({
    example: true,
    description: 'Active status of the user account',
  })
  isActive: boolean;
}
