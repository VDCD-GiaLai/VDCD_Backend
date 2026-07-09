import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class LoginDto {
  @ApiProperty({
    example: 'admin@vdcd.vn',
    description: 'User login email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User login password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
