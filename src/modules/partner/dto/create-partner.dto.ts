import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePartnerDto {
  @ApiProperty({
    example: 'VDCD Group',
    description: 'Name of the partner',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'file-123456',
    description: 'File ID of the logo image',
  })
  @IsOptional()
  @IsString()
  logoFileId?: string;

  @ApiProperty({
    example: 'https://example.com/images/partner-logo.png',
    description: 'Logo URL of the partner',
  })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiPropertyOptional({
    example: 'https://vdcd.vn',
    description: 'Website URL of the partner',
  })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Display order of the partner',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;
}
