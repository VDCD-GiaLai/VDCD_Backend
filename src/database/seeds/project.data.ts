/** Projects page data — workflow stages + project entries with detail data
 *  Real data crawled from https://vdcd.vn/du-an/
 */

export interface WorkflowStage {
  number: string;
  title: string;
  titleEn: string;
  description: string;
  image: string;
}

export interface ProjectJourneyStage {
  number: string;
  title: string;
  titleEn: string;
  description: string;
  detail: string;
  image: string;
}

export interface ProjectGalleryImage {
  src: string;
  caption: string;
  size: 'large' | 'small';
}

export interface ProjectTechnicalHighlight {
  label: string;
  value: string;
}

export interface ProjectDetail {
  challenge: string;
  services: string[];
  discipline: string;
  journeyStages: ProjectJourneyStage[];
  galleryImages: ProjectGalleryImage[];
  technicalHighlights: ProjectTechnicalHighlight[];
  transformationBefore: string;
  transformationAfter: string;
  nextProjectId: string | null;
}

export interface ProjectEntry {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  coverImage: string;
  /** Controls how this card renders in the asymmetric gallery */
  layout: 'landscape-full' | 'landscape-half' | 'portrait';
  /** Rich case-study data for the detail page */
  detail: ProjectDetail;
}

/* ────────────────────────────────────────────────────────
   WORKFLOW STAGES
   ──────────────────────────────────────────────────────── */

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    number: '01',
    title: 'Khảo sát',
    titleEn: 'Discover',
    description:
      'Tìm hiểu mục tiêu, ràng buộc và bối cảnh dự án của khách hàng. Xác định phạm vi triển khai và lộ trình thực hiện phù hợp.',
    image:
      'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited.jpg',
  },
  {
    number: '02',
    title: 'Thu thập dữ liệu',
    titleEn: 'Survey',
    description:
      'Thu thập dữ liệu hiện trường chính xác thông qua các công nghệ khảo sát hiện đại: drone, LiDAR, GNSS và camera giám sát thông minh.',
    image:
      'https://vdcd.vn/wp-content/uploads/2024/03/467321399_1099508478849158_37644.jpg',
  },
  {
    number: '03',
    title: 'Mô hình hóa',
    titleEn: 'Model',
    description:
      'Chuyển đổi thông tin thu thập thành tài sản số đáng tin cậy — mô hình BIM, bản đồ GIS và cơ sở dữ liệu phân tích.',
    image:
      'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg',
  },
  {
    number: '04',
    title: 'Kỹ thuật',
    titleEn: 'Engineer',
    description:
      'Kiểm tra, phối hợp và tối ưu hóa các giải pháp kỹ thuật. Đảm bảo tính chính xác, hiệu quả và khả thi trong triển khai thực tế.',
    image:
      'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
  },
  {
    number: '05',
    title: 'Bàn giao',
    titleEn: 'Deliver',
    description:
      'Bàn giao giá trị lâu dài thông qua triển khai thực tế, hỗ trợ vận hành và đào tạo đội ngũ vận hành cho khách hàng.',
    image: 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
  },
];

/* ────────────────────────────────────────────────────────
   REUSABLE JOURNEY STAGES (project-specific overrides possible)
   ──────────────────────────────────────────────────────── */

const DEFAULT_JOURNEY: ProjectJourneyStage[] = [
  {
    number: '01',
    title: 'Khảo sát',
    titleEn: 'Capture',
    description:
      'Khảo sát hiện trường, xác định vị trí lắp đặt thiết bị và phạm vi giám sát toàn diện.',
    detail: 'Drone DJI Matrice 350 RTK + camera Sony Alpha 7R V',
    image:
      'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited.jpg',
  },
  {
    number: '02',
    title: 'Xử lý dữ liệu',
    titleEn: 'Process',
    description:
      'Thu thập và xử lý dữ liệu hình ảnh, video theo thời gian thực. Đồng bộ với hệ thống quản lý trung tâm.',
    detail: 'Xử lý trung bình 2.4TB dữ liệu hình ảnh mỗi tháng',
    image:
      'https://vdcd.vn/wp-content/uploads/2024/03/467321399_1099508478849158_37644.jpg',
  },
  {
    number: '03',
    title: 'Mô hình hóa',
    titleEn: 'Model',
    description:
      'Xây dựng mô hình số hóa công trình, tạo bản đồ GIS và hệ thống giám sát trực quan.',
    detail: 'Mô hình BIM LOD 300 + bản đồ GIS tỷ lệ 1:500',
    image:
      'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg',
  },
  {
    number: '04',
    title: 'Kiểm chứng',
    titleEn: 'Validate',
    description:
      'Đối chiếu dữ liệu thực tế với kế hoạch thi công. Phát hiện sai lệch và đề xuất giải pháp khắc phục.',
    detail: 'Độ chính xác đo đạc ±2mm trên phạm vi 500m',
    image:
      'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
  },
  {
    number: '05',
    title: 'Bàn giao',
    titleEn: 'Deliver',
    description:
      'Bàn giao hệ thống vận hành, đào tạo nhân sự và hỗ trợ kỹ thuật liên tục trong suốt vòng đời dự án.',
    detail: 'Bảo hành 24 tháng + hỗ trợ kỹ thuật từ xa 24/7',
    image: 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
  },
];

/* ────────────────────────────────────────────────────────
   PROJECTS — Real data from vdcd.vn (16 projects)
   ──────────────────────────────────────────────────────── */

export const PROJECTS_DATA: ProjectEntry[] = [
  /* ── 1. Vân Phong – Khánh Hòa ──────────────────────── */
  {
    id: 'van-phong-khanh-hoa',
    title: 'Vân Phong – Khánh Hòa',
    category: 'Bản đồ số',
    location: 'Khánh Hòa',
    year: '2024',
    description:
      'Khảo sát địa hình dự án Vân Phong – Khánh Hòa. Trọn gói sản phẩm trắc địa toàn diện phục vụ quy hoạch khu kinh tế chiến lược.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg',
    layout: 'landscape-full',
    detail: {
      challenge:
        'Khu kinh tế Vân Phong nằm ở phía Bắc tỉnh Khánh Hòa, với tổng quy mô các dự án lên đến hàng nghìn hecta. Bay quét địa hình được tiến hành với mục đích thu hình ảnh tổng quan về khu vực, phục vụ việc định hướng quy hoạch và lên concept cho các mục tiêu thiết kế về sau.',
      services: [
        'Khảo sát thành lập bản vẽ 2D',
        'Khảo sát thành lập bản vẽ 3D',
        'Bản vẽ địa hình 1/500',
        'Bay quét Drone chuyên nghiệp',
      ],
      discipline: 'Khảo sát địa hình & Trắc địa',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg',
          caption: 'Toàn cảnh khu kinh tế Vân Phong từ trên cao',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/z6230086515847_880a32e4555a0e1a2092fafe725ba010-1-edited-1024x768.jpg',
          caption: 'Khảo sát thực địa tại Vân Phong',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited.jpg',
          caption: 'Drone bay quét địa hình khu vực ven biển',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/z6246996465902_d2b58a023e87326b3d6b828d09049fa4-1024x618-1.jpg',
          caption: 'Bản đồ địa hình số khu kinh tế',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/z6249184485226_65353c2131876581d63d52ac58854302-1024x683-1.jpg',
          caption: 'Đội ngũ khảo sát tại hiện trường',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/IMG_7134-edited-2048x1536-1-1024x768.jpg',
          caption: 'Thiết bị bay quét LiDAR',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Diện tích khảo sát', value: 'Hàng nghìn ha' },
        { label: 'Địa hình cấp 1', value: '600 ha/ngày' },
        { label: 'Địa hình cấp 6', value: '100 ha/ngày' },
        { label: 'Sản phẩm bàn giao', value: '2D, 3D, 1/500' },
        { label: 'Công nghệ', value: 'Drone + LiDAR' },
        { label: 'Chủ đầu tư', value: 'Sun Group' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2025/11/z6246996465902_d2b58a023e87326b3d6b828d09049fa4-1024x618-1.jpg',
      nextProjectId: 'lotte-mall-vo-chi-cong',
    },
  },

  /* ── 2. Lotte Mall Võ Chí Công ─────────────────────── */
  {
    id: 'lotte-mall-vo-chi-cong',
    title: 'Trung tâm thương mại Lotte Mall',
    category: 'Giám sát số',
    location: 'Hà Nội',
    year: '2024',
    description:
      'Giám sát, quản lý công trình xây dựng Lotte Mall Võ Chí Công ứng dụng công nghệ cao. Theo dõi tiến độ thi công toàn diện.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg',
    layout: 'portrait',
    detail: {
      challenge:
        'Lotte Mall Võ Chí Công là tổ hợp thương mại – dịch vụ – căn hộ quy mô lớn tại Tây Hồ, Hà Nội. Dự án yêu cầu giám sát liên tục 24/7 trên nhiều góc quay khác nhau, ghi nhận chính xác tiến độ từng hạng mục.',
      services: [
        'AutoTimelapse đa góc',
        'Video timelapse 4K',
        'Báo cáo tiến độ tự động',
        'Giám sát quản lý công trình',
      ],
      discipline: 'Giám sát xây dựng',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg',
          caption: 'Tổ hợp Lotte Mall nhìn từ trên cao',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/481910989_2375973832761147_7242746415740845603_n-1.jpg',
          caption: 'Hệ thống camera giám sát tại công trường',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Tây Hồ, Hà Nội' },
        { label: 'Loại hình', value: 'Tổ hợp TM–DV' },
        { label: 'Giám sát', value: '24/7' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'Video', value: '4K UHD' },
        { label: 'Chủ đầu tư', value: 'Lotte Group' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/481910989_2375973832761147_7242746415740845603_n-1.jpg',
      nextProjectId: 'becamex-binh-duong',
    },
  },

  /* ── 3. Becamex Bình Dương ─────────────────────────── */
  {
    id: 'becamex-binh-duong',
    title: 'Tòa nhà Becamex Bình Dương',
    category: 'Giám sát số',
    location: 'Bình Dương',
    year: '2023',
    description:
      'AutoTimelapse đồng hành cùng Becamex Tower Bình Dương – giải pháp giám sát công trình cao tầng hiện đại, nền tảng cho đô thị thông minh.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
    layout: 'landscape-half',
    detail: {
      challenge:
        'Becamex Tower là tòa nhà biểu tượng của thành phố mới Bình Dương. Thách thức thi công cao tầng đòi hỏi giải pháp AutoTimelapse – công nghệ điều hành công trình hiện đại, giám sát toàn diện từ móng đến hoàn thiện.',
      services: [
        'AutoTimelapse cao tầng',
        'Giám sát thi công 24/7',
        'Phân tích tiến độ AI',
        'Báo cáo so sánh kế hoạch – thực tế',
      ],
      discipline: 'Giám sát cao tầng',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
          caption: 'Becamex Tower – Biểu tượng đô thị Bình Dương',
          size: 'large',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'TP. Bình Dương' },
        { label: 'Loại hình', value: 'Văn phòng TM–DV' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'Giám sát', value: '24/7' },
        { label: 'Ứng dụng', value: 'Đô thị thông minh' },
        { label: 'Chủ đầu tư', value: 'Becamex IDC' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg',
      nextProjectId: 'the-terra-an-hung',
    },
  },

  /* ── 4. The Terra An Hưng ──────────────────────────── */
  {
    id: 'the-terra-an-hung',
    title: 'The Terra An Hưng',
    category: 'Giám sát số',
    location: 'Hà Nội',
    year: '2023',
    description:
      'VDCD triển khai giám sát tự động tại The Terra An Hưng, giúp Văn Phú – Invest quản lý tiến độ số hóa và xây dựng đô thị thông minh.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg',
    layout: 'landscape-full',
    detail: {
      challenge:
        'Dự án The Terra An Hưng là khu đô thị phức hợp với nhiều tòa nhà xây dựng song song. Thách thức lớn nhất là giám sát đồng thời nhiều hạng mục trên diện rộng và tích hợp dữ liệu vào hệ thống quản lý dự án.',
      services: [
        'AutoTimelapse đa điểm',
        'Tích hợp hệ thống quản lý',
        'Video timelapse quảng bá',
        'Báo cáo định kỳ tự động',
      ],
      discipline: 'Giám sát đô thị thông minh',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg',
          caption: 'Phối cảnh tổng thể The Terra An Hưng',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/the-terra-an-hung-1-1-1.jpg',
          caption: 'Giai đoạn thi công khu đô thị',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/497670130_1264939388971481_6818461079310841617_n-1024x768.jpg',
          caption: 'Hệ thống camera giám sát tại công trường',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Hà Đông, Hà Nội' },
        { label: 'Chủ đầu tư', value: 'Văn Phú – Invest' },
        { label: 'Giám sát', value: 'Đa điểm 24/7' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'Tích hợp', value: 'Quản lý dự án' },
        { label: 'Loại hình', value: 'Khu đô thị' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/the-terra-an-hung-1-1-1.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg',
      nextProjectId: 'thap-ba-ponagar',
    },
  },

  /* ── 5. Tháp Bà Ponagar ───────────────────────────── */
  {
    id: 'thap-ba-ponagar',
    title: 'Tháp Bà Ponagar',
    category: 'Bản đồ số',
    location: 'Khánh Hòa',
    year: '2024',
    description:
      'Khảo sát địa hình khu di tích Tháp Bà Ponagar – Nha Trang. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, mô hình 3D, bản đồ 1/500 và VR360.',
    coverImage: 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
    layout: 'portrait',
    detail: {
      challenge:
        'Tháp Bà Ponagar là di tích lịch sử cấp quốc gia với hơn 1.000 năm tuổi. Việc khảo sát và số hóa phải đảm bảo không gây ảnh hưởng đến kiến trúc cổ, đồng thời cung cấp dữ liệu chính xác về hiện trạng công trình.',
      services: [
        'Khảo sát thành lập bản vẽ 2D',
        'Khảo sát thành lập bản vẽ 3D',
        'Bản vẽ địa hình 1/500',
        'VR360 toàn cảnh',
      ],
      discipline: 'Bảo tồn di sản & Trắc địa',
      journeyStages: [
        {
          number: '01',
          title: 'Khảo sát di tích',
          titleEn: 'Heritage Survey',
          description:
            'Khảo sát toàn diện hiện trạng kiến trúc, xác định các điểm cần số hóa trọng yếu.',
          detail: 'Scan LiDAR 3D toàn bộ quần thể tháp Chăm Pa',
          image: 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
        },
        {
          number: '02',
          title: 'Số hóa kiến trúc',
          titleEn: 'Digital Twin',
          description:
            'Tạo bản sao số chính xác của di tích để theo dõi biến đổi theo thời gian.',
          detail: 'Mô hình 3D với độ chi tiết dưới 1mm',
          image:
            'https://vdcd.vn/wp-content/uploads/2024/03/3d-thap-ba-ponagar.png',
        },
        {
          number: '03',
          title: 'Bản vẽ 2D',
          titleEn: '2D Drawing',
          description:
            'Thành lập bản vẽ mặt bằng, mặt cắt và mặt đứng chi tiết toàn bộ quần thể.',
          detail: 'Bản vẽ AutoCAD tỷ lệ 1:200 và 1:500',
          image:
            'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-1024x768.jpg',
        },
        {
          number: '04',
          title: 'Mô hình 3D',
          titleEn: '3D Model',
          description:
            'Dựng mô hình 3D chính xác phục vụ bảo tồn và quản lý di sản văn hóa.',
          detail: 'Point cloud 50 triệu điểm + mesh texture HD',
          image:
            'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-2-1-1024x768.jpg',
        },
        {
          number: '05',
          title: 'VR360',
          titleEn: 'Virtual Tour',
          description:
            'Tạo tour thực tế ảo 360° cho phép tham quan di tích từ xa với trải nghiệm chân thực.',
          detail: 'VR360 độ phân giải 12K toàn cảnh',
          image:
            'https://vdcd.vn/wp-content/uploads/2024/03/z6227939792173_a593ec4952ff2e1679658730cd16b032-1024x582-1.jpg',
        },
      ],
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
          caption: 'Tháp Bà Ponagar – Di sản Chăm Pa',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-1024x768.jpg',
          caption: 'Bản vẽ 2D khảo sát di tích',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/3d-thap-ba-ponagar.png',
          caption: 'Mô hình 3D quần thể tháp',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/z6227939792173_a593ec4952ff2e1679658730cd16b032-1024x582-1.jpg',
          caption: 'Toàn cảnh khu di tích từ trên cao',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/screenshot1-15-1024x490-1.jpg',
          caption: 'VR360 tham quan thực tế ảo',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-2-1-1024x768.jpg',
          caption: 'Chi tiết bản vẽ kiến trúc',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Niên đại di tích', value: '1.000+ năm' },
        { label: 'Sản phẩm', value: '2D, 3D, VR360' },
        { label: 'Tỷ lệ bản đồ', value: '1/500' },
        { label: 'Mô hình 3D', value: 'Point Cloud HD' },
        { label: 'VR360', value: '12K' },
        { label: 'Công nghệ', value: 'LiDAR + Drone' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/3d-thap-ba-ponagar.png',
      nextProjectId: 'sun-marina-ha-long',
    },
  },

  /* ── 6. Sun Marina Hạ Long ─────────────────────────── */
  {
    id: 'sun-marina-ha-long',
    title: 'Sun Marina Hạ Long',
    category: 'Giám sát số',
    location: 'Quảng Ninh',
    year: '2024',
    description:
      'AutoTimelapse triển khai tại khu đô thị Sun Marina Hạ Long – giải pháp giám sát toàn diện cho đô thị ven biển hiện đại.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg',
    layout: 'landscape-half',
    detail: {
      challenge:
        'Sun Marina Hạ Long nằm trong vịnh Hạ Long — di sản thiên nhiên thế giới. Công trình xây dựng phải tuân thủ nghiêm ngặt các quy định bảo vệ môi trường, đồng thời đảm bảo tiến độ thi công trong điều kiện khí hậu biển.',
      services: [
        'AutoTimelapse ven biển',
        'Giám sát môi trường xung quanh',
        'Video marketing timelapse',
        'Báo cáo tiến độ trực tuyến',
      ],
      discipline: 'Giám sát công trình ven biển',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg',
          caption: 'Sun Marina Hạ Long – Đô thị ven biển',
          size: 'large',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Vịnh Hạ Long' },
        { label: 'Chủ đầu tư', value: 'Sun Group' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'Giám sát', value: '24/7' },
        { label: 'Loại hình', value: 'Khu đô thị' },
        { label: 'Đặc thù', value: 'Ven biển' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg',
      nextProjectId: 'son-tra-da-nang',
    },
  },

  /* ── 7. Sơn Trà – Đà Nẵng ─────────────────────────── */
  {
    id: 'son-tra-da-nang',
    title: 'Sơn Trà – Đà Nẵng',
    category: 'Bản đồ số',
    location: 'Đà Nẵng',
    year: '2025',
    description:
      'Trọn gói sản phẩm trắc địa toàn diện phục vụ xây dựng quy hoạch bán đảo Sơn Trà. Sản phẩm 2D, bản vẽ 1/500, mô hình 3D.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png',
    layout: 'landscape-full',
    detail: {
      challenge:
        'Bán đảo Sơn Trà có địa hình phức tạp với rừng nguyên sinh và hệ sinh thái nhạy cảm. Việc khảo sát đòi hỏi bay quét drone chính xác trên địa hình đồi núi ven biển và xử lý dữ liệu lớn thành sản phẩm trắc địa phục vụ quy hoạch.',
      services: [
        'Sản phẩm bản vẽ 2D',
        'Bản vẽ 1/500 chi tiết',
        'Mô hình 3D',
        'Giải pháp trắc địa toàn diện',
      ],
      discipline: 'Trắc địa & Quy hoạch',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png',
          caption: 'Toàn cảnh bán đảo Sơn Trà',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/467126771_1099508525515820_4642314407752063642_n-1024x683-1.jpg',
          caption: 'Đội ngũ khảo sát tại Sơn Trà',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Diện tích', value: '4,439 ha' },
        { label: 'Sản phẩm', value: '2D, 3D, 1/500' },
        { label: 'Công nghệ', value: 'Drone + GNSS' },
        { label: 'Địa hình', value: 'Đồi núi ven biển' },
        { label: 'Tỷ lệ', value: '1/500' },
        { label: 'Mục đích', value: 'Quy hoạch' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/467126771_1099508525515820_4642314407752063642_n-1024x683-1.jpg',
      nextProjectId: 'san-bay-van-don',
    },
  },

  /* ── 8. Sân bay Vân Đồn ────────────────────────────── */
  {
    id: 'san-bay-van-don',
    title: 'Sân bay Vân Đồn',
    category: 'Bản đồ số',
    location: 'Quảng Ninh',
    year: '2023',
    description:
      'Khảo sát địa hình và ứng dụng công nghệ LiDAR Scan tại Sân bay Vân Đồn. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, 3D, VR360.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/11/467741379_1104256805040992_4651998732288142886_n-1024x512-1.jpg',
    layout: 'landscape-half',
    detail: {
      challenge:
        'Sân bay Vân Đồn là sân bay tư nhân đầu tiên tại Việt Nam. Quy mô xây dựng rộng lớn yêu cầu khảo sát đa điểm với ứng dụng công nghệ LiDAR Scan, bao phủ toàn bộ khu vực đường băng, nhà ga và hạ tầng phụ trợ.',
      services: [
        'Khảo sát thành lập bản vẽ 2D',
        'Khảo sát thành lập bản vẽ 3D',
        'Bản vẽ địa hình 1/500',
        'VR360 toàn cảnh',
        'Ứng dụng LiDAR Scan',
      ],
      discipline: 'Trắc địa hạ tầng hàng không',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/467741379_1104256805040992_4651998732288142886_n-1024x512-1.jpg',
          caption: 'Sân bay Vân Đồn nhìn từ trên cao',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/467321399_1099508478849158_37644.jpg',
          caption: 'Quá trình khảo sát khu vực nhà ga',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/466682223_1099508235515849_3883118592529925754_n-1024x683-1.jpg',
          caption: 'Thiết bị LiDAR tại đường băng',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-edited.png',
          caption: 'Bản đồ số 3D sân bay',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_1-edited-1024x768.png',
          caption: 'Mô hình 3D nhà ga hành khách',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/screenshot1-14-1024x490-1.jpg',
          caption: 'VR360 toàn cảnh sân bay',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Diện tích', value: '325 ha' },
        { label: 'Công nghệ', value: 'LiDAR Scan' },
        { label: 'Sản phẩm', value: '2D, 3D, VR360' },
        { label: 'Tỷ lệ bản đồ', value: '1/500' },
        { label: 'Chủ đầu tư', value: 'Sun Group' },
        { label: 'Hình ảnh', value: '10 bộ' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/467321399_1099508478849158_37644.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-edited.png',
      nextProjectId: 'san-bay-quoc-te-phu-quoc',
    },
  },

  /* ── 9. Sân Bay Quốc Tế Phú Quốc ──────────────────── */
  {
    id: 'san-bay-quoc-te-phu-quoc',
    title: 'Sân Bay Quốc Tế Phú Quốc',
    category: 'Giám sát số',
    location: 'Kiên Giang',
    year: '2023',
    description:
      'VDCD triển khai giải pháp AutoTimelapse giám sát công trình tại cảng hàng không quốc tế Phú Quốc – cửa ngõ du lịch hàng đầu Việt Nam.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg',
    layout: 'portrait',
    detail: {
      challenge:
        'Cảng hàng không quốc tế Phú Quốc vận hành song song với giai đoạn mở rộng. Hệ thống giám sát phải đảm bảo an toàn hàng không tuyệt đối, không gây ảnh hưởng đến hoạt động bay. Công nghệ tiên tiến cho giám sát công trình hiệu quả.',
      services: [
        'AutoTimelapse an toàn hàng không',
        'Giám sát mở rộng nhà ga',
        'Video timelapse quảng bá',
        'Hỗ trợ chuyên nghiệp',
      ],
      discipline: 'Giám sát hạ tầng hàng không',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg',
          caption: 'Cảng hàng không quốc tế Phú Quốc',
          size: 'large',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Phú Quốc' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'An toàn', value: 'ICAO cấp 4E' },
        { label: 'Giám sát', value: '24/7' },
        { label: 'Loại hình', value: 'Sân bay quốc tế' },
        { label: 'Chất lượng', value: 'Cam kết chuyên nghiệp' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg',
      nextProjectId: 'nha-hat-ho-tay',
    },
  },

  /* ── 10. Nhà hát Hồ Tây ────────────────────────────── */
  {
    id: 'nha-hat-ho-tay',
    title: 'Nhà hát Hồ Tây',
    category: 'Giám sát số',
    location: 'Hà Nội',
    year: '2024',
    description:
      'Lắp đặt hệ thống giám sát công trình AutoTimelapse cho dự án Nhà hát Hồ Tây – công trình văn hóa biểu tượng Hà Nội.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg',
    layout: 'landscape-full',
    detail: {
      challenge:
        'Nhà hát Hồ Tây là dự án văn hóa biểu tượng của Hà Nội với kiến trúc phức tạp. Hệ thống AutoTimelapse cần ghi lại toàn bộ quá trình xây dựng với chất lượng hình ảnh cao nhất, phục vụ quản lý tiến độ và truyền thông.',
      services: [
        'AutoTimelapse giám sát công trình',
        'Ghi hình 24/7 chất lượng cao',
        'Báo cáo tiến độ tự động',
        'Video timelapse truyền thông',
      ],
      discipline: 'Giám sát công trình văn hóa',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg',
          caption: 'Phối cảnh Nhà hát Hồ Tây',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/nha-hat-ho-tay.jpg',
          caption: 'Công trường xây dựng nhà hát',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/514970510_1308500817948671_3336272050708746027_n-1-1024x768.jpg',
          caption: 'Camera AutoTimelapse lắp đặt tại công trường',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/514760343_1308500777948675_797658922111612414_n-1-1024x768.jpg',
          caption: 'Tiến độ thi công nhà hát',
          size: 'large',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Hồ Tây, Hà Nội' },
        { label: 'Loại hình', value: 'Công trình văn hóa' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'Giám sát', value: '24/7' },
        { label: 'Chất lượng', value: 'Video HD' },
        { label: 'Ý nghĩa', value: 'Biểu tượng Hà Nội' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/nha-hat-ho-tay.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg',
      nextProjectId: 'le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam',
    },
  },

  /* ── 11. Lễ Diễu binh 80 năm Quốc khánh ───────────── */
  {
    id: 'le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam',
    title: 'Lễ Diễu binh 80 năm Quốc khánh',
    category: 'Sản xuất phim',
    location: 'Hà Nội',
    year: '2025',
    description:
      'Việt-Flycam tự hào ghi dấu ấn bằng những thước phim trên cao cùng Đại lễ A80 – Lễ Diễu binh kỷ niệm 80 năm Quốc khánh Việt Nam.',
    coverImage: 'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg',
    layout: 'landscape-half',
    detail: {
      challenge:
        'Ghi hình đại lễ diễu binh kỷ niệm 80 năm Quốc khánh đòi hỏi bay drone chính xác trong không phận được kiểm soát nghiêm ngặt, với yêu cầu an ninh tuyệt đối và chất lượng hình ảnh điện ảnh.',
      services: [
        'Bay quay phim drone chuyên nghiệp',
        'Ghi hình sự kiện trên cao',
        'Hậu kỳ video điện ảnh',
        'Sản xuất phim tài liệu',
      ],
      discipline: 'Sản xuất phim & Sự kiện',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg',
          caption: 'Lễ Diễu binh kỷ niệm 80 năm Quốc khánh',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/10/75474.jpg',
          caption: 'Toàn cảnh đại lễ từ trên cao',
          size: 'large',
        },
      ],
      technicalHighlights: [
        { label: 'Sự kiện', value: 'Đại lễ A80' },
        { label: 'Địa điểm', value: 'Quảng trường BĐ' },
        { label: 'Công nghệ', value: 'Drone cinema' },
        { label: 'An ninh', value: 'Cấp quốc gia' },
        { label: 'Chất lượng', value: '4K Cinema' },
        { label: 'Đơn vị', value: 'Việt-Flycam' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2025/10/75474.jpg',
      nextProjectId: 'sun-world-ba-na-hills',
    },
  },

  /* ── 12. Sun World Bà Nà Hills ─────────────────────── */
  {
    id: 'sun-world-ba-na-hills',
    title: 'Sun World Bà Nà Hills',
    category: 'Bản đồ số',
    location: 'Đà Nẵng',
    year: '2024',
    description:
      'Scan 3D hiện trạng Khu du lịch Sun World Bà Nà Hills – Đà Nẵng. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, 3D và bản vẽ 1/500.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg',
    layout: 'portrait',
    detail: {
      challenge:
        'Khu du lịch Sun World Bà Nà Hills nằm trên đỉnh núi Bà Nà ở độ cao 1.489m. Việc scan 3D toàn bộ khu vực đòi hỏi bay drone trong điều kiện thời tiết núi cao với gió mạnh, sương mù và mưa bất chợt.',
      services: [
        'Scan 3D hiện trạng',
        'Sản phẩm bản vẽ 2D',
        'Bản vẽ 1/500 chi tiết',
        'Mô hình 3D toàn khu vực',
      ],
      discipline: 'Trắc địa & Scan 3D',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg',
          caption: 'Sun World Bà Nà Hills – Cầu Vàng',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/du-an-van-don-1-scaled.jpg',
          caption: 'Scan 3D khu vực Bà Nà',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_71-min-1024x570-1.png',
          caption: 'Mô hình 3D toàn cảnh',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_72-min-1024x593-1.png',
          caption: 'Bản vẽ 2D chi tiết',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-101052-min-1024x498-1.png',
          caption: 'Point cloud 3D khu vui chơi',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-10-135726-min-1024x492-1.png',
          caption: 'Bản vẽ tỷ lệ 1/500',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Độ cao', value: '1,489 m' },
        { label: 'Công nghệ', value: 'Scan 3D' },
        { label: 'Sản phẩm', value: '2D, 3D, 1/500' },
        { label: 'Chủ đầu tư', value: 'Sun Group' },
        { label: 'Hình ảnh', value: '7 bộ' },
        { label: 'Đặc thù', value: 'Địa hình núi cao' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_72-min-1024x593-1.png',
      nextProjectId: 'dien-gio-phong-nguyen-phong-huy-quang-tri',
    },
  },

  /* ── 13. Điện gió Quảng Trị ────────────────────────── */
  {
    id: 'dien-gio-phong-nguyen-phong-huy-quang-tri',
    title: 'Điện gió Phong Nguyên Quảng Trị',
    category: 'Giám sát số',
    location: 'Quảng Trị',
    year: '2023',
    description:
      'AutoTimelapse tối ưu giám sát công trình điện gió Phong Nguyên Phong Huy Quảng Trị – theo dõi tiến độ xây dựng turbine gió quy mô lớn.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp',
    layout: 'landscape-full',
    detail: {
      challenge:
        'Dự án điện gió Phong Nguyên Phong Huy tại Quảng Trị triển khai trên địa hình đồi núi rộng lớn. Giám sát xây dựng turbine gió ở độ cao lớn đòi hỏi hệ thống camera chịu gió mạnh và truyền dữ liệu ổn định.',
      services: [
        'AutoTimelapse công trình điện gió',
        'Giám sát tiến độ xây lắp turbine',
        'Video timelapse dự án năng lượng',
        'Báo cáo tiến độ',
      ],
      discipline: 'Giám sát năng lượng tái tạo',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp',
          caption: 'Điện gió Quảng Trị – Timelapse',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/chi-phi-quay-timelapse-1-e1665396002939.jpg',
          caption: 'Quá trình lắp đặt turbine',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-dien-gio-quang-tri-atl-1.webp',
          caption: 'Toàn cảnh trại điện gió',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Quảng Trị' },
        { label: 'Loại hình', value: 'Điện gió' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'Đặc thù', value: 'Chịu gió mạnh' },
        { label: 'Giám sát', value: '24/7' },
        { label: 'Năng lượng', value: 'Tái tạo' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2025/11/chi-phi-quay-timelapse-1-e1665396002939.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp',
      nextProjectId: 'cao-oc-thuong-mai-hai-phong',
    },
  },

  /* ── 14. Cao Ốc Thương Mại Hải Phòng ──────────────── */
  {
    id: 'cao-oc-thuong-mai-hai-phong',
    title: 'Cao Ốc Thương Mại Hải Phòng',
    category: 'Thiết kế số',
    location: 'Hải Phòng',
    year: '2024',
    description:
      'Thiết kế cao ốc thương mại Hải Phòng – dự án thiết kế kiến trúc số với phối cảnh ban ngày và ban đêm ấn tượng.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg',
    layout: 'landscape-half',
    detail: {
      challenge:
        'Thiết kế cao ốc thương mại tại Hải Phòng yêu cầu phối cảnh kiến trúc 3D chất lượng cao cho cả ban ngày và ban đêm, phục vụ trình bày với nhà đầu tư và xin giấy phép xây dựng.',
      services: [
        'Thiết kế kiến trúc 3D',
        'Phối cảnh ban ngày',
        'Phối cảnh ban đêm',
        'Render chất lượng cao',
      ],
      discipline: 'Thiết kế kiến trúc số',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg',
          caption: 'Phối cảnh ban đêm cao ốc Hải Phòng',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/10/banngay01_1f0f4785d29046d19e06af1ef0ef7f19_master-1.jpg',
          caption: 'Phối cảnh ban ngày – Góc chính diện',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/10/banngay02_ea3cc501664d4538a1c6a908b4406887_master-1.jpg',
          caption: 'Phối cảnh ban ngày – Góc phối cảnh',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1.jpg',
          caption: 'Phối cảnh ban đêm – Toàn cảnh',
          size: 'large',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Hải Phòng' },
        { label: 'Loại hình', value: 'Cao ốc TM' },
        { label: 'Sản phẩm', value: '3D Render' },
        { label: 'Phối cảnh', value: 'Ngày + Đêm' },
        { label: 'Chất lượng', value: '8K Render' },
        { label: 'Lĩnh vực', value: 'Thiết kế số' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2025/10/banngay01_1f0f4785d29046d19e06af1ef0ef7f19_master-1.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg',
      nextProjectId: 'benh-vien-da-chien-ha-noi',
    },
  },

  /* ── 15. Bệnh viện dã chiến Hà Nội ────────────────── */
  {
    id: 'benh-vien-da-chien-ha-noi',
    title: 'Bệnh viện dã chiến Hà Nội',
    category: 'Giám sát số',
    location: 'Hà Nội',
    year: '2021',
    description:
      'Thần tốc hoàn thiện bệnh viện dã chiến Hà Nội – VDCD là đơn vị cập nhật tiến độ thi công bệnh viện dã chiến phục vụ chống dịch COVID-19.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png',
    layout: 'landscape-half',
    detail: {
      challenge:
        'Bệnh viện dã chiến Hà Nội được xây dựng thần tốc trong bối cảnh dịch COVID-19. VDCD cần triển khai hệ thống giám sát ngay lập tức để ghi lại toàn bộ quá trình xây dựng với tiến độ chạy đua thời gian.',
      services: [
        'AutoTimelapse giám sát thần tốc',
        'Cập nhật tiến độ real-time',
        'Video timelapse tài liệu',
        'Báo cáo tiến độ cho chính quyền',
      ],
      discipline: 'Giám sát công trình khẩn cấp',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png',
          caption: 'Bệnh viện dã chiến Hà Nội – Xây dựng thần tốc',
          size: 'large',
        },
      ],
      technicalHighlights: [
        { label: 'Bối cảnh', value: 'COVID-19' },
        { label: 'Tiến độ', value: 'Thần tốc' },
        { label: 'Giám sát', value: 'Real-time' },
        { label: 'Công nghệ', value: 'AutoTimelapse' },
        { label: 'Ý nghĩa', value: 'Chống dịch' },
        { label: 'Vị trí', value: 'Hà Nội' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png',
      nextProjectId: 'bai-xep-phu-yen',
    },
  },

  /* ── 16. Bãi Xép – Phú Yên ────────────────────────── */
  {
    id: 'bai-xep-phu-yen',
    title: 'Bãi Xép – Phú Yên',
    category: 'Bản đồ số',
    location: 'Phú Yên',
    year: '2024',
    description:
      'Khảo sát địa hình 1/500 chi tiết dự án Bãi Xép – Phú Yên. Trọn gói sản phẩm trắc địa phục vụ thiết kế xây dựng khu du lịch ven biển.',
    coverImage:
      'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg',
    layout: 'portrait',
    detail: {
      challenge:
        'Bãi Xép là điểm du lịch nổi tiếng tại Phú Yên với bờ biển hoang sơ. Khảo sát địa hình phục vụ thiết kế xây dựng khu du lịch đòi hỏi độ chính xác cao trên địa hình ven biển đá ghềnh phức tạp.',
      services: [
        'Sản phẩm bản vẽ 2D',
        'Bản vẽ 1/500 chi tiết',
        'Mô hình 3D',
        'VR 360 toàn cảnh',
      ],
      discipline: 'Trắc địa & Khảo sát ven biển',
      journeyStages: DEFAULT_JOURNEY,
      galleryImages: [
        {
          src: 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg',
          caption: 'Bãi Xép – Phú Yên từ trên cao',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_8-copy-1024x665-1.jpg',
          caption: 'Bản vẽ 2D khu vực ven biển',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_1-copy-1024x673-1.jpg',
          caption: 'Mô hình 3D bãi biển',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_4-min-1024x528-1.png',
          caption: 'Bản vẽ tỷ lệ 1/500',
          size: 'large',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-min-1024x537-1.png',
          caption: 'Point cloud 3D bãi đá',
          size: 'small',
        },
        {
          src: 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_73-min-1024x537-1.png',
          caption: 'VR360 toàn cảnh bãi Xép',
          size: 'small',
        },
      ],
      technicalHighlights: [
        { label: 'Vị trí', value: 'Bãi Xép, Phú Yên' },
        { label: 'Sản phẩm', value: '2D, 3D, VR360' },
        { label: 'Tỷ lệ', value: '1/500' },
        { label: 'Công nghệ', value: 'Flycam' },
        { label: 'Mục đích', value: 'Thiết kế XD' },
        { label: 'Địa hình', value: 'Ven biển đá' },
      ],
      transformationBefore:
        'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg',
      transformationAfter:
        'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-min-1024x537-1.png',
      nextProjectId: 'van-phong-khanh-hoa',
    },
  },
];

/* ────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────── */

/** Lookup a single project by its slug/id */
export function getProjectById(id: string): ProjectEntry | undefined {
  return PROJECTS_DATA.find((p) => p.id === id);
}

/** Get the next project entry (for the "next project" section) */
export function getNextProject(currentId: string): ProjectEntry | undefined {
  const current = getProjectById(currentId);
  if (!current?.detail.nextProjectId) return undefined;
  return getProjectById(current.detail.nextProjectId);
}
