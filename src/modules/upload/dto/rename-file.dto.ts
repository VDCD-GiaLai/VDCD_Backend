import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class RenameFileDto {
  @ApiProperty({
    description: 'Tên file mới (có thể có hoặc không có phần mở rộng)',
    example: 'banner-hoi-thao-2026.jpg',
  })
  @IsString({ message: 'Tên tệp phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên tệp không được để trống' })
  @MaxLength(200, { message: 'Tên tệp tối đa 200 ký tự' })
  newFileName: string;

  @ApiPropertyOptional({
    description: 'Tự động đồng bộ cập nhật URL trong cơ sở dữ liệu nếu file đang được sử dụng',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  syncDatabaseReferences?: boolean = true;
}

export class RenameFileResponseDto {
  @ApiProperty({ description: 'ID của file trên ImageKit', example: '64b0f12c...' })
  fileId: string;

  @ApiProperty({ description: 'Tên file mới', example: 'banner-hoi-thao-2026.jpg' })
  name: string;

  @ApiProperty({ description: 'Đường dẫn file mới trên ImageKit', example: '/vdcd/images/banner-hoi-thao-2026.jpg' })
  filePath: string;

  @ApiProperty({ description: 'URL trực tiếp mới của file', example: 'https://ik.imagekit.io/your_id/vdcd/images/banner-hoi-thao-2026.jpg' })
  url: string;

  @ApiPropertyOptional({ description: 'Số lượng bản ghi CSDL được cập nhật URL liên kết', example: 1 })
  updatedDbRecordsCount?: number;
}
