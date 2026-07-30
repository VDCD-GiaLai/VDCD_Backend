import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Search')
@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Global Search',
    description:
      'Perform a global search across multiple entities. Restricted to superadmin and editor. Returns results grouped by entity type.',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully.',
  })
  globalSearch(
    @Query() dto: SearchQueryDto,
    @Request() req: { user: { role: string } },
  ) {
    const userRole = req.user.role; // Assumes JwtAuthGuard injects `req.user`
    return this.searchService.globalSearch(dto, userRole);
  }
}
