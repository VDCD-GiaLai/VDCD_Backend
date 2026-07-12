import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/vi';

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
    await queryRunner.query('TRUNCATE TABLE solution CASCADE');
    await queryRunner.query('TRUNCATE TABLE program CASCADE');
    await queryRunner.query('TRUNCATE TABLE slide CASCADE');
    await queryRunner.query('TRUNCATE TABLE partner CASCADE');
    await queryRunner.query('TRUNCATE TABLE province CASCADE');
    await queryRunner.query('TRUNCATE TABLE operation_field CASCADE');
    await queryRunner.query('TRUNCATE TABLE organization CASCADE');
    await queryRunner.query('TRUNCATE TABLE admin_user CASCADE');
    await queryRunner.query('TRUNCATE TABLE job CASCADE');
    await queryRunner.query('TRUNCATE TABLE lead CASCADE');
    await queryRunner.query('TRUNCATE TABLE upload_temp CASCADE');

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
    console.log(`   → ${users.length} admin users`);

    // ── 2. Organization ────────────────────────────────────────────
    console.log('🏢 Seeding organization...');
    const orgRepo = queryRunner.manager.getRepository(Organization);
    await orgRepo.save(
      orgRepo.create({
        name: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
        tagline: 'Kết nối – Sáng tạo – Phát triển',
        description: `Trung tâm Đổi mới Sáng tạo Gia Lai giữ vai trò cầu nối trong hệ sinh thái đổi mới sáng tạo của tỉnh, gắn kết Nhà nước, Doanh nghiệp, Startup, Chuyên gia và Quỹ đầu tư. Với năng lực tư vấn, chuyển giao và triển khai công nghệ, Trung tâm đưa các giải pháp hiện đại vào thực tiễn phát triển kinh tế – xã hội của địa phương.`,
        mission:
          'Thúc đẩy đổi mới sáng tạo, chuyển đổi số và phát triển bền vững cho tỉnh Gia Lai và khu vực Tây Nguyên.',
        vision:
          'Trở thành trung tâm đổi mới sáng tạo hàng đầu khu vực Tây Nguyên vào năm 2030.',
        coreValues: 'Sáng tạo – Chính trực – Hợp tác – Tác động',
        foundedYear: 2020,
        stats: {
          provinces: 12,
          centers: 8,
          projects: 45,
          staff: 60,
          partners: 30,
        },
        socialLinks: {
          facebook: 'https://facebook.com/vdcd.vn',
          youtube: 'https://youtube.com/@vdcd',
          zalo: 'https://zalo.me/vdcd',
          linkedin: 'https://linkedin.com/company/vdcd',
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

    const provinceMap = Object.fromEntries(provinces.map((p) => [p.code, p]));

    // ── 5. Partners ────────────────────────────────────────────────
    console.log('🤝 Seeding partners...');
    const partnerRepo = queryRunner.manager.getRepository(Partner);
    const partnerNames = [
      'UBND tỉnh Gia Lai',
      'Sở Khoa học & Công nghệ Gia Lai',
      'Trường Đại học FPT',
      'Tập đoàn Viettel',
      'Ngân hàng BIDV',
      'Tập đoàn TH True Milk',
      'Công ty HAGL Agrico',
      'Quỹ đầu tư Mekong Capital',
      'Vietnam Silicon Valley',
      'Trung tâm Hỗ trợ Khởi nghiệp Quốc gia (NSSC)',
      'Tập đoàn FPT',
      'Vingroup',
    ];
    const partners = await partnerRepo.save(
      partnerNames.map((name, i) =>
        partnerRepo.create({
          name,
          logo: `https://ik.imagekit.io/vdcd/partners/partner-${i + 1}.png`,
          logoFileId: `partner-logo-${i + 1}`,
          websiteUrl: `https://partner${i + 1}.vn`,
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
        title: 'Kết nối – Sáng tạo – Phát triển',
        subTitle: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
        description:
          'Trung tâm Đổi mới Sáng tạo Gia Lai – cầu nối giữa doanh nghiệp, nhà nước và cộng đồng khởi nghiệp.',
        ctaText: 'Tìm hiểu thêm',
        ctaUrl: '/ve-chung-toi',
      },
      {
        title: 'Chuyển đổi số cho doanh nghiệp Tây Nguyên',
        subTitle: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
        description:
          'Chúng tôi đồng hành cùng hàng trăm doanh nghiệp trong hành trình chuyển đổi số toàn diện.',
        ctaText: 'Xem giải pháp',
        ctaUrl: '/chuong-trinh-giai-phap/giai-phap',
      },
      {
        title: 'Nông nghiệp công nghệ cao – Tương lai xanh',
        subTitle: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
        description:
          'Ứng dụng IoT, AI và dữ liệu lớn vào sản xuất nông nghiệp, nâng cao năng suất và giá trị.',
        ctaText: 'Xem dự án',
        ctaUrl: '/du-an',
      },
      {
        title: 'Hồ sơ năng lực VDCD 2024',
        subTitle: 'Trung tâm Đổi mới Sáng tạo Gia Lai',
        description:
          'Khám phá năng lực, dự án và hệ sinh thái đổi mới sáng tạo của chúng tôi.',
        ctaText: 'Tải hồ sơ',
        ctaUrl: '/ho-so-nang-luc',
      },
    ];
    const slides = await slideRepo.save(
      slideData.map((s, i) =>
        slideRepo.create({
          ...s,
          imageUrl: `https://ik.imagekit.io/vdcd/slides/slide-${i + 1}.jpg`,
          imageFileId: `slide-image-${i + 1}`,
          order: i,
          isActive: true,
        }),
      ),
    );
    console.log(`   → ${slides.length} slides`);

    // ── 7. Programs ────────────────────────────────────────────────
    console.log('📋 Seeding programs...');
    const programRepo = queryRunner.manager.getRepository(Program);
    const programData = [
      {
        title: 'Chương trình Tăng tốc Khởi nghiệp Tây Nguyên',
        slug: 'tang-toc-khoi-nghiep-tay-nguyen',
        shortDescription:
          'Chương trình hỗ trợ 50 startup tiềm năng khu vực Tây Nguyên với mentoring, vốn hạt giống và kết nối nhà đầu tư.',
        content: `## Tổng quan\n\nChương trình Tăng tốc Khởi nghiệp Tây Nguyên là sáng kiến hàng đầu của VDCD nhằm phát triển hệ sinh thái khởi nghiệp khu vực...\n\n## Mục tiêu\n\n- Hỗ trợ 50 startup/năm\n- Kết nối với 20+ nhà đầu tư\n- Tỷ lệ startup được đầu tư: 30%`,
        fieldIndex: 1,
        metaTitle: 'Chương trình Tăng tốc Khởi nghiệp Tây Nguyên | VDCD',
        metaDescription:
          'Hỗ trợ startup Tây Nguyên với mentoring, vốn hạt giống và kết nối nhà đầu tư. Đăng ký ngay!',
      },
      {
        title: 'Chương trình Chuyển đổi số SME',
        slug: 'chuyen-doi-so-sme',
        shortDescription:
          'Hỗ trợ doanh nghiệp vừa và nhỏ (SME) tại Tây Nguyên ứng dụng công nghệ số vào quản lý và vận hành.',
        content: `## Về chương trình\n\nChương trình Chuyển đổi số SME cung cấp lộ trình và công cụ giúp doanh nghiệp vừa và nhỏ chuyển đổi số hiệu quả...\n\n## Nội dung hỗ trợ\n\n- Đánh giá mức độ sẵn sàng số\n- Tư vấn lộ trình chuyển đổi\n- Hỗ trợ triển khai phần mềm`,
        fieldIndex: 1,
        metaTitle: 'Chương trình Chuyển đổi số SME | VDCD',
        metaDescription:
          'Hỗ trợ SME Tây Nguyên chuyển đổi số toàn diện. Đăng ký tư vấn miễn phí.',
      },
      {
        title: 'Chương trình Nông nghiệp 4.0',
        slug: 'nong-nghiep-4-0',
        shortDescription:
          'Ứng dụng công nghệ IoT, AI và phân tích dữ liệu vào sản xuất nông nghiệp, nâng cao năng suất và giảm chi phí.',
        content: `## Giới thiệu\n\nChương trình Nông nghiệp 4.0 hướng đến việc hiện đại hóa ngành nông nghiệp Tây Nguyên thông qua ứng dụng công nghệ tiên tiến...`,
        fieldIndex: 0,
        metaTitle: 'Chương trình Nông nghiệp 4.0 | VDCD',
        metaDescription:
          'Ứng dụng IoT và AI vào sản xuất nông nghiệp Tây Nguyên. Nâng cao năng suất, giảm chi phí.',
      },
      {
        title: 'Chương trình Đào tạo Nhân lực Số',
        slug: 'dao-tao-nhan-luc-so',
        shortDescription:
          'Đào tạo kỹ năng số cho 1.000 cán bộ, doanh nhân và sinh viên tại khu vực Tây Nguyên mỗi năm.',
        content: `## Mục tiêu\n\nChương trình hướng đến xây dựng nguồn nhân lực chất lượng cao trong lĩnh vực công nghệ số cho khu vực Tây Nguyên...`,
        fieldIndex: 2,
        metaTitle: 'Chương trình Đào tạo Nhân lực Số | VDCD',
        metaDescription:
          'Đào tạo kỹ năng số cho cán bộ và doanh nhân Tây Nguyên. Đăng ký học ngay.',
      },
    ];

    const programs = await programRepo.save(
      programData.map((p) =>
        programRepo.create({
          title: p.title,
          slug: p.slug,
          shortDescription: p.shortDescription,
          content: p.content,
          thumbnail: `https://ik.imagekit.io/vdcd/thumbnails/program-${p.slug}.jpg`,
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
        title: 'Nền tảng Quản lý Nông trại Thông minh',
        slug: 'quan-ly-nong-trai-thong-minh',
        shortDescription:
          'Hệ thống IoT và AI giúp nông dân theo dõi, phân tích và tối ưu hóa sản xuất nông nghiệp theo thời gian thực.',
        content: `## Giải pháp\n\nNền tảng tích hợp cảm biến IoT, camera AI và phân tích dữ liệu lớn để cung cấp thông tin chính xác về đất, nước, thời tiết và cây trồng...`,
        fieldIndex: 0,
        metaTitle: 'Giải pháp Quản lý Nông trại Thông minh | VDCD',
        metaDescription:
          'Ứng dụng IoT và AI quản lý nông trại hiệu quả. Tăng năng suất 30%, giảm chi phí 20%.',
      },
      {
        title: 'Hệ thống ERP cho SME',
        slug: 'erp-cho-sme',
        shortDescription:
          'Giải pháp quản trị doanh nghiệp toàn diện, tích hợp kế toán, nhân sự, kho hàng và bán hàng trên một nền tảng.',
        content: `## Tổng quan\n\nHệ thống ERP được thiết kế đặc biệt cho doanh nghiệp vừa và nhỏ tại Việt Nam, dễ triển khai và phù hợp ngân sách...`,
        fieldIndex: 1,
        metaTitle: 'Giải pháp ERP cho SME | VDCD',
        metaDescription:
          'Phần mềm quản trị doanh nghiệp toàn diện cho SME. Dùng thử miễn phí 30 ngày.',
      },
      {
        title: 'Nền tảng Du lịch Thông minh',
        slug: 'du-lich-thong-minh',
        shortDescription:
          'Hệ sinh thái số kết nối khách du lịch, doanh nghiệp lữ hành và điểm đến tại Tây Nguyên.',
        content: `## Giới thiệu\n\nNền tảng Du lịch Thông minh cung cấp công cụ số hóa toàn bộ chuỗi giá trị du lịch, từ đặt phòng, tour đến trải nghiệm tại điểm đến...`,
        fieldIndex: 4,
        metaTitle: 'Giải pháp Du lịch Thông minh Tây Nguyên | VDCD',
        metaDescription:
          'Số hóa ngành du lịch Tây Nguyên. Kết nối khách hàng và doanh nghiệp lữ hành hiệu quả.',
      },
      {
        title: 'Hệ thống Quản lý Y tế Điện tử',
        slug: 'quan-ly-y-te-dien-tu',
        shortDescription:
          'Giải pháp số hóa hồ sơ bệnh nhân, đặt lịch khám và quản lý cơ sở y tế cho bệnh viện và phòng khám.',
        content: `## Mô tả giải pháp\n\nHệ thống quản lý y tế điện tử toàn diện giúp các cơ sở y tế nâng cao chất lượng dịch vụ và hiệu quả vận hành...`,
        fieldIndex: 3,
        metaTitle: 'Giải pháp Quản lý Y tế Điện tử | VDCD',
        metaDescription:
          'Số hóa bệnh viện và phòng khám. Hồ sơ điện tử, đặt lịch online, quản lý toàn diện.',
      },
    ];

    const solutions = await solutionRepo.save(
      solutionData.map((s) =>
        solutionRepo.create({
          title: s.title,
          slug: s.slug,
          shortDescription: s.shortDescription,
          content: s.content,
          thumbnail: `https://ik.imagekit.io/vdcd/thumbnails/solution-${s.slug}.jpg`,
          thumbnailFileId: `solution-thumb-${s.slug}`,
          field: fields[s.fieldIndex],
          metaTitle: s.metaTitle,
          metaDescription: s.metaDescription,
          isPublished: true,
        }),
      ),
    );
    console.log(`   → ${solutions.length} solutions`);

    // ── 9. Projects ────────────────────────────────────────────────
    console.log('🏗️  Seeding projects...');
    const projectRepo = queryRunner.manager.getRepository(Project);
    const imageRepo = queryRunner.manager.getRepository(ProjectImage);

    const projectData = [
      {
        title: 'Xây dựng Hệ sinh thái Khởi nghiệp Gia Lai',
        slug: 'he-sinh-thai-khoi-nghiep-gia-lai',
        overview: `## Tổng quan\n\nDự án xây dựng hệ sinh thái khởi nghiệp toàn diện tại Gia Lai, bao gồm không gian làm việc chung, chương trình mentoring và quỹ hỗ trợ khởi nghiệp...\n\n## Kết quả đạt được\n\n- 120 startup được hỗ trợ\n- 15 startup nhận đầu tư\n- Tổng vốn huy động: 45 tỷ đồng`,
        provinceCode: 'GL',
        fieldIndex: 1,
        year: 2023,
      },
      {
        title: 'Chuyển đổi số Hợp tác xã Nông nghiệp Đắk Lắk',
        slug: 'chuyen-doi-so-htx-nong-nghiep-dak-lak',
        overview: `## Giới thiệu\n\nDự án triển khai giải pháp số hóa toàn bộ hoạt động của 20 hợp tác xã nông nghiệp tại Đắk Lắk, từ quản lý sản xuất đến truy xuất nguồn gốc và kết nối thị trường...\n\n## Tác động\n\n- 20 HTX được số hóa\n- 500 hộ nông dân hưởng lợi\n- Doanh thu tăng trung bình 25%`,
        provinceCode: 'DL',
        fieldIndex: 0,
        year: 2023,
      },
      {
        title: 'Ứng dụng IoT trong Canh tác Cà phê Kon Tum',
        slug: 'iot-canh-tac-ca-phe-kon-tum',
        overview: `## Mô tả\n\nTriển khai hệ thống cảm biến IoT và phần mềm phân tích dữ liệu cho 500 ha cà phê tại Kon Tum, giúp nông dân tối ưu hóa tưới tiêu, bón phân và phát hiện sâu bệnh sớm...\n\n## Kết quả\n\n- 500 ha cà phê được lắp đặt IoT\n- Tiết kiệm 30% nước tưới\n- Năng suất tăng 20%`,
        provinceCode: 'KT',
        fieldIndex: 0,
        year: 2022,
      },
      {
        title: 'Nền tảng Du lịch Thông minh Lâm Đồng',
        slug: 'du-lich-thong-minh-lam-dong',
        overview: `## Tổng quan\n\nXây dựng nền tảng số kết nối toàn bộ chuỗi giá trị du lịch tại Lâm Đồng – Đà Lạt, từ đặt phòng, tour trải nghiệm đến hướng dẫn du lịch thông minh...\n\n## Thành tựu\n\n- 200 cơ sở lưu trú tham gia\n- 50.000 lượt đặt phòng qua nền tảng\n- Doanh thu du lịch tăng 35%`,
        provinceCode: 'LD',
        fieldIndex: 4,
        year: 2023,
      },
      {
        title: 'Hệ thống Quản lý Y tế Điện tử Bệnh viện Gia Lai',
        slug: 'quan-ly-y-te-benh-vien-gia-lai',
        overview: `## Mô tả dự án\n\nTriển khai hệ thống quản lý y tế điện tử toàn diện cho Bệnh viện Đa khoa tỉnh Gia Lai với 500 giường bệnh...\n\n## Kết quả\n\n- 100% hồ sơ bệnh nhân được số hóa\n- Thời gian chờ khám giảm 40%\n- Hài lòng bệnh nhân đạt 4.5/5`,
        provinceCode: 'GL',
        fieldIndex: 3,
        year: 2022,
      },
      {
        title: 'Chương trình Đào tạo Kỹ năng Số Đắk Nông',
        slug: 'dao-tao-ky-nang-so-dak-nong',
        overview: `## Giới thiệu\n\nChương trình đào tạo kỹ năng số cho 500 cán bộ cơ quan nhà nước và 1.000 doanh nhân tại Đắk Nông...\n\n## Tác động\n\n- 1.500 người được đào tạo\n- 80% hoàn thành chứng chỉ\n- 60% áp dụng vào công việc`,
        provinceCode: 'DN',
        fieldIndex: 2,
        year: 2023,
      },
      {
        title: 'Hệ thống Năng lượng Mặt trời Nông thôn Bình Định',
        slug: 'nang-luong-mat-troi-nong-thon-binh-dinh',
        overview: `## Tổng quan\n\nDự án lắp đặt hệ thống điện mặt trời áp mái cho 200 hộ nông dân và 5 trường học tại vùng nông thôn Bình Định...\n\n## Kết quả\n\n- 200 hộ gia đình có điện sạch\n- Tiết kiệm 60% chi phí điện\n- Giảm 500 tấn CO2/năm`,
        provinceCode: 'BD',
        fieldIndex: 5,
        year: 2022,
      },
      {
        title: 'Trung tâm Đổi mới Sáng tạo Quảng Ngãi',
        slug: 'trung-tam-doi-moi-sang-tao-quang-ngai',
        overview: `## Mô tả\n\nXây dựng và vận hành Trung tâm Đổi mới Sáng tạo tại Quảng Ngãi, phục vụ cộng đồng khởi nghiệp và doanh nghiệp địa phương...\n\n## Hoạt động\n\n- Không gian coworking 500m²\n- 30 sự kiện/năm\n- 200 thành viên cộng đồng`,
        provinceCode: 'QN',
        fieldIndex: 1,
        year: 2023,
      },
      {
        title: 'Nông nghiệp Hữu cơ Công nghệ cao Đắk Lắk',
        slug: 'nong-nghiep-huu-co-cong-nghe-cao-dak-lak',
        overview: `## Tổng quan\n\nDự án chuyển đổi 300 ha canh tác truyền thống sang nông nghiệp hữu cơ kết hợp công nghệ cao tại Đắk Lắk...\n\n## Kết quả\n\n- 300 ha canh tác hữu cơ\n- Giá bán sản phẩm tăng 50%\n- 100% sản phẩm đạt tiêu chuẩn xuất khẩu`,
        provinceCode: 'DL',
        fieldIndex: 0,
        year: 2024,
      },
      {
        title: 'Ứng dụng AI trong Giáo dục Tây Nguyên',
        slug: 'ai-trong-giao-duc-tay-nguyen',
        overview: `## Mô tả\n\nTriển khai nền tảng học tập thông minh sử dụng AI để cá nhân hóa lộ trình học cho học sinh tại 50 trường THPT khu vực Tây Nguyên...\n\n## Tác động\n\n- 50 trường THPT tham gia\n- 20.000 học sinh hưởng lợi\n- Kết quả học tập cải thiện 25%`,
        provinceCode: 'GL',
        fieldIndex: 2,
        year: 2024,
      },
    ];

    const projects: Project[] = [];
    for (const p of projectData) {
      const project = await projectRepo.save(
        projectRepo.create({
          title: p.title,
          slug: p.slug,
          overview: p.overview,
          thumbnail: `https://ik.imagekit.io/vdcd/projects/${p.slug}/thumb.jpg`,
          thumbnailFileId: `project-thumb-${p.slug}`,
          field: fields[p.fieldIndex],
          province: provinceMap[p.provinceCode],
          year: p.year,
          metaTitle: `${p.title} | VDCD`,
          metaDescription: p.overview
            .split('\n')[0]
            .replace('## Tổng quan\n\n', '')
            .replace('## Giới thiệu\n\n', '')
            .replace('## Mô tả\n\n', '')
            .slice(0, 160),
          isPublished: true,
        }),
      );

      // Thêm gallery images cho mỗi project
      await imageRepo.save(
        Array.from({ length: 4 }, (_, i) =>
          imageRepo.create({
            project,
            url: `https://ik.imagekit.io/vdcd/projects/${p.slug}/image-${i + 1}.jpg`,
            fileId: `project-img-${p.slug}-${i + 1}`,
            caption: `Hình ảnh ${i + 1} – ${p.title}`,
            order: i,
          }),
        ),
      );

      projects.push(project);
    }
    console.log(`   → ${projects.length} projects với gallery images`);

    // ── 10. Articles ───────────────────────────────────────────────
    console.log('📰 Seeding articles...');
    const articleRepo = queryRunner.manager.getRepository(Article);

    const articleData = [
      // Tin tức độc lập
      {
        title: 'VDCD tham dự Diễn đàn Đổi mới Sáng tạo Quốc gia 2024',
        slug: 'vdcd-tham-du-dien-dan-doi-moi-sang-tao-2024',
        category: 'Tin tức',
        tags: 'sự kiện,đổi mới sáng tạo,quốc gia',
        projectIndex: null,
        programIndex: null,
        solutionIndex: null,
      },
      {
        title: 'VDCD ký kết hợp tác chiến lược với Tập đoàn FPT',
        slug: 'vdcd-ky-ket-hop-tac-fpt',
        category: 'Tin tức',
        tags: 'hợp tác,FPT,chuyển đổi số',
        projectIndex: null,
        programIndex: null,
        solutionIndex: null,
      },
      {
        title: '10 xu hướng công nghệ nông nghiệp năm 2024',
        slug: '10-xu-huong-cong-nghe-nong-nghiep-2024',
        category: 'Kiến thức',
        tags: 'nông nghiệp,công nghệ,xu hướng',
        projectIndex: null,
        programIndex: 2,
        solutionIndex: null,
      },
      // Bài SEO gắn với project
      {
        title: 'Hành trình xây dựng hệ sinh thái khởi nghiệp tại Gia Lai',
        slug: 'hanh-trinh-xay-dung-he-sinh-thai-khoi-nghiep-gia-lai',
        category: 'Dự án',
        tags: 'khởi nghiệp,Gia Lai,hệ sinh thái',
        projectIndex: 0,
        programIndex: null,
        solutionIndex: null,
      },
      {
        title: 'Chuyển đổi số thay đổi cuộc sống nông dân Đắk Lắk như thế nào?',
        slug: 'chuyen-doi-so-nong-dan-dak-lak',
        category: 'Dự án',
        tags: 'chuyển đổi số,nông dân,Đắk Lắk',
        projectIndex: 1,
        programIndex: null,
        solutionIndex: null,
      },
      {
        title: 'IoT trong canh tác cà phê – Câu chuyện thành công tại Kon Tum',
        slug: 'iot-canh-tac-ca-phe-kon-tum-thanh-cong',
        category: 'Dự án',
        tags: 'IoT,cà phê,Kon Tum,nông nghiệp',
        projectIndex: 2,
        programIndex: null,
        solutionIndex: 0,
      },
      // Bài SEO gắn với program
      {
        title: 'Startup Tây Nguyên: Cơ hội và thách thức trong kỷ nguyên số',
        slug: 'startup-tay-nguyen-co-hoi-thach-thuc',
        category: 'Kiến thức',
        tags: 'startup,Tây Nguyên,khởi nghiệp',
        projectIndex: null,
        programIndex: 0,
        solutionIndex: null,
      },
      {
        title: '5 bước SME Tây Nguyên bắt đầu hành trình chuyển đổi số',
        slug: '5-buoc-sme-tay-nguyen-chuyen-doi-so',
        category: 'Hướng dẫn',
        tags: 'SME,chuyển đổi số,hướng dẫn',
        projectIndex: null,
        programIndex: 1,
        solutionIndex: 1,
      },
      // Bài SEO gắn với solution
      {
        title:
          'Quản lý nông trại thông minh – Tương lai của nông nghiệp Việt Nam',
        slug: 'quan-ly-nong-trai-thong-minh-tuong-lai',
        category: 'Kiến thức',
        tags: 'nông trại thông minh,AI,IoT',
        projectIndex: null,
        programIndex: null,
        solutionIndex: 0,
      },
      {
        title: 'Du lịch Đà Lạt thay đổi nhờ nền tảng số như thế nào?',
        slug: 'du-lich-da-lat-nen-tang-so',
        category: 'Dự án',
        tags: 'du lịch,Đà Lạt,Lâm Đồng,chuyển đổi số',
        projectIndex: 3,
        programIndex: null,
        solutionIndex: 2,
      },
    ];

    const now = new Date();
    await articleRepo.save(
      articleData.map((a, i) => {
        const publishedAt = new Date(now);
        publishedAt.setDate(now.getDate() - i * 3); // cách nhau 3 ngày

        return articleRepo.create({
          title: a.title,
          slug: a.slug,
          content: `## ${a.title}\n\n${faker.lorem.paragraphs(4, '\n\n')}\n\n## Kết luận\n\n${faker.lorem.paragraph()}`,
          thumbnail: `https://ik.imagekit.io/vdcd/thumbnails/article-${a.slug}.jpg`,
          thumbnailFileId: `article-thumb-${a.slug}`,
          category: a.category,
          tags: a.tags,
          metaTitle: `${a.title} | VDCD`,
          metaDescription: faker.lorem.sentence(),
          isPublished: true,
          publishedAt,
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
        title: 'Chuyên viên Tư vấn Chuyển đổi Số',
        slug: 'chuyen-vien-tu-van-chuyen-doi-so',
        department: 'Tư vấn & Triển khai',
        location: 'Pleiku, Gia Lai',
        type: 'full-time' as const,
        salaryRange: '15 – 25 triệu',
        isUrgent: true,
      },
      {
        title: 'Kỹ sư IoT / Nhúng',
        slug: 'ky-su-iot-nhung',
        department: 'Kỹ thuật',
        location: 'Pleiku, Gia Lai',
        type: 'full-time' as const,
        salaryRange: '20 – 35 triệu',
        isUrgent: true,
      },
      {
        title: 'Chuyên viên Marketing Số',
        slug: 'chuyen-vien-marketing-so',
        department: 'Marketing',
        location: 'Pleiku, Gia Lai / Remote',
        type: 'full-time' as const,
        salaryRange: '12 – 18 triệu',
        isUrgent: false,
      },
      {
        title: 'Lập trình viên Full-stack (NestJS + Next.js)',
        slug: 'lap-trinh-vien-fullstack-nestjs-nextjs',
        department: 'Kỹ thuật',
        location: 'Remote',
        type: 'full-time' as const,
        salaryRange: '25 – 45 triệu',
        isUrgent: false,
      },
      {
        title: 'Thực tập sinh Phân tích Dữ liệu',
        slug: 'thuc-tap-sinh-phan-tich-du-lieu',
        department: 'Data & AI',
        location: 'Pleiku, Gia Lai',
        type: 'intern' as const,
        salaryRange: '3 – 5 triệu',
        isUrgent: false,
      },
      {
        title: 'Chuyên viên Phát triển Đối tác',
        slug: 'chuyen-vien-phat-trien-doi-tac',
        department: 'Kinh doanh',
        location: 'Pleiku, Gia Lai',
        type: 'full-time' as const,
        salaryRange: '18 – 28 triệu',
        isUrgent: false,
      },
    ];

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    await jobRepo.save(
      jobData.map((j) =>
        jobRepo.create({
          ...j,
          deadline,
          description: `## Mô tả công việc\n\n${faker.lorem.paragraphs(2, '\n\n')}`,
          requirements: `## Yêu cầu\n\n- ${faker.lorem.sentences(4, '\n- ')}`,
          benefits: `## Quyền lợi\n\n- Lương cạnh tranh: ${j.salaryRange}\n- ${faker.lorem.sentences(3, '\n- ')}`,
          isActive: true,
        }),
      ),
    );
    console.log(`   → ${jobData.length} jobs`);

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
