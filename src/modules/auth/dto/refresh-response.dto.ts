import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates token refresh success status',
  })
  success: boolean;
}
