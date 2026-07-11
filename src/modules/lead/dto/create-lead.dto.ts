import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the contact person',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the contact person',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '0987654321',
    description: 'Phone number of the contact person',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Inquiry about services',
    description: 'Subject of the lead message',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({
    example: 'I would like to request a quote for...',
    description: 'Message body of the lead',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/attachments/document.pdf',
    description: 'Optional attachment URL or path',
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
