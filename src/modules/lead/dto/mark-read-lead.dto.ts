import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class MarkReadDto {
  @ApiProperty({
    description: 'Mark the lead as read (true) or unread (false)',
    example: true,
  })
  @IsBoolean()
  isRead: boolean;
}
