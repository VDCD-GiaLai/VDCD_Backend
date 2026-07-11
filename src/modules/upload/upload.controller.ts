import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileUploadDto } from './dto/file-upload.dto';
import {
  UploadResponseDto,
  ImageKitAuthDto,
  TransformedUrlDto,
} from './dto/upload-response.dto';

// Memory storage — Don't save file to disk, just send to ImageKit
const memoryUpload = () =>
  FileInterceptor('file', { storage: memoryStorage() });

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly service: UploadService) {}

  // ── General image ───────────────────────────────────────────────────
  @Post('image')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @UseInterceptors(memoryUpload())
  @ApiOperation({
    summary: 'Upload general image',
    description:
      'Upload a general image file to ImageKit under the "images" folder. Restricted to superadmin and editor.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(file);
  }

  // ── Image in specific folder ──────────────────────────────────────
  @Post('image/thumbnail')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @UseInterceptors(memoryUpload())
  @ApiOperation({
    summary: 'Upload thumbnail image',
    description:
      'Upload a thumbnail image file to ImageKit under the "thumbnails" folder. Restricted to superadmin and editor.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Thumbnail image uploaded successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadThumbnail(file);
  }

  @Post('image/project')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @UseInterceptors(memoryUpload())
  @ApiOperation({
    summary: 'Upload project image',
    description:
      'Upload a project image file to ImageKit under the "projects" folder. Restricted to superadmin and editor.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Project image uploaded successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  uploadProjectImage(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadProjectImage(file);
  }

  @Post('image/slide')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @UseInterceptors(memoryUpload())
  @ApiOperation({
    summary: 'Upload slide image',
    description:
      'Upload a slide image file to ImageKit under the "slides" folder. Restricted to superadmin and editor.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Slide image uploaded successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  uploadSlideImage(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadSlideImage(file);
  }

  @Post('image/partner')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @UseInterceptors(memoryUpload())
  @ApiOperation({
    summary: 'Upload partner logo',
    description:
      'Upload a partner logo image file to ImageKit under the "partners" folder. Restricted to superadmin and editor.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Partner logo uploaded successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  uploadPartnerLogo(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadPartnerLogo(file);
  }

  // ── Attached file (public — guest send CV) ───────────────────────
  @Public()
  @Post('file')
  @UseInterceptors(memoryUpload())
  @ApiOperation({
    summary: 'Upload attachment file',
    description:
      'Upload an attachment file (PDF, DOC, DOCX) to ImageKit. Public access.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Attachment file uploaded successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadFile(file);
  }

  // ── Delete file ────────────────────────────────────────────────────
  @Delete(':fileId')
  @Roles('superadmin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete uploaded file',
    description:
      'Delete a file from ImageKit by its file ID. Restricted to superadmin.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'The unique ID of the file in ImageKit',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully.',
  })
  deleteFile(@Param('fileId') fileId: string) {
    return this.service.deleteFile(fileId);
  }

  // ── URL transform (resize on-the-fly) ───────────────────────────
  @Public()
  @Get('transform')
  @ApiOperation({
    summary: 'Get transformed URL',
    description:
      'Generate a transformed ImageKit URL with options like width, height, quality, and format. Public access.',
  })
  @ApiQuery({
    name: 'path',
    description: 'The ImageKit file path',
    required: true,
  })
  @ApiQuery({
    name: 'w',
    description: 'Width to resize to (pixels)',
    required: false,
  })
  @ApiQuery({
    name: 'h',
    description: 'Height to resize to (pixels)',
    required: false,
  })
  @ApiQuery({
    name: 'q',
    description: 'Quality percentage (1-100)',
    required: false,
  })
  @ApiQuery({
    name: 'f',
    description: 'Format to convert to',
    enum: ['webp', 'jpg', 'png', 'auto'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Transformed URL generated successfully.',
    type: TransformedUrlDto,
  })
  getTransformedUrl(
    @Query('path') path: string,
    @Query('w') width: string,
    @Query('h') height: string,
    @Query('q') quality: string,
    @Query('f') format: 'webp' | 'jpg' | 'png' | 'auto',
  ) {
    return {
      url: this.service.getTransformedUrl(path, {
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        quality: quality ? parseInt(quality) : 80,
        format: format ?? 'auto',
      }),
    };
  }

  // ── Auth params for client-side upload ──────────────────────────
  @Get('auth')
  @Roles('superadmin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get client-side upload auth parameters',
    description:
      'Get temporary token, signature, and expiration time for uploading files directly from client side. Restricted to superadmin and editor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication parameters retrieved successfully.',
    type: ImageKitAuthDto,
  })
  getAuthParams() {
    return this.service.getAuthParams();
  }
}
