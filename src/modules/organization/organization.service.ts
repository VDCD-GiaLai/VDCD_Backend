// src/modules/organization/organization.service.ts
import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

const DEFAULT_ECOSYSTEM_MEMBERS = [
  {
    id: 'trung-tam-ban-do-so',
    title: 'Trung tâm Bản đồ số',
    slug: 'trung-tam-ban-do-so',
    description:
      'Cung cấp các dịch vụ bay quét 3D, trắc địa số hóa và thành lập bản đồ địa hình độ chính xác cao bằng máy bay không người lái.',
    imageUrl: 'https://vdcd.vn/wp-content/uploads/2024/03/5-768x431.jpg',
    websiteUrl:
      'https://vietflycam.vn/dich-vu/bay-quet-3d-trac-dia-so-va-thanh-lap-ban-do',
    order: 1,
  },
  {
    id: 'vien-thiet-ke-so',
    title: 'Viện Thiết Kế Số',
    slug: 'vien-thiet-ke-so',
    description:
      'Nghiên cứu, phát triển ứng dụng mô hình thông tin công trình (BIM) và các giải pháp thiết kế số trong lĩnh vực xây dựng, kiến trúc.',
    imageUrl:
      'https://vdcd.vn/wp-content/uploads/2024/03/picture1_8463e044ab0c465da2d031f6af1a4c5f_master-768x768.png',
    websiteUrl: 'https://bimv.vn/',
    order: 2,
  },
  {
    id: 'trung-tam-giam-sat-so',
    title: 'Trung Tâm Giám Sát Số',
    slug: 'trung-tam-giam-sat-so',
    description:
      'Cung cấp hệ thống Auto Timelapse giám sát thông minh tiến độ xây dựng công trình, nông nghiệp và môi trường một cách tự động, trực quan.',
    imageUrl: 'https://vdcd.vn/wp-content/uploads/2024/03/3123-768x512.jpg',
    websiteUrl: 'https://autotimelapse.com',
    order: 3,
  },
  {
    id: 'trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai',
    title: 'Trung tâm dữ liệu siêu máy tính và đào tạo AI',
    slug: 'trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai',
    description:
      'Xây dựng hạ tầng tính toán hiệu năng cao (HPC) và tổ chức các chương trình đào tạo trí tuệ nhân tạo chuyên sâu phục vụ chuyển đổi số doanh nghiệp.',
    imageUrl:
      'https://vdcd.vn/wp-content/uploads/2025/10/z7173282299491_651f9e392555944f94acd55dab050480-768x576.jpg',
    websiteUrl:
      'https://vdcd.vn/services/trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai/',
    order: 4,
  },
  {
    id: 'vien-nghien-cuu-cong-nghe-khong-gian-va-duoi-nuoc',
    title: 'Viện Nghiên cứu công nghệ không gian và dưới nước',
    slug: 'vien-nghien-cuu-cong-nghe-khong-gian-va-duoi-nuoc',
    description:
      'Nghiên cứu và ứng dụng các công nghệ tiên tiến trong không gian vũ trụ và thám hiểm, đo đạc môi trường dưới nước.',
    imageUrl:
      'https://vdcd.vn/wp-content/uploads/2025/10/Vien-khong-gian-va-duoi-nuoc-BK-768x499.jpg',
    websiteUrl: 'https://iig.vn',
    order: 5,
  },
  {
    id: 'trung-tam-phan-mem-vdcd-soft',
    title: 'Trung tâm phần mềm VDCD – Soft',
    slug: 'trung-tam-phan-mem-vdcd-soft',
    description:
      'Phát triển các phần mềm quản lý doanh nghiệp, giải pháp chuyển đổi số chuyên sâu phục vụ hệ sinh thái kinh tế vùng và cả nước.',
    imageUrl:
      'https://vdcd.vn/wp-content/uploads/2024/03/Untitled-1-01-1-768x768.png',
    websiteUrl: 'https://vdcd.vn',
    order: 6,
  },
  {
    id: 'trung-tam-doi-moi-sang-tao-tinh',
    title: 'Trung Tâm Đổi Mới Sáng Tạo Tỉnh',
    slug: 'trung-tam-doi-moi-sang-tao-tinh',
    description:
      'Hỗ trợ ươm tạo khởi nghiệp, phát triển ý tưởng sáng tạo và thúc đẩy chuyển giao công nghệ tại địa phương.',
    imageUrl:
      'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited-768x576.jpg',
    websiteUrl: 'https://vdcd.vn',
    order: 7,
  },
  {
    id: 'trung-tam-chuyen-giao-cong-nghe',
    title: 'Trung Tâm Chuyển giao Công Nghệ',
    slug: 'trung-tam-chuyen-giao-cong-nghe',
    description:
      'Cầu nối chuyển giao các công nghệ tiên tiến từ viện nghiên cứu, trường đại học đến các doanh nghiệp địa phương ứng dụng thực tiễn.',
    imageUrl:
      'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-chuyen-giao-cong-nghe-02-1-768x512.jpg',
    websiteUrl: 'https://vdcd.vn',
    order: 8,
  },
  {
    id: 'may-bay-viet',
    title: 'Máy Bay Việt',
    slug: 'may-bay-viet',
    description:
      'Đơn vị cung cấp giải pháp máy bay không người lái phục vụ nông nghiệp thông minh, khảo sát công nghiệp và quay chụp chuyên nghiệp.',
    imageUrl:
      'https://vdcd.vn/wp-content/uploads/2024/03/may-bay-khong-nguoi-lai-phun-thuoc-1.jpg',
    websiteUrl: 'https://maybayviet.vn',
    order: 9,
  },
  {
    id: 'trung-tam-phat-trien-robot-ai',
    title: 'Trung tâm phát triển Robot & AI',
    slug: 'trung-tam-phat-trien-robot-ai',
    description:
      'Nghiên cứu chế tạo các hệ thống cánh tay robot tự động hóa, xe tự hành (AGV) kết hợp trí tuệ nhân tạo nhận diện hình ảnh và tối ưu vận hành.',
    imageUrl: 'https://vdcd.vn/wp-content/uploads/2024/03/123-768x512.jpg',
    websiteUrl: 'https://vdcd.vn',
    order: 10,
  },
  {
    id: 'trung-tam-san-xuat-phim',
    title: 'Trung Tâm Sản Xuất Phim',
    slug: 'trung-tam-san-xuat-phim',
    description:
      'Sản xuất video clip giới thiệu dự án, quay phim khảo sát, flycam sự kiện chuyên nghiệp với trang thiết bị hiện đại hàng đầu.',
    imageUrl: 'https://vdcd.vn/wp-content/uploads/2024/03/4-768x512.jpg',
    websiteUrl: 'https://vdcd.vn',
    order: 11,
  },
  {
    id: 'trung-tam-nghien-cuu-va-phat-trien-san-pham-rd',
    title: 'Trung tâm nghiên cứu và phát triển sản phẩm R&D',
    slug: 'trung-tam-nghien-cuu-va-phat-trien-san-pham-rd',
    description:
      'Đội ngũ chuyên gia chuyên nghiên cứu phát triển các sản phẩm phần cứng và giải pháp công nghệ mới bắt kịp xu hướng thế giới.',
    imageUrl: 'https://vdcd.vn/wp-content/uploads/2024/03/44-768x432.jpg',
    websiteUrl: 'https://vdcd.vn',
    order: 12,
  },
];

const DEFAULT_STATS_LIST = [
  {
    key: 'staff',
    value: '1500+',
    label: 'Nhân sự',
    description: 'Đội ngũ chuyên môn cao, đáp ứng triển khai dự án quy mô lớn',
    icon: 'users',
  },
  {
    key: 'experts',
    value: '250+',
    label: 'Chuyên gia',
    description: 'Năng lực R&D phần cứng, GIS, AI và chuyển đổi số',
    icon: 'award',
  },
  {
    key: 'projects',
    value: '100+',
    label: 'Dự án',
    description: 'Tham gia trực tiếp triển khai các dự án quy mô toàn quốc',
    icon: 'briefcase',
  },
  {
    key: 'provinces',
    value: '30+',
    label: 'Tỉnh thành',
    description:
      'Mạng lưới phục vụ thực địa rộng khắp các tỉnh thành toàn quốc',
    icon: 'map-pin',
  },
];

const DEFAULT_CORE_VALUES_LIST = [
  {
    title: 'Sáng tạo',
    description:
      'Không ngừng đổi mới tư duy và tiên phong phát triển giải pháp công nghệ hiện đại',
    icon: 'lightbulb',
  },
  {
    title: 'Chính trực',
    description:
      'Minh bạch, trung thực và đặt đạo đức nghề nghiệp lên hàng đầu trong mọi hoạt động',
    icon: 'shield-check',
  },
  {
    title: 'Hợp tác',
    description:
      'Kết nối mạng lưới đa bên, đồng hành chia sẻ giá trị cùng đối tác và khách hàng',
    icon: 'handshake',
  },
  {
    title: 'Tác động',
    description:
      'Kiến tạo những giá trị thực tiễn, bền vững cho cộng đồng và kinh tế xã hội địa phương',
    icon: 'trending-up',
  },
];

const DEFAULT_LEADER = {
  name: '',
  role: 'Phó Chủ tịch HĐQT kiêm Tổng Giám đốc',
  quote:
    'Chúng tôi không bắt đầu từ những điều quá cao siêu. Chúng tôi bắt đầu từ những khó khăn thực tế của người dân, cơ quan quản lý và doanh nghiệp, để đưa công nghệ vào giải quyết những vấn đề thiết thực và góp phần nâng cao chất lượng cuộc sống.',
  avatarUrl: '',
  avatarFileId: '',
  ctaText: 'Xem thông tin lãnh đạo',
  ctaLink: '/leadership',
};

const DEFAULT_ANNOUNCEMENT = {
  text: 'Hội nghị Xúc tiến đầu tư tỉnh Gia Lai năm 2026 diễn ra vào ngày 28/3/2026 tại Trung tâm Hội nghị tỉnh (số 01 Nguyễn Tất Thành, phường Quy Nhơn)',
  link: '',
  isActive: true,
};

const DEFAULT_CTA_SECTION = {
  badge: 'Tầm nhìn & Sứ mệnh',
  title: 'CHUYỂN ĐỔI SỐ TƯƠNG LAI CỦA BẠN',
  description:
    'Hãy liên hệ với chúng tôi để thiết kế các giải pháp công nghệ tối ưu nhất dành riêng cho doanh nghiệp, cơ quan của bạn tại địa bàn tỉnh.',
  buttonText: 'Liên hệ hợp tác',
  buttonLink: '/contact',
  secondaryButtonText: 'Khám phá giải pháp',
  secondaryButtonLink: '#',
  subtext: 'Kiến tạo tương lai số bền vững cho doanh nghiệp và cộng đồng.',
};

const DEFAULT_DEVELOPMENT_ORIENTATIONS = [
  {
    title: 'Phát triển hạ tầng dữ liệu và công nghệ dùng chung',
    description:
      'Lập mô hình 3D số hóa không gian, chuẩn hóa hệ thống GIS và vận hành điện toán mây phục vụ dữ liệu số toàn tỉnh.',
    icon: 'database',
    order: 1,
  },
  {
    title: 'Thúc đẩy ứng dụng công nghệ trong các ngành kinh tế chủ lực',
    description:
      'Cung cấp hệ thống giám sát IOC/DOC, tự động hóa AutoTimelapse và nền tảng Digital Twin hỗ trợ quản trị và vận hành.',
    icon: 'cpu',
    order: 2,
  },
  {
    title: 'Hỗ trợ startup và doanh nghiệp đổi mới mô hình hoạt động',
    description:
      'Xây dựng mạng lưới liên kết giữa cơ quan quản lý, viện nghiên cứu, tập đoàn công nghệ và quỹ đầu tư trong nước.',
    icon: 'rocket',
    order: 3,
  },
  {
    title:
      'Kết nối Gia Lai với mạng lưới chuyên gia, công nghệ và đầu tư trong nước',
    description:
      'Đào tạo nhân lực số chất lượng cao, tư vấn chuyển đổi số và chuyển giao giải pháp cho doanh nghiệp địa phương.',
    icon: 'globe',
    order: 4,
  },
];

const DEFAULT_OPERATION_FIELDS = [
  {
    title: 'Công nghệ số & Chuyển đổi số',
    description:
      'Nghiên cứu phát triển và tích hợp các giải pháp trí tuệ nhân tạo (AI), Internet vạn vật (IoT), dữ liệu lớn (Big Data), điện toán đám mây (Cloud) và mô hình hóa thông tin số (Digital Twin) phục vụ tối ưu hóa vận hành.',
    icon: 'cpu',
    order: 1,
  },
  {
    title: 'Khảo sát, Đo đạc & Số hóa bản đồ',
    description:
      'Thành lập bản đồ địa hình và hiện trạng độ phân giải siêu cao sử dụng thiết bị bay không người lái (UAV/Drone). Số hóa cơ sở dữ liệu đất đai, lâm nghiệp và hạ tầng kỹ thuật chính xác.',
    icon: 'map',
    order: 2,
  },
  {
    title: 'Giải pháp hạ tầng thông minh',
    description:
      'Thiết kế, xây dựng và tích hợp hệ thống trung tâm điều hành thông minh (IOC/DOC), giải pháp đô thị thông minh (Smart City) và hệ thống giám sát tự động AutoTimelapse.',
    icon: 'layers',
    order: 3,
  },
  {
    title: 'Sản xuất & Chế tạo thiết bị công nghệ',
    description:
      'Chế tạo các thiết bị robot công nghiệp, lắp ráp các hệ thống thiết bị bay không người lái (Drone/UAV) chuyên dụng, camera AI thông minh và phần cứng IoT phục vụ đa lĩnh vực.',
    icon: 'tool',
    order: 4,
  },
];

@Injectable()
export class OrganizationService implements OnModuleInit {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    @InjectRepository(Organization)
    private repo: Repository<Organization>,
    @Optional()
    private readonly uploadService?: UploadService,
  ) {}

  async onModuleInit() {
    await this.ensureSchema();
    await this.ensureDefaults();
  }

  /**
   * Self-healing migration check: safely ensures all new columns exist in database.
   */
  private async ensureSchema() {
    try {
      await this.repo.query(`
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "short_name" character varying(100);
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "email" character varying(255);
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "hotline" character varying(50);
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "announcement" jsonb;
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "leader" jsonb;
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "stats_list" jsonb;
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "core_values_list" jsonb;
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "ecosystem_members" jsonb;
        ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "cta_section" jsonb;
      `);
      this.logger.log(
        'Organization schema columns verified/updated successfully.',
      );
    } catch (err) {
      this.logger.warn(`Failed to verify organization schema: ${err.message}`);
    }
  }

  /**
   * Initializes default data for about-us fields if they are currently null or empty.
   */
  private async ensureDefaults() {
    try {
      const orgs = await this.repo.find({ take: 1 });
      if (!orgs.length) {
        const defaultOrg = this.repo.create({
          name: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
          shortName: 'VDCD Gia Lai',
          tagline: 'Kết nối – Sáng tạo – Phát triển',
          businessLicenseNo: '4101443823',
          description: `Trung tâm Đổi mới Sáng tạo Gia Lai, là mô hình xã hội hóa do doanh nghiệp đầu tư và vận hành. Trung tâm được hình thành nhằm kết nối nguồn lực công nghệ, chuyên gia, doanh nghiệp và dữ liệu; thúc đẩy ứng dụng công nghệ, chuyển đổi số và phát triển hệ sinh thái khởi nghiệp sáng tạo tại địa phương.\n\nVới định hướng lấy nhu cầu thực tiễn làm trung tâm, Trung tâm không chỉ là không gian kết nối mà còn trực tiếp đồng hành trong quá trình tư vấn, thử nghiệm, đào tạo, chuyển giao và triển khai công nghệ.`,
          mission:
            'Thúc đẩy đổi mới sáng tạo, chuyển đổi số và phát triển bền vững cho tỉnh Gia Lai và khu vực Tây Nguyên.',
          vision:
            'Trở thành trung tâm đổi mới sáng tạo hàng đầu khu vực Tây Nguyên vào năm 2030.',
          coreValues: 'Sáng tạo – Chính trực – Hợp tác – Tác động',
          coreValuesList: DEFAULT_CORE_VALUES_LIST,
          foundedYear: 2020,
          address: 'Số 226 Đống Đa, Phường Quy Nhơn, Tỉnh Gia Lai',
          email: 'dmstgialai@vdcd.vn',
          hotline: '0373600099',
          announcement: DEFAULT_ANNOUNCEMENT,
          leader: DEFAULT_LEADER,
          stats: { staff: 1500, experts: 250, projects: 100, provinces: 30 },
          statsList: DEFAULT_STATS_LIST,
          socialLinks: {
            facebook: 'https://www.facebook.com/VDCDGIALAI',
            tiktok: 'https://www.tiktok.com/@vdcdgialai',
            zalo: 'https://zalo.me/0373600099',
            hotline: '0373600099',
            email: 'dmstgialai@vdcd.vn',
            messenger: 'https://www.messenger.com/t/888742211000071',
          },
          operationFields: DEFAULT_OPERATION_FIELDS,
          ecosystemCapabilities:
            'Trung tâm kế thừa năng lực công nghệ, đội ngũ chuyên gia và mạng lưới triển khai của hệ sinh thái VDCD Group trong các lĩnh vực khảo sát, dữ liệu không gian, trí tuệ nhân tạo, mô hình thông tin công trình, hạ tầng dữ liệu và phần mềm quản lý.',
          ecosystemMembers: DEFAULT_ECOSYSTEM_MEMBERS,
          developmentOrientations: DEFAULT_DEVELOPMENT_ORIENTATIONS,
          ctaSection: DEFAULT_CTA_SECTION,
        });
        await this.repo.save(defaultOrg);
        this.logger.log(
          'Created default organization record with comprehensive about-us data.',
        );
        return;
      }

      const org = orgs[0];
      let needsSave = false;

      if (!org.shortName) {
        org.shortName = 'VDCD Gia Lai';
        needsSave = true;
      }

      if (!org.email && org.socialLinks?.email) {
        org.email = org.socialLinks.email;
        needsSave = true;
      }

      if (!org.hotline && org.socialLinks?.hotline) {
        org.hotline = org.socialLinks.hotline;
        needsSave = true;
      }

      if (!org.announcement) {
        org.announcement = DEFAULT_ANNOUNCEMENT;
        needsSave = true;
      }

      if (!org.leader) {
        org.leader = DEFAULT_LEADER;
        needsSave = true;
      }

      if (!org.statsList || !org.statsList.length) {
        org.statsList = DEFAULT_STATS_LIST;
        needsSave = true;
      }

      if (!org.coreValuesList || !org.coreValuesList.length) {
        org.coreValuesList = DEFAULT_CORE_VALUES_LIST;
        needsSave = true;
      }

      if (!org.ecosystemMembers || !org.ecosystemMembers.length) {
        org.ecosystemMembers = DEFAULT_ECOSYSTEM_MEMBERS;
        needsSave = true;
      }

      if (!org.ctaSection) {
        org.ctaSection = DEFAULT_CTA_SECTION;
        needsSave = true;
      }

      // If development orientations have empty descriptions, fill with rich defaults
      if (
        org.developmentOrientations &&
        org.developmentOrientations.length &&
        org.developmentOrientations.some((d) => !d.description)
      ) {
        org.developmentOrientations = DEFAULT_DEVELOPMENT_ORIENTATIONS;
        needsSave = true;
      }

      // If operation fields are empty, fill with default operation fields
      if (!org.operationFields || !org.operationFields.length) {
        org.operationFields = DEFAULT_OPERATION_FIELDS;
        needsSave = true;
      }

      if (needsSave) {
        await this.repo.save(org);
        this.logger.log(
          'Updated existing organization with default about-us fields.',
        );
      }
    } catch (err) {
      this.logger.warn(`Failed to seed organization defaults: ${err.message}`);
    }
  }

  async get(): Promise<Organization> {
    const orgs = await this.repo.find({ take: 1 });
    if (!orgs.length) {
      const org = this.repo.create({
        name: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
        shortName: 'VDCD Gia Lai',
      });
      return this.repo.save(org);
    }
    return orgs[0];
  }

  async update(dto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.get();

    // Bi-directional synchronization for stats and statsList
    if (dto.statsList && dto.statsList.length) {
      if (!dto.stats) {
        const statsObj: Record<string, any> = { ...(org.stats || {}) };
        for (const item of dto.statsList) {
          if (item.key) {
            const num = parseInt(item.value.replace(/[^0-9]/g, ''), 10);
            statsObj[item.key] = isNaN(num) ? item.value : num;
          }
        }
        org.stats = statsObj;
      }
    }

    // Keep email and hotline in socialLinks synchronized
    if (dto.email || dto.hotline) {
      org.socialLinks = {
        ...(org.socialLinks || {}),
        ...(dto.email ? { email: dto.email } : {}),
        ...(dto.hotline ? { hotline: dto.hotline } : {}),
      };
    }

    if (this.uploadService) {
      if (dto.announcement?.imageFileId) {
        await this.uploadService.confirmUpload(dto.announcement.imageFileId);
      }
      const oldAnnouncementFileId = org.announcement?.imageFileId;
      if (
        oldAnnouncementFileId &&
        dto.announcement !== undefined &&
        oldAnnouncementFileId !== dto.announcement?.imageFileId
      ) {
        await this.uploadService.deleteFile(oldAnnouncementFileId);
      }

      if (dto.leader?.avatarFileId) {
        await this.uploadService.confirmUpload(dto.leader.avatarFileId);
      }
      const oldLeaderFileId = org.leader?.avatarFileId;
      if (
        oldLeaderFileId &&
        dto.leader !== undefined &&
        oldLeaderFileId !== dto.leader?.avatarFileId
      ) {
        await this.uploadService.deleteFile(oldLeaderFileId);
      }
    }

    Object.assign(org, dto);
    return this.repo.save(org);
  }
}
