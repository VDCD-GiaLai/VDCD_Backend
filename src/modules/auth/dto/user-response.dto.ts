import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'd3b07384-d113-4956-a5db-e78119d90184',
    description: 'Account ID',
  })
  id: string;

  @ApiProperty({ example: 'admin_user', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'admin@vdcd.vn', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'Account role' })
  role: string;
}
