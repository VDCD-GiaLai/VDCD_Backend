import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload',
  })
  file: any;

  @ApiPropertyOptional({
    type: 'string',
    description:
      'Optional subfolder name under the category folder (e.g. "bai-viet", "so-hoa-du-lieu")',
    example: 'bai-viet',
  })
  @IsOptional()
  @IsString()
  subfolder?: string;
}
