// src/modules/slide/slide.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ReorderSlidesDto } from './dto/reorder-slides.dto';
import { ToggleSlideDto } from './dto/toggle-slide.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Slide } from './entities/slide.entity';

@ApiTags('Slides')
@Controller('slides')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlideController {
  constructor(private service: SlideService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get active slides',
    description:
      'Retrieve a list of all active slides ordered by display order. Public access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active slides retrieved successfully.',
    type: [Slide],
  })
  findActive() {
    return this.service.findActive();
  }

  @Get('all')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Get all slides (Admin)',
    description:
      'Retrieve a list of all slides (active and inactive) ordered by display order. Restricted to superadmin and editor.',
  })
  @ApiResponse({
    status: 200,
    description: 'All slides retrieved successfully.',
    type: [Slide],
  })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Create a new slide',
    description:
      'Create a new slide record. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: CreateSlideDto })
  @ApiResponse({
    status: 201,
    description: 'Slide created successfully.',
    type: Slide,
  })
  create(@Body() dto: CreateSlideDto) {
    return this.service.create(dto);
  }

  @Patch('reorder')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Reorder slides',
    description:
      'Reorder display positions of slides. Restricted to superadmin and editor.',
  })
  @ApiBody({ type: ReorderSlidesDto })
  @ApiResponse({ status: 200, description: 'Slides reordered successfully.' })
  reorder(@Body() dto: ReorderSlidesDto) {
    return this.service.reorder(dto.items);
  }

  @Patch(':id')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Update a slide',
    description:
      'Update slide details by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the slide to update' })
  @ApiBody({ type: UpdateSlideDto })
  @ApiResponse({
    status: 200,
    description: 'Slide updated successfully.',
    type: Slide,
  })
  @ApiResponse({ status: 404, description: 'Slide not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateSlideDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/toggle')
  @Roles('superadmin', 'editor')
  @ApiOperation({
    summary: 'Toggle slide active status',
    description:
      'Activate or deactivate a slide by ID. Restricted to superadmin and editor.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the slide' })
  @ApiBody({ type: ToggleSlideDto })
  @ApiResponse({
    status: 200,
    description: 'Slide active status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Slide not found.' })
  toggle(@Param('id') id: string, @Body() dto: ToggleSlideDto) {
    return this.service.toggle(id, dto.isActive);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a slide',
    description: 'Permanently delete a slide by ID. Restricted to superadmin.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the slide to delete' })
  @ApiResponse({ status: 200, description: 'Slide deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Slide not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
