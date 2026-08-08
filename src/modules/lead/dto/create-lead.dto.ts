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

  @ApiPropertyOptional({ example: '1998-05-15', description: 'Date of birth' })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({
    example: 'TP. Pleiku, Gia Lai',
    description: 'Current address',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    example: '1 - 3 năm',
    description: 'Years of experience',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  experienceYears?: string;

  @ApiPropertyOptional({
    example: '15 - 20 triệu',
    description: 'Expected salary',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  expectedSalary?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/username',
    description: 'Portfolio/LinkedIn/GitHub URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  portfolioUrl?: string;

  @ApiPropertyOptional({
    example: 'Tôi rất quan tâm đến vị trí này...',
    description: 'Cover letter content',
  })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiPropertyOptional({
    example: 'career_form',
    description: 'Lead source',
    enum: ['career_form', 'contact_form', 'landing_page'],
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Honeypot field for bot detection (leave empty)',
  })
  @IsOptional()
  @IsString()
  website?: string;
}
