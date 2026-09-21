import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GalleryQueryDto {
  @ApiPropertyOptional({
    description: 'Folder path to browse (e.g. "/vdcd/slides")',
    example: '/vdcd/slides',
  })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({
    description:
      'Optional search query (ImageKit searchQuery syntax, e.g. name LIKE "banner")',
    example: 'name LIKE "banner"',
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 30,
    default: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of results to skip (for pagination)',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC_CREATED',
    default: 'DESC_CREATED',
    enum: [
      'ASC_CREATED',
      'DESC_CREATED',
      'ASC_UPDATED',
      'DESC_UPDATED',
      'ASC_NAME',
      'DESC_NAME',
      'ASC_SIZE',
      'DESC_SIZE',
    ],
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'ASC_CREATED',
    'DESC_CREATED',
    'ASC_UPDATED',
    'DESC_UPDATED',
    'ASC_NAME',
    'DESC_NAME',
    'ASC_SIZE',
    'DESC_SIZE',
  ])
  sort?: string;

  @ApiPropertyOptional({
    description: 'Filter by file type',
    example: 'all',
    default: 'all',
    enum: ['all', 'image', 'non-image'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['all', 'image', 'non-image'])
  fileType?: string;
}

export class GalleryFoldersQueryDto {
  @ApiPropertyOptional({
    description: 'Parent folder path to list subfolders',
    example: '/vdcd',
    default: '/vdcd',
  })
  @IsOptional()
  @IsString()
  path?: string;
}

export class GalleryFileDto {
  @ApiProperty({ description: 'ImageKit file ID', example: '64b0f12c...' })
  fileId: string;

  @ApiProperty({ description: 'File name', example: 'banner.png' })
  name: string;

  @ApiProperty({
    description: 'Direct URL to the file',
    example: 'https://ik.imagekit.io/your_id/vdcd/slides/banner.png',
  })
  url: string;

  @ApiProperty({
    description: 'File path in ImageKit',
    example: '/vdcd/slides/banner.png',
  })
  filePath: string;

  @ApiProperty({ description: 'File size in bytes', example: 102400 })
  size: number;

  @ApiPropertyOptional({ description: 'Image width', example: 1920 })
  width?: number;

  @ApiPropertyOptional({ description: 'Image height', example: 1080 })
  height?: number;

  @ApiProperty({
    description: 'File creation timestamp',
    example: '2026-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Thumbnail URL (small preview)',
    example:
      'https://ik.imagekit.io/your_id/tr:n-ik_ml_thumbnail/vdcd/slides/banner.png',
  })
  thumbnail: string;

  @ApiPropertyOptional({
    description: 'File classification (image or non-image)',
    example: 'image',
  })
  fileType?: string;

  @ApiPropertyOptional({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  mime?: string;
}

export class GalleryResponseDto {
  @ApiProperty({ type: [GalleryFileDto] })
  files: GalleryFileDto[];
}

export class GalleryFolderDto {
  @ApiProperty({ description: 'Folder name', example: 'slides' })
  name: string;

  @ApiProperty({
    description: 'Full folder path',
    example: '/vdcd/slides',
  })
  folderPath: string;
}

export class GalleryFoldersResponseDto {
  @ApiProperty({ type: [GalleryFolderDto] })
  folders: GalleryFolderDto[];
}
