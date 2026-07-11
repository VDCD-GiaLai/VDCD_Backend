import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';
import { MarkReadDto } from './dto/mark-read-lead.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadController {
  constructor(private service: LeadService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Create a new lead',
    description:
      'Submit contact/inquiry form to create a new lead (public endpoint, includes a honeypot field)',
  })
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({
    status: 201,
    description: 'Lead submitted successfully.',
  })
  create(@Body() dto: CreateLeadDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all leads',
    description:
      'Retrieve a paginated list of leads with optional read/unread filtering. Restricted to admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Leads retrieved successfully.',
  })
  findAll(@Query() dto: FilterLeadDto) {
    return this.service.findAll(dto);
  }

  @Get('export')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Export leads as CSV',
    description:
      'Export all lead submissions within a specified date range to a CSV file. Restricted to superadmin.',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Start date filter (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'End date filter (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'CSV file generated and returned successfully.',
  })
  async exportCsv(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const leads = await this.service.exportCsv(from, to);
    const rows = [
      'id,full_name,email,phone,subject,message,created_at',
      ...leads.map((l) =>
        [l.id, l.fullName, l.email, l.phone, l.subject, l.message, l.createdAt]
          .map((v) => `"${(v ?? '').toString().replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=leads_${Date.now()}.csv`,
    );
    res.send('\uFEFF' + rows); // BOM cho Excel đọc đúng UTF-8
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a single lead by ID',
    description:
      'Retrieve details of a specific lead and automatically mark it as read. Restricted to admin.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the lead' })
  @ApiResponse({
    status: 200,
    description: 'Lead details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update lead read status',
    description:
      'Explicitly mark a lead as read or unread. Restricted to admin.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the lead' })
  @ApiBody({ type: MarkReadDto })
  @ApiResponse({
    status: 200,
    description: 'Lead read status updated successfully.',
  })
  markRead(@Param('id') id: string, @Body() dto: MarkReadDto) {
    return this.service.markRead(id, dto.isRead);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a lead',
    description: 'Permanently delete a lead by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the lead to delete' })
  @ApiResponse({
    status: 200,
    description: 'Lead deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
