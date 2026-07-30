import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Admin User', description: 'User display name' })
  @IsString()
  @IsNotEmpty({ message: 'Tên hiển thị không được để trống' })
  @MaxLength(50, { message: 'Tên hiển thị không được vượt quá 50 ký tự' })
  username: string;
}
