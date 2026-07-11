import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOperationFieldDto {
  @ApiProperty({
    example: 'Năng lượng tái tạo',
    description: 'Tên lĩnh vực hoạt động',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'nang-luong-tai-tao',
    description: 'Slug của lĩnh vực hoạt động (nếu trống sẽ tự sinh từ tên)',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'mdi:solar-power',
    description: 'Icon đại diện cho lĩnh vực hoạt động',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    example: 'Cung cấp các giải pháp điện mặt trời, điện gió...',
    description: 'Mô tả ngắn về lĩnh vực hoạt động',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Thứ tự hiển thị',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;
}
