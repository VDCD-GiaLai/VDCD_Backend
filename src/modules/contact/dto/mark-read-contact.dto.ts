import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class MarkReadContactDto {
  @ApiProperty({
    description: 'Mark the contact as read (true) or unread (false)',
    example: true,
  })
  @IsBoolean()
  isRead: boolean;
}
