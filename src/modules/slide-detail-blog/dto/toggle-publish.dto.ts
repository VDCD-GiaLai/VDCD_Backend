// src/modules/slide-detail-blog/dto/toggle-publish.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleBlogPublishDto {
  @ApiProperty({
    example: true,
    description: 'Whether the blog is published',
  })
  @IsBoolean()
  isPublished: boolean;
}
