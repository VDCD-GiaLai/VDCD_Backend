import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsIn,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    example: 'Lập trình viên Full-stack NodeJS/React',
    description: 'The title of the job opening',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'lap-trinh-vien-fullstack-nodejs-react',
    description:
      'Custom slug for the job. If not provided, it will be auto-generated from the title.',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Phòng Phát triển Phần mềm',
    description: 'The department of the job',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    example: 'Gia Lai / Remote',
    description: 'Job location',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 'full-time',
    description: 'Employment type',
    enum: ['full-time', 'part-time', 'intern'],
  })
  @IsIn(['full-time', 'part-time', 'intern'])
  type: string;

  @ApiPropertyOptional({
    example: '15,000,000 - 25,000,000 VND',
    description: 'Salary range',
  })
  @IsOptional()
  @IsString()
  salaryRange?: string;

  @ApiPropertyOptional({
    example: '2026-08-31',
    description: 'Application deadline (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({
    example: 'Mô tả chi tiết công việc...',
    description: 'Job description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Yêu cầu 2 năm kinh nghiệm...',
    description: 'Job requirements',
  })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({
    example: 'Chế độ bảo hiểm, lương tháng 13...',
    description: 'Job benefits',
  })
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the job opening is urgent',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the job posting is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
