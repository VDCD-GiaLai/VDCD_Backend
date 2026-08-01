import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Full name of the person making contact',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({
    example: 'nguyen.a@example.com',
    description: 'Email address',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '0912345678',
    description: 'Phone number',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Tư vấn giải pháp chuyển đổi số',
    description: 'Subject of the contact message',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({
    example: 'Chúng tôi muốn tìm hiểu về dịch vụ...',
    description: 'Message body',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/attachments/doc.pdf',
    description: 'Optional attachment URL',
  })
  @IsOptional()
  @IsString()
  attachment?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Honeypot field for bot detection (leave empty)',
  })
  @IsOptional()
  @IsString()
  website?: string;
}
