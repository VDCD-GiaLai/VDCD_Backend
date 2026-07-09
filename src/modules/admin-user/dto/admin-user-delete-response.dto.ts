import { ApiProperty } from '@nestjs/swagger';

export class AdminUserDeleteResponseDto {
  @ApiProperty({
    example: 'Deleted successfully',
    description: 'Result message',
  })
  message: string;
}
