import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateProjectImageDto {
  @ApiPropertyOptional({
    description: 'Image caption',
    example: 'Bản đồ quy hoạch 3D Pleiku',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    description: 'Image display size',
    enum: ['small', 'large'],
    default: 'small',
  })
  @IsOptional()
  @IsIn(['small', 'large'])
  size?: string;
}
