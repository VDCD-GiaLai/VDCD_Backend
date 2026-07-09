import { ApiProperty } from '@nestjs/swagger';
import { AdminUser } from '../entities/admin-user.entity';

export class AdminUserPaginationResponseDto {
  @ApiProperty({ type: [AdminUser], description: 'List of admin users' })
  data: AdminUser[];

  @ApiProperty({ example: 10, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;
}
