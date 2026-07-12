import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProjectImageDto {
  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: 'URL of the image',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    example: 'Image caption',
    description: 'Caption of the image',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    example: 'file-id',
    description: 'File ID of the image',
  })
  @IsOptional()
  @IsString()
  fileId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order of the image',
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class AddImagesDto {
  @ApiProperty({
    type: [ProjectImageDto],
    description: 'List of images to add',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images: ProjectImageDto[];
}
