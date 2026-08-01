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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';
import { MarkReadContactDto } from './dto/mark-read-contact.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactController {
  constructor(private service: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Submit a contact form',
    description:
      'Public endpoint for submitting contact/inquiry forms. Includes honeypot bot detection.',
  })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({
    status: 201,
    description: 'Contact submitted successfully.',
  })
  create(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all contacts',
    description:
      'Retrieve a paginated list of contacts with optional read/unread filtering. Restricted to admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully.',
  })
  findAll(@Query() dto: FilterContactDto) {
    return this.service.findAll(dto);
  }

  @Get('export')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Export contacts as CSV',
    description:
      'Export all contact submissions within a specified date range to a CSV file. Restricted to superadmin.',
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
    const contacts = await this.service.exportCsv(from, to);
    const rows = [
      'id,full_name,email,phone,subject,message,created_at',
      ...contacts.map((c) =>
        [
          c.id,
          c.fullName,
          c.email,
          c.phone,
          c.subject,
          c.message,
          c.createdAt,
        ]
          .map((v) => `"${(v ?? '').toString().replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=contacts_${Date.now()}.csv`,
    );
    res.send('\uFEFF' + rows); // BOM cho Excel đọc đúng UTF-8
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a single contact by ID',
    description:
      'Retrieve details of a specific contact and automatically mark it as read. Restricted to admin.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the contact' })
  @ApiResponse({
    status: 200,
    description: 'Contact details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update contact read status',
    description:
      'Explicitly mark a contact as read or unread. Restricted to admin.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the contact' })
  @ApiBody({ type: MarkReadContactDto })
  @ApiResponse({
    status: 200,
    description: 'Contact read status updated successfully.',
  })
  markRead(@Param('id') id: string, @Body() dto: MarkReadContactDto) {
    return this.service.markRead(id, dto.isRead);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a contact',
    description:
      'Permanently delete a contact by ID. Restricted to superadmin.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the contact to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
