import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AddImagesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Project images (multipart/form-data)',
  })
  files: any[];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
    },
    description:
      'Captions for the uploaded images. Can be sent as multiple form fields or a JSON string array.',
    example: ['caption 1', 'caption 2'],
  })
  @IsOptional()
  captions?: string | string[];
}
