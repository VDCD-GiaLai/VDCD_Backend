import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

import { AdminUser } from '../../modules/admin-user/entities/admin-user.entity';
import { Organization } from '../../modules/organization/entities/organization.entity';
import { OperationField } from '../../modules/operation-field/entities/operation-field.entity';
import { Province } from '../../modules/province/entities/province.entity';
import { Slide } from '../../modules/slide/entities/slide.entity';
import { Program } from '../../modules/program/entities/program.entity';
import { Solution } from '../../modules/solution/entities/solution.entity';
import { Project } from '../../modules/project/entities/project.entity';
import { ProjectImage } from '../../modules/project/entities/project-image.entity';
import { Article } from '../../modules/article/entities/article.entity';
import { Job } from '../../modules/job/entities/job.entity';
import { UploadTemp } from '../../modules/upload/entities/upload-temp.entity';
import { Lead } from '../../modules/lead/entities/lead.entity';
import { Partner } from '../../modules/partner/entities/partner.entity';
import { PageBanner } from '../../modules/page-banner/entities/page-banner.entity';
import { convertHtmlToBlocks } from '../../modules/article/utils/html-to-blocks.util';
import { PROJECTS_DATA } from './project.data';

dotenv.config({ path: '.env.development' });
dotenv.config({ path: '.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    AdminUser,
    Organization,
    OperationField,
    Province,
    Partner,
    Slide,
    PageBanner,
    Program,
    Solution,
    Project,
    ProjectImage,
    Article,
    Job,
    UploadTemp,
    Lead,
  ],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Connected to database');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('🧹 Clearing existing data...');
    // Xoá theo thứ tự ngược dependency
    await queryRunner.query('TRUNCATE TABLE article CASCADE');
    await queryRunner.query('TRUNCATE TABLE project_image CASCADE');
    await queryRunner.query('TRUNCATE TABLE project CASCADE');
    await queryRunner.query('TRUNCATE TABLE lead CASCADE');
    await queryRunner.query('TRUNCATE TABLE solution CASCADE');
    await queryRunner.query('TRUNCATE TABLE program CASCADE');
    await queryRunner.query('TRUNCATE TABLE slide CASCADE');
    await queryRunner.query('TRUNCATE TABLE page_banner CASCADE');
    await queryRunner.query('TRUNCATE TABLE partner CASCADE');
    await queryRunner.query('TRUNCATE TABLE province CASCADE');
    await queryRunner.query('TRUNCATE TABLE operation_field CASCADE');
    await queryRunner.query('TRUNCATE TABLE organization CASCADE');
    await queryRunner.query('TRUNCATE TABLE admin_user CASCADE');
    await queryRunner.query('TRUNCATE TABLE job CASCADE');
    await queryRunner.query('TRUNCATE TABLE lead CASCADE');
    await queryRunner.query('TRUNCATE TABLE upload_temp CASCADE');
    await queryRunner.query('TRUNCATE TABLE contact CASCADE');

    // ── 1. Admin Users ─────────────────────────────────────────────
    console.log('👤 Seeding admin users...');
    const adminRepo = queryRunner.manager.getRepository(AdminUser);
    const users = await adminRepo.save([
      adminRepo.create({
        username: 'superadmin',
        email: 'superadmin@vdcd.vn',
        passwordHash: await bcrypt.hash('Admin@123456', 12),
        role: 'superadmin',
        isActive: true,
      }),
      adminRepo.create({
        username: 'editor',
        email: 'editor@vdcd.vn',
        passwordHash: await bcrypt.hash('Editor@123456', 12),
        role: 'editor',
        isActive: true,
      }),
      adminRepo.create({
        username: 'viewer',
        email: 'viewer@vdcd.vn',
        passwordHash: await bcrypt.hash('Viewer@123456', 12),
        role: 'viewer',
        isActive: true,
      }),
    ]);
    console.log(`  → ${users.length} admin users`);

    // ── 2. Organization ────────────────────────────────────────────
    console.log('🏢 Seeding organization...');
    const orgRepo = queryRunner.manager.getRepository(Organization);
    await orgRepo.save(
      orgRepo.create({
        // ── Khối 1: Giới thiệu chung ──
        name: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
        tagline: 'Kết nối – Sáng tạo – Phát triển',
        businessLicenseNo: '4101443823',
        description: `Trung tâm Đổi mới Sáng tạo Gia Lai, là mô hình xã hội hóa do doanh nghiệp đầu tư và vận hành. Trung tâm được hình thành nhằm kết nối nguồn lực công nghệ, chuyên gia, doanh nghiệp và dữ liệu; thúc đẩy ứng dụng công nghệ, chuyển đổi số và phát triển hệ sinh thái khởi nghiệp sáng tạo tại địa phương.\n\nVới định hướng lấy nhu cầu thực tiễn làm trung tâm, Trung tâm không chỉ là không gian kết nối mà còn trực tiếp đồng hành trong quá trình tư vấn, thử nghiệm, đào tạo, chuyển giao và triển khai công nghệ.`,
        foundedYear: 2020,
        address: 'Số 226 Đống Đa, Phường Quy Nhơn, Tỉnh Gia Lai',

        // ── Khối 2: Sứ mệnh, Tầm nhìn, Giá trị cốt lõi ──
        mission:
          'Thúc đẩy đổi mới sáng tạo, chuyển đổi số và phát triển bền vững cho tỉnh Gia Lai và khu vực Tây Nguyên.',
        vision:
          'Trở thành trung tâm đổi mới sáng tạo hàng đầu khu vực Tây Nguyên vào năm 2030.',
        coreValues: 'Sáng tạo – Chính trực – Hợp tác – Tác động',

        // ── Khối 3: Mạng lưới (Thống kê) ──
        stats: {
          staff: 1500,
          experts: 250,
          provinces: 30,
          projects: 100,
        },

        // ── Khối 4: Lĩnh vực hoạt động ──
        operationFields: [
          {
            title: 'Công nghệ số & Chuyển đổi số',
            description:
              'Nghiên cứu phát triển và tích hợp các giải pháp trí tuệ nhân tạo (AI), Internet vạn vật (IoT), dữ liệu lớn (Big Data), điện toán đám mây (Cloud) và mô hình hóa thông tin số (Digital Twin) phục vụ tối ưu hóa vận hành.',
          },
          {
            title: 'Khảo sát, Đo đạc & Số hóa bản đồ',
            description:
              'Thành lập bản đồ địa hình và hiện trạng độ phân giải siêu cao sử dụng thiết bị bay không người lái (UAV/Drone). Số hóa cơ sở dữ liệu đất đai, lâm nghiệp và hạ tầng kỹ thuật chính xác.',
          },
          {
            title: 'Giải pháp hạ tầng thông minh',
            description:
              'Thiết kế, xây dựng và tích hợp hệ thống trung tâm điều hành thông minh (IOC/DOC), giải pháp đô thị thông minh (Smart City) và hệ thống giám sát tự động AutoTimelapse.',
          },
          {
            title: 'Sản xuất & Chế tạo thiết bị công nghệ',
            description:
              'Chế tạo các thiết bị robot công nghiệp, lắp ráp các hệ thống thiết bị bay không người lái (Drone/UAV) chuyên dụng, camera AI thông minh và phần cứng IoT phục vụ đa lĩnh vực.',
          },
        ],

        // ── Khối 5: Năng lực kế thừa từ hệ sinh thái VDCD ──
        ecosystemCapabilities:
          'Trung tâm kế thừa năng lực công nghệ, đội ngũ chuyên gia và mạng lưới triển khai của hệ sinh thái VDCD Group trong các lĩnh vực khảo sát, dữ liệu không gian, trí tuệ nhân tạo, mô hình thông tin công trình, hạ tầng dữ liệu và phần mềm quản lý.',

        // ── Khối 6: Định hướng phát triển ──
        developmentOrientations: [
          {
            title: 'Phát triển hạ tầng dữ liệu và công nghệ dùng chung',
            description: '',
          },
          {
            title:
              'Thúc đẩy ứng dụng công nghệ trong các ngành kinh tế chủ lực',
            description: '',
          },
          {
            title: 'Hỗ trợ startup và doanh nghiệp đổi mới mô hình hoạt động',
            description: '',
          },
          {
            title:
              'Kết nối Gia Lai với mạng lưới chuyên gia, công nghệ và đầu tư trong nước',
            description: '',
          },
        ],

        // ── Social Links ──
        socialLinks: {
          facebook: 'https://www.facebook.com/VDCDGIALAI',
          tiktok: 'https://www.tiktok.com/@vdcdgialai',
          zalo: 'https://zalo.me/0373600099',
          hotline: '0373600099',
          email: 'dmstgialai@vdcd.vn',
          messenger: 'https://www.messenger.com/t/888742211000071',
        },
      }),
    );
    console.log('   → 1 organization');

    // ── 3. Operation Fields ────────────────────────────────────────
    console.log('📂 Seeding operation fields...');
    const fieldRepo = queryRunner.manager.getRepository(OperationField);
    const fieldData = [
      {
        name: 'Nông nghiệp công nghệ cao',
        slug: 'nong-nghiep-cong-nghe-cao',
        icon: 'leaf',
      },
      { name: 'Chuyển đổi số', slug: 'chuyen-doi-so', icon: 'cpu' },
      {
        name: 'Giáo dục & Đào tạo',
        slug: 'giao-duc-dao-tao',
        icon: 'graduation-cap',
      },
      { name: 'Y tế & Sức khỏe', slug: 'y-te-suc-khoe', icon: 'heart-pulse' },
      { name: 'Du lịch thông minh', slug: 'du-lich-thong-minh', icon: 'map' },
      { name: 'Năng lượng tái tạo', slug: 'nang-luong-tai-tao', icon: 'zap' },
    ];
    const fields = await fieldRepo.save(
      fieldData.map((f, i) =>
        fieldRepo.create({
          ...f,
          shortDescription: `Lĩnh vực ${f.name} – thúc đẩy đổi mới sáng tạo và ứng dụng công nghệ hiện đại.`,
          order: i,
        }),
      ),
    );
    console.log(`   → ${fields.length} operation fields`);

    // ── 4. Provinces ───────────────────────────────────────────────
    console.log('🗺️  Seeding provinces...');
    const provinceRepo = queryRunner.manager.getRepository(Province);
    const provinceData = [
      { name: 'Gia Lai', code: 'GL', hasProject: true, centerCount: 3 },
      { name: 'Đắk Lắk', code: 'DL', hasProject: true, centerCount: 2 },
      { name: 'Kon Tum', code: 'KT', hasProject: true, centerCount: 1 },
      { name: 'Đắk Nông', code: 'DN', hasProject: true, centerCount: 1 },
      { name: 'Lâm Đồng', code: 'LD', hasProject: true, centerCount: 2 },
      { name: 'Bình Định', code: 'BD', hasProject: true, centerCount: 1 },
      { name: 'Phú Yên', code: 'PY', hasProject: false, centerCount: 0 },
      { name: 'Khánh Hòa', code: 'KH', hasProject: false, centerCount: 0 },
      { name: 'Quảng Ngãi', code: 'QN', hasProject: true, centerCount: 1 },
      { name: 'Quảng Nam', code: 'QNA', hasProject: false, centerCount: 0 },
      {
        name: 'Thừa Thiên Huế',
        code: 'TTH',
        hasProject: false,
        centerCount: 0,
      },
      { name: 'Hà Nội', code: 'HN', hasProject: true, centerCount: 1 },
      {
        name: 'TP. Hồ Chí Minh',
        code: 'HCM',
        hasProject: true,
        centerCount: 2,
      },
      { name: 'Đà Nẵng', code: 'DNG', hasProject: true, centerCount: 1 },
    ];
    const provinces = await provinceRepo.save(
      provinceData.map((p) => provinceRepo.create(p)),
    );
    console.log(`   → ${provinces.length} provinces`);

    // ── 5. Partners ────────────────────────────────────────────────
    console.log('🤝 Seeding partners...');
    const partnerRepo = queryRunner.manager.getRepository(Partner);
    const partnerData = [
      { name: 'VTV', logo: 'https://vdcd.vn/wp-content/uploads/2025/11/1.png' },
      {
        name: 'Lotte',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/3.png',
      },
      {
        name: 'Sungroup',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/1-1.png',
      },
      {
        name: 'Samsung',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/4.png',
      },
      {
        name: 'Petrolimex',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/5.png',
      },
      {
        name: 'VinGroup',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/6.png',
      },
      {
        name: 'Hòa Phát',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/7.png',
      },
      { name: 'FLC', logo: 'https://vdcd.vn/wp-content/uploads/2025/11/8.png' },
      {
        name: 'Đường sắt Việt Nam',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/9.png',
      },
      {
        name: 'Phúc Lộc',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/2.png',
      },
      {
        name: 'Silk Path',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/10.png',
      },
      {
        name: 'Hòa Bình',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/12.png',
      },
      {
        name: 'Six Senses',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/13.png',
      },
      {
        name: 'DELTA',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/15.png',
      },
      {
        name: 'GIZA',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/17.png',
      },
      {
        name: 'Tân Á Đại Thành',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/18.png',
      },
      {
        name: 'Hoàng Thịnh Đạt',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/19.png',
      },
      {
        name: 'NOVA Land',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/20.png',
      },
      {
        name: 'NOVASIA Energy',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/21.png',
      },
      {
        name: 'Tuần Châu',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/22.png',
      },
      {
        name: 'CIENCO8',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/3-1.png',
      },
      {
        name: 'Flamingo',
        logo: 'https://vdcd.vn/wp-content/uploads/2025/11/4-1.png',
      },
    ];
    const partners = await partnerRepo.save(
      partnerData.map((p, i) =>
        partnerRepo.create({
          name: p.name,
          logo: p.logo,
          logoFileId: `partner-logo-${i + 1}`,
          websiteUrl: `https://vdcd.vn`,
          order: i,
          isActive: true,
        }),
      ),
    );
    console.log(`   → ${partners.length} partners`);

    // ── 6. Slides ──────────────────────────────────────────────────
    console.log('🖼️  Seeding slides...');
    const slideRepo = queryRunner.manager.getRepository(Slide);
    const slideData = [
      {
        title: 'PHÁT TRIỂN ĐỊA PHƯƠNG',
        subtitle: 'TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI',
        description:
          'Nghiên cứu, chuyển giao và ứng dụng công nghệ số nhằm hỗ trợ chính quyền, doanh nghiệp và cộng đồng trong hành trình chuyển đổi số và đổi mới sáng tạo.',
        ctaText: 'Tìm hiểu thêm',
        ctaUrl: '/#',
        imageUrl:
          'https://ik.imagekit.io/huy01040104/vdcd/slides/81B72404-9A7A-4E02-B5C6-4D8AA67AF50F.PNG',
      },
      {
        title: 'ĐÔ THỊ THÔNG MINH',
        subtitle: 'TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI',
        description:
          'Tích hợp Camera AI, UAV, AutoTimelapse, nền tảng 3DGIS hoặc Autotimelaspe PRO để giám sát, phân tích dữ liệu và hỗ trợ điều hành đô thị theo thời gian thực.',
        ctaText: 'Tìm hiểu thêm',
        ctaUrl: '/#',
        imageUrl:
          'https://ik.imagekit.io/huy01040104/vdcd/slides/quynhon_herobanner.jpg',
      },
      {
        title: 'XÂY DỰNG CƠ SỞ DỮ LIỆU',
        subtitle: 'TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI',
        description:
          'Ứng dụng UAV, AI và nền tảng 3DGIS để khảo sát, thành lập bản đồ 2D/3D, xây dựng cơ sở dữ liệu và quản lý đất đai phục vụ quy hoạch, quản lý và chuyển đổi số.',
        ctaText: 'Tìm hiểu thêm',
        ctaUrl: '/#',
        imageUrl:
          'https://ik.imagekit.io/huy01040104/vdcd/slides/hethongdothiso.jpg',
      },
      {
        title: 'QUẢN LÝ TÀI NGUYÊN RỪNG',
        subtitle: 'TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI',
        description:
          'Ứng dụng UAV, AI và nền tảng 3DGIS dữ liệu không gian trong kiểm kê, giám sát, phân tích hiện trạng và theo dõi biến động tài nguyên rừng theo thời gian thực.',
        ctaText: 'Tìm hiểu thêm',
        ctaUrl: '/#',
        imageUrl:
          'https://ik.imagekit.io/huy01040104/vdcd/slides/24514AFA-9CB5-4DC3-98A5-EEA103201F96.png',
      },
      {
        title: 'HẠ TẦNG DỮ LIỆU SỐ',
        subtitle: 'TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI',
        description:
          'Hạ tầng lưu trữ dữ liệu đám mây (Cloud Storage) và xử lý dữ liệu lớn (Big Data) chuẩn quốc tế, đảm bảo tính an toàn, bảo mật và khả năng mở rộng cho các tổ chức, doanh nghiệp.',
        ctaText: 'Tìm hiểu thêm',
        ctaUrl: '/#',
        imageUrl:
          'https://ik.imagekit.io/huy01040104/vdcd/slides/data_center.jpg',
      },
    ];
    const slides = await slideRepo.save(
      slideData.map((s, i) =>
        slideRepo.create({
          ...s,
          imageFileId: `slide-image-${i + 1}`,
          order: i,
          isActive: true,
        }),
      ),
    );
    console.log(`   → ${slides.length} slides`);

    // ── 6.5. Page Banners ──────────────────────────────────────────
    console.log('🖼️ Seeding page banners...');
    const pageBannerRepo = queryRunner.manager.getRepository(PageBanner);
    const pageBannerData = [
      {
        pageKey: 'projects',
        title: 'Những công trình\nkiến tạo giá trị',
        subtitle:
          'Mỗi dự án là một hành trình đồng hành cùng khách hàng — từ khảo sát thực địa đến giám sát thi công, chuyển đổi số hóa và bàn giao giải pháp bền vững.',
        tag: 'Dự án tiêu biểu',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited-768x576.jpg',
        ctaButtons: [
          {
            label: 'Xem dự án',
            href: '#gallery',
            variant: 'primary',
            ariaLabel: 'Xem các dự án tiêu biểu',
          },
          {
            label: 'Liên hệ hợp tác',
            href: '/contact',
            variant: 'secondary',
            ariaLabel: 'Liên hệ hợp tác dự án',
          },
        ],
      },
      {
        pageKey: 'programs',
        title: 'Chương trình\nđổi mới sáng tạo',
        subtitle:
          'Khám phá các chương trình chiến lược của VDCD — từ chuyển đổi số nông nghiệp, đô thị thông minh đến đào tạo nguồn nhân lực và năng lượng tái tạo cho Tây Nguyên.',
        tag: 'Chương trình',
        imageUrl: 'https://picsum.photos/id/1015/1920/1080',
        ctaButtons: [
          {
            label: 'Khám phá chương trình',
            href: '#programs-grid',
            variant: 'primary',
            ariaLabel: 'Xem danh sách chương trình',
          },
          {
            label: 'Liên hệ tư vấn',
            href: '/contact',
            variant: 'secondary',
            ariaLabel: 'Liên hệ tư vấn chương trình',
          },
        ],
      },
      {
        pageKey: 'news',
        title: 'Cập nhật mới nhất\ntừ VDCD Group',
        subtitle:
          'Theo dõi tin tức, sự kiện và những câu chuyện đổi mới sáng tạo từ VDCD — nơi công nghệ gặp gỡ phát triển bền vững.',
        tag: 'Tin tức & Bài viết',
        imageUrl: 'https://picsum.photos/id/180/1920/1080',
        ctaButtons: [
          {
            label: 'Đọc tin mới',
            href: '#news-grid',
            variant: 'primary',
            ariaLabel: 'Xem danh sách bài viết',
          },
          {
            label: 'Về chúng tôi',
            href: '/about-us',
            variant: 'secondary',
            ariaLabel: 'Tìm hiểu về VDCD Group',
          },
        ],
      },
      {
        pageKey: 'contact',
        title: 'Kết nối cùng\nVDCD Group',
        subtitle:
          'Hãy liên hệ với chúng tôi để được tư vấn về các giải pháp chuyển đổi số, hợp tác dự án, hoặc bất kỳ thông tin nào bạn cần. Đội ngũ VDCD luôn sẵn sàng hỗ trợ.',
        tag: 'Liên hệ',
        imageUrl: 'https://picsum.photos/id/368/1920/1080',
        ctaButtons: [
          {
            label: 'Gửi tin nhắn',
            href: '#contact-form',
            variant: 'primary',
            ariaLabel: 'Gửi tin nhắn cho chúng tôi',
          },
          {
            label: 'Gọi ngay',
            href: 'tel:0373600099',
            variant: 'secondary',
            ariaLabel: 'Gọi hotline VDCD',
          },
        ],
      },
      {
        pageKey: 'careers',
        title: 'Kiến tạo tương lai\nchuyển đổi số tại Gia Lai',
        subtitle:
          'Gia nhập VDCD Group để cùng xây dựng hệ sinh thái công nghệ tiên phong, đưa các giải pháp đổi mới sáng tạo vào phục vụ phát triển kinh tế bền vững tại khu vực Tây Nguyên.',
        tag: 'Tuyển dụng',
        imageUrl: 'https://picsum.photos/id/1/1920/1080',
        ctaButtons: [
          {
            label: 'Xem vị trí',
            href: '#positions',
            variant: 'primary',
            ariaLabel: 'Xem các vị trí tuyển dụng',
          },
          {
            label: 'Về chúng tôi',
            href: '/about-us',
            variant: 'secondary',
            ariaLabel: 'Tìm hiểu về VDCD Group',
          },
        ],
      },
      {
        pageKey: 'about',
        title: 'KIẾN TẠO\nTƯƠNG LAI SỐ',
        subtitle:
          'VDCD Group là hệ sinh thái công nghệ hàng đầu tại Việt Nam, tiên phong cung cấp các giải pháp đổi mới sáng tạo, chuyển đổi số toàn diện và chế tạo thiết bị công nghệ cao phục vụ phát triển kinh tế vùng bền vững.',
        tag: 'Về chúng tôi',
        imageUrl: 'https://picsum.photos/id/367/1920/1080',
        ctaButtons: [
          {
            label: 'Tìm hiểu thêm',
            href: '#brand-story',
            variant: 'primary',
            ariaLabel: 'Tìm hiểu thêm về VDCD Group',
          },
          {
            label: 'Liên hệ',
            href: '/contact',
            variant: 'secondary',
            ariaLabel: 'Liên hệ với VDCD Group',
          },
        ],
      },
      {
        pageKey: 'solutions',
        title: 'Giải pháp\ntheo lĩnh vực',
        subtitle:
          'Khám phá các giải pháp công nghệ toàn diện của chúng tôi, mang lại giá trị bền vững và hiệu quả tối ưu cho từng lĩnh vực hoạt động.',
        tag: 'Giải pháp',
        imageUrl: 'https://picsum.photos/id/201/1920/1080',
        ctaButtons: [
          {
            label: 'Xem giải pháp',
            href: '#solutions-grid',
            variant: 'primary',
            ariaLabel: 'Xem các giải pháp',
          },
          {
            label: 'Liên hệ tư vấn',
            href: '/contact',
            variant: 'secondary',
            ariaLabel: 'Liên hệ tư vấn giải pháp',
          },
        ],
      },
    ];

    const pageBanners = await pageBannerRepo.save(
      pageBannerData.map((b, i) =>
        pageBannerRepo.create({
          ...b,
          imageFileId: `page-banner-image-${i + 1}`,
          isActive: true,
        }),
      ),
    );
    console.log(`   → ${pageBanners.length} page banners`);

    // ── 7. Programs ────────────────────────────────────────────────
    console.log('📋 Seeding programs...');
    const programRepo = queryRunner.manager.getRepository(Program);
    const programData = [
      {
        title: 'Chương trình Chuyển đổi số Nông nghiệp Tây Nguyên',
        slug: 'chuyen-doi-so-nong-nghiep-tay-nguyen',
        shortDescription:
          'Ứng dụng công nghệ IoT, dữ liệu lớn và trí tuệ nhân tạo vào quản lý chuỗi cung ứng nông sản, giám sát canh tác và tối ưu hóa năng suất cho nông hộ tại Gia Lai và các tỉnh Tây Nguyên.',
        content: `<h2>Giới thiệu chương trình</h2>\n<p>Chương trình Chuyển đổi số Nông nghiệp Tây Nguyên là sáng kiến chiến lược của VDCD Group nhằm đưa công nghệ hiện đại vào lĩnh vực nông nghiệp — ngành kinh tế trọng điểm của khu vực Tây Nguyên.</p>\n<h2>Mục tiêu</h2>\n<ul>\n<li>Triển khai hệ thống IoT giám sát môi trường canh tác tại 50+ nông hộ</li>\n<li>Xây dựng nền tảng dữ liệu nông nghiệp tập trung cho tỉnh Gia Lai</li>\n<li>Đào tạo kỹ năng số cho 200+ nông dân và kỹ thuật viên nông nghiệp</li>\n</ul>\n<h2>Kết quả dự kiến</h2>\n<p>Tăng năng suất 15-20%, giảm chi phí vật tư 10-15%, và xây dựng mô hình nông nghiệp thông minh có thể nhân rộng ra toàn khu vực.</p>`,
        fieldIndex: 0,
        metaTitle: 'Chuyển đổi số Nông nghiệp Tây Nguyên | VDCD Group',
        metaDescription:
          'Chương trình ứng dụng IoT, AI vào nông nghiệp Tây Nguyên — nâng cao năng suất, giảm chi phí cho nông hộ Gia Lai.',
      },
      {
        title: 'Đề án Đô thị Thông minh Pleiku 2030',
        slug: 'de-an-do-thi-thong-minh-pleiku-2030',
        shortDescription:
          'Quy hoạch và triển khai hạ tầng đô thị số cho thành phố Pleiku, bao gồm hệ thống quản lý giao thông, dịch vụ công trực tuyến và giám sát môi trường đô thị.',
        content: `<h2>Tổng quan đề án</h2>\n<p>Đề án Đô thị Thông minh Pleiku 2030 hướng đến xây dựng một thành phố hiện đại, bền vững, lấy công nghệ làm nền tảng phát triển kinh tế-xã hội.</p>\n<h2>Các hạng mục chính</h2>\n<ul>\n<li>Hệ thống camera giám sát giao thông thông minh</li>\n<li>Cổng dịch vụ công trực tuyến mức độ 4</li>\n<li>Trung tâm điều hành đô thị thông minh (IOC)</li>\n<li>Mạng cảm biến môi trường đô thị</li>\n</ul>`,
        fieldIndex: 1,
        metaTitle: 'Đề án Đô thị Thông minh Pleiku 2030 | VDCD Group',
        metaDescription:
          'Quy hoạch hạ tầng đô thị số Pleiku — giao thông thông minh, dịch vụ công trực tuyến, giám sát môi trường.',
      },
      {
        title: 'Chương trình Đào tạo Kỹ năng số cho Thanh niên',
        slug: 'dao-tao-ky-nang-so-thanh-nien',
        shortDescription:
          'Khóa đào tạo kỹ năng lập trình, phân tích dữ liệu và thiết kế số dành cho thanh niên 18-30 tuổi tại các tỉnh Tây Nguyên, nhằm phát triển nguồn nhân lực công nghệ tại chỗ.',
        content: `<h2>Mục tiêu chương trình</h2>\n<p>Trang bị kỹ năng số thiết yếu cho thế hệ trẻ Tây Nguyên, tạo nguồn nhân lực chất lượng cao phục vụ chuyển đổi số địa phương.</p>\n<h2>Nội dung đào tạo</h2>\n<ul>\n<li>Lập trình web cơ bản (HTML, CSS, JavaScript)</li>\n<li>Phân tích dữ liệu với Python</li>\n<li>Thiết kế đồ họa và UI/UX</li>\n<li>Kỹ năng khởi nghiệp sáng tạo</li>\n</ul>`,
        fieldIndex: 2,
        metaTitle: 'Đào tạo Kỹ năng số cho Thanh niên | VDCD Group',
        metaDescription:
          'Khóa đào tạo lập trình, phân tích dữ liệu và kỹ năng số cho thanh niên Tây Nguyên.',
      },
      {
        title: 'Chương trình Năng lượng Xanh cho Tây Nguyên',
        slug: 'nang-luong-xanh-tay-nguyen',
        shortDescription:
          'Triển khai giải pháp năng lượng mặt trời và biomass cho các vùng nông thôn Tây Nguyên, hỗ trợ phát triển kinh tế bền vững và giảm phát thải carbon.',
        content: `<h2>Bối cảnh</h2>\n<p>Tây Nguyên sở hữu tiềm năng năng lượng tái tạo lớn với lượng bức xạ mặt trời trung bình 5-6 kWh/m²/ngày và nguồn biomass dồi dào từ phế phẩm nông nghiệp.</p>\n<h2>Phạm vi triển khai</h2>\n<ul>\n<li>Lắp đặt hệ thống điện mặt trời áp mái cho 100 hộ gia đình</li>\n<li>Xây dựng 5 trạm sạc năng lượng mặt trời cộng đồng</li>\n<li>Triển khai 3 hệ thống biomass xử lý phế phẩm nông nghiệp</li>\n</ul>`,
        fieldIndex: 5,
        metaTitle: 'Năng lượng Xanh cho Tây Nguyên | VDCD Group',
        metaDescription:
          'Giải pháp năng lượng mặt trời và biomass cho vùng nông thôn Tây Nguyên — phát triển kinh tế bền vững.',
      },
      {
        title: 'Chương trình Hỗ trợ Doanh nghiệp Chuyển đổi số',
        slug: 'ho-tro-doanh-nghiep-chuyen-doi-so',
        shortDescription:
          'Tư vấn chiến lược và hỗ trợ triển khai chuyển đổi số cho doanh nghiệp vừa và nhỏ tại Gia Lai, bao gồm số hóa quy trình, quản lý khách hàng và thương mại điện tử.',
        content: `<h2>Đối tượng</h2>\n<p>Các doanh nghiệp vừa và nhỏ (SME) tại tỉnh Gia Lai muốn ứng dụng công nghệ để nâng cao hiệu quả hoạt động và mở rộng thị trường.</p>\n<h2>Gói hỗ trợ</h2>\n<ul>\n<li>Đánh giá mức độ sẵn sàng chuyển đổi số</li>\n<li>Tư vấn lộ trình chuyển đổi số phù hợp</li>\n<li>Triển khai phần mềm quản lý (ERP, CRM)</li>\n<li>Đào tạo nhân sự vận hành hệ thống</li>\n</ul>`,
        fieldIndex: 1,
        metaTitle: 'Hỗ trợ Doanh nghiệp Chuyển đổi số | VDCD Group',
        metaDescription:
          'Tư vấn và triển khai chuyển đổi số cho doanh nghiệp SME tại Gia Lai — ERP, CRM, thương mại điện tử.',
      },
      {
        title: 'Chương trình Khởi nghiệp Sáng tạo Gia Lai',
        slug: 'khoi-nghiep-sang-tao-gia-lai',
        shortDescription:
          'Vườn ươm khởi nghiệp dành cho các startup công nghệ tại Gia Lai, cung cấp không gian làm việc, mentoring, kết nối nhà đầu tư và hỗ trợ pháp lý.',
        content: `<h2>Giới thiệu</h2>\n<p>Chương trình Khởi nghiệp Sáng tạo Gia Lai là nền tảng hỗ trợ toàn diện cho các dự án khởi nghiệp công nghệ, từ ý tưởng đến hiện thực hóa sản phẩm.</p>\n<h2>Quyền lợi tham gia</h2>\n<ul>\n<li>Không gian co-working miễn phí 6 tháng</li>\n<li>Mentoring từ chuyên gia công nghệ và kinh doanh</li>\n<li>Kết nối với quỹ đầu tư và nhà đầu tư thiên thần</li>\n<li>Hỗ trợ đăng ký kinh doanh và sở hữu trí tuệ</li>\n</ul>`,
        fieldIndex: 2,
        metaTitle: 'Khởi nghiệp Sáng tạo Gia Lai | VDCD Group',
        metaDescription:
          'Vườn ươm khởi nghiệp công nghệ Gia Lai — co-working, mentoring, kết nối đầu tư.',
      },
    ];

    const programs = await programRepo.save(
      programData.map((p) =>
        programRepo.create({
          title: p.title,
          slug: p.slug,
          shortDescription: p.shortDescription,
          content: p.content,
          thumbnail: `https://picsum.photos/seed/${p.slug}/800/500`,
          thumbnailFileId: `program-thumb-${p.slug}`,
          field: fields[p.fieldIndex],
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          isPublished: true,
        }),
      ),
    );
    console.log(`   → ${programs.length} programs`);

    // ── 8. Solutions ───────────────────────────────────────────────
    console.log('💡 Seeding solutions...');
    const solutionRepo = queryRunner.manager.getRepository(Solution);
    const solutionData = [
      {
        title: 'Trung tâm Bản đồ số',
        slug: 'trung-tam-ban-do-so',
        shortDescription:
          'Cung cấp các dịch vụ bay quét 3D, trắc địa số hóa và thành lập bản đồ địa hình độ chính xác cao bằng máy bay không người lái.',
        content:
          'Cung cấp các dịch vụ bay quét 3D, trắc địa số hóa và thành lập bản đồ địa hình độ chính xác cao bằng máy bay không người lái.',
        imageUrl: 'https://vdcd.vn/wp-content/uploads/2024/03/5-768x431.jpg',
        websiteUrl:
          'https://vietflycam.vn/dich-vu/bay-quet-3d-trac-dia-so-va-thanh-lap-ban-do',
        fieldIndex: 0,
      },
      {
        title: 'Viện Thiết Kế Số',
        slug: 'vien-thiet-ke-so',
        shortDescription:
          'Nghiên cứu, phát triển ứng dụng mô hình thông tin công trình (BIM) và các giải pháp thiết kế số trong lĩnh vực xây dựng, kiến trúc.',
        content:
          'Nghiên cứu, phát triển ứng dụng mô hình thông tin công trình (BIM) và các giải pháp thiết kế số trong lĩnh vực xây dựng, kiến trúc.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2024/03/picture1_8463e044ab0c465da2d031f6af1a4c5f_master-768x768.png',
        websiteUrl: 'https://bimv.vn/',
        fieldIndex: 1,
      },
      {
        title: 'Trung Tâm Giám Sát Số',
        slug: 'trung-tam-giam-sat-so',
        shortDescription:
          'Cung cấp hệ thống Auto Timelapse giám sát thông minh tiến độ xây dựng công trình, nông nghiệp và môi trường một cách tự động, trực quan.',
        content:
          'Cung cấp hệ thống Auto Timelapse giám sát thông minh tiến độ xây dựng công trình, nông nghiệp và môi trường một cách tự động, trực quan.',
        imageUrl: 'https://vdcd.vn/wp-content/uploads/2024/03/3123-768x512.jpg',
        websiteUrl: 'https://autotimelapse.com',
        fieldIndex: 1,
      },
      {
        title: 'Trung tâm dữ liệu siêu máy tính và đào tạo AI',
        slug: 'trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai',
        shortDescription:
          'Xây dựng hạ tầng tính toán hiệu năng cao (HPC) và tổ chức các chương trình đào tạo trí tuệ nhân tạo chuyên sâu phục vụ chuyển đổi số doanh nghiệp.',
        content:
          'Xây dựng hạ tầng tính toán hiệu năng cao (HPC) và tổ chức các chương trình đào tạo trí tuệ nhân tạo chuyên sâu phục vụ chuyển đổi số doanh nghiệp.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2025/10/z7173282299491_651f9e392555944f94acd55dab050480-768x576.jpg',
        websiteUrl:
          'https://vdcd.vn/services/trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai/',
        fieldIndex: 2,
      },
      {
        title: 'Viện Nghiên cứu công nghệ không gian và dưới nước',
        slug: 'vien-nghien-cuu-cong-nghe-khong-gian-va-duoi-nuoc',
        shortDescription:
          'Nghiên cứu và ứng dụng các công nghệ tiên tiến trong không gian vũ trụ và thám hiểm, đo đạc môi trường dưới nước.',
        content:
          'Nghiên cứu và ứng dụng các công nghệ tiên tiến trong không gian vũ trụ và thám hiểm, đo đạc môi trường dưới nước.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2025/10/Vien-khong-gian-va-duoi-nuoc-BK-768x499.jpg',
        websiteUrl: 'https://iig.vn',
        fieldIndex: 2,
      },
      {
        title: 'Trung tâm phần mềm VDCD – Soft',
        slug: 'trung-tam-phan-mem-vdcd-soft',
        shortDescription:
          'Phát triển các phần mềm quản lý doanh nghiệp, giải pháp chuyển đổi số chuyên sâu phục vụ hệ sinh thái kinh tế vùng và cả nước.',
        content:
          'Phát triển các phần mềm quản lý doanh nghiệp, giải pháp chuyển đổi số chuyên sâu phục vụ hệ sinh thái kinh tế vùng và cả nước.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2024/03/Untitled-1-01-1-768x768.png',
        websiteUrl: 'https://geneat.vn',
        fieldIndex: 1,
      },
      {
        title: 'Trung Tâm Đổi Mới Sáng Tạo Tỉnh',
        slug: 'trung-tam-doi-moi-sang-tao-tinh',
        shortDescription:
          'Hỗ trợ ươm tạo khởi nghiệp, phát triển ý tưởng sáng tạo và thúc đẩy chuyển giao công nghệ tại địa phương.',
        content:
          'Hỗ trợ ươm tạo khởi nghiệp, phát triển ý tưởng sáng tạo và thúc đẩy chuyển giao công nghệ tại địa phương.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2025/11/S3-1-1-768x590.jpg',
        websiteUrl: 'https://vdcd.vn/services/trung-tam-doi-moi-sang-tao-tinh/',
        fieldIndex: 1,
      },
      {
        title: 'Trung Tâm Chuyển giao Công Nghệ',
        slug: 'trung-tam-chuyen-giao-cong-nghe',
        shortDescription:
          'Cầu nối chuyển giao các công nghệ tiên tiến từ viện nghiên cứu, trường đại học đến các doanh nghiệp địa phương ứng dụng thực tiễn.',
        content:
          'Cầu nối chuyển giao các công nghệ tiên tiến từ viện nghiên cứu, trường đại học đến các doanh nghiệp địa phương ứng dụng thực tiễn.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2025/10/BOT06612-768x512.jpg',
        websiteUrl: 'https://vdcd.vn/services/trung-tam-chuyen-giao-cong-nghe/',
        fieldIndex: 1,
      },
      {
        title: 'Máy Bay Việt',
        slug: 'may-bay-viet',
        shortDescription:
          'Đơn vị cung cấp giải pháp máy bay không người lái phục vụ nông nghiệp thông minh, khảo sát công nghiệp và quay chụp chuyên nghiệp.',
        content:
          'Đơn vị cung cấp giải pháp máy bay không người lái phục vụ nông nghiệp thông minh, khảo sát công nghiệp và quay chụp chuyên nghiệp.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2025/10/1WUpukaXKpD5fkPMSNblWMSh6WCwXJ6Jj6f9AaF0YHj7OHjPJMzUbLBU1IEVPY2B2vQ-768x432.jpg',
        websiteUrl: 'https://maybayviet.com',
        fieldIndex: 0,
      },
      {
        title: 'Trung tâm phát triển Robot & AI',
        slug: 'trung-tam-phat-trien-robot-ai',
        shortDescription:
          'Nghiên cứu chế tạo các hệ thống cánh tay robot tự động hóa, xe tự hành (AGV) kết hợp trí tuệ nhân tạo nhận diện hình ảnh và tối ưu vận hành.',
        content:
          'Nghiên cứu chế tạo các hệ thống cánh tay robot tự động hóa, xe tự hành (AGV) kết hợp trí tuệ nhân tạo nhận diện hình ảnh và tối ưu vận hành.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2024/03/ImageForArticle_702_172159750532-768x432.jpg',
        websiteUrl: 'https://vdcd.vn/services/trung-tam-phat-trien-robot-ai/',
        fieldIndex: 2,
      },
      {
        title: 'Trung Tâm Sản Xuất Phim',
        slug: 'trung-tam-san-xuat-phim',
        shortDescription:
          'Sản xuất video clip giới thiệu dự án, quay phim khảo sát, flycam sự kiện chuyên nghiệp với trang thiết bị hiện đại hàng đầu.',
        content:
          'Sản xuất video clip giới thiệu dự án, quay phim khảo sát, flycam sự kiện chuyên nghiệp với trang thiết bị hiện đại hàng đầu.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2025/10/75474-768x576.jpg',
        websiteUrl:
          'https://vietflycam.vn/dich-vu/quay-phim-chup-anh-bang-flycam',
        fieldIndex: 4,
      },
      {
        title: 'Trung tâm nghiên cứu và phát triển sản phẩm R&D',
        slug: 'trung-tam-nghien-cuu-va-phat-trien-san-pham-rd',
        shortDescription:
          'Đội ngũ chuyên gia chuyên nghiên cứu phát triển các sản phẩm phần cứng và giải pháp công nghệ mới bắt kịp xu hướng thế giới.',
        content:
          'Đội ngũ chuyên gia chuyên nghiên cứu phát triển các sản phẩm phần cứng và giải pháp công nghệ mới bắt kịp xu hướng thế giới.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2024/03/64576458-768x512.jpg',
        websiteUrl:
          'https://vdcd.vn/services/trung-tam-nghien-cuu-va-phat-trien-san-pham/',
        fieldIndex: 2,
      },
      {
        title: 'Nông nghiệp - Lâm nghiệp',
        slug: 'nong-nghiep-lam-nghiep',
        shortDescription:
          'Giải pháp nông nghiệp thông minh, giúp tối ưu hóa canh tác, tối ưu chi phí và truy xuất nguồn gốc dễ dàng.',
        content:
          'Giải pháp nông nghiệp thông minh, giúp tối ưu hóa canh tác, tối ưu chi phí và truy xuất nguồn gốc dễ dàng.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2026/06/Ban-sao-cua-IMG_2462-1024x768.jpg',
        websiteUrl: '/solution/nong-nghiep-lam-nghiep',
        fieldIndex: 0,
      },
      {
        title: 'Giám sát an ninh',
        slug: 'an-ninh-giam-sat-an-ninh',
        shortDescription:
          'Ứng dụng công nghệ AutoTimelapse giám sát trực quan 24/7, tự động cảnh báo xâm nhập và lưu trữ bảo mật.',
        content:
          'Ứng dụng công nghệ AutoTimelapse giám sát trực quan 24/7, tự động cảnh báo xâm nhập và lưu trữ bảo mật.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2026/06/z7896992273679_a63ab25fd7af7b68be795587ac4a41fb-1-1024x683.jpg',
        websiteUrl: '/solution/an-ninh-giam-sat-an-ninh',
        fieldIndex: 1,
      },
      {
        title: 'Điện - Năng lượng',
        slug: 'dien-nang-luong',
        shortDescription:
          'Hệ sinh thái số hóa tích hợp giúp tối ưu khảo sát, bảo trì lưới điện và giám sát an toàn.',
        content:
          'Hệ sinh thái số hóa tích hợp giúp tối ưu khảo sát, bảo trì lưới điện và giám sát an toàn.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2026/06/Dien-gio-Quang-Tri-1-1410x720.jpg',
        websiteUrl: '/solution/dien-nang-luong',
        fieldIndex: 1,
      },
      {
        title: 'Khai thác khoáng sản',
        slug: 'tai-nguyen-khai-thac-khoang-san',
        shortDescription:
          'Giải pháp số hóa toàn diện khu vực mỏ giúp kiểm soát trạm cân, minh bạch hóa dữ liệu và tối ưu vận hành mỏ.',
        content:
          'Giải pháp số hóa toàn diện khu vực mỏ giúp kiểm soát trạm cân, minh bạch hóa dữ liệu và tối ưu vận hành mỏ.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2026/06/z7903688360376_37c98f8dadd2f5e6419362c107fe4ca4-1-1024x509.jpg',
        websiteUrl: '/solution/tai-nguyen-khai-thac-khoang-san',
        fieldIndex: 1,
      },
      {
        title: 'Tài nguyên môi trường',
        slug: 'quan-ly-tai-nguyen-quan-trac-moi-truong',
        shortDescription:
          'Giải pháp quan trắc môi trường giúp theo dõi dữ liệu thời gian thực, cảnh báo sớm rủi ro sinh thái.',
        content:
          'Giải pháp quan trắc môi trường giúp theo dõi dữ liệu thời gian thực, cảnh báo sớm rủi ro sinh thái.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2026/06/z7913610376494_aabfc4669de386a5916480d8fb3f34cd-1024x490.jpg',
        websiteUrl: '/solution/quan-ly-tai-nguyen-quan-trac-moi-truong',
        fieldIndex: 3,
      },
      {
        title: 'Du lịch thông minh - Số hóa di sản',
        slug: 'du-lich-thong-minh-so-hoa-di-san',
        shortDescription:
          'Ứng dụng công nghệ để số hóa di sản, xây dựng bản đồ du lịch thông minh và nâng tầm trải nghiệm thực tế ảo.',
        content:
          'Ứng dụng công nghệ để số hóa di sản, xây dựng bản đồ du lịch thông minh và nâng tầm trải nghiệm thực tế ảo.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2026/06/Lotte-Mall-1-1-1-scaled.jpg',
        websiteUrl: '/solution/du-lich-thong-minh-so-hoa-di-san',
        fieldIndex: 4,
      },
      {
        title: 'Cứu hộ cứu nạn',
        slug: 'cuu-ho-cuu-nan-phong-chong-thien-tai',
        shortDescription:
          'Ứng dụng công nghệ tích hợp giúp cảnh báo sớm rủi ro thiên tai và hỗ trợ tìm kiếm cứu nạn.',
        content:
          'Ứng dụng công nghệ tích hợp giúp cảnh báo sớm rủi ro thiên tai và hỗ trợ tìm kiếm cứu nạn.',
        imageUrl:
          'https://vdcd.vn/wp-content/uploads/2026/06/z7908953163351_e6a394ecff68dca617c06ebed9a5ecbc-1024x768.jpg',
        websiteUrl: '/solution/cuu-ho-cuu-nan-phong-chong-thien-tai',
        fieldIndex: 1,
      },
    ];

    const solutions = await solutionRepo.save(
      solutionData.map((s) =>
        solutionRepo.create({
          title: s.title,
          slug: s.slug,
          shortDescription: s.shortDescription,
          content: s.content,
          thumbnail: s.imageUrl,
          thumbnailFileId: `solution-thumb-${s.slug}`,
          websiteUrl: s.websiteUrl,
          field: fields[s.fieldIndex],
          metaTitle: `${s.title} | VDCD`,
          metaDescription: s.shortDescription,
          isPublished: true,
        }),
      ),
    );
    console.log(`   → ${solutions.length} solutions`);

    // ── 9. Projects ────────────────────────────────────────────────
    console.log('🏗️  Seeding projects...');
    const projectRepo = queryRunner.manager.getRepository(Project);
    const imageRepo = queryRunner.manager.getRepository(ProjectImage);

    const projects: Project[] = [];
    for (const p of PROJECTS_DATA) {
      // Find matching or fallback province & field
      const prov =
        provinces.find((pr) =>
          pr.name.toLowerCase().includes(p.location.toLowerCase()),
        ) || provinces[0];
      const fld =
        fields.find((f) =>
          f.name.toLowerCase().includes(p.category.toLowerCase()),
        ) || fields[0];

      const project = await projectRepo.save(
        projectRepo.create({
          title: p.title,
          slug: p.id,
          overview: p.description,
          thumbnail: p.coverImage,
          thumbnailFileId: `project-thumb-${p.id}`,
          field: fld,
          province: prov,
          year: Number(p.year) || 2024,

          // Detail fields
          challenge: p.detail.challenge,
          services: p.detail.services,
          discipline: p.detail.discipline,
          transformationBefore: p.detail.transformationBefore,
          transformationAfter: p.detail.transformationAfter,
          technicalHighlights: p.detail.technicalHighlights,
          nextProjectSlug: p.detail.nextProjectId ?? undefined,

          metaTitle: `${p.title} | VDCD`,
          metaDescription: p.description.slice(0, 160),
          isPublished: true,
        }),
      );

      // Save gallery images
      if (
        Array.isArray(p.detail.galleryImages) &&
        p.detail.galleryImages.length > 0
      ) {
        await imageRepo.save(
          p.detail.galleryImages.map((g, i) =>
            imageRepo.create({
              project,
              url: g.src,
              fileId: `project-img-${p.id}-${i + 1}`,
              caption: g.caption || `Hình ảnh ${i + 1} – ${p.title}`,
              order: i,
              size: g.size,
            }),
          ),
        );
      }
      projects.push(project);
    }
    console.log(`   → ${projects.length} projects với gallery images`);

    // ── 10. Articles ───────────────────────────────────────────────
    console.log('📰 Seeding articles...');
    const articleRepo = queryRunner.manager.getRepository(Article);

    const articleData = [
      {
        title:
          'Trung tâm Đổi mới Sáng tạo Gia Lai ký kết hợp tác chiến lược với Vietedge thúc đẩy chuyển đổi số',
        slug: 'trung-tam-dmst-gia-lai-ky-ket-vietedge',
        category: 'Tin tức',
        tags: 'hợp tác,Vietedge,đổi mới sáng tạo,chuyển đổi số,Gia Lai',
        content: `<p>Tháng 7/2026, Công ty Cổ phần Trung tâm Đổi mới Sáng tạo Gia Lai (thành viên VDCD Group) chính thức ký kết Biên bản ghi nhớ hợp tác (MOU) với Vietedge — đơn vị tiên phong trong lĩnh vực công nghệ và đầu tư số tại Việt Nam.</p><h2>Nội dung hợp tác</h2><ul><li>Thúc đẩy hệ sinh thái công nghệ và đổi mới sáng tạo tại tỉnh Gia Lai</li><li>Xúc tiến thương mại, kết nối đầu tư vào các dự án công nghệ số</li><li>Phát triển nguồn nhân lực số chất lượng cao cho khu vực Tây Nguyên</li><li>Chuyển giao công nghệ và ứng dụng giải pháp AI, IoT, dữ liệu lớn</li></ul>`,
        metaDescription:
          'Trung tâm Đổi mới Sáng tạo Gia Lai và Vietedge ký kết MOU thúc đẩy hệ sinh thái công nghệ, chuyển đổi số tại Tây Nguyên.',
        publishedAt: '2026-07-18T09:00:00.000Z',
        programIndex: 4,
        projectIndex: null,
        solutionIndex: null,
      },
      {
        title:
          'Xã Tây Sơn trở thành "Xã hạt nhân số" đầu tiên của tỉnh Gia Lai',
        slug: 'xa-tay-son-xa-hat-nhan-so-dau-tien-gia-lai',
        category: 'Chuyển đổi số',
        tags: 'xã hạt nhân số,Tây Sơn,chuyển đổi số,chính quyền số,Gia Lai',
        content: `<p>Xã Tây Sơn (huyện An Khê, Gia Lai) được UBND tỉnh lựa chọn làm đơn vị thí điểm xây dựng mô hình "Xã hạt nhân về khoa học công nghệ, đổi mới sáng tạo và chuyển đổi số", với sự phối hợp của Trung tâm Đổi mới Sáng tạo Gia Lai (VDCD).</p><h2>Kết quả đạt được</h2><ul><li>100% thủ tục hành chính xử lý trực tuyến — thời gian đăng ký hộ kinh doanh giảm từ 3 ngày xuống 3 giờ</li><li>Tỷ lệ hài lòng của người dân đạt 100%</li><li>Triển khai mô hình "chợ số" — tiểu thương thanh toán không dùng tiền mặt</li><li>Tỷ lệ phủ sóng 5G đạt 99,3% dân số</li></ul>`,
        metaDescription:
          'Mô hình xã hạt nhân số tại Tây Sơn giảm thời gian TTHC từ 3 ngày xuống 3 giờ, phủ sóng 5G 99,3% dân số.',
        publishedAt: '2026-07-12T14:00:00.000Z',
        programIndex: null,
        projectIndex: null,
        solutionIndex: null,
      },
      {
        title:
          'VDCD Group ký MOU với Trường Đại học Quy Nhơn — Xây dựng hệ sinh thái khởi nghiệp trong môi trường đại học',
        slug: 'vdcd-ky-mou-dai-hoc-quy-nhon',
        category: 'Sự kiện',
        tags: 'Đại học Quy Nhơn,hợp tác,khởi nghiệp,đào tạo,nhân lực',
        content: `<p>Ngày 18/05/2026, Trường Đại học Quy Nhơn và Công ty Cổ phần Trung tâm Đổi mới Sáng tạo Gia Lai (thành viên VDCD Group) chính thức ký kết Bản thỏa thuận hợp tác (MOU).</p><h2>Nội dung hợp tác trọng tâm</h2><ul><li>Xây dựng hệ sinh thái khởi nghiệp đổi mới sáng tạo trong môi trường đại học</li><li>Chuyển giao công nghệ và ứng dụng kết quả nghiên cứu vào thực tiễn doanh nghiệp</li><li>Đào tạo nguồn nhân lực chất lượng cao trong các lĩnh vực AI, IoT, GIS, UAV</li></ul>`,
        metaDescription:
          'VDCD Group ký kết hợp tác với Đại học Quy Nhơn xây dựng hệ sinh thái khởi nghiệp, chuyển giao công nghệ.',
        publishedAt: '2026-05-20T08:30:00.000Z',
        programIndex: 5,
        projectIndex: null,
        solutionIndex: null,
      },
      {
        title:
          'Khánh thành hạ tầng Data Center và 6 phòng Lab chuyên ngành tại Trung tâm ĐMST Gia Lai',
        slug: 'khanh-thanh-data-center-phong-lab-trung-tam-dmst-gia-lai',
        category: 'Tin tức',
        tags: 'Data Center,phòng lab,AI,UAV,GIS,hạ tầng,Gia Lai',
        content: `<p>Trung tâm Đổi mới Sáng tạo Gia Lai chính thức đưa vào vận hành hệ thống hạ tầng công nghệ hiện đại, bao gồm Data Center, siêu máy tính AI và 6 phòng lab chuyên ngành.</p><h2>6 phòng Lab chuyên ngành</h2><ul><li><strong>Lab UAV:</strong> Bay chụp, khảo sát địa hình, lập bản đồ 3D</li><li><strong>Lab AI:</strong> Xử lý ảnh, nhận diện, chatbot, phân tích dữ liệu</li><li><strong>Lab GIS:</strong> Hệ thống thông tin địa lý, bản đồ số, quy hoạch</li><li><strong>Lab Nông nghiệp công nghệ cao:</strong> IoT cảm biến, tưới tự động</li><li><strong>Lab Công nghệ sinh học:</strong> Nuôi cấy mô, phân tích mẫu</li><li><strong>Lab STEM:</strong> Giáo dục STEM cho học sinh, sinh viên</li></ul>`,
        metaDescription:
          'VDCD đưa vào vận hành Data Center, siêu máy tính AI và 6 phòng lab chuyên ngành UAV, AI, GIS, Nông nghiệp, STEM.',
        publishedAt: '2026-06-25T10:00:00.000Z',
        programIndex: null,
        projectIndex: null,
        solutionIndex: null,
      },
      {
        title:
          'Ứng dụng UAV/Drone trong đo đạc, lập bản đồ địa chính — VDCD triển khai thành công tại Hà Tĩnh',
        slug: 'ung-dung-uav-drone-do-dac-ban-do-dia-chinh-ha-tinh',
        category: 'Công nghệ',
        tags: 'UAV,drone,đo đạc,bản đồ,địa chính,GIS,Hà Tĩnh',
        content: `<p>VDCD Group đã triển khai thành công công nghệ bay không người lái (UAV/Drone) trong công tác đo đạc, lập bản đồ địa chính tại xã Đồng Tiến, tỉnh Hà Tĩnh.</p><h2>Quy trình triển khai</h2><ul><li>Bay chụp ảnh hàng không bằng drone chuyên dụng</li><li>Xử lý ảnh, tạo bản đồ trực ảnh độ phân giải cao</li><li>Chiết xuất dữ liệu ranh giới thửa đất</li><li>Cung cấp bản đồ số phục vụ quản lý đất đai</li></ul><h2>Hiệu quả</h2><p>Giảm 70% thời gian khảo sát, tăng độ chính xác gấp 3 lần so với phương pháp truyền thống.</p>`,
        metaDescription:
          'VDCD triển khai công nghệ drone đo đạc, lập bản đồ địa chính tại Hà Tĩnh — giảm 70% thời gian khảo sát.',
        publishedAt: '2026-06-15T09:00:00.000Z',
        programIndex: null,
        projectIndex: null,
        solutionIndex: 0,
      },
      {
        title:
          'Sở KH&CN An Giang, Hiệp hội Doanh nghiệp tỉnh và VDCD Group ký kết hợp tác phát triển hệ sinh thái khởi nghiệp',
        slug: 'so-khcn-an-giang-hiep-hoi-dn-vdcd-ky-ket-khoi-nghiep',
        category: 'Sự kiện',
        tags: 'An Giang,Sở KH&CN,khởi nghiệp,hệ sinh thái,ký kết',
        content: `<p>Ngày 28/07/2026, tại TP. Long Xuyên, Sở Khoa học và Công nghệ tỉnh An Giang, Hiệp hội Doanh nghiệp tỉnh An Giang và VDCD Group chính thức ký kết hợp tác ba bên.</p><h2>Mô hình Trung tâm ĐMST</h2><p>VDCD Group đề xuất xây dựng Trung tâm Đổi mới Sáng tạo tỉnh An Giang theo hình thức xã hội hóa — 100% vốn doanh nghiệp, không sử dụng ngân sách nhà nước.</p><h2>Quy trình hỗ trợ</h2><p>Khảo sát nhu cầu → Tư vấn giải pháp → Demo thử nghiệm → Triển khai thực tế → Đào tạo vận hành.</p>`,
        metaDescription:
          'VDCD Group ký kết 3 bên với Sở KH&CN và Hiệp hội DN An Giang phát triển hệ sinh thái khởi nghiệp.',
        publishedAt: '2026-07-28T10:00:00.000Z',
        programIndex: 5,
        projectIndex: null,
        solutionIndex: null,
      },
      {
        title:
          'VDCD Group mở rộng mô hình Trung tâm ĐMST tại Quảng Ninh, Cao Bằng và Hưng Yên',
        slug: 'vdcd-mo-rong-mo-hinh-dmst-quang-ninh-cao-bang-hung-yen',
        category: 'Tin tức',
        tags: 'mở rộng,Quảng Ninh,Cao Bằng,Hưng Yên,Lạng Sơn,ĐMST',
        content: `<p>Trong năm 2026, VDCD Group tiếp tục mở rộng mô hình "Trung tâm Đổi mới sáng tạo do doanh nghiệp làm chủ" ra nhiều tỉnh thành trên cả nước.</p><h2>Tiến độ triển khai</h2><ul><li><strong>Lạng Sơn (02/2026):</strong> Sở KH&CN họp xem xét đề án thành lập</li><li><strong>Hưng Yên (03/2026):</strong> Làm việc về phương án đầu tư</li><li><strong>Quảng Ninh (03/2026):</strong> Đề xuất thành lập phục vụ kinh tế biển và du lịch số</li><li><strong>Cao Bằng (07/2026):</strong> UBND tỉnh họp cho ý kiến về đề án</li></ul><p>VDCD Group hiện sở hữu hệ sinh thái với 12 trung tâm nghiên cứu chuyên sâu.</p>`,
        metaDescription:
          'VDCD Group mở rộng mô hình Trung tâm ĐMST do doanh nghiệp làm chủ tại nhiều tỉnh thành trên cả nước.',
        publishedAt: '2026-07-05T08:30:00.000Z',
        programIndex: null,
        projectIndex: null,
        solutionIndex: null,
      },
      {
        title:
          'AutoTimelapse — Giải pháp giám sát công trình thông minh 24/7 của VDCD Group',
        slug: 'autotimelapse-giai-phap-giam-sat-cong-trinh-thong-minh',
        category: 'Công nghệ',
        tags: 'AutoTimelapse,giám sát công trình,AI,camera thông minh,timelapse',
        content: `<p>AutoTimelapse là giải pháp giám sát trực quan công trình 24/7 do VDCD Group phát triển.</p><h2>Tính năng nổi bật</h2><ul><li>Camera thông minh kết hợp AI — giám sát 24/7</li><li>Tự động tạo video timelapse, so sánh tiến độ thực tế với kế hoạch</li><li>Cảnh báo sớm các sai lệch về tiến độ, an toàn lao động</li><li>Dashboard quản lý trực quan — truy cập từ xa qua web và mobile</li></ul><p>Hệ thống đã được triển khai thành công trên nhiều gói thầu quan trọng của các dự án hạ tầng lớn trên cả nước.</p>`,
        metaDescription:
          'AutoTimelapse — giải pháp giám sát trực quan công trình 24/7 bằng AI, tự động tạo timelapse và cảnh báo sớm.',
        publishedAt: '2026-06-01T08:00:00.000Z',
        programIndex: null,
        projectIndex: 1,
        solutionIndex: 2,
      },
      {
        title:
          'Hội thảo truyền thông chính sách khởi nghiệp sáng tạo — VDCD giới thiệu mô hình ĐMST do doanh nghiệp làm chủ',
        slug: 'hoi-thao-truyen-thong-chinh-sach-khoi-nghiep-sang-tao-gia-lai',
        category: 'Sự kiện',
        tags: 'hội thảo,khởi nghiệp,Sở KH&CN,Gia Lai,chính sách',
        content: `<p>Tháng 5/2026, Sở Khoa học và Công nghệ tỉnh Gia Lai tổ chức Hội thảo truyền thông chính sách khởi nghiệp sáng tạo.</p><h2>Các giải pháp được giới thiệu</h2><ul><li>Hạ tầng dữ liệu số và bản đồ số cho quản lý đô thị</li><li>Ứng dụng AI trong nông nghiệp thông minh</li><li>Giải pháp UAV/Drone cho khảo sát và giám sát</li><li>Chương trình hỗ trợ chuyển đổi số cho doanh nghiệp SME</li></ul>`,
        metaDescription:
          'VDCD giới thiệu mô hình Trung tâm ĐMST do doanh nghiệp làm chủ tại Hội thảo chính sách khởi nghiệp Gia Lai.',
        publishedAt: '2026-05-10T09:00:00.000Z',
        programIndex: 4,
        projectIndex: null,
        solutionIndex: null,
      },
      {
        title:
          'Phong trào "Bình dân học vụ số" tại Gia Lai — VDCD đồng hành cùng Tổ công nghệ số cộng đồng',
        slug: 'binh-dan-hoc-vu-so-gia-lai-vdcd-to-cong-nghe-so',
        category: 'Chuyển đổi số',
        tags: 'bình dân học vụ số,iGiaLai,công dân số,cộng đồng,Gia Lai',
        content: `<p>Trung tâm Đổi mới Sáng tạo Gia Lai (VDCD) phối hợp cùng các Tổ công nghệ số cộng đồng triển khai phong trào "Bình dân học vụ số".</p><h2>Nội dung hỗ trợ</h2><ul><li>Hướng dẫn cài đặt và sử dụng ứng dụng iGiaLai</li><li>Đăng ký tài khoản định danh điện tử (VNeID)</li><li>Sử dụng thanh toán không dùng tiền mặt qua ví điện tử, QR Code</li><li>Bảo mật thông tin cá nhân trên không gian mạng</li></ul><p>Phong trào đã tiếp cận hơn 2.000 người dân trong 3 tháng đầu, với tỷ lệ cài đặt ứng dụng thành công đạt trên 85%.</p>`,
        metaDescription:
          'VDCD hỗ trợ hơn 2.000 người dân Gia Lai cài đặt ứng dụng số qua phong trào Bình dân học vụ số.',
        publishedAt: '2026-04-20T08:00:00.000Z',
        programIndex: null,
        projectIndex: null,
        solutionIndex: null,
      },
    ];

    await articleRepo.save(
      articleData.map((a) => {
        return articleRepo.create({
          title: a.title,
          slug: a.slug,
          content: convertHtmlToBlocks(a.content),
          thumbnail: `https://picsum.photos/seed/${a.slug}/800/500`,
          thumbnailFileId: `article-thumb-${a.slug}`,
          category: a.category,
          tags: a.tags,
          metaTitle: `${a.title} | VDCD`,
          metaDescription: a.metaDescription,
          isPublished: true,
          publishedAt: new Date(a.publishedAt),
          ...(a.projectIndex !== null
            ? { project: projects[a.projectIndex] }
            : {}),
          ...(a.programIndex !== null
            ? { program: programs[a.programIndex] }
            : {}),
          ...(a.solutionIndex !== null
            ? { solution: solutions[a.solutionIndex] }
            : {}),
        });
      }),
    );
    console.log(`   → ${articleData.length} articles`);

    // ── 11. Jobs ───────────────────────────────────────────────────
    console.log('💼 Seeding jobs...');
    const jobRepo = queryRunner.manager.getRepository(Job);
    const jobData = [
      {
        title: 'Kỹ sư phần mềm Full-stack',
        slug: 'ky-su-phan-mem-fullstack',
        department: 'Kỹ thuật',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '15 - 25 triệu',
        deadline: new Date('2026-09-30'),
        experience: '1 - 3 năm',
        tags: ['NestJS', 'Next.js', 'TypeScript', 'PostgreSQL', 'Docker'],
        isUrgent: true,
        isActive: true,
        description:
          '## Mô tả công việc\n\nThiết kế và phát triển các ứng dụng web, RESTful API và hệ thống quản lý nội bộ phục vụ chuyển đổi số.\n\n- Phát triển frontend với Next.js và backend với NestJS.\n- Thiết kế database schema với TypeORM + PostgreSQL.\n- Tích hợp ImageKit, Gmail SMTP, Redis cache.\n- Code review và đảm bảo coverage > 80%.',
        requirements:
          '## Yêu cầu\n\n- Tốt nghiệp ĐH chuyên ngành CNTT.\n- 1+ năm kinh nghiệm TypeScript, Node.js.\n- Thành thạo React/Next.js, NestJS.\n- Hiểu biết PostgreSQL, Redis, Docker.',
        benefits:
          '## Quyền lợi\n\n- Lương: 15 - 25 triệu.\n- Thưởng KPI + dự án + Tết.\n- BHXH, BHYT + VDCD Care.\n- Tài trợ 100% chứng chỉ quốc tế.\n- Hybrid work, nghỉ phép 14 ngày/năm.',
      },
      {
        title: 'Kỹ sư IoT / Nhúng',
        slug: 'ky-su-iot-nhung',
        department: 'Kỹ thuật',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '20 - 35 triệu',
        deadline: new Date('2026-09-30'),
        experience: '2 - 5 năm',
        tags: ['ESP32', 'STM32', 'MQTT', 'LoRa', 'C/C++', 'Python'],
        isUrgent: true,
        isActive: true,
        description:
          '## Mô tả công việc\n\nNghiên cứu và triển khai giải pháp IoT phục vụ nông nghiệp thông minh, giám sát môi trường tại Tây Nguyên.\n\n- Thiết kế mạch, lập trình firmware ESP32/STM32.\n- Tích hợp MQTT, LoRaWAN với cloud backend.\n- Xây dựng dashboard giám sát realtime.\n- Khảo sát thực địa và lắp đặt thiết bị.',
        requirements:
          '## Yêu cầu\n\n- Tốt nghiệp ĐH Điện tử, Tự động hóa hoặc CNTT.\n- 2+ năm lập trình nhúng.\n- Thành thạo C/C++, Python.\n- Hiểu biết MQTT, CoAP, LoRaWAN.',
        benefits:
          '## Quyền lợi\n\n- Lương: 20 - 35 triệu.\n- Thưởng KPI + dự án.\n- Tiếp cận thiết bị công nghệ mới nhất.\n- Nghiên cứu thực địa Tây Nguyên.',
      },
      {
        title: 'Chuyên viên Tư vấn Chuyển đổi Số',
        slug: 'chuyen-vien-tu-van-chuyen-doi-so',
        department: 'Tư vấn & Triển khai',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '15 - 25 triệu',
        deadline: new Date('2026-09-30'),
        experience: '1 - 3 năm',
        tags: ['Digital Transformation', 'Business Analysis', 'Agile', 'BPMN'],
        isUrgent: false,
        isActive: true,
        description:
          '## Mô tả công việc\n\nTư vấn chuyển đổi số cho cơ quan nhà nước và doanh nghiệp tại Gia Lai.\n\n- Khảo sát, phân tích nhu cầu chuyển đổi số.\n- Xây dựng đề xuất giải pháp và roadmap.\n- Chuyển yêu cầu thành spec kỹ thuật.\n- Đào tạo khách hàng sử dụng hệ thống.',
        requirements:
          '## Yêu cầu\n\n- Tốt nghiệp ĐH CNTT, QTKD hoặc tương đương.\n- Hiểu biết chuyển đổi số, chính quyền điện tử.\n- Kỹ năng phân tích nghiệp vụ, viết tài liệu.\n- Ưu tiên có PMP, Scrum Master.',
        benefits:
          '## Quyền lợi\n\n- Lương: 15 - 25 triệu.\n- Phụ cấp công tác, di chuyển.\n- Thưởng theo dự án.\n- Đào tạo nâng cao kỹ năng tư vấn.',
      },
      {
        title: 'Chuyên viên Marketing Số',
        slug: 'chuyen-vien-marketing-so',
        department: 'Marketing',
        location: 'TP. Pleiku, Gia Lai / Remote',
        type: 'full-time',
        salaryRange: '12 - 18 triệu',
        deadline: new Date('2026-09-30'),
        experience: '1 - 2 năm',
        tags: [
          'SEO',
          'Google Ads',
          'Facebook Ads',
          'Content Marketing',
          'Analytics',
        ],
        isUrgent: false,
        isActive: true,
        description:
          '## Mô tả công việc\n\nTriển khai chiến lược marketing số cho VDCD Group.\n\n- Quản lý chiến dịch Google Ads, Facebook Ads, LinkedIn.\n- Sản xuất content (bài viết, video, infographic).\n- Phân tích hiệu suất, báo cáo ROI.\n- Quản lý website và social media.',
        requirements:
          '## Yêu cầu\n\n- Tốt nghiệp ĐH Marketing, Truyền thông.\n- 1+ năm Digital Marketing.\n- Thành thạo Google Analytics, Google Ads.\n- Kỹ năng viết content tốt.',
        benefits:
          '## Quyền lợi\n\n- Lương: 12 - 18 triệu.\n- Hỗ trợ làm việc remote.\n- Ngân sách quảng cáo thực hành.\n- Đào tạo nâng cao marketing.',
      },
      {
        title: 'Lập trình viên Full-stack Senior (NestJS + Next.js)',
        slug: 'lap-trinh-vien-fullstack-senior',
        department: 'Kỹ thuật',
        location: 'Remote',
        type: 'full-time',
        salaryRange: '25 - 45 triệu',
        deadline: new Date('2026-09-30'),
        experience: '3 - 5 năm',
        tags: [
          'NestJS',
          'Next.js',
          'TypeScript',
          'GraphQL',
          'Redis',
          'Kubernetes',
        ],
        isUrgent: false,
        isActive: true,
        description:
          '## Mô tả công việc\n\nDẫn dắt kỹ thuật, phát triển hệ thống phần mềm quy mô lớn. 100% remote.\n\n- Kiến trúc hệ thống, thiết kế API.\n- Mentoring junior developers, code review.\n- Tối ưu hiệu năng và bảo mật.\n- Nghiên cứu áp dụng công nghệ mới.',
        requirements:
          '## Yêu cầu\n\n- 3+ năm Full-stack development.\n- Expert TypeScript, NestJS, Next.js.\n- Thành thạo PostgreSQL, Redis, Docker, CI/CD.\n- Kinh nghiệm microservices, message queue.',
        benefits:
          '## Quyền lợi\n\n- Lương: 25 - 45 triệu.\n- 100% remote.\n- Trang bị thiết bị làm việc.\n- Stock option cho nhân sự cốt lõi.',
      },
      {
        title: 'Thực tập sinh Phân tích Dữ liệu',
        slug: 'thuc-tap-sinh-phan-tich-du-lieu',
        department: 'Data & AI',
        location: 'TP. Pleiku, Gia Lai',
        type: 'intern',
        salaryRange: '3 - 5 triệu',
        deadline: new Date('2026-09-30'),
        experience: 'Không yêu cầu',
        tags: ['Python', 'SQL', 'Power BI', 'Pandas', 'Machine Learning'],
        isUrgent: false,
        isActive: true,
        description:
          '## Mô tả công việc\n\nThực tập 6 tháng tại phòng Data & AI.\n\n- Thu thập, làm sạch và xử lý dữ liệu.\n- Xây dựng dashboard Power BI.\n- Hỗ trợ xây dựng mô hình ML đơn giản.\n- Tham gia seminar và đào tạo nội bộ.',
        requirements:
          '## Yêu cầu\n\n- Sinh viên năm cuối hoặc mới tốt nghiệp CNTT, Toán, Thống kê.\n- Kiến thức cơ bản Python, SQL.\n- Ham học hỏi, chủ động.\n- Làm việc 5 ngày/tuần tại văn phòng.',
        benefits:
          '## Quyền lợi\n\n- Trợ cấp: 3 - 5 triệu/tháng.\n- Mentoring bởi Senior Data Engineer.\n- Cơ hội chính thức sau thực tập.\n- Chứng nhận hoàn thành chương trình.',
      },
    ];

    await jobRepo.save(jobData.map((j) => jobRepo.create(j)));
    console.log(`   → ${jobData.length} jobs`);

    // ── 12. Leads ───────────────────────────────────────────────────
    console.log('✉️  Seeding leads...');
    const leadRepo = queryRunner.manager.getRepository(Lead);
    const leadData = [
      // ── Career form leads (ứng tuyển) ──
      {
        fullName: 'Nguyễn Văn An',
        email: 'nguyenvanan@gmail.com',
        phone: '0912345678',
        subject: '[Ứng tuyển] Kỹ sư phần mềm Full-stack',
        message: '',
        attachment: 'https://ik.imagekit.io/vdcd/cv/nguyen-van-an-cv.pdf',
        dob: new Date('1998-05-15'),
        address: 'TP. Pleiku, Gia Lai',
        experienceYears: '1 - 3 năm',
        expectedSalary: '15 - 20 triệu',
        portfolioUrl: 'https://github.com/nguyenvanan',
        coverLetter:
          'Tôi rất hứng thú với vị trí Kỹ sư Full-stack tại VDCD. Với 2 năm kinh nghiệm NestJS + Next.js, tôi tin mình có thể đóng góp tốt cho đội ngũ phát triển sản phẩm chuyển đổi số của công ty.',
        source: 'career_form',
        isRead: false,
      },
      {
        fullName: 'Trần Thị Bình',
        email: 'tranthib@gmail.com',
        phone: '0987654321',
        subject: '[Ứng tuyển] Kỹ sư IoT / Nhúng',
        message: '',
        attachment: 'https://ik.imagekit.io/vdcd/cv/tran-thi-binh-cv.pdf',
        dob: new Date('1995-11-20'),
        address: 'TP. Buôn Ma Thuột, Đắk Lắk',
        experienceYears: '2 - 5 năm',
        expectedSalary: '25 - 30 triệu',
        portfolioUrl: 'https://linkedin.com/in/tranthib',
        coverLetter:
          'Với 3 năm kinh nghiệm lập trình nhúng ESP32 và tích hợp MQTT/LoRa, tôi mong muốn được đồng hành cùng VDCD triển khai các giải pháp IoT cho nông nghiệp Tây Nguyên.',
        source: 'career_form',
        isRead: true,
      },
      {
        fullName: 'Lê Hoàng Cường',
        email: 'lehoangcuong@outlook.com',
        phone: '0905123456',
        subject: '[Ứng tuyển] Lập trình viên Full-stack Senior',
        message: '',
        attachment: 'https://ik.imagekit.io/vdcd/cv/le-hoang-cuong-cv.pdf',
        dob: new Date('1993-03-08'),
        address: 'Quận 7, TP. Hồ Chí Minh',
        experienceYears: '3 - 5 năm',
        expectedSalary: '35 - 40 triệu',
        portfolioUrl: 'https://github.com/lhcuong',
        coverLetter:
          'Tôi có 5 năm kinh nghiệm Full-stack với TypeScript, NestJS, Next.js. Hiện đang tìm kiếm cơ hội remote để đóng góp cho các dự án chuyển đổi số có tác động xã hội.',
        source: 'career_form',
        isRead: false,
      },
      {
        fullName: 'Phạm Minh Đức',
        email: 'phamminhduc@gmail.com',
        phone: '0918765432',
        subject: '[Ứng tuyển] Chuyên viên Marketing Số',
        message: '',
        attachment: 'https://ik.imagekit.io/vdcd/cv/pham-minh-duc-cv.pdf',
        dob: new Date('2000-07-25'),
        address: 'TP. Pleiku, Gia Lai',
        experienceYears: '1 - 2 năm',
        expectedSalary: '14 - 16 triệu',
        portfolioUrl: 'https://behance.net/phamminhduc',
        coverLetter:
          'Là người con Gia Lai, tôi rất muốn đóng góp cho sự phát triển công nghệ tại quê hương. Với kinh nghiệm Google Ads và content marketing, tôi tự tin đáp ứng yêu cầu công việc.',
        source: 'career_form',
        isRead: true,
      },
      {
        fullName: 'Võ Thị Hạnh',
        email: 'vothihanh.sv@gmail.com',
        phone: '0933456789',
        subject: '[Ứng tuyển] Thực tập sinh Phân tích Dữ liệu',
        message: '',
        dob: new Date('2003-12-10'),
        address: 'Huyện Chư Sê, Gia Lai',
        experienceYears: 'Không yêu cầu',
        expectedSalary: '4 - 5 triệu',
        coverLetter:
          'Em là sinh viên năm cuối ngành Toán ứng dụng, Đại học Quy Nhơn. Em có kiến thức Python, SQL và rất mong được thực tập tại VDCD để học hỏi thực tế.',
        source: 'career_form',
        isRead: false,
      },
      // ── Contact form leads (liên hệ) ──
      {
        fullName: 'Nguyễn Thị Mai',
        email: 'ntmai@ubndpleiku.gov.vn',
        phone: '0269381xxxx',
        subject: 'Hỏi về giải pháp chuyển đổi số cho UBND',
        message:
          'Chúng tôi muốn tìm hiểu về giải pháp số hóa quy trình quản lý hành chính cho UBND TP. Pleiku. Xin vui lòng liên hệ để trao đổi chi tiết.',
        source: 'contact_form',
        isRead: true,
      },
      {
        fullName: 'Trần Văn Phúc',
        email: 'phuc.tran@htxgialai.vn',
        phone: '0905987654',
        subject: 'Tư vấn giải pháp IoT nông nghiệp',
        message:
          'HTX chúng tôi đang canh tác 50ha cà phê tại Đắk Đoa. Muốn tìm hiểu hệ thống giám sát IoT tưới tự động và cảm biến đất của VDCD.',
        source: 'contact_form',
        isRead: false,
      },
      {
        fullName: 'Lê Quốc Hùng',
        email: 'hung.lq@doanhnghiep.vn',
        phone: '0911222333',
        subject: 'Hợp tác triển khai AutoTimelapse cho công trình',
        message:
          'Công ty xây dựng chúng tôi đang thi công dự án tại Kon Tum, muốn triển khai giải pháp AutoTimelapse giám sát tiến độ. Xin báo giá và demo.',
        source: 'contact_form',
        isRead: false,
      },
    ];
    await leadRepo.save(leadData.map((l) => leadRepo.create(l)));
    console.log(`   → ${leadData.length} leads`);

    await queryRunner.commitTransaction();
    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Tài khoản đăng nhập:');
    console.log('   superadmin@vdcd.vn  /  Admin@123456');
    console.log('   editor@vdcd.vn      /  Editor@123456');
    console.log('   viewer@vdcd.vn      /  Viewer@123456');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('\n❌ Seed failed, rolled back:', err);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seed();
