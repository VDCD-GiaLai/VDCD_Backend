import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('lead-trends')
  @ApiOperation({ summary: 'Get lead trends' })
  @ApiQuery({ name: 'range', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Trends retrieved successfully' })
  getLeadTrends(@Query('range') range: string = '7days') {
    return this.dashboardService.getLeadTrends(range);
  }

  @Get('drafts')
  @ApiOperation({ summary: 'Get draft content' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Drafts retrieved successfully' })
  getDrafts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.dashboardService.getDrafts(Number(page), Number(limit));
  }
}
