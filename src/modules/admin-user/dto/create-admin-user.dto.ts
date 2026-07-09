import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'admin_user', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin@vdcd.vn', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'editor',
    description: 'Account role',
    enum: ['superadmin', 'editor', 'viewer'],
  })
  @IsIn(['superadmin', 'editor', 'viewer'])
  role: string;
}
