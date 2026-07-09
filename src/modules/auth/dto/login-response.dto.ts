import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOi...',
    description: 'JWT Access Token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOi...',
    description: 'JWT Refresh Token',
  })
  refreshToken: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user information',
  })
  user: UserResponseDto;
}
