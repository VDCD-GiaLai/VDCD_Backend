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
    await queryRunner.query('TRUNCATE TABLE lead CASCADE');
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
        title: 'KIẾN TẠO HỆ SINH THÁI SỐ',
        subTitle: 'TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI',
        description:
          'Cầu nối thúc đẩy khởi nghiệp sáng tạo, chuyển giao công nghệ lõi và xây dựng hạ tầng kỹ thuật số đồng bộ, đồng hành cùng sự phát triển kinh tế số của tỉnh Gia Lai.',
        ctaText: 'Tìm hiểu thêm',
        ctaUrl: '/about-us',
        imageUrl: '/images/home/kientaotuonglai.jpeg',
      },
      {
        title: 'NÔNG NGHIỆP THÔNG MINH',
        subTitle: 'NÔNG NGHIỆP CÔNG NGHỆ CAO',
        description:
          'Ứng dụng các giải pháp số hóa IoT, tự động hóa và AI nhằm tối ưu hóa chuỗi giá trị, nâng cao năng suất và gia tăng giá trị bền vững cho nông sản chủ lực Gia Lai.',
        ctaText: 'Xem giải pháp',
        ctaUrl: '/solution',
        imageUrl: '/images/home/farm_area_drone_view.jpg',
      },
      {
        title: 'HỆ THỐNG ĐÔ THỊ SỐ',
        subTitle: 'QUẢN LÝ ĐÔ THỊ THÔNG MINH',
        description:
          'Giải pháp quản lý, giám sát và điều hành đô thị thông minh IOC giúp tối ưu hóa dịch vụ công cộng và hỗ trợ ra quyết định kịp thời cho chính quyền và doanh nghiệp.',
        ctaText: 'Xem dự án',
        ctaUrl: '/projects',
        imageUrl: '/images/home/hethongdothiso.jpg',
      },
      {
        title: 'TRUNG TÂM DỮ LIỆU VÙNG',
        subTitle: 'HẠ TẦNG KỸ THUẬT SỐ',
        description:
          'Hạ tầng lưu trữ đám mây và xử lý dữ liệu lớn chuẩn quốc tế, đảm bảo tính an toàn, bảo mật tối đa và khả năng mở rộng không giới hạn cho các tổ chức, doanh nghiệp.',
        ctaText: 'Tải hồ sơ',
        ctaUrl: '/ho-so-nang-luc',
        imageUrl: '/images/home/data_center.jpg',
      },
      {
        title: 'LIÊN KẾT PHÁT TRIỂN',
        subTitle: 'HỆ SINH THÁI VDCD GROUP',
        description:
          'Hội tụ năng lực công nghệ lõi và nguồn lực tài chính bền vững trong hệ sinh thái, làm cầu nối vững chắc đưa các giải pháp hiện đại đi vào thực tiễn cuộc sống.',
        ctaText: 'Liên hệ',
        ctaUrl: '/contact',
        imageUrl: '/images/home/quynhon_herobanner.jpg',
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

    const projectData = [
      {
        title: 'Vân Phong – Khánh Hòa',
        slug: 'van-phong-khanh-hoa',
        overview:
          'Khu kinh tế Vân Phong nằm ở phía Bắc tỉnh Khánh Hòa, với tổng quy mô các dự án lên đến hàng nghìn hecta. Bay quét địa hình được tiến hành với mục đích thu hình ảnh tổng quan về khu vực, phục vụ việc định hướng quy hoạch và lên concept cho các mục tiêu thiết kế về sau.',
        location: 'Khánh Hòa',
        category: 'Bản đồ số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg',
            caption: 'Toàn cảnh khu kinh tế Vân Phong từ trên cao',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/z6230086515847_880a32e4555a0e1a2092fafe725ba010-1-edited-1024x768.jpg',
            caption: 'Khảo sát thực địa tại Vân Phong',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited.jpg',
            caption: 'Drone bay quét địa hình khu vực ven biển',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/z6246996465902_d2b58a023e87326b3d6b828d09049fa4-1024x618-1.jpg',
            caption: 'Bản đồ địa hình số khu kinh tế',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/z6249184485226_65353c2131876581d63d52ac58854302-1024x683-1.jpg',
            caption: 'Đội ngũ khảo sát tại hiện trường',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/IMG_7134-edited-2048x1536-1-1024x768.jpg',
            caption: 'Thiết bị bay quét LiDAR',
          },
        ],
      },
      {
        title: 'Trung tâm thương mại Lotte Mall',
        slug: 'lotte-mall-vo-chi-cong',
        overview:
          'Lotte Mall Võ Chí Công là tổ hợp thương mại – dịch vụ – căn hộ quy mô lớn tại Tây Hồ, Hà Nội. Dự án yêu cầu giám sát liên tục 24/7 trên nhiều góc quay khác nhau, ghi nhận chính xác tiến độ từng hạng mục.',
        location: 'Hà Nội',
        category: 'Giám sát số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg',
            caption: 'Tổ hợp Lotte Mall nhìn từ trên cao',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/481910989_2375973832761147_7242746415740845603_n-1.jpg',
            caption: 'Hệ thống camera giám sát tại công trường',
          },
        ],
      },
      {
        title: 'Tòa nhà Becamex Bình Dương',
        slug: 'becamex-binh-duong',
        overview:
          'Becamex Tower là tòa nhà biểu tượng của thành phố mới Bình Dương. Thách thức thi công cao tầng đòi hỏi giải pháp AutoTimelapse – công nghệ điều hành công trình hiện đại, giám sát toàn diện từ móng đến hoàn thiện.',
        location: 'Bình Dương',
        category: 'Giám sát số',
        year: 2023,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
            caption: 'Becamex Tower – Biểu tượng đô thị Bình Dương',
          },
        ],
      },
      {
        title: 'The Terra An Hưng',
        slug: 'the-terra-an-hung',
        overview:
          'Dự án The Terra An Hưng là khu đô thị phức hợp với nhiều tòa nhà xây dựng song song. Thách thức lớn nhất là giám sát đồng thời nhiều hạng mục trên diện rộng và tích hợp dữ liệu vào hệ thống quản lý dự án.',
        location: 'Hà Nội',
        category: 'Giám sát số',
        year: 2023,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg',
            caption: 'Phối cảnh tổng thể The Terra An Hưng',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/the-terra-an-hung-1-1-1.jpg',
            caption: 'Giai đoạn thi công khu đô thị',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/497670130_1264939388971481_6818461079310841617_n-1024x768.jpg',
            caption: 'Hệ thống camera giám sát tại công trường',
          },
        ],
      },
      {
        title: 'Tháp Bà Ponagar',
        slug: 'thap-ba-ponagar',
        overview:
          'Tháp Bà Ponagar là di tích lịch sử cấp quốc gia với hơn 1.000 năm tuổi. Việc khảo sát và số hóa phải đảm bảo không gây ảnh hưởng đến kiến trúc cổ, đồng thời cung cấp dữ liệu chính xác về hiện trạng công trình.',
        location: 'Khánh Hòa',
        category: 'Bản đồ số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
            caption: 'Tháp Bà Ponagar – Di sản Chăm Pa',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-1024x768.jpg',
            caption: 'Bản vẽ 2D khảo sát di tích',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/3d-thap-ba-ponagar.png',
            caption: 'Mô hình 3D quần thể tháp',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/z6227939792173_a593ec4952ff2e1679658730cd16b032-1024x582-1.jpg',
            caption: 'Toàn cảnh khu di tích từ trên cao',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/screenshot1-15-1024x490-1.jpg',
            caption: 'VR360 tham quan thực tế ảo',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-2-1-1024x768.jpg',
            caption: 'Chi tiết bản vẽ kiến trúc',
          },
        ],
      },
      {
        title: 'Sun Marina Hạ Long',
        slug: 'sun-marina-ha-long',
        overview:
          'Sun Marina Hạ Long nằm trong vịnh Hạ Long — di sản thiên nhiên thế giới. Công trình xây dựng phải tuân thủ nghiêm ngặt các quy định bảo vệ môi trường, đồng thời đảm bảo tiến độ thi công trong điều kiện khí hậu biển.',
        location: 'Quảng Ninh',
        category: 'Giám sát số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg',
            caption: 'Sun Marina Hạ Long – Đô thị ven biển',
          },
        ],
      },
      {
        title: 'Sơn Trà – Đà Nẵng',
        slug: 'son-tra-da-nang',
        overview:
          'Bán đảo Sơn Trà có địa hình phức tạp với rừng nguyên sinh và hệ sinh thái nhạy cảm. Việc khảo sát đòi hỏi bay quét drone chính xác trên địa hình đồi núi ven biển và xử lý dữ liệu lớn thành sản phẩm trắc địa phục vụ quy hoạch.',
        location: 'Đà Nẵng',
        category: 'Bản đồ số',
        year: 2025,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png',
            caption: 'Toàn cảnh bán đảo Sơn Trà',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/467126771_1099508525515820_4642314407752063642_n-1024x683-1.jpg',
            caption: 'Đội ngũ khảo sát tại Sơn Trà',
          },
        ],
      },
      {
        title: 'Sân bay Vân Đồn',
        slug: 'san-bay-van-don',
        overview:
          'Sân bay Vân Đồn là sân bay tư nhân đầu tiên tại Việt Nam. Quy mô xây dựng rộng lớn yêu cầu khảo sát đa điểm với ứng dụng công nghệ LiDAR Scan, bao phủ toàn bộ khu vực đường băng, nhà ga và hạ tầng phụ trợ.',
        location: 'Quảng Ninh',
        category: 'Bản đồ số',
        year: 2023,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/467741379_1104256805040992_4651998732288142886_n-1024x512-1.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/467741379_1104256805040992_4651998732288142886_n-1024x512-1.jpg',
            caption: 'Sân bay Vân Đồn nhìn từ trên cao',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/467321399_1099508478849158_37644.jpg',
            caption: 'Quá trình khảo sát khu vực nhà ga',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/466682223_1099508235515849_3883118592529925754_n-1024x683-1.jpg',
            caption: 'Thiết bị LiDAR tại đường băng',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-edited.png',
            caption: 'Bản đồ số 3D sân bay',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_1-edited-1024x768.png',
            caption: 'Mô hình 3D nhà ga hành khách',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/screenshot1-14-1024x490-1.jpg',
            caption: 'VR360 toàn cảnh sân bay',
          },
        ],
      },
      {
        title: 'Sân Bay Quốc Tế Phú Quốc',
        slug: 'san-bay-quoc-te-phu-quoc',
        overview:
          'Cảng hàng không quốc tế Phú Quốc vận hành song song với giai đoạn mở rộng. Hệ thống giám sát phải đảm bảo an toàn hàng không tuyệt đối, không gây ảnh hưởng đến hoạt động bay. Công nghệ tiên tiến cho giám sát công trình hiệu quả.',
        location: 'Kiên Giang',
        category: 'Giám sát số',
        year: 2023,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg',
            caption: 'Cảng hàng không quốc tế Phú Quốc',
          },
        ],
      },
      {
        title: 'Nhà hát Hồ Tây',
        slug: 'nha-hat-ho-tay',
        overview:
          'Nhà hát Hồ Tây là dự án văn hóa biểu tượng của Hà Nội với kiến trúc phức tạp. Hệ thống AutoTimelapse cần ghi lại toàn bộ quá trình xây dựng với chất lượng hình ảnh cao nhất, phục vụ quản lý tiến độ và truyền thông.',
        location: 'Hà Nội',
        category: 'Giám sát số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg',
            caption: 'Phối cảnh Nhà hát Hồ Tây',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/nha-hat-ho-tay.jpg',
            caption: 'Công trường xây dựng nhà hát',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/514970510_1308500817948671_3336272050708746027_n-1-1024x768.jpg',
            caption: 'Camera AutoTimelapse lắp đặt tại công trường',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/514760343_1308500777948675_797658922111612414_n-1-1024x768.jpg',
            caption: 'Tiến độ thi công nhà hát',
          },
        ],
      },
      {
        title: 'Lễ Diễu binh 80 năm Quốc khánh',
        slug: 'le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam',
        overview:
          'Ghi hình đại lễ diễu binh kỷ niệm 80 năm Quốc khánh đòi hỏi bay drone chính xác trong không phận được kiểm soát nghiêm ngặt, với yêu cầu an ninh tuyệt đối và chất lượng hình ảnh điện ảnh.',
        location: 'Hà Nội',
        category: 'Sản xuất phim',
        year: 2025,
        coverImage: 'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg',
            caption: 'Lễ Diễu binh kỷ niệm 80 năm Quốc khánh',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/10/75474.jpg',
            caption: 'Toàn cảnh đại lễ từ trên cao',
          },
        ],
      },
      {
        title: 'Sun World Bà Nà Hills',
        slug: 'sun-world-ba-na-hills',
        overview:
          'Khu du lịch Sun World Bà Nà Hills nằm trên đỉnh núi Bà Nà ở độ cao 1.489m. Việc scan 3D toàn bộ khu vực đòi hỏi bay drone trong điều kiện thời tiết núi cao với gió mạnh, sương mù và mưa bất chợt.',
        location: 'Đà Nẵng',
        category: 'Bản đồ số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg',
            caption: 'Sun World Bà Nà Hills – Cầu Vàng',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/du-an-van-don-1-scaled.jpg',
            caption: 'Scan 3D khu vực Bà Nà',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_71-min-1024x570-1.png',
            caption: 'Mô hình 3D toàn cảnh',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_72-min-1024x593-1.png',
            caption: 'Bản vẽ 2D chi tiết',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-101052-min-1024x498-1.png',
            caption: 'Point cloud 3D khu vui chơi',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-10-135726-min-1024x492-1.png',
            caption: 'Bản vẽ tỷ lệ 1/500',
          },
        ],
      },
      {
        title: 'Điện gió Phong Nguyên Quảng Trị',
        slug: 'dien-gio-phong-nguyen-phong-huy-quang-tri',
        overview:
          'Dự án điện gió Phong Nguyên Phong Huy tại Quảng Trị triển khai trên địa hình đồi núi rộng lớn. Giám sát xây dựng turbine gió ở độ cao lớn đòi hỏi hệ thống camera chịu gió mạnh và truyền dữ liệu ổn định.',
        location: 'Quảng Trị',
        category: 'Giám sát số',
        year: 2023,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp',
            caption: 'Điện gió Quảng Trị – Timelapse',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/chi-phi-quay-timelapse-1-e1665396002939.jpg',
            caption: 'Quá trình lắp đặt turbine',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-dien-gio-quang-tri-atl-1.webp',
            caption: 'Toàn cảnh trại điện gió',
          },
        ],
      },
      {
        title: 'Cao Ốc Thương Mại Hải Phòng',
        slug: 'cao-oc-thuong-mai-hai-phong',
        overview:
          'Thiết kế cao ốc thương mại tại Hải Phòng yêu cầu phối cảnh kiến trúc 3D chất lượng cao cho cả ban ngày và ban đêm, phục vụ trình bày với nhà đầu tư và xin giấy phép xây dựng.',
        location: 'Hải Phòng',
        category: 'Thiết kế số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg',
            caption: 'Phối cảnh ban đêm cao ốc Hải Phòng',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/10/banngay01_1f0f4785d29046d19e06af1ef0ef7f19_master-1.jpg',
            caption: 'Phối cảnh ban ngày – Góc chính diện',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/10/banngay02_ea3cc501664d4538a1c6a908b4406887_master-1.jpg',
            caption: 'Phối cảnh ban ngày – Góc phối cảnh',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1.jpg',
            caption: 'Phối cảnh ban đêm – Toàn cảnh',
          },
        ],
      },
      {
        title: 'Bệnh viện dã chiến Hà Nội',
        slug: 'benh-vien-da-chien-ha-noi',
        overview:
          'Bệnh viện dã chiến Hà Nội được xây dựng thần tốc trong bối cảnh dịch COVID-19. VDCD cần triển khai hệ thống giám sát ngay lập tức để ghi lại toàn bộ quá trình xây dựng với tiến độ chạy đua thời gian.',
        location: 'Hà Nội',
        category: 'Giám sát số',
        year: 2021,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png',
            caption: 'Bệnh viện dã chiến Hà Nội – Xây dựng thần tốc',
          },
        ],
      },
      {
        title: 'Bãi Xép – Phú Yên',
        slug: 'bai-xep-phu-yen',
        overview:
          'Bãi Xép là điểm du lịch nổi tiếng tại Phú Yên với bờ biển hoang sơ. Khảo sát địa hình phục vụ thiết kế xây dựng khu du lịch đòi hỏi độ chính xác cao trên địa hình ven biển đá ghềnh phức tạp.',
        location: 'Phú Yên',
        category: 'Bản đồ số',
        year: 2024,
        coverImage:
          'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg',
        galleryImages: [
          {
            url: 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg',
            caption: 'Bãi Xép – Phú Yên từ trên cao',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_8-copy-1024x665-1.jpg',
            caption: 'Bản vẽ 2D khu vực ven biển',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_1-copy-1024x673-1.jpg',
            caption: 'Mô hình 3D bãi biển',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_4-min-1024x528-1.png',
            caption: 'Bản vẽ tỷ lệ 1/500',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-min-1024x537-1.png',
            caption: 'Point cloud 3D bãi đá',
          },
          {
            url: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_73-min-1024x537-1.png',
            caption: 'VR360 toàn cảnh bãi Xép',
          },
        ],
      },
    ];

    const projects: Project[] = [];
    for (const p of projectData) {
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
          slug: p.slug,
          overview: p.overview,
          thumbnail: p.coverImage,
          thumbnailFileId: `project-thumb-${p.slug}`,
          field: fld,
          province: prov,
          year: p.year,
          metaTitle: `${p.title} | VDCD`,
          metaDescription: p.overview.slice(0, 160),
          isPublished: true,
        }),
      );

      // Save gallery images
      if (Array.isArray(p.galleryImages) && p.galleryImages.length > 0) {
        await imageRepo.save(
          p.galleryImages.map((g, i) =>
            imageRepo.create({
              project,
              url: g.url,
              fileId: `project-img-${p.slug}-${i + 1}`,
              caption: g.caption || `Hình ảnh ${i + 1} – ${p.title}`,
              order: i,
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
          content: a.content,
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
        slug: 'ky-su-phan-mem-full-stack',
        department: 'Công nghệ',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '15 – 25 triệu',
        description:
          'Thiết kế và phát triển các ứng dụng web, API và hệ thống quản lý nội bộ phục vụ chuyển đổi số cho các cơ quan và doanh nghiệp.',
        requirements:
          'Yêu cầu kinh nghiệm 2 – 4 năm. Kỹ năng thành thạo: React, Node.js, TypeScript, PostgreSQL.',
        benefits:
          'Mức lương cạnh tranh 15 – 25 triệu, bảo hiểm toàn diện, môi trường làm việc hiện đại.',
        isUrgent: true,
      },
      {
        title: 'Chuyên viên AI & Machine Learning',
        slug: 'chuyen-vien-ai-machine-learning',
        department: 'Nghiên cứu & Phát triển',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '20 – 35 triệu',
        description:
          'Nghiên cứu và triển khai các mô hình AI/ML phục vụ nhận diện hình ảnh, phân tích dữ liệu địa lý và nông nghiệp thông minh.',
        requirements:
          'Yêu cầu kinh nghiệm 3 – 5 năm. Kỹ năng thành thạo: Python, TensorFlow, Computer Vision, Deep Learning.',
        benefits:
          'Mức lương cạnh tranh 20 – 35 triệu, đào tạo chuyên sâu, cơ hội tham gia các dự án công nghệ cấp tỉnh.',
        isUrgent: true,
      },
      {
        title: 'Kỹ sư DevOps & Cloud',
        slug: 'ky-su-devops-cloud',
        department: 'Công nghệ',
        location: 'TP. Hồ Chí Minh',
        type: 'full-time',
        salaryRange: '18 – 30 triệu',
        description:
          'Quản lý hạ tầng cloud, CI/CD pipeline, container orchestration và giám sát hiệu năng hệ thống cho các dự án chuyển đổi số.',
        requirements:
          'Yêu cầu kinh nghiệm 2 – 4 năm. Kỹ năng thành thạo: Docker, Kubernetes, AWS, Terraform.',
        benefits:
          'Mức lương cạnh tranh 18 – 30 triệu, chế độ làm việc linh hoạt hybrid.',
        isUrgent: false,
      },
      {
        title: 'Thiết kế UI/UX',
        slug: 'thiet-ke-ui-ux',
        department: 'Dịch vụ số',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '12 – 20 triệu',
        description:
          'Thiết kế giao diện người dùng cho các sản phẩm số, ứng dụng di động và nền tảng web phục vụ chính quyền và doanh nghiệp.',
        requirements:
          'Yêu cầu kinh nghiệm 1 – 3 năm. Kỹ năng thành thạo: Figma, Design System, Prototyping, User Research.',
        benefits:
          'Mức lương cạnh tranh 12 – 20 triệu, trang bị thiết bị làm việc cấu hình cao.',
        isUrgent: false,
      },
      {
        title: 'Chuyên viên Hành chính - Nhân sự',
        slug: 'chuyen-vien-hanh-chinh-nhan-su',
        department: 'Nhân sự',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '10 – 15 triệu',
        description:
          'Quản lý hồ sơ nhân sự, tuyển dụng, đào tạo phát triển nhân viên và xây dựng văn hóa doanh nghiệp.',
        requirements:
          'Yêu cầu kinh nghiệm 1 – 2 năm. Kỹ năng thành thạo: Tuyển dụng, Đào tạo, C&B, Luật lao động.',
        benefits:
          'Mức lương 10 – 15 triệu, du lịch hàng năm, đầy đủ chế độ bảo hiểm.',
        isUrgent: false,
      },
      {
        title: 'Kỹ sư Khảo sát UAV/Drone',
        slug: 'ky-su-khao-sat-uav-drone',
        department: 'Khảo sát & Đo đạc',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '14 – 22 triệu',
        description:
          'Vận hành và bảo trì thiết bị bay không người lái phục vụ khảo sát địa hình, lập bản đồ và giám sát tự động.',
        requirements:
          'Yêu cầu kinh nghiệm 1 – 3 năm. Kỹ năng thành thạo: UAV, GIS, Photogrammetry, AutoCAD.',
        benefits:
          'Mức lương 14 – 22 triệu, phụ cấp công tác phí và bảo hiểm tai nạn rủi ro.',
        isUrgent: false,
      },
      {
        title: 'Thực tập sinh Phát triển phần mềm',
        slug: 'thuc-tap-sinh-phat-trien-phan-mem',
        department: 'Công nghệ',
        location: 'TP. Pleiku, Gia Lai',
        type: 'intern',
        salaryRange: '3 – 5 triệu',
        description:
          'Tham gia phát triển các dự án thực tế, được đào tạo và mentoring bởi đội ngũ kỹ sư giàu kinh nghiệm.',
        requirements:
          'Sinh viên năm cuối ngành CNTT hoặc tương đương. Kỹ năng cơ bản: JavaScript, React, Git, Agile.',
        benefits:
          'Hỗ trợ thực tập 3 – 5 triệu/tháng, cơ hội chuyển thành nhân viên chính thức.',
        isUrgent: false,
      },
      {
        title: 'Kế toán tổng hợp',
        slug: 'ke-toan-tong-hop',
        department: 'Tài chính',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '10 – 16 triệu',
        description:
          'Thực hiện nghiệp vụ kế toán tổng hợp, báo cáo tài chính, quản lý thuế và công nợ cho hệ thống doanh nghiệp.',
        requirements:
          'Yêu cầu kinh nghiệm 2 – 4 năm. Kỹ năng thành thạo: Kế toán, Thuế, SAP, Báo cáo tài chính.',
        benefits: 'Mức lương 10 – 16 triệu, thưởng tháng 13 và KPI hấp dẫn.',
        isUrgent: false,
      },
      {
        title: 'Chuyên viên Quản lý dự án CNTT',
        slug: 'chuyen-vien-quan-ly-du-an-cntt',
        department: 'Dịch vụ số',
        location: 'TP. Hồ Chí Minh',
        type: 'full-time',
        salaryRange: '18 – 28 triệu',
        description:
          'Lập kế hoạch, điều phối và giám sát các dự án chuyển đổi số, đảm bảo tiến độ và chất lượng triển khai.',
        requirements:
          'Yêu cầu kinh nghiệm 3 – 5 năm. Kỹ năng thành thạo: PMP, Agile, Scrum, JIRA.',
        benefits: 'Mức lương 18 – 28 triệu, thưởng hoàn thành dự án.',
        isUrgent: false,
      },
      {
        title: 'Chuyên viên IoT & Embedded',
        slug: 'chuyen-vien-iot-embedded',
        department: 'Nghiên cứu & Phát triển',
        location: 'TP. Pleiku, Gia Lai',
        type: 'full-time',
        salaryRange: '15 – 25 triệu',
        description:
          'Phát triển firmware và phần cứng IoT cho các hệ thống giám sát môi trường, nông nghiệp thông minh và đô thị số.',
        requirements:
          'Yêu cầu kinh nghiệm 2 – 4 năm. Kỹ năng thành thạo: C/C++, ESP32, MQTT, PCB Design.',
        benefits: 'Mức lương 15 – 25 triệu, phòng lab trang thiết bị hiện đại.',
        isUrgent: true,
      },
    ];

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    await jobRepo.save(
      jobData.map((j) =>
        jobRepo.create({
          ...j,
          deadline,
          isActive: true,
        }),
      ),
    );
    console.log(`   → ${jobData.length} jobs`);

    // ── 12. Leads ───────────────────────────────────────────────────
    console.log('✉️  Seeding leads...');
    const leadRepo = queryRunner.manager.getRepository(Lead);
    const leadData = Array.from({ length: 15 }).map(() => ({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number({ style: 'national' }),
      subject: faker.lorem.sentence(5),
      message: faker.lorem.paragraph(),
      isRead: faker.datatype.boolean(),
    }));
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
