import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OperationFieldItemDto {
  @ApiPropertyOptional({ example: 'Công nghệ số & Chuyển đổi số' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Nghiên cứu phát triển...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'cpu' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class DevelopmentOrientationItemDto {
  @ApiPropertyOptional({
    example: 'Phát triển hạ tầng dữ liệu và công nghệ dùng chung',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Lập mô hình 3D số hóa không gian...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'database' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class LeaderDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Phó Chủ tịch HĐQT kiêm Tổng Giám đốc' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example:
      'Chúng tôi không bắt đầu từ những điều quá cao siêu. Chúng tôi bắt đầu từ những khó khăn thực tế của người dân, cơ quan quản lý và doanh nghiệp, để đưa công nghệ vào giải quyết những vấn đề thiết thực và góp phần nâng cao chất lượng cuộc sống.',
  })
  @IsOptional()
  @IsString()
  quote?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'avatar-file-id' })
  @IsOptional()
  @IsString()
  avatarFileId?: string;

  @ApiPropertyOptional({ example: 'Xem thông tin lãnh đạo' })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional({ example: '/leadership' })
  @IsOptional()
  @IsString()
  ctaLink?: string;
}

export class AnnouncementDto {
  @ApiPropertyOptional({
    example: 'https://ik.imagekit.io/vdcd/about-us/event.webp',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'file_about_us_123' })
  @IsOptional()
  @IsString()
  imageFileId?: string;

  @ApiPropertyOptional({
    example:
      'Hội nghị Xúc tiến đầu tư tỉnh Gia Lai năm 2026 diễn ra vào ngày 28/3/2026 tại Trung tâm Hội nghị tỉnh (số 01 Nguyễn Tất Thành, phường Quy Nhơn)',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ example: '/events/hoi-nghi-xuc-tien-dau-tu' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StatItemDto {
  @ApiPropertyOptional({ example: 'staff' })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional({ example: '1500+' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ example: 'Nhân sự' })
  @IsString()
  label: string;

  @ApiPropertyOptional({
    example: 'Đội ngũ chuyên môn cao, đáp ứng triển khai dự án quy mô lớn',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'users' })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class CoreValueItemDto {
  @ApiPropertyOptional({ example: 'Sáng tạo' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Không ngừng đổi mới tư duy và giải pháp công nghệ',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'sparkles' })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class EcosystemMemberItemDto {
  @ApiPropertyOptional({ example: 'trung-tam-ban-do-so' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: 'Trung tâm Bản đồ số' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'trung-tam-ban-do-so' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example:
      'Cung cấp các dịch vụ bay quét 3D, trắc địa số hóa và thành lập bản đồ địa hình độ chính xác cao bằng máy bay không người lái.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://vdcd.vn/wp-content/uploads/2024/03/5-768x431.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example:
      'https://vietflycam.vn/dich-vu/bay-quet-3d-trac-dia-so-va-thanh-lap-ban-do',
  })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class CtaSectionDto {
  @ApiPropertyOptional({ example: 'Tầm nhìn & Sứ mệnh' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ example: 'CHUYỂN ĐỔI SỐ TƯƠNG LAI CỦA BẠN' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example:
      'Hãy liên hệ với chúng tôi để thiết kế các giải pháp công nghệ tối ưu nhất dành riêng cho doanh nghiệp, cơ quan của bạn tại địa bàn tỉnh.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Liên hệ hợp tác' })
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ApiPropertyOptional({ example: '/contact' })
  @IsOptional()
  @IsString()
  buttonLink?: string;

  @ApiPropertyOptional({ example: 'Khám phá giải pháp' })
  @IsOptional()
  @IsString()
  secondaryButtonText?: string;

  @ApiPropertyOptional({ example: '#' })
  @IsOptional()
  @IsString()
  secondaryButtonLink?: string;

  @ApiPropertyOptional({
    example: 'Kiến tạo tương lai số bền vững cho doanh nghiệp và cộng đồng.',
  })
  @IsOptional()
  @IsString()
  subtext?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    example: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
    description: 'Name of the organization',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'VDCD Gia Lai',
    description: 'Short name or abbreviation of the organization',
  })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({
    example: 'Nâng tầm giá trị Việt',
    description: 'Tagline of the organization',
  })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional({
    example: '4101443823',
    description: 'Business license number (Giấy CNĐKKD)',
  })
  @IsOptional()
  @IsString()
  businessLicenseNo?: string;

  @ApiPropertyOptional({
    example: 'Mô tả chi tiết về tổ chức...',
    description: 'Description of the organization',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Sứ mệnh của chúng tôi...',
    description: 'Mission statement of the organization',
  })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiPropertyOptional({
    example: 'Tầm nhìn phát triển tương lai...',
    description: 'Vision of the organization',
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiPropertyOptional({
    example: 'Sáng tạo – Chính trực – Hợp tác – Tác động',
    description: 'Core values string of the organization',
  })
  @IsOptional()
  @IsString()
  coreValues?: string;

  @ApiPropertyOptional({
    type: [CoreValueItemDto],
    description: 'Structured list of core values with details',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoreValueItemDto)
  coreValuesList?: CoreValueItemDto[];

  @ApiPropertyOptional({
    example: 2020,
    description: 'The year the organization was founded',
  })
  @IsOptional()
  @IsInt()
  foundedYear?: number;

  @ApiPropertyOptional({
    example: 'Số 226 Đống Đa, Phường Quy Nhơn, Tỉnh Gia Lai',
    description: 'Address of the organization',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'dmstgialai@vdcd.vn',
    description: 'Official contact email of the organization',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '0373600099',
    description: 'Official hotline / phone number',
  })
  @IsOptional()
  @IsString()
  hotline?: string;

  @ApiPropertyOptional({
    type: AnnouncementDto,
    description: 'Top announcement or event notice bar',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AnnouncementDto)
  announcement?: AnnouncementDto;

  @ApiPropertyOptional({
    type: LeaderDto,
    description: 'Leader quote, message, role and avatar',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LeaderDto)
  leader?: LeaderDto;

  @ApiPropertyOptional({
    example: {
      staff: 1500,
      experts: 250,
      provinces: 30,
      projects: 100,
    },
    description: 'Key-value statistics of the organization (legacy)',
  })
  @IsOptional()
  @IsObject()
  stats?: Record<string, any>;

  @ApiPropertyOptional({
    type: [StatItemDto],
    description:
      'Detailed list of network statistics with labels and descriptions',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatItemDto)
  statsList?: StatItemDto[];

  @ApiPropertyOptional({
    example: {
      facebook: 'https://www.facebook.com/VDCDGIALAI',
      tiktok: 'https://www.tiktok.com/@vdcdgialai',
      zalo: 'https://zalo.me/0373600099',
      hotline: '0373600099',
      email: 'dmstgialai@vdcd.vn',
    },
    description: 'Social media links of the organization',
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, any>;

  @ApiPropertyOptional({
    type: [OperationFieldItemDto],
    description:
      'Operation fields displayed on the About Us page (Lĩnh vực hoạt động)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperationFieldItemDto)
  operationFields?: OperationFieldItemDto[];

  @ApiPropertyOptional({
    example:
      'Trung tâm kế thừa năng lực công nghệ, đội ngũ chuyên gia và mạng lưới triển khai của hệ sinh thái VDCD Group...',
    description:
      'Ecosystem capabilities inherited from VDCD (Năng lực kế thừa)',
  })
  @IsOptional()
  @IsString()
  ecosystemCapabilities?: string;

  @ApiPropertyOptional({
    type: [EcosystemMemberItemDto],
    description: 'Ecosystem member units / centers (Thành viên hệ sinh thái)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EcosystemMemberItemDto)
  ecosystemMembers?: EcosystemMemberItemDto[];

  @ApiPropertyOptional({
    type: [DevelopmentOrientationItemDto],
    description: 'Development orientations (Định hướng phát triển)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevelopmentOrientationItemDto)
  developmentOrientations?: DevelopmentOrientationItemDto[];

  @ApiPropertyOptional({
    type: CtaSectionDto,
    description: 'Call-to-action bottom block (Chuyển đổi số tương lai)',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CtaSectionDto)
  ctaSection?: CtaSectionDto;
}
