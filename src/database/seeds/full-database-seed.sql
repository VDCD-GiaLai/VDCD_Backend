-- ==============================================================================
-- VDCD DATABASE FULL SEED DUMP
-- Exported at: 2026-09-03T16:01:24.198Z
-- Database: postgres @ localhost
-- Total tables: 16
-- Total business records: 182
--
-- Table Statistics:
--   admin_user          : 3 rows
--   organization        : 1 rows
--   operation_field     : 11 rows
--   province            : 14 rows
--   partner             : 22 rows
--   job                 : 6 rows
--   lead                : 8 rows
--   contact             : 0 rows
--   page_banner         : 7 rows
--   slide               : 5 rows
--   program             : 5 rows
--   solution            : 19 rows
--   project             : 16 rows
--   slide_detail_blog   : 1 rows
--   project_image       : 54 rows
--   article             : 10 rows
-- ==============================================================================

BEGIN;

-- 1. CLEANUP (TRUNCATE in reverse foreign key dependency order)
TRUNCATE TABLE
  "article",
  "project_image",
  "slide_detail_blog",
  "project",
  "solution",
  "program",
  "slide",
  "page_banner",
  "contact",
  "lead",
  "job",
  "partner",
  "province",
  "operation_field",
  "organization",
  "admin_user"
CASCADE;

-- 2. INSERT DATA (in topological dependency order)

-- ------------------------------------------------------------------------------
-- TABLE: admin_user (3 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "admin_user" ("id", "username", "email", "password_hash", "role", "is_active", "created_at", "updated_at") VALUES
  ('82a3fae6-486c-4dc4-9c9d-85471980bea6', 'superadmin', 'superadmin@vdcd.vn', '$2b$12$ncRW3nw4svLOc4X51UGX.eDnjCmK5lb/tYjZA3mzp0x/IaFWwuUyO', 'superadmin', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('e7882b8f-b711-4be0-a760-051afe179b05', 'editor', 'editor@vdcd.vn', '$2b$12$tskJ09g5KmAOwoZNo3//a.3Ni389Nnuz5ZCAY3qt.jA4.D2LI2BK2', 'editor', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('7c3594f1-6b35-4cef-82f4-8c9fe8b574c0', 'viewer', 'viewer@vdcd.vn', '$2b$12$82URQ5nVP09J.pX8ndH9EOBk/ZfKrY7OG2sD3NhKM1vTyXwxVCP6W', 'viewer', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z');

-- ------------------------------------------------------------------------------
-- TABLE: organization (1 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "organization" ("id", "name", "tagline", "description", "mission", "vision", "core_values", "founded_year", "stats", "social_links", "updated_at", "address", "business_license_no", "operation_fields", "ecosystem_capabilities", "development_orientations") VALUES
  ('1acff113-58ee-42f4-89b7-452ee45c1967', 'Trung tâm Đổi mới Sáng tạo Gia Lai', 'Kết nối – Sáng tạo – Phát triển', 'Trung tâm Đổi mới Sáng tạo Gia Lai, là mô hình xã hội hóa do doanh nghiệp đầu tư và vận hành. Trung tâm được hình thành nhằm kết nối nguồn lực công nghệ, chuyên gia, doanh nghiệp và dữ liệu; thúc đẩy ứng dụng công nghệ, chuyển đổi số và phát triển hệ sinh thái khởi nghiệp sáng tạo tại địa phương.

Với định hướng lấy nhu cầu thực tiễn làm trung tâm, Trung tâm không chỉ là không gian kết nối mà còn trực tiếp đồng hành trong quá trình tư vấn, thử nghiệm, đào tạo, chuyển giao và triển khai công nghệ.', 'Thúc đẩy đổi mới sáng tạo, chuyển đổi số và phát triển bền vững cho tỉnh Gia Lai và khu vực Tây Nguyên.', 'Trở thành trung tâm đổi mới sáng tạo hàng đầu khu vực Tây Nguyên vào năm 2030.', 'Sáng tạo – Chính trực – Hợp tác – Tác động', 2020, '{"staff":1500,"experts":250,"projects":100,"provinces":30}'::jsonb, '{"zalo":"https://zalo.me/0373600099","email":"dmstgialai@vdcd.vn","tiktok":"https://www.tiktok.com/@vdcdgialai","hotline":"0373600099","facebook":"https://www.facebook.com/VDCDGIALAI","messenger":"https://www.messenger.com/t/888742211000071"}'::jsonb, '2026-08-31T20:04:50.107Z', 'Số 226 Đống Đa, Phường Quy Nhơn, Tỉnh Gia Lai', '4101443823', '[{"title":"Công nghệ số & Chuyển đổi số","description":"Nghiên cứu phát triển và tích hợp các giải pháp trí tuệ nhân tạo (AI), Internet vạn vật (IoT), dữ liệu lớn (Big Data), điện toán đám mây (Cloud) và mô hình hóa thông tin số (Digital Twin) phục vụ tối ưu hóa vận hành."},{"title":"Khảo sát, Đo đạc & Số hóa bản đồ","description":"Thành lập bản đồ địa hình và hiện trạng độ phân giải siêu cao sử dụng thiết bị bay không người lái (UAV/Drone). Số hóa cơ sở dữ liệu đất đai, lâm nghiệp và hạ tầng kỹ thuật chính xác."},{"title":"Giải pháp hạ tầng thông minh","description":"Thiết kế, xây dựng và tích hợp hệ thống trung tâm điều hành thông minh (IOC/DOC), giải pháp đô thị thông minh (Smart City) và hệ thống giám sát tự động AutoTimelapse."},{"title":"Sản xuất & Chế tạo thiết bị công nghệ","description":"Chế tạo các thiết bị robot công nghiệp, lắp ráp các hệ thống thiết bị bay không người lái (Drone/UAV) chuyên dụng, camera AI thông minh và phần cứng IoT phục vụ đa lĩnh vực."}]'::jsonb, 'Trung tâm kế thừa năng lực công nghệ, đội ngũ chuyên gia và mạng lưới triển khai của hệ sinh thái VDCD Group trong các lĩnh vực khảo sát, dữ liệu không gian, trí tuệ nhân tạo, mô hình thông tin công trình, hạ tầng dữ liệu và phần mềm quản lý.', '[{"title":"Phát triển hạ tầng dữ liệu và công nghệ dùng chung","description":""},{"title":"Thúc đẩy ứng dụng công nghệ trong các ngành kinh tế chủ lực","description":""},{"title":"Hỗ trợ startup và doanh nghiệp đổi mới mô hình hoạt động","description":""},{"title":"Kết nối Gia Lai với mạng lưới chuyên gia, công nghệ và đầu tư trong nước","description":""}]'::jsonb);

-- ------------------------------------------------------------------------------
-- TABLE: operation_field (6 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "operation_field" ("id", "name", "slug", "icon", "short_description", "order") VALUES
  ('e20f8cfa-92dd-4302-a746-fe50562e19b4', 'Nông nghiệp công nghệ cao', 'nong-nghiep-cong-nghe-cao', 'leaf', 'Lĩnh vực Nông nghiệp công nghệ cao – thúc đẩy đổi mới sáng tạo và ứng dụng công nghệ hiện đại.', 0),
  ('5292c9c5-7499-4353-9430-11aa730c63d8', 'Chuyển đổi số', 'chuyen-doi-so', 'cpu', 'Lĩnh vực Chuyển đổi số – thúc đẩy đổi mới sáng tạo và ứng dụng công nghệ hiện đại.', 1),
  ('e1760c66-386b-4de3-8490-5d71680649cf', 'Giáo dục & Đào tạo', 'giao-duc-dao-tao', 'graduation-cap', 'Lĩnh vực Giáo dục & Đào tạo – thúc đẩy đổi mới sáng tạo và ứng dụng công nghệ hiện đại.', 2),
  ('5192c2da-2ca6-4c81-bbaa-fb0e9d4e02ae', 'Y tế & Sức khỏe', 'y-te-suc-khoe', 'heart-pulse', 'Lĩnh vực Y tế & Sức khỏe – thúc đẩy đổi mới sáng tạo và ứng dụng công nghệ hiện đại.', 3),
  ('8cf42e59-62b2-44f9-9ab6-9adfa4ff12a7', 'Du lịch thông minh', 'du-lich-thong-minh', 'map', 'Lĩnh vực Du lịch thông minh – thúc đẩy đổi mới sáng tạo và ứng dụng công nghệ hiện đại.', 4),
  ('65bcaab7-d62c-481c-b264-2e0581503c78', 'Năng lượng tái tạo', 'nang-luong-tai-tao', 'zap', 'Lĩnh vực Năng lượng tái tạo – thúc đẩy đổi mới sáng tạo và ứng dụng công nghệ hiện đại.', 5),
  ('c0110001-0000-4000-a000-000000000001', 'Ươm tạo khởi nghiệp', 'uom-tao-khoi-nghiep', 'rocket-launch', 'Hỗ trợ các dự án đổi mới sáng tạo từ ý tưởng đến mô hình thử nghiệm và thương mại hóa.', 10),
  ('c0110001-0000-4000-a000-000000000002', 'Đào tạo công nghệ', 'dao-tao-cong-nghe', 'school', 'Chương trình đào tạo thực chiến về chuyển đổi số, UAV, AI, GIS và BIM cho doanh nghiệp và chính quyền.', 11),
  ('c0110001-0000-4000-a000-000000000003', 'Kết nối chuyên gia', 'ket-noi-chuyen-gia', 'handshake', 'Kết nối doanh nghiệp, tổ chức với mạng lưới chuyên gia công nghệ, viện nghiên cứu và trường đại học.', 12),
  ('c0110001-0000-4000-a000-000000000004', 'Tư vấn chuyển đổi số', 'tu-van-chuyen-doi-so', 'lightbulb-on', 'Tư vấn chiến lược và xây dựng lộ trình chuyển đổi số thực chất, khả thi cấp tỉnh và doanh nghiệp.', 13),
  ('c0110001-0000-4000-a000-000000000005', 'Hội thảo & Sự kiện', 'hoi-thao-su-kien', 'bullhorn', 'Diễn đàn kết nối tri thức, chia sẻ xu hướng công nghệ mới và xúc tiến đổi mới sáng tạo.', 14);

-- ------------------------------------------------------------------------------
-- TABLE: province (14 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "province" ("id", "name", "code", "has_project", "center_count") VALUES
  ('0237f2ca-535d-4dec-9dd3-1f12be723bb8', 'Gia Lai', 'GL', TRUE, 3),
  ('9116b79f-817c-4de7-8b11-ebde80dc78a1', 'Đắk Lắk', 'DL', TRUE, 2),
  ('8ef5b9ab-adc3-4047-8156-dbabc83a1415', 'Kon Tum', 'KT', TRUE, 1),
  ('537da1c1-b33e-4395-900d-4ea2a81e77ce', 'Đắk Nông', 'DN', TRUE, 1),
  ('0b4e7465-cf40-4f57-9f81-c54b6bc5d321', 'Lâm Đồng', 'LD', TRUE, 2),
  ('527dba43-a36b-40fb-8edd-0466c2a2cbb6', 'Bình Định', 'BD', TRUE, 1),
  ('ab9278d5-0a6b-4d27-84c1-c0d48cb03961', 'Phú Yên', 'PY', FALSE, 0),
  ('21f123a9-a48f-425f-bb8a-b871e6013fa1', 'Khánh Hòa', 'KH', FALSE, 0),
  ('ea89ef3b-b871-4902-b593-4100bf7be7d0', 'Quảng Ngãi', 'QN', TRUE, 1),
  ('6939a54f-abe7-4201-9347-23e4c7dae354', 'Quảng Nam', 'QNA', FALSE, 0),
  ('166ef0ec-619d-46cc-9d90-93dcc861a7b1', 'Thừa Thiên Huế', 'TTH', FALSE, 0),
  ('5dc27894-c279-4ce3-86c6-b609a5671564', 'Hà Nội', 'HN', TRUE, 1),
  ('64de3266-8385-44ec-b8dc-9064e9db72fc', 'TP. Hồ Chí Minh', 'HCM', TRUE, 2),
  ('6aa2210d-50aa-47ef-a348-f366d47f6acb', 'Đà Nẵng', 'DNG', TRUE, 1);

-- ------------------------------------------------------------------------------
-- TABLE: partner (22 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "partner" ("id", "name", "logo", "website_url", "order", "is_active", "logo_file_id") VALUES
  ('182979bb-0fae-4b4b-b622-18cdd9299389', 'VTV', 'https://vdcd.vn/wp-content/uploads/2025/11/1.png', 'https://vdcd.vn', 0, TRUE, 'partner-logo-1'),
  ('f8cc8849-56ff-493c-a1fc-6d66bbafcb1b', 'Lotte', 'https://vdcd.vn/wp-content/uploads/2025/11/3.png', 'https://vdcd.vn', 1, TRUE, 'partner-logo-2'),
  ('909cb69a-ac64-418d-bf34-60169b1d4b5d', 'Sungroup', 'https://vdcd.vn/wp-content/uploads/2025/11/1-1.png', 'https://vdcd.vn', 2, TRUE, 'partner-logo-3'),
  ('1a9afa69-6077-4939-80ff-1109a41097c5', 'Samsung', 'https://vdcd.vn/wp-content/uploads/2025/11/4.png', 'https://vdcd.vn', 3, TRUE, 'partner-logo-4'),
  ('7f606463-83b8-4d51-aa80-940c137e580f', 'Petrolimex', 'https://vdcd.vn/wp-content/uploads/2025/11/5.png', 'https://vdcd.vn', 4, TRUE, 'partner-logo-5'),
  ('858fe8ef-5675-40b7-88e4-d453b033acfb', 'VinGroup', 'https://vdcd.vn/wp-content/uploads/2025/11/6.png', 'https://vdcd.vn', 5, TRUE, 'partner-logo-6'),
  ('9cc61b4c-920f-4466-b404-199e03720526', 'Hòa Phát', 'https://vdcd.vn/wp-content/uploads/2025/11/7.png', 'https://vdcd.vn', 6, TRUE, 'partner-logo-7'),
  ('47b68642-2a6b-4dcc-a40f-f45717461d93', 'FLC', 'https://vdcd.vn/wp-content/uploads/2025/11/8.png', 'https://vdcd.vn', 7, TRUE, 'partner-logo-8'),
  ('b948912e-ba21-4df3-abc8-bf7e546e7105', 'Đường sắt Việt Nam', 'https://vdcd.vn/wp-content/uploads/2025/11/9.png', 'https://vdcd.vn', 8, TRUE, 'partner-logo-9'),
  ('812e7e1f-b1a9-4dc6-b799-c7b845120d83', 'Phúc Lộc', 'https://vdcd.vn/wp-content/uploads/2025/11/2.png', 'https://vdcd.vn', 9, TRUE, 'partner-logo-10'),
  ('ece26185-8595-40be-ae4d-67a7b866df1d', 'Silk Path', 'https://vdcd.vn/wp-content/uploads/2025/11/10.png', 'https://vdcd.vn', 10, TRUE, 'partner-logo-11'),
  ('073f7f74-6c56-4521-9b3d-fd5630600e68', 'Hòa Bình', 'https://vdcd.vn/wp-content/uploads/2025/11/12.png', 'https://vdcd.vn', 11, TRUE, 'partner-logo-12'),
  ('12005b93-04d6-4600-89b1-bb628720c3a7', 'Six Senses', 'https://vdcd.vn/wp-content/uploads/2025/11/13.png', 'https://vdcd.vn', 12, TRUE, 'partner-logo-13'),
  ('91057750-7755-4de1-b55d-772fc59c8c8d', 'DELTA', 'https://vdcd.vn/wp-content/uploads/2025/11/15.png', 'https://vdcd.vn', 13, TRUE, 'partner-logo-14'),
  ('23997a18-26ad-4f90-9736-ab85ca023d94', 'GIZA', 'https://vdcd.vn/wp-content/uploads/2025/11/17.png', 'https://vdcd.vn', 14, TRUE, 'partner-logo-15'),
  ('75005656-fb75-4657-ab25-0fab0b864f6c', 'Tân Á Đại Thành', 'https://vdcd.vn/wp-content/uploads/2025/11/18.png', 'https://vdcd.vn', 15, TRUE, 'partner-logo-16'),
  ('8fbba32b-dd99-486c-97a3-949b875d8ecb', 'Hoàng Thịnh Đạt', 'https://vdcd.vn/wp-content/uploads/2025/11/19.png', 'https://vdcd.vn', 16, TRUE, 'partner-logo-17'),
  ('a9f516ac-1f22-49c2-8683-59f3a0e8f6ee', 'NOVA Land', 'https://vdcd.vn/wp-content/uploads/2025/11/20.png', 'https://vdcd.vn', 17, TRUE, 'partner-logo-18'),
  ('46bbc056-4cd1-44f5-9b32-1566c27cf7fd', 'NOVASIA Energy', 'https://vdcd.vn/wp-content/uploads/2025/11/21.png', 'https://vdcd.vn', 18, TRUE, 'partner-logo-19'),
  ('90e2ec63-5f4e-4552-80ee-c80030c5f70e', 'Tuần Châu', 'https://vdcd.vn/wp-content/uploads/2025/11/22.png', 'https://vdcd.vn', 19, TRUE, 'partner-logo-20'),
  ('a5a61421-ff22-40fa-b7bf-2479ba9d7582', 'CIENCO8', 'https://vdcd.vn/wp-content/uploads/2025/11/3-1.png', 'https://vdcd.vn', 20, TRUE, 'partner-logo-21'),
  ('189c7f23-5c9e-4219-8e9a-b8e3331f453d', 'Flamingo', 'https://vdcd.vn/wp-content/uploads/2025/11/4-1.png', 'https://vdcd.vn', 21, TRUE, 'partner-logo-22');

-- ------------------------------------------------------------------------------
-- TABLE: job (6 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "job" ("id", "title", "slug", "department", "location", "type", "salary_range", "deadline", "description", "requirements", "benefits", "is_urgent", "is_active", "created_at", "updated_at", "experience", "tags") VALUES
  ('d5a82376-7fbf-4e13-85ce-0049d2111a5f', 'Kỹ sư phần mềm Full-stack', 'ky-su-phan-mem-fullstack', 'Kỹ thuật', 'TP. Pleiku, Gia Lai', 'full-time', '15 - 25 triệu', '2026-09-29T17:00:00.000Z', '## Mô tả công việc

Thiết kế và phát triển các ứng dụng web, RESTful API và hệ thống quản lý nội bộ phục vụ chuyển đổi số.

- Phát triển frontend với Next.js và backend với NestJS.
- Thiết kế database schema với TypeORM + PostgreSQL.
- Tích hợp ImageKit, Gmail SMTP, Redis cache.
- Code review và đảm bảo coverage > 80%.', '## Yêu cầu

- Tốt nghiệp ĐH chuyên ngành CNTT.
- 1+ năm kinh nghiệm TypeScript, Node.js.
- Thành thạo React/Next.js, NestJS.
- Hiểu biết PostgreSQL, Redis, Docker.', '## Quyền lợi

- Lương: 15 - 25 triệu.
- Thưởng KPI + dự án + Tết.
- BHXH, BHYT + VDCD Care.
- Tài trợ 100% chứng chỉ quốc tế.
- Hybrid work, nghỉ phép 14 ngày/năm.', TRUE, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '1 - 3 năm', '["NestJS","Next.js","TypeScript","PostgreSQL","Docker"]'::jsonb),
  ('b473d49c-5610-4535-927c-97490dc457c2', 'Kỹ sư IoT / Nhúng', 'ky-su-iot-nhung', 'Kỹ thuật', 'TP. Pleiku, Gia Lai', 'full-time', '20 - 35 triệu', '2026-09-29T17:00:00.000Z', '## Mô tả công việc

Nghiên cứu và triển khai giải pháp IoT phục vụ nông nghiệp thông minh, giám sát môi trường tại Tây Nguyên.

- Thiết kế mạch, lập trình firmware ESP32/STM32.
- Tích hợp MQTT, LoRaWAN với cloud backend.
- Xây dựng dashboard giám sát realtime.
- Khảo sát thực địa và lắp đặt thiết bị.', '## Yêu cầu

- Tốt nghiệp ĐH Điện tử, Tự động hóa hoặc CNTT.
- 2+ năm lập trình nhúng.
- Thành thạo C/C++, Python.
- Hiểu biết MQTT, CoAP, LoRaWAN.', '## Quyền lợi

- Lương: 20 - 35 triệu.
- Thưởng KPI + dự án.
- Tiếp cận thiết bị công nghệ mới nhất.
- Nghiên cứu thực địa Tây Nguyên.', TRUE, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '2 - 5 năm', '["ESP32","STM32","MQTT","LoRa","C/C++","Python"]'::jsonb),
  ('afa0d9ff-3b9b-4ef6-85cb-11c12fe4f774', 'Chuyên viên Tư vấn Chuyển đổi Số', 'chuyen-vien-tu-van-chuyen-doi-so', 'Tư vấn & Triển khai', 'TP. Pleiku, Gia Lai', 'full-time', '15 - 25 triệu', '2026-09-29T17:00:00.000Z', '## Mô tả công việc

Tư vấn chuyển đổi số cho cơ quan nhà nước và doanh nghiệp tại Gia Lai.

- Khảo sát, phân tích nhu cầu chuyển đổi số.
- Xây dựng đề xuất giải pháp và roadmap.
- Chuyển yêu cầu thành spec kỹ thuật.
- Đào tạo khách hàng sử dụng hệ thống.', '## Yêu cầu

- Tốt nghiệp ĐH CNTT, QTKD hoặc tương đương.
- Hiểu biết chuyển đổi số, chính quyền điện tử.
- Kỹ năng phân tích nghiệp vụ, viết tài liệu.
- Ưu tiên có PMP, Scrum Master.', '## Quyền lợi

- Lương: 15 - 25 triệu.
- Phụ cấp công tác, di chuyển.
- Thưởng theo dự án.
- Đào tạo nâng cao kỹ năng tư vấn.', FALSE, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '1 - 3 năm', '["Digital Transformation","Business Analysis","Agile","BPMN"]'::jsonb),
  ('dfd408ae-423a-4b28-99f2-c2ec68216bce', 'Chuyên viên Marketing Số', 'chuyen-vien-marketing-so', 'Marketing', 'TP. Pleiku, Gia Lai / Remote', 'full-time', '12 - 18 triệu', '2026-09-29T17:00:00.000Z', '## Mô tả công việc

Triển khai chiến lược marketing số cho VDCD Group.

- Quản lý chiến dịch Google Ads, Facebook Ads, LinkedIn.
- Sản xuất content (bài viết, video, infographic).
- Phân tích hiệu suất, báo cáo ROI.
- Quản lý website và social media.', '## Yêu cầu

- Tốt nghiệp ĐH Marketing, Truyền thông.
- 1+ năm Digital Marketing.
- Thành thạo Google Analytics, Google Ads.
- Kỹ năng viết content tốt.', '## Quyền lợi

- Lương: 12 - 18 triệu.
- Hỗ trợ làm việc remote.
- Ngân sách quảng cáo thực hành.
- Đào tạo nâng cao marketing.', FALSE, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '1 - 2 năm', '["SEO","Google Ads","Facebook Ads","Content Marketing","Analytics"]'::jsonb),
  ('c3944334-a2c0-4322-9660-2516e7cef9cc', 'Lập trình viên Full-stack Senior (NestJS + Next.js)', 'lap-trinh-vien-fullstack-senior', 'Kỹ thuật', 'Remote', 'full-time', '25 - 45 triệu', '2026-09-29T17:00:00.000Z', '## Mô tả công việc

Dẫn dắt kỹ thuật, phát triển hệ thống phần mềm quy mô lớn. 100% remote.

- Kiến trúc hệ thống, thiết kế API.
- Mentoring junior developers, code review.
- Tối ưu hiệu năng và bảo mật.
- Nghiên cứu áp dụng công nghệ mới.', '## Yêu cầu

- 3+ năm Full-stack development.
- Expert TypeScript, NestJS, Next.js.
- Thành thạo PostgreSQL, Redis, Docker, CI/CD.
- Kinh nghiệm microservices, message queue.', '## Quyền lợi

- Lương: 25 - 45 triệu.
- 100% remote.
- Trang bị thiết bị làm việc.
- Stock option cho nhân sự cốt lõi.', FALSE, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '3 - 5 năm', '["NestJS","Next.js","TypeScript","GraphQL","Redis","Kubernetes"]'::jsonb),
  ('5e6e7207-cc18-46c7-909b-13b706ef2a5b', 'Thực tập sinh Phân tích Dữ liệu', 'thuc-tap-sinh-phan-tich-du-lieu', 'Data & AI', 'TP. Pleiku, Gia Lai', 'intern', '3 - 5 triệu', '2026-09-29T17:00:00.000Z', '## Mô tả công việc

Thực tập 6 tháng tại phòng Data & AI.

- Thu thập, làm sạch và xử lý dữ liệu.
- Xây dựng dashboard Power BI.
- Hỗ trợ xây dựng mô hình ML đơn giản.
- Tham gia seminar và đào tạo nội bộ.', '## Yêu cầu

- Sinh viên năm cuối hoặc mới tốt nghiệp CNTT, Toán, Thống kê.
- Kiến thức cơ bản Python, SQL.
- Ham học hỏi, chủ động.
- Làm việc 5 ngày/tuần tại văn phòng.', '## Quyền lợi

- Trợ cấp: 3 - 5 triệu/tháng.
- Mentoring bởi Senior Data Engineer.
- Cơ hội chính thức sau thực tập.
- Chứng nhận hoàn thành chương trình.', FALSE, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'Không yêu cầu', '["Python","SQL","Power BI","Pandas","Machine Learning"]'::jsonb);

-- ------------------------------------------------------------------------------
-- TABLE: lead (8 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "lead" ("id", "full_name", "email", "phone", "subject", "message", "attachment", "is_read", "created_at", "dob", "address", "experience_years", "expected_salary", "portfolio_url", "cover_letter", "source") VALUES
  ('30bf417e-12d1-4002-bb8a-2edf492e944d', 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0912345678', '[Ứng tuyển] Kỹ sư phần mềm Full-stack', '', 'https://ik.imagekit.io/vdcd/cv/nguyen-van-an-cv.pdf', FALSE, '2026-08-31T20:04:50.107Z', '1998-05-14T17:00:00.000Z', 'TP. Pleiku, Gia Lai', '1 - 3 năm', '15 - 20 triệu', 'https://github.com/nguyenvanan', 'Tôi rất hứng thú với vị trí Kỹ sư Full-stack tại VDCD. Với 2 năm kinh nghiệm NestJS + Next.js, tôi tin mình có thể đóng góp tốt cho đội ngũ phát triển sản phẩm chuyển đổi số của công ty.', 'career_form'),
  ('aac90350-5fc0-486b-a1e6-c1f8eefa4891', 'Trần Thị Bình', 'tranthib@gmail.com', '0987654321', '[Ứng tuyển] Kỹ sư IoT / Nhúng', '', 'https://ik.imagekit.io/vdcd/cv/tran-thi-binh-cv.pdf', TRUE, '2026-08-31T20:04:50.107Z', '1995-11-19T17:00:00.000Z', 'TP. Buôn Ma Thuột, Đắk Lắk', '2 - 5 năm', '25 - 30 triệu', 'https://linkedin.com/in/tranthib', 'Với 3 năm kinh nghiệm lập trình nhúng ESP32 và tích hợp MQTT/LoRa, tôi mong muốn được đồng hành cùng VDCD triển khai các giải pháp IoT cho nông nghiệp Tây Nguyên.', 'career_form'),
  ('f4c43621-8dd9-4dab-b32a-1baad3aa2796', 'Lê Hoàng Cường', 'lehoangcuong@outlook.com', '0905123456', '[Ứng tuyển] Lập trình viên Full-stack Senior', '', 'https://ik.imagekit.io/vdcd/cv/le-hoang-cuong-cv.pdf', FALSE, '2026-08-31T20:04:50.107Z', '1993-03-07T17:00:00.000Z', 'Quận 7, TP. Hồ Chí Minh', '3 - 5 năm', '35 - 40 triệu', 'https://github.com/lhcuong', 'Tôi có 5 năm kinh nghiệm Full-stack với TypeScript, NestJS, Next.js. Hiện đang tìm kiếm cơ hội remote để đóng góp cho các dự án chuyển đổi số có tác động xã hội.', 'career_form'),
  ('6de5fae6-b468-405d-9015-95f1ce918b8d', 'Phạm Minh Đức', 'phamminhduc@gmail.com', '0918765432', '[Ứng tuyển] Chuyên viên Marketing Số', '', 'https://ik.imagekit.io/vdcd/cv/pham-minh-duc-cv.pdf', TRUE, '2026-08-31T20:04:50.107Z', '2000-07-24T17:00:00.000Z', 'TP. Pleiku, Gia Lai', '1 - 2 năm', '14 - 16 triệu', 'https://behance.net/phamminhduc', 'Là người con Gia Lai, tôi rất muốn đóng góp cho sự phát triển công nghệ tại quê hương. Với kinh nghiệm Google Ads và content marketing, tôi tự tin đáp ứng yêu cầu công việc.', 'career_form'),
  ('c23fd635-4caa-494f-a3f1-3648aded127d', 'Võ Thị Hạnh', 'vothihanh.sv@gmail.com', '0933456789', '[Ứng tuyển] Thực tập sinh Phân tích Dữ liệu', '', NULL, FALSE, '2026-08-31T20:04:50.107Z', '2003-12-09T17:00:00.000Z', 'Huyện Chư Sê, Gia Lai', 'Không yêu cầu', '4 - 5 triệu', NULL, 'Em là sinh viên năm cuối ngành Toán ứng dụng, Đại học Quy Nhơn. Em có kiến thức Python, SQL và rất mong được thực tập tại VDCD để học hỏi thực tế.', 'career_form'),
  ('dc90d88a-9825-4756-8bb6-acbcd6dde95f', 'Nguyễn Thị Mai', 'ntmai@ubndpleiku.gov.vn', '0269381xxxx', 'Hỏi về giải pháp chuyển đổi số cho UBND', 'Chúng tôi muốn tìm hiểu về giải pháp số hóa quy trình quản lý hành chính cho UBND TP. Pleiku. Xin vui lòng liên hệ để trao đổi chi tiết.', NULL, TRUE, '2026-08-31T20:04:50.107Z', NULL, NULL, NULL, NULL, NULL, NULL, 'contact_form'),
  ('6bc0f461-c29a-413e-afc3-e94c29078b92', 'Trần Văn Phúc', 'phuc.tran@htxgialai.vn', '0905987654', 'Tư vấn giải pháp IoT nông nghiệp', 'HTX chúng tôi đang canh tác 50ha cà phê tại Đắk Đoa. Muốn tìm hiểu hệ thống giám sát IoT tưới tự động và cảm biến đất của VDCD.', NULL, FALSE, '2026-08-31T20:04:50.107Z', NULL, NULL, NULL, NULL, NULL, NULL, 'contact_form'),
  ('d5883b90-4560-4c9e-ac42-5c31cdd1b8d2', 'Lê Quốc Hùng', 'hung.lq@doanhnghiep.vn', '0911222333', 'Hợp tác triển khai AutoTimelapse cho công trình', 'Công ty xây dựng chúng tôi đang thi công dự án tại Kon Tum, muốn triển khai giải pháp AutoTimelapse giám sát tiến độ. Xin báo giá và demo.', NULL, FALSE, '2026-08-31T20:04:50.107Z', NULL, NULL, NULL, NULL, NULL, NULL, 'contact_form');

-- ------------------------------------------------------------------------------
-- TABLE: contact (0 rows)
-- ------------------------------------------------------------------------------
-- (Table is currently empty, skipping inserts)

-- ------------------------------------------------------------------------------
-- TABLE: page_banner (7 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "page_banner" ("id", "page_key", "title", "subtitle", "tag", "image_url", "image_file_id", "cta_buttons", "is_active", "created_at", "updated_at") VALUES
  ('29491b22-5867-4366-8bca-f644bfab9787', 'projects', 'Những công trình
kiến tạo giá trị', 'Mỗi dự án là một hành trình đồng hành cùng khách hàng — từ khảo sát thực địa đến giám sát thi công, chuyển đổi số hóa và bàn giao giải pháp bền vững.', 'Dự án tiêu biểu', 'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited-768x576.jpg', 'page-banner-image-1', '[{"href":"#gallery","label":"Xem dự án","variant":"primary","ariaLabel":"Xem các dự án tiêu biểu"},{"href":"/contact","label":"Liên hệ hợp tác","variant":"secondary","ariaLabel":"Liên hệ hợp tác dự án"}]'::jsonb, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('a4f7088b-2b47-4dcb-aa36-b5a3a9a4cff4', 'programs', 'Chương trình
đổi mới sáng tạo', 'Khám phá các chương trình chiến lược của VDCD — từ chuyển đổi số nông nghiệp, đô thị thông minh đến đào tạo nguồn nhân lực và năng lượng tái tạo cho Tây Nguyên.', 'Chương trình', 'https://picsum.photos/id/1015/1920/1080', 'page-banner-image-2', '[{"href":"#programs-grid","label":"Khám phá chương trình","variant":"primary","ariaLabel":"Xem danh sách chương trình"},{"href":"/contact","label":"Liên hệ tư vấn","variant":"secondary","ariaLabel":"Liên hệ tư vấn chương trình"}]'::jsonb, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('173a5d0e-422b-40ce-acff-7d106f1dbf45', 'news', 'Cập nhật mới nhất
từ VDCD Group', 'Theo dõi tin tức, sự kiện và những câu chuyện đổi mới sáng tạo từ VDCD — nơi công nghệ gặp gỡ phát triển bền vững.', 'Tin tức & Bài viết', 'https://picsum.photos/id/180/1920/1080', 'page-banner-image-3', '[{"href":"#news-grid","label":"Đọc tin mới","variant":"primary","ariaLabel":"Xem danh sách bài viết"},{"href":"/about-us","label":"Về chúng tôi","variant":"secondary","ariaLabel":"Tìm hiểu về VDCD Group"}]'::jsonb, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('a4622248-c083-4328-a0b7-3291d6cefc37', 'contact', 'Kết nối cùng
VDCD Group', 'Hãy liên hệ với chúng tôi để được tư vấn về các giải pháp chuyển đổi số, hợp tác dự án, hoặc bất kỳ thông tin nào bạn cần. Đội ngũ VDCD luôn sẵn sàng hỗ trợ.', 'Liên hệ', 'https://picsum.photos/id/368/1920/1080', 'page-banner-image-4', '[{"href":"#contact-form","label":"Gửi tin nhắn","variant":"primary","ariaLabel":"Gửi tin nhắn cho chúng tôi"},{"href":"tel:0373600099","label":"Gọi ngay","variant":"secondary","ariaLabel":"Gọi hotline VDCD"}]'::jsonb, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('a3017078-5acd-4aa3-a12a-85a4d24d6f5c', 'careers', 'Kiến tạo tương lai
chuyển đổi số tại Gia Lai', 'Gia nhập VDCD Group để cùng xây dựng hệ sinh thái công nghệ tiên phong, đưa các giải pháp đổi mới sáng tạo vào phục vụ phát triển kinh tế bền vững tại khu vực Tây Nguyên.', 'Tuyển dụng', 'https://picsum.photos/id/1/1920/1080', 'page-banner-image-5', '[{"href":"#positions","label":"Xem vị trí","variant":"primary","ariaLabel":"Xem các vị trí tuyển dụng"},{"href":"/about-us","label":"Về chúng tôi","variant":"secondary","ariaLabel":"Tìm hiểu về VDCD Group"}]'::jsonb, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('dcfaf6e9-2460-46f6-9628-c2c78f5f0b1c', 'about', 'KIẾN TẠO
TƯƠNG LAI SỐ', 'VDCD Group là hệ sinh thái công nghệ hàng đầu tại Việt Nam, tiên phong cung cấp các giải pháp đổi mới sáng tạo, chuyển đổi số toàn diện và chế tạo thiết bị công nghệ cao phục vụ phát triển kinh tế vùng bền vững.', 'Về chúng tôi', 'https://picsum.photos/id/367/1920/1080', 'page-banner-image-6', '[{"href":"#brand-story","label":"Tìm hiểu thêm","variant":"primary","ariaLabel":"Tìm hiểu thêm về VDCD Group"},{"href":"/contact","label":"Liên hệ","variant":"secondary","ariaLabel":"Liên hệ với VDCD Group"}]'::jsonb, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z'),
  ('af1765a6-d220-4451-abcd-9c6c0cd56dd1', 'solutions', 'Giải pháp
theo lĩnh vực', 'Khám phá các giải pháp công nghệ toàn diện của chúng tôi, mang lại giá trị bền vững và hiệu quả tối ưu cho từng lĩnh vực hoạt động.', 'Giải pháp', 'https://picsum.photos/id/201/1920/1080', 'page-banner-image-7', '[{"href":"#solutions-grid","label":"Xem giải pháp","variant":"primary","ariaLabel":"Xem các giải pháp"},{"href":"/contact","label":"Liên hệ tư vấn","variant":"secondary","ariaLabel":"Liên hệ tư vấn giải pháp"}]'::jsonb, TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z');

-- ------------------------------------------------------------------------------
-- TABLE: slide (5 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "slide" ("id", "title", "description", "cta_text", "cta_url", "image_url", "order", "is_active", "created_at", "subtitle", "image_file_id") VALUES
  ('86f80ccc-ce60-445a-a665-7f05dc7e444e', 'SỐ HÓA DỮ LIỆU ĐẤT ĐAI', 'Ứng dụng UAV và AI xây dựng bản đồ số hiện trạng 2D/3D, nhận diện ranh thửa và tích hợp trên phần mềm 3DGIS phục vụ đối soát, quản lý dữ liệu đất đai.', 'Tìm hiểu thêm', '/#', 'https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/1788429301995-80b1c4213a06.jpg', 1, TRUE, '2026-08-31T20:04:50.107Z', '', '6a9943f7ead997d09afdfea1'),
  ('4ac78763-ec9a-4a9b-9e19-0068c7e443f5', 'QUẢN LÝ TÀI NGUYÊN VÀ MÔI TRƯỜNG', 'Kết hợp UAV, AI, AutoTimelapse và phần mềm 3DGIS trong khảo sát, kiểm kê, giám sát biến động và hỗ trợ quản lý tài nguyên, môi trường.', 'Tìm hiểu thêm', '/#', 'https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/1788429311480-6a4bf76e5534.webp', 2, TRUE, '2026-08-31T20:04:50.107Z', '', '6a994401ead997d09afe517b'),
  ('4a6acd92-e307-49f6-830f-cac75f81af12', 'ĐÔ THỊ THÔNG MINH', 'Kết nối camera AI và AutoTimelapse để thu thập dữ liệu hiện trường, tích hợp trên phần mềm AutoTimelapse Pro, hỗ trợ giám sát, quản lý và nâng cao hiệu quả điều hành đô thị.', 'Tìm hiểu thêm', '/#', 'https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/1788429320884-44564d8c2b78.png', 3, TRUE, '2026-08-31T20:04:50.107Z', '', '6a99440aead997d09afe940f'),
  ('cc549362-6ade-457a-9c5a-febab365fe05', 'TRUNG TÂM DỮ LIỆU VÙNG', 'Hạ tầng Data Center phục vụ lưu trữ, tích hợp và chia sẻ dữ liệu tập trung, kết nối các hệ thống và hỗ trợ khai thác dữ liệu phục vụ quản lý, điều hành.', 'Tìm hiểu thêm', '/#', 'https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/1788429330513-c7068cbd16ee.webp', 4, TRUE, '2026-08-31T20:04:50.107Z', '', '6a994414ead997d09afee3bf'),
  ('2609eb18-f74a-451d-a01c-bff702a8ada7', 'TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI', 'Kết nối công nghệ, chuyên gia và doanh nghiệp, thúc đẩy chuyển đổi số và phát triển hệ sinh thái khởi nghiệp đổi mới sáng tạo tại địa phương.', 'Tìm hiểu thêm', '/slides/so-hoa-du-lieu-dat-dai', 'https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/1788429211721-48490265ae67.png', 0, TRUE, '2026-08-31T20:04:50.107Z', '', '6a99439dead997d09afb7fed');

-- ------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------
-- TABLE: program (5 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "program" ("id", "title", "slug", "short_description", "content", "thumbnail", "meta_title", "meta_description", "is_published", "created_at", "updated_at", "field_id", "thumbnail_file_id") VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-012345678901', 'Ươm tạo khởi nghiệp sáng tạo', 'uom-tao-khoi-nghiep-sang-tao', 'Từ ý tưởng đến mô hình có thể thử nghiệm và thương mại hóa. Hỗ trợ dự án hoàn thiện mô hình kinh doanh, phát triển sản phẩm thử nghiệm, kiểm chứng thị trường và kết nối nguồn lực để thương mại hóa.', '<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ƯƠM TẠO KHỞI NGHIỆP SÁNG TẠO</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Từ ý tưởng đến mô hình có thể thử nghiệm và thương mại hóa</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai hỗ trợ cá nhân, nhóm dự án, startup, hợp tác xã và doanh nghiệp từng bước kiểm chứng ý tưởng, hoàn thiện mô hình kinh doanh, phát triển sản phẩm thử nghiệm và tiếp cận các nguồn lực phù hợp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mục tiêu của chương trình không chỉ là hoàn thiện một bản kế hoạch, mà giúp dự án trả lời được những câu hỏi quan trọng: Sản phẩm giải quyết vấn đề gì? Ai sẵn sàng sử dụng? Mô hình có khả thi không? Và cần làm gì tiếp theo để đưa sản phẩm vào thực tế?</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image110.png?tr=w-1200,q-80,f-auto" alt="Ông Trần Tuấn Cường đang nêu những khó khăn đang gặp phải tại Gia Lai" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Ông Trần Tuấn Cường đang nêu những khó khăn đang gặp phải tại Gia Lai</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">Ý TƯỞNG TỐT VẪN CẦN MỘT LỘ TRÌNH ĐÚNG</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhiều ý tưởng khởi nghiệp được hình thành từ những vấn đề gần gũi trong đời sống, sản xuất và nhu cầu của địa phương. Tuy nhiên, để biến ý tưởng thành một dự án có khả năng phát triển, đội ngũ sáng lập thường gặp phải những điểm nghẽn:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chưa xác định rõ khách hàng và nhu cầu thực tế.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chưa biết cách kiểm chứng tính khả thi của ý tưởng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sản phẩm còn ở dạng khái niệm, chưa có phiên bản thử nghiệm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mô hình kinh doanh và phương án tạo doanh thu chưa rõ ràng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thiếu kinh nghiệm về quản trị, tài chính, pháp lý và thị trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chưa tiếp cận được công nghệ, chuyên gia và đối tác phù hợp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chưa có hồ sơ đủ thuyết phục để giới thiệu dự án.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chương trình ươm tạo giúp dự án nhận diện đúng điểm nghẽn, xác định việc cần ưu tiên và xây dựng lộ trình phát triển phù hợp với nguồn lực hiện có.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐỐI TƯỢNG THAM GIA</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cá nhân và nhóm có ý tưởng</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Có ý tưởng giải quyết một vấn đề thực tế nhưng chưa biết bắt đầu hoặc chưa hình thành mô hình kinh doanh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Startup và dự án khởi nghiệp</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đã có sản phẩm ban đầu, cần kiểm chứng thị trường, hoàn thiện mô hình hoặc chuẩn bị cho giai đoạn phát triển tiếp theo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sinh viên và nhóm nghiên cứu</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Có sáng kiến, kết quả nghiên cứu hoặc sản phẩm công nghệ cần đánh giá khả năng ứng dụng và thương mại hóa.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hợp tác xã và doanh nghiệp</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Muốn đổi mới sản phẩm, quy trình, phương thức vận hành hoặc phát triển mô hình kinh doanh mới trên nền tảng công nghệ.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">HÀNH TRÌNH ƯƠM TẠO</h2>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">01. Tiếp nhận và đánh giá</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tìm hiểu ý tưởng, đội ngũ, sản phẩm, thị trường dự kiến và những khó khăn dự án đang gặp phải. Kết quả đánh giá giúp xác định giai đoạn phát triển và nội dung cần ưu tiên.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">02. Kiểm chứng vấn đề và khách hàng</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Làm rõ đối tượng khách hàng, nhu cầu cần giải quyết và giá trị mà sản phẩm mang lại. Dự án được định hướng khảo sát, phỏng vấn và thu thập phản hồi từ người dùng thực tế.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">03. Hoàn thiện mô hình kinh doanh</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xác định khách hàng mục tiêu, giá trị cốt lõi, nguồn doanh thu, cơ cấu chi phí, kênh tiếp cận thị trường và những nguồn lực cần thiết.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">04. Phát triển sản phẩm thử nghiệm</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hỗ trợ dự án xây dựng mô hình mẫu, phiên bản khả dụng tối thiểu (MVP) hoặc bản chứng minh tính khả thi của giải pháp (POC).</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tùy theo nhu cầu, dự án có thể được kết nối với năng lực công nghệ trong hệ sinh thái VDCD Group như AI, phần mềm, dữ liệu, UAV, GIS, mô hình 3D và hạ tầng tính toán.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">05. Thử nghiệm và hoàn thiện</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đưa sản phẩm đến nhóm người dùng hoặc đối tác tiềm năng để thu thập phản hồi, đánh giá khả năng sử dụng và tiếp tục điều chỉnh sản phẩm, phương án vận hành và chiến lược thị trường.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">06. Trình bày và kết nối nguồn lực</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hoàn thiện hồ sơ giới thiệu, nội dung thuyết trình và kế hoạch phát triển. Những dự án phù hợp có thể được giới thiệu đến chuyên gia, doanh nghiệp, đơn vị công nghệ, chương trình hỗ trợ hoặc nguồn lực đầu tư.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">DỰ ÁN ĐƯỢC HỖ TRỢ NHỮNG GÌ?</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sản phẩm và mô hình kinh doanh</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Làm rõ vấn đề, giá trị khác biệt, khách hàng mục tiêu, phương thức tạo doanh thu và khả năng mở rộng của dự án.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Công nghệ và phát triển giải pháp</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết nối đội ngũ kỹ thuật, công nghệ và hạ tầng phù hợp để hỗ trợ hoàn thiện sản phẩm mẫu hoặc phiên bản thử nghiệm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thị trường và vận hành</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng cách tiếp cận khách hàng, kế hoạch truyền thông, phương án vận hành, tài chính và sử dụng nguồn lực.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chuyên gia và hệ sinh thái</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết nối chuyên gia, cố vấn, doanh nghiệp, trường đại học, tổ chức nghiên cứu và đối tác có khả năng hỗ trợ dự án trong từng giai đoạn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mỗi dự án có một điểm xuất phát khác nhau. Sau bước đánh giá ban đầu, Trung tâm Đổi mới Sáng tạo Gia Lai sẽ đề xuất nội dung và lộ trình phù hợp, thay vì áp dụng một chương trình giống nhau cho tất cả.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image115.png?tr=w-1200,q-80,f-auto" alt="Ông Cao Quân Vũ trực tiếp tư vấn cho các doanh nghiệp địa phương" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Ông Cao Quân Vũ trực tiếp tư vấn cho các doanh nghiệp địa phương</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">KẾT QUẢ DỰ ÁN HƯỚNG ĐẾN</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tùy theo mức độ phát triển, dự án có thể hoàn thiện một hoặc nhiều đầu ra:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Định vị và hồ sơ dự án rõ ràng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết quả kiểm chứng nhu cầu khách hàng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mô hình kinh doanh được hoàn thiện.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sản phẩm mẫu, MVP hoặc POC.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kế hoạch tiếp cận và thử nghiệm thị trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phương án vận hành và tài chính ban đầu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Bộ hồ sơ hoặc bài thuyết trình dự án.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Lộ trình phát triển trong giai đoạn tiếp theo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mạng lưới chuyên gia, doanh nghiệp và đối tác phù hợp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết quả của chương trình được đánh giá bằng mức độ dự án hiểu thị trường rõ hơn, sản phẩm cụ thể hơn và xác định được bước đi tiếp theo.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image101.png?tr=w-1200,q-80,f-auto" alt="Startup trao đổi về ý tưởng mới tại hội thảo." class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Startup trao đổi về ý tưởng mới tại hội thảo.</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">HỆ SINH THÁI ĐỒNG HÀNH CÙNG DỰ ÁN</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai kết nối nguồn lực trong hệ sinh thái VDCD Group, bao gồm:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mạng lưới chuyên gia và cố vấn đa lĩnh vực.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đội ngũ nghiên cứu, kỹ thuật và phát triển sản phẩm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Năng lực về UAV, AI, GIS, phần mềm và dữ liệu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hạ tầng trung tâm dữ liệu và tính toán.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Doanh nghiệp, trường đại học và tổ chức nghiên cứu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đối tác thị trường, truyền thông và thương mại.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm đóng vai trò tổ chức, định hướng và kết nối nguồn lực; đội ngũ sáng lập vẫn là chủ thể trực tiếp phát triển sản phẩm và đưa dự án vào thực tế.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐƯA Ý TƯỞNG ĐI XA HƠN BẰNG NHỮNG BƯỚC ĐI CỤ THỂ</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khởi nghiệp sáng tạo không bắt đầu bằng một kế hoạch hoàn hảo. Nó bắt đầu bằng việc hiểu đúng vấn đề, kiểm chứng từng giả định và liên tục hoàn thiện sản phẩm từ phản hồi thực tế.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐĂNG KÝ THAM GIA CHƯƠNG TRÌNH ƯƠM TẠO</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Gửi thông tin về ý tưởng, đội ngũ, sản phẩm hiện có và nhu cầu cần hỗ trợ. Trung tâm Đổi mới Sáng tạo Gia Lai sẽ tiếp nhận, đánh giá ban đầu và trao đổi về lộ trình phù hợp.</p>

<div class="project-style-cta border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 md:p-14 space-y-6 relative overflow-hidden transition-all duration-300 text-center my-12">
  <div class="flex items-center justify-center gap-2 text-accent-red font-mono text-xs font-bold uppercase tracking-widest mb-1">
    <span class="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
    Ươm tạo khởi nghiệp
  </div>

  <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold font-heading tracking-tight uppercase max-w-3xl mx-auto leading-tight text-zinc-950 dark:text-white transition-colors duration-300">
    Đưa ý tưởng đi xa hơn bằng những bước đi cụ thể
  </h3>

  <p class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed pb-2 transition-colors duration-300 font-sans">
    Gửi thông tin về ý tưởng, đội ngũ, sản phẩm hiện có và nhu cầu cần hỗ trợ. Trung tâm Đổi mới Sáng tạo Gia Lai sẽ tiếp nhận, đánh giá ban đầu và trao đổi về lộ trình phù hợp.
  </p>

  <div class="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
    <a
      href="/contact"
      class="program-cta-btn cta-btn-primary inline-flex items-center gap-3 pl-6 pr-4 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent-red hover:text-white dark:hover:bg-accent-red dark:hover:text-white transition-all duration-300 shadow-lg group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none !no-underline"
      style="text-decoration: none !important;"
    >
      <span>GỬI HỒ SƠ DỰ ÁN</span>
      <span class="w-8 h-8 bg-white/10 dark:bg-black/10 flex items-center justify-center text-inherit group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </span>
    </a>

    <a
      href="/contact"
      class="program-cta-btn cta-btn-secondary inline-flex items-center gap-3 pl-6 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono text-xs font-bold uppercase tracking-widest hover:border-accent-red hover:text-accent-red transition-all duration-300 backdrop-blur-sm group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none cursor-pointer !no-underline"
      style="text-decoration: none !important;"
    >
      <span>TRAO ĐỔI VỚI TRUNG TÂM</span>
      <span class="w-8 h-8 bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-inherit group-hover:bg-accent-red/10 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </span>
    </a>
  </div>
</div>', 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/ai_thong_minh.png?tr=w-1200,q-85,f-auto', 'Ươm tạo khởi nghiệp sáng tạo | VDCD Gia Lai', 'Hỗ trợ dự án hoàn thiện mô hình kinh doanh, phát triển sản phẩm thử nghiệm, kiểm chứng thị trường và kết nối nguồn lực để thương mại hóa.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'c0110001-0000-4000-a000-000000000001', 'program-thumb-uom-tao-khoi-nghiep-sang-tao'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-012345678902', 'Đào tạo công nghệ và chuyển đổi số', 'dao-tao-cong-nghe-va-chuyen-doi-so', 'Chương trình đào tạo theo nhu cầu thực tế về chuyển đổi số, UAV, AI, GIS, BIM và quản trị dữ liệu số cho doanh nghiệp và các sở ban ngành.', '<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐÀO TẠO</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Học để hiểu, thực hành để làm được</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai tổ chức các chương trình đào tạo gắn với nhu cầu thực tế của cơ quan, doanh nghiệp, trường học và đội ngũ triển khai tại địa phương.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nội dung được xây dựng theo từng nhóm đối tượng, kết hợp kiến thức nền tảng, tình huống thực tế và hoạt động thực hành. Mục tiêu sau đào tạo không chỉ là hiểu thêm về công nghệ, mà là biết cách lựa chọn, vận hành và đưa công nghệ vào công việc cụ thể.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image57.png?tr=w-1200,q-80,f-auto" alt="Ông Dương Đức Cảnh - Phó viện trưởng viện thiết kế số, Phó GIÁM ĐỐC TRUNG TÂM ĐÀO TẠO VÀ CHUYỂN GIAO CÔNG NGHỆ" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Ông Dương Đức Cảnh - Phó viện trưởng viện thiết kế số, Phó GIÁM ĐỐC TRUNG TÂM ĐÀO TẠO VÀ CHUYỂN GIAO CÔNG NGHỆ</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐÀO TẠO BẮT ĐẦU TỪ NHU CẦU THỰC TẾ</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mỗi đơn vị có một điểm xuất phát khác nhau. Có nơi cần trang bị kiến thức nền tảng về chuyển đổi số; có đội ngũ cần nâng cao kỹ năng vận hành thiết bị; cũng có doanh nghiệp muốn đào tạo nhân sự để triển khai một giải pháp mới.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nếu nội dung đào tạo không gắn với công việc, kiến thức sẽ khó được áp dụng sau chương trình. Vì vậy, Trung tâm Đổi mới Sáng tạo Gia Lai tiếp cận đào tạo theo ba nguyên tắc:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đúng đối tượng: Nội dung phù hợp với vai trò và trình độ người học.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đúng nhu cầu: Tập trung vào những vấn đề đơn vị đang cần giải quyết.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Có thực hành: Kết hợp tình huống, dữ liệu, thiết bị hoặc phần mềm thực tế.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐỐI TƯỢNG ĐÀO TẠO</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cơ quan và đơn vị quản lý</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nâng cao nhận thức về chuyển đổi số, quản trị dữ liệu và khả năng ứng dụng công nghệ trong công tác chuyên môn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Doanh nghiệp và hợp tác xã</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trang bị kiến thức, kỹ năng và phương pháp để cải tiến quy trình, khai thác dữ liệu và nâng cao hiệu quả vận hành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đội ngũ kỹ thuật</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đào tạo vận hành thiết bị, thu thập dữ liệu hiện trường, xử lý nội nghiệp và sử dụng các nền tảng công nghệ chuyên môn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sinh viên và người trẻ</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tiếp cận công nghệ mới, rèn luyện kỹ năng thực hành và hiểu rõ hơn nhu cầu nhân lực trong môi trường số.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image62.png?tr=w-1200,q-80,f-auto" alt="https://www.facebook.com/share/1GqPWZPHFJ/Đào tạo Bim cho các nhân sự của doanh nghiệp tại địa phương" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">https://www.facebook.com/share/1GqPWZPHFJ/Đào tạo Bim cho các nhân sự của doanh nghiệp tại địa phương</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">CÁC NHÓM CHƯƠNG TRÌNH ĐÀO TẠO</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chuyển đổi số và quản trị dữ liệu</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Giúp học viên hiểu đúng về chuyển đổi số, nhận diện các quy trình có thể cải tiến và xây dựng tư duy quản lý dựa trên dữ liệu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nội dung có thể bao gồm:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhận thức và tư duy chuyển đổi số.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Số hóa quy trình và hồ sơ.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thu thập, chuẩn hóa và quản trị dữ liệu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">An toàn và khai thác dữ liệu trong hoạt động.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Ứng dụng nền tảng số vào quản lý, sản xuất và kinh doanh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">UAV, bản đồ số và GIS</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trang bị kiến thức từ vận hành thiết bị ngoài thực địa đến xử lý, kiểm tra và khai thác dữ liệu sau thu thập.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nội dung có thể bao gồm:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kiến thức cơ bản và an toàn vận hành UAV.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Lập kế hoạch bay và thu thập dữ liệu hiện trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sử dụng GNSS và thiết lập điểm khống chế.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xử lý bình đồ ảnh, mô hình 2D và 3D.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Biên tập, quản lý và khai thác dữ liệu trên GIS.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phối hợp giữa công tác ngoại nghiệp và nội nghiệp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">AI, phần mềm và khai thác dữ liệu</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Giúp học viên hiểu khả năng ứng dụng AI và phần mềm vào từng bài toán cụ thể, từ nhận diện hình ảnh đến tự động hóa quy trình.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nội dung có thể bao gồm:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kiến thức nền tảng về AI và dữ liệu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Ứng dụng AI trong phân tích hình ảnh, video.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhận diện, đếm và phân loại đối tượng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sử dụng phần mềm và dashboard quản lý.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khai thác dữ liệu phục vụ báo cáo và ra quyết định.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sử dụng AI có trách nhiệm và kiểm soát kết quả đầu ra.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khởi nghiệp và đổi mới sáng tạo</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trang bị phương pháp giúp cá nhân và nhóm dự án phát triển ý tưởng theo hướng thực tế hơn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nội dung có thể bao gồm:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xác định vấn đề và khách hàng mục tiêu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng mô hình kinh doanh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phát triển sản phẩm thử nghiệm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kiểm chứng nhu cầu thị trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng thương hiệu và kế hoạch tiếp cận khách hàng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hoàn thiện hồ sơ và kỹ năng trình bày dự án.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phần đào tạo cung cấp kiến thức và công cụ thực hành. Những dự án cần đồng hành chuyên sâu từ ý tưởng đến thương mại hóa sẽ được định hướng sang chương trình Ươm tạo khởi nghiệp sáng tạo.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image112.png?tr=w-1200,q-80,f-auto" alt="Hơn 600+ học viên đến từ các sở ban ngành tham dự buổi đạo tào" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Hơn 600+ học viên đến từ các sở ban ngành tham dự buổi đạo tào</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">QUY TRÌNH XÂY DỰNG CHƯƠNG TRÌNH</h2>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">01. Khảo sát nhu cầu</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tìm hiểu đối tượng học viên, mục tiêu của đơn vị, kiến thức hiện có và vấn đề cần giải quyết sau đào tạo.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">02. Thiết kế nội dung</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng chủ đề, thời lượng, hình thức tổ chức và hoạt động thực hành phù hợp với yêu cầu thực tế.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">03. Tổ chức đào tạo</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết hợp trình bày kiến thức, minh họa công nghệ, trao đổi tình huống và hướng dẫn thực hành.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">04. Thực hành và xử lý tình huống</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Học viên trực tiếp làm việc với thiết bị, phần mềm, dữ liệu mẫu hoặc bài toán mô phỏng phù hợp với chương trình.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">05. Đánh giá và đề xuất áp dụng</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đánh giá mức độ tiếp thu, tổng hợp phản hồi và đề xuất những nội dung đơn vị có thể tiếp tục triển khai sau đào tạo.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">HÌNH THỨC TỔ CHỨC LINH HOẠT</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tùy theo mục tiêu và điều kiện triển khai, chương trình có thể được tổ chức dưới nhiều hình thức:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hội thảo và chương trình nâng cao nhận thức.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Lớp đào tạo tập trung theo chuyên đề.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đào tạo trực tiếp tại đơn vị.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thực hành ngoài hiện trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hướng dẫn sử dụng thiết bị và phần mềm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chương trình ngắn hạn theo nhu cầu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đào tạo kết hợp trực tiếp và trực tuyến.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thời lượng và nội dung được điều chỉnh theo nhóm học viên, thay vì sử dụng một giáo trình cố định cho mọi đối tượng.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">KẾT QUẢ SAU ĐÀO TẠO</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tùy theo từng chương trình, đơn vị và học viên có thể nhận được:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chương trình được thiết kế theo nhu cầu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tài liệu và hướng dẫn thực hành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kiến thức nền tảng về lĩnh vực đào tạo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kỹ năng sử dụng thiết bị hoặc phần mềm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Bài tập và tình huống gắn với công việc.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết quả đánh giá mức độ tiếp thu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đề xuất áp dụng sau chương trình.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xác nhận hoàn thành nếu chương trình có áp dụng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mỗi chương trình cần xác định rõ học viên sẽ hiểu được gì, làm được gì và có thể áp dụng vào đâu.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">KẾT NỐI CHUYÊN MÔN VÀ CÔNG NGHỆ</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai kết nối nguồn lực trong hệ sinh thái VDCD Group để xây dựng và tổ chức các chương trình phù hợp:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mạng lưới chuyên gia, giảng viên và đội ngũ kỹ thuật.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kinh nghiệm triển khai công nghệ tại hiện trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hệ thống UAV, AI, GIS, phần mềm và dữ liệu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hạ tầng trung tâm dữ liệu và tính toán.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mạng lưới doanh nghiệp, trường đại học và tổ chức nghiên cứu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chuyên gia được lựa chọn theo chủ đề và mục tiêu của chương trình, giúp nội dung đào tạo vừa có nền tảng chuyên môn, vừa gắn với kinh nghiệm triển khai thực tế.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image107.png?tr=w-1200,q-80,f-auto" alt="Chuyên gia đang đào tạo cho nhân sự mới ra trường" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Chuyên gia đang đào tạo cho nhân sự mới ra trường</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">XÂY DỰNG NĂNG LỰC ĐỂ CÔNG NGHỆ ĐƯỢC ÁP DỤNG THỰC CHẤT</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Công nghệ chỉ tạo ra giá trị khi đội ngũ hiểu, sử dụng đúng và có khả năng duy trì trong công việc hằng ngày.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai hướng đến các chương trình đào tạo thiết thực, dễ tiếp cận và có khả năng chuyển hóa kiến thức thành năng lực triển khai.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐỀ XUẤT CHƯƠNG TRÌNH ĐÀO TẠO</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cơ quan, doanh nghiệp và tổ chức có thể gửi nhu cầu về đối tượng học viên, chủ đề, mục tiêu và hình thức tổ chức. Trung tâm sẽ khảo sát và đề xuất nội dung phù hợp.</p>

<div class="project-style-cta border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 md:p-14 space-y-6 relative overflow-hidden transition-all duration-300 text-center my-12">
  <div class="flex items-center justify-center gap-2 text-accent-red font-mono text-xs font-bold uppercase tracking-widest mb-1">
    <span class="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
    Đào tạo công nghệ
  </div>

  <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold font-heading tracking-tight uppercase max-w-3xl mx-auto leading-tight text-zinc-950 dark:text-white transition-colors duration-300">
    Xây dựng năng lực để công nghệ được áp dụng thực chất
  </h3>

  <p class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed pb-2 transition-colors duration-300 font-sans">
    Cơ quan, doanh nghiệp và tổ chức có thể gửi nhu cầu về đối tượng học viên, chủ đề, mục tiêu và hình thức tổ chức. Trung tâm sẽ khảo sát và đề xuất nội dung phù hợp.
  </p>

  <div class="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
    <a
      href="/contact"
      class="program-cta-btn cta-btn-primary inline-flex items-center gap-3 pl-6 pr-4 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent-red hover:text-white dark:hover:bg-accent-red dark:hover:text-white transition-all duration-300 shadow-lg group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none !no-underline"
      style="text-decoration: none !important;"
    >
      <span>ĐĂNG KÝ NHU CẦU ĐÀO TẠO</span>
      <span class="w-8 h-8 bg-white/10 dark:bg-black/10 flex items-center justify-center text-inherit group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </span>
    </a>

    <a
      href="/contact"
      class="program-cta-btn cta-btn-secondary inline-flex items-center gap-3 pl-6 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono text-xs font-bold uppercase tracking-widest hover:border-accent-red hover:text-accent-red transition-all duration-300 backdrop-blur-sm group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none cursor-pointer !no-underline"
      style="text-decoration: none !important;"
    >
      <span>TRAO ĐỔI VỚI TRUNG TÂM</span>
      <span class="w-8 h-8 bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-inherit group-hover:bg-accent-red/10 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </span>
    </a>
  </div>
</div>', 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/data_center_viet_nam.png?tr=w-1200,q-85,f-auto', 'Đào tạo công nghệ và chuyển đổi số | VDCD Gia Lai', 'Chương trình đào tạo theo nhu cầu thực tế về chuyển đổi số, UAV, AI, GIS, BIM và quản trị dữ liệu số cho doanh nghiệp và các sở ban ngành.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'c0110001-0000-4000-a000-000000000002', 'program-thumb-dao-tao-cong-nghe-va-chuyen-doi-so'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-012345678903', 'Kết nối chuyên gia và hệ sinh thái', 'ket-noi-chuyen-gia-va-he-sinh-thai', 'Kết nối đúng chuyên môn – Tháo gỡ đúng nút thắt – Mở rộng cơ hội hợp tác giữa chính quyền, doanh nghiệp, viện nghiên cứu và trường đại học.', '<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">KẾT NỐI CHUYÊN GIA</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đúng bài toán - Đúng chuyên gia - Đúng thời điểm</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Một vấn đề chỉ có thể được giải quyết hiệu quả khi đơn vị tiếp cận đúng người có chuyên môn, kinh nghiệm và khả năng đồng hành phù hợp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai kết nối cơ quan, doanh nghiệp, hợp tác xã, startup và tổ chức nghiên cứu với mạng lưới chuyên gia trong nhiều lĩnh vực. Không chỉ giới thiệu thông tin liên hệ, Trung tâm hỗ trợ làm rõ nhu cầu, lựa chọn chuyên gia và tổ chức hình thức trao đổi phù hợp với từng bài toán.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image105.png?tr=w-1200,q-80,f-auto" alt="Kí kết hợp tác chiến lược với Vietadge" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Kí kết hợp tác chiến lược với Vietadge</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">KHI BÀI TOÁN ĐÃ CÓ NHƯNG CHƯA TÌM ĐƯỢC ĐÚNG NGƯỜI</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trong quá trình triển khai công việc, nhiều đơn vị gặp những nhu cầu như:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần đánh giá tính khả thi của một ý tưởng hoặc giải pháp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần ý kiến chuyên môn trước khi triển khai dự án.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Muốn ứng dụng công nghệ nhưng chưa xác định phương án phù hợp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần chuyên gia phản biện sản phẩm, quy trình hoặc mô hình kinh doanh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần đối tác có năng lực kỹ thuật để phối hợp triển khai.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Muốn tiếp cận mạng lưới doanh nghiệp, trường đại học và tổ chức nghiên cứu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Việc tìm được một chuyên gia giỏi chưa chắc đã đủ. Chuyên gia cần có kinh nghiệm phù hợp với lĩnh vực, hiểu đúng vấn đề và tham gia theo hình thức đáp ứng được mục tiêu của đơn vị.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai đóng vai trò tiếp nhận bài toán, xác định nhu cầu và kết nối đúng nguồn lực chuyên môn.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐỐI TƯỢNG KẾT NỐI</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cơ quan và đơn vị quản lý</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần ý kiến chuyên môn, phản biện giải pháp hoặc kết nối nguồn lực phục vụ chương trình và dự án tại địa phương.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Doanh nghiệp và hợp tác xã</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần chuyên gia hỗ trợ về công nghệ, vận hành, sản phẩm, thị trường hoặc đổi mới mô hình kinh doanh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Startup và nhóm dự án</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần cố vấn đánh giá ý tưởng, hoàn thiện sản phẩm, kiểm chứng mô hình và chuẩn bị cho giai đoạn phát triển tiếp theo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trường đại học và tổ chức nghiên cứu</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cần kết nối doanh nghiệp, chuyên gia thực tiễn hoặc đối tác để hợp tác nghiên cứu, chuyển giao và ứng dụng công nghệ.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">7(5).JPG</h2>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image114.png?tr=w-1200,q-80,f-auto" alt="Kí kết MOU với Trường Đại học Quy Nhơn" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Kí kết MOU với Trường Đại học Quy Nhơn</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">LĨNH VỰC CHUYÊN GIA KẾT NỐI</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Công nghệ và chuyển đổi số</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng chiến lược và lộ trình chuyển đổi số.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Quản trị, số hóa và khai thác dữ liệu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phát triển phần mềm và nền tảng quản lý.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hạ tầng công nghệ, trung tâm dữ liệu và an toàn thông tin.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">UAV, AI và dữ liệu không gian</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">UAV, trắc địa và bản đồ số.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">GIS, mô hình 2D, 3D và dữ liệu không gian.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trí tuệ nhân tạo và phân tích hình ảnh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tự động hóa, giám sát và cảnh báo thông minh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Quản lý và phát triển dự án</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng mô hình tổ chức và vận hành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đánh giá tính khả thi của giải pháp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Quản lý dự án và kiểm soát tiến độ.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phát triển sản phẩm và ứng dụng công nghệ.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khởi nghiệp và thị trường</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hoàn thiện mô hình kinh doanh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng thương hiệu và chiến lược thị trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cố vấn sản phẩm và phát triển khách hàng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hồ sơ dự án và định hướng tiếp cận nguồn lực.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Các lĩnh vực chuyên ngành</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thông qua hệ sinh thái VDCD Group, Trung tâm có thể kết nối chuyên gia trong các lĩnh vực như trắc địa, xây dựng, quy hoạch, đất đai, tài nguyên, môi trường, nông nghiệp, lâm nghiệp và hạ tầng đô thị.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">HÌNH THỨC KẾT NỐI</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tùy theo tính chất của từng nhu cầu, hoạt động kết nối có thể được tổ chức dưới nhiều hình thức:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trao đổi trực tiếp với chuyên gia</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phù hợp với những vấn đề cụ thể, cần làm rõ hướng tiếp cận hoặc nhận ý kiến chuyên môn ban đầu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phiên tư vấn và phản biện</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chuyên gia nghiên cứu thông tin, trao đổi với đơn vị và đưa ra nhận định, khuyến nghị hoặc phương án đề xuất.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hội đồng chuyên gia</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tập hợp chuyên gia từ nhiều lĩnh vực để đánh giá một dự án, sản phẩm hoặc giải pháp có tính liên ngành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hội thảo và tọa đàm chuyên đề</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tạo không gian trao đổi giữa chuyên gia, cơ quan quản lý, doanh nghiệp và cộng đồng về một chủ đề thực tiễn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết nối hợp tác triển khai</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Giới thiệu chuyên gia, doanh nghiệp hoặc đơn vị kỹ thuật có khả năng tiếp tục tham gia nghiên cứu, thử nghiệm hay phối hợp triển khai.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hoạt động kết nối tạo cơ hội để các bên gặp gỡ và đánh giá khả năng hợp tác; không đồng nghĩa với cam kết dự án, đầu tư hoặc kết quả thương mại.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">QUY TRÌNH KẾT NỐI CHUYÊN GIA</h2>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">01. Tiếp nhận nhu cầu</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đơn vị cung cấp thông tin về vấn đề, mục tiêu, lĩnh vực chuyên môn và kết quả mong muốn.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">02. Làm rõ bài toán</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm trao đổi để xác định phạm vi, mức độ chuyên sâu, hình thức làm việc và năng lực chuyên gia cần có.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">03. Lựa chọn chuyên gia phù hợp</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tìm kiếm và đề xuất chuyên gia dựa trên lĩnh vực chuyên môn, kinh nghiệm thực tế và mức độ phù hợp với yêu cầu.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">04. Tổ chức kết nối</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Điều phối lịch làm việc, cung cấp thông tin cần thiết và tổ chức buổi trao đổi, tư vấn hoặc phản biện.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">05. Theo dõi và mở rộng hợp tác</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tổng hợp nội dung trao đổi, tiếp nhận phản hồi và hỗ trợ kết nối các bước tiếp theo nếu hai bên có nhu cầu.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">GIÁ TRỊ NHẬN ĐƯỢC</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thông qua hoạt động kết nối, đơn vị có thể:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tiếp cận chuyên gia phù hợp trong thời gian ngắn hơn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhận góc nhìn độc lập và có cơ sở chuyên môn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhận diện sớm rủi ro trước khi triển khai.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Làm rõ hướng công nghệ, sản phẩm hoặc mô hình hoạt động.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mở rộng quan hệ với doanh nghiệp và tổ chức nghiên cứu.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hình thành cơ hội hợp tác hoặc chuyển giao công nghệ.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Có cơ sở xác định bước đi tiếp theo cho bài toán của mình.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">MẠNG LƯỚI CHUYÊN MÔN ĐA LĨNH VỰC</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai kết nối mạng lưới chuyên gia, kỹ sư, nhà nghiên cứu, doanh nghiệp công nghệ và các đơn vị thành viên trong hệ sinh thái VDCD Group.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nguồn lực đa lĩnh vực giúp Trung tâm không chỉ tìm người có chuyên môn phù hợp, mà còn có khả năng kết nối các nhóm chuyên gia khi bài toán cần sự phối hợp giữa công nghệ, quản lý và thực tiễn triển khai.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image103.png?tr=w-1200,q-80,f-auto" alt="Kí kết MOU với Trường Đại học FPT Quy Nhơn" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Kí kết MOU với Trường Đại học FPT Quy Nhơn</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">KẾT NỐI ĐÚNG NGƯỜI ĐỂ BÀI TOÁN ĐI ĐÚNG HƯỚNG</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Không phải mọi vấn đề đều cần một chương trình đào tạo dài hạn hay một dự án tư vấn tổng thể. Đôi khi, điều đơn vị cần nhất là được tiếp cận đúng chuyên gia để nhìn rõ vấn đề và xác định bước đi tiếp theo.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">GỬI NHU CẦU KẾT NỐI CHUYÊN GIA</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Cung cấp thông tin về lĩnh vực, vấn đề cần giải quyết và hình thức hỗ trợ mong muốn. Trung tâm Đổi mới Sáng tạo Gia Lai sẽ tiếp nhận, làm rõ và đề xuất phương án kết nối phù hợp.</p>

<div class="project-style-cta border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 md:p-14 space-y-6 relative overflow-hidden transition-all duration-300 text-center my-12">
  <div class="flex items-center justify-center gap-2 text-accent-red font-mono text-xs font-bold uppercase tracking-widest mb-1">
    <span class="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
    Kết nối chuyên gia
  </div>

  <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold font-heading tracking-tight uppercase max-w-3xl mx-auto leading-tight text-zinc-950 dark:text-white transition-colors duration-300">
    Kết nối đúng chuyên môn – Tháo gỡ đúng nút thắt
  </h3>

  <p class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed pb-2 transition-colors duration-300 font-sans">
    Gửi thông tin về bài toán hoặc nhu cầu hợp tác của đơn vị. Trung tâm Đổi mới Sáng tạo Gia Lai sẽ tiếp nhận, làm rõ yêu cầu và kết nối với chuyên gia hoặc đối tác phù hợp.
  </p>

  <div class="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
    <a
      href="/contact"
      class="program-cta-btn cta-btn-primary inline-flex items-center gap-3 pl-6 pr-4 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent-red hover:text-white dark:hover:bg-accent-red dark:hover:text-white transition-all duration-300 shadow-lg group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none !no-underline"
      style="text-decoration: none !important;"
    >
      <span>GỬI NHU CẦU CHUYÊN GIA</span>
      <span class="w-8 h-8 bg-white/10 dark:bg-black/10 flex items-center justify-center text-inherit group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </span>
    </a>

    <a
      href="/contact"
      class="program-cta-btn cta-btn-secondary inline-flex items-center gap-3 pl-6 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono text-xs font-bold uppercase tracking-widest hover:border-accent-red hover:text-accent-red transition-all duration-300 backdrop-blur-sm group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none cursor-pointer !no-underline"
      style="text-decoration: none !important;"
    >
      <span>TRAO ĐỔI VỚI TRUNG TÂM</span>
      <span class="w-8 h-8 bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-inherit group-hover:bg-accent-red/10 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </span>
    </a>
  </div>
</div>', 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image114.png?tr=w-1200,q-80,f-auto', 'Kết nối chuyên gia và hệ sinh thái | VDCD Gia Lai', 'Kết nối đúng chuyên môn – Tháo gỡ đúng nút thắt – Mở rộng cơ hội hợp tác giữa chính quyền, doanh nghiệp, viện nghiên cứu và trường đại học.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'c0110001-0000-4000-a000-000000000003', 'program-thumb-ket-noi-chuyen-gia-va-he-sinh-thai'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-012345678904', 'Tư vấn chuyển đổi số cấp tỉnh', 'tu-van-chuyen-doi-so-cap-tinh', 'Tư vấn chuyển đổi số từ bài toán thực tế đến lộ trình khả thi. Khảo sát hiện trạng, xây dựng danh mục ưu tiên và dashboard giám sát toàn diện cho địa phương.', '<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">TƯ VẤN CHUYỂN ĐỔI SỐ</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Từ bài toán của từng đơn vị đến lộ trình chuyển đổi số toàn diện</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chuyển đổi số không đơn thuần là trang bị phần mềm, thiết bị hay đưa hồ sơ giấy lên máy tính. Giá trị thực sự chỉ được tạo ra khi công nghệ giúp cải tiến quy trình, kết nối dữ liệu và nâng cao hiệu quả quản lý, điều hành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai kết nối chuyên gia và hệ sinh thái công nghệ để hỗ trợ tỉnh, các sở, ban, ngành, địa phương và doanh nghiệp đánh giá hiện trạng, xác định bài toán ưu tiên, xây dựng lộ trình và thử nghiệm giải pháp phù hợp.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image4.png?tr=w-1200,q-80,f-auto" alt="DashBoard quản lí toàn bộ dự án thuộc Gia Lai" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">DashBoard quản lí toàn bộ dự án thuộc Gia Lai</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">CHUYỂN ĐỔI SỐ NÊN BẮT ĐẦU TỪ ĐÂU?</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhiều đơn vị nhận thấy cần chuyển đổi số nhưng chưa xác định rõ nên triển khai khâu nào trước, lựa chọn công nghệ gì và đánh giá hiệu quả bằng cách nào.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Những điểm nghẽn thường gặp gồm:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Quy trình còn phụ thuộc nhiều vào thao tác thủ công.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Dữ liệu phân tán giữa hồ sơ, phần mềm và các phòng ban.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hệ thống hiện có chưa kết nối hoặc khó mở rộng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Việc tổng hợp báo cáo mất nhiều thời gian.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khó theo dõi tiến độ và hoạt động theo thời gian thực.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đã đầu tư công nghệ nhưng chưa khai thác hiệu quả.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhân sự chưa sẵn sàng tiếp nhận quy trình và công cụ mới.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chưa có lộ trình và tiêu chí đánh giá rõ ràng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tư vấn chuyển đổi số giúp đơn vị trả lời ba câu hỏi quan trọng:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Vấn đề nào cần giải quyết? Công nghệ nào phù hợp? Triển khai theo thứ tự nào để tạo ra hiệu quả?</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">TƯ VẤN CHUYỂN ĐỔI SỐ CẤP TỈNH VÀ LIÊN NGÀNH</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Chuyển đổi số cấp tỉnh không thể triển khai riêng lẻ tại từng cơ quan. Quy trình, dữ liệu và nhiệm vụ của các sở, ban, ngành có mối liên hệ chặt chẽ, đòi hỏi một lộ trình tổng thể nhưng vẫn phải phù hợp với đặc thù của từng lĩnh vực.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai có khả năng phối hợp tư vấn:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khảo sát hiện trạng chuyển đổi số tại các sở, ban, ngành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tổng hợp nhu cầu và mức độ sẵn sàng của từng đơn vị.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Rà soát quy trình, phần mềm và nguồn dữ liệu hiện có.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xác định dữ liệu chuyên ngành và dữ liệu có thể chia sẻ.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng danh mục nhiệm vụ chuyển đổi số theo mức độ ưu tiên.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đề xuất kiến trúc tích hợp và nền tảng dữ liệu dùng chung.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng dashboard theo dõi tiến độ và hỗ trợ điều hành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Lựa chọn mô hình thí điểm trước khi triển khai diện rộng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đào tạo và chuyển giao cho đội ngũ vận hành tại địa phương.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phạm vi có thể bao gồm hành chính công, đất đai, tài nguyên và môi trường, xây dựng, đô thị, giao thông, nông nghiệp, lâm nghiệp, giáo dục, y tế, du lịch và quản lý hạ tầng.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image109.png?tr=w-1200,q-80,f-auto" alt="Tham dự tư vấn chuyển đổi số tại UBND xã Tây Sơn" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Tham dự tư vấn chuyển đổi số tại UBND xã Tây Sơn</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">NỘI DUNG TƯ VẤN</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đánh giá hiện trạng và xác định ưu tiên</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khảo sát quy trình, dữ liệu, phần mềm, thiết bị, hạ tầng và năng lực nhân sự. Qua đó xác định những điểm nghẽn cần giải quyết, khả năng kế thừa hệ thống hiện có và các nhiệm vụ nên triển khai trước.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Số hóa quy trình và quản trị dữ liệu</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Rà soát các bước xử lý công việc, giảm thao tác trùng lặp và đề xuất phương án số hóa phù hợp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Dữ liệu được định hướng thu thập, chuẩn hóa, phân quyền và khai thác thống nhất để phục vụ tra cứu, báo cáo và hỗ trợ ra quyết định.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kiến trúc công nghệ và tích hợp hệ thống</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Giải pháp được lựa chọn dựa trên bài toán và điều kiện vận hành, có thể kết hợp:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">UAV, GIS và dữ liệu không gian.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">AI và phân tích hình ảnh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Camera AI, cảm biến và IoT.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phần mềm, dashboard và nền tảng quản lý.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm dữ liệu và hạ tầng tính toán.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Các hệ thống được định hướng kết nối, chia sẻ và hạn chế hình thành những kho dữ liệu riêng lẻ, khó khai thác.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thí điểm và mở rộng giải pháp</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Một quy trình, khu vực hoặc bài toán ưu tiên được lựa chọn để xây dựng mô hình thử nghiệm, POC hoặc chương trình thí điểm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết quả được đo lường và điều chỉnh trước khi mở rộng, giúp đơn vị kiểm soát chi phí, hạn chế rủi ro và đánh giá được hiệu quả thực tế.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">QUY TRÌNH TƯ VẤN CHUYỂN ĐỔI SỐ</h2>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">01. Tiếp nhận nhu cầu</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trao đổi về hiện trạng, khó khăn, mục tiêu và phạm vi cần tư vấn.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">02. Khảo sát và phân tích</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đánh giá quy trình, dữ liệu, hệ thống, hạ tầng và nguồn lực liên quan.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">03. Xây dựng danh mục ưu tiên</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xác định những bài toán có tính cấp thiết, khả thi và khả năng tạo ra giá trị rõ ràng.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">04. Đề xuất lộ trình và giải pháp</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Xây dựng các giai đoạn triển khai, kiến trúc công nghệ, nguồn lực và tiêu chí đánh giá.</p>
<h3 class="text-lg md:text-xl font-bold font-heading text-black dark:text-white mt-6 mb-2 tracking-tight">05. Thí điểm, đánh giá và mở rộng</h3>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thử nghiệm trong phạm vi phù hợp, đo lường kết quả, điều chỉnh và đề xuất kế hoạch nhân rộng.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">SẢN PHẨM TƯ VẤN</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tùy theo phạm vi, sản phẩm có thể bao gồm:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Báo cáo khảo sát và đánh giá hiện trạng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sơ đồ quy trình và các điểm nghẽn cần cải tiến.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Danh mục nhiệm vụ chuyển đổi số ưu tiên.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Danh mục dữ liệu chuyên ngành và dữ liệu dùng chung.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đề xuất kiến trúc công nghệ và phương án tích hợp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Lộ trình triển khai theo từng giai đoạn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kế hoạch thí điểm hoặc mô hình POC.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Dashboard theo dõi tiến độ và kết quả.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Bộ chỉ số đánh giá hiệu quả.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kế hoạch đào tạo, chuyển giao và vận hành.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sản phẩm tư vấn cần giúp đơn vị biết rõ việc gì cần làm trước, nguồn lực nào cần chuẩn bị và hiệu quả được đánh giá ra sao.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">NĂNG LỰC KẾT NỐI GIẢI PHÁP</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm Đổi mới Sáng tạo Gia Lai kết nối nguồn lực trong hệ sinh thái VDCD Group:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mạng lưới chuyên gia và đội ngũ kỹ thuật đa lĩnh vực.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Năng lực khảo sát và thu thập dữ liệu hiện trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Công nghệ UAV, AI, GIS, IoT và mô hình 3D.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phần mềm, dashboard và nền tảng quản lý.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hạ tầng trung tâm dữ liệu và tính toán.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khả năng thử nghiệm, tích hợp và chuyển giao giải pháp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Trung tâm tiếp cận theo nguyên tắc bài toán đi trước công nghệ, kế thừa hệ thống hiện có, triển khai theo từng giai đoạn và hướng đến khả năng vận hành lâu dài.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image111.png?tr=w-1200,q-80,f-auto" alt="Chủ tịch HĐQT VDCD Group đại diện đề xuất các công nghệ chuyển đổi số" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  <p class="text-xs md:text-sm text-center text-zinc-500 dark:text-zinc-400 py-3 px-4 bg-zinc-50 dark:bg-zinc-900/50 italic border-t border-zinc-200 dark:border-zinc-800">Chủ tịch HĐQT VDCD Group đại diện đề xuất các công nghệ chuyển đổi số</p>
</div>

<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">BẮT ĐẦU TỪ MỘT BÀI TOÁN CỤ THỂ</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Không có một mô hình chuyển đổi số duy nhất phù hợp với mọi tổ chức. Một lộ trình hiệu quả phải phản ánh đúng hiện trạng, giải quyết đúng nhu cầu và phù hợp với nguồn lực triển khai.</p>
<h2 class="text-xl md:text-2xl font-bold font-heading text-black dark:text-white mt-10 mb-4 tracking-tight uppercase">ĐĂNG KÝ KHẢO SÁT NHU CẦU CHUYỂN ĐỔI SỐ</h2>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Gửi thông tin về hiện trạng, vấn đề cần giải quyết và mục tiêu dự kiến. Trung tâm Đổi mới Sáng tạo Gia Lai sẽ tiếp nhận, trao đổi và đề xuất phương án khảo sát phù hợp.</p>

<div class="project-style-cta border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 md:p-14 space-y-6 relative overflow-hidden transition-all duration-300 text-center my-12">
  <div class="flex items-center justify-center gap-2 text-accent-red font-mono text-xs font-bold uppercase tracking-widest mb-1">
    <span class="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
    Tư vấn chuyển đổi số
  </div>

  <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold font-heading tracking-tight uppercase max-w-3xl mx-auto leading-tight text-zinc-950 dark:text-white transition-colors duration-300">
    Bắt đầu từ một bài toán cụ thể
  </h3>

  <p class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed pb-2 transition-colors duration-300 font-sans">
    Gửi thông tin về hiện trạng, vấn đề cần giải quyết và mục tiêu dự kiến. Trung tâm Đổi mới Sáng tạo Gia Lai sẽ tiếp nhận, trao đổi và đề xuất phương án khảo sát phù hợp.
  </p>

  <div class="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
    <a
      href="/contact"
      class="program-cta-btn cta-btn-primary inline-flex items-center gap-3 pl-6 pr-4 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent-red hover:text-white dark:hover:bg-accent-red dark:hover:text-white transition-all duration-300 shadow-lg group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none !no-underline"
      style="text-decoration: none !important;"
    >
      <span>ĐĂNG KÝ KHẢO SÁT</span>
      <span class="w-8 h-8 bg-white/10 dark:bg-black/10 flex items-center justify-center text-inherit group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </span>
    </a>

    <a
      href="/contact"
      class="program-cta-btn cta-btn-secondary inline-flex items-center gap-3 pl-6 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono text-xs font-bold uppercase tracking-widest hover:border-accent-red hover:text-accent-red transition-all duration-300 backdrop-blur-sm group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none cursor-pointer !no-underline"
      style="text-decoration: none !important;"
    >
      <span>TRAO ĐỔI VỚI TRUNG TÂM</span>
      <span class="w-8 h-8 bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-inherit group-hover:bg-accent-red/10 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </span>
    </a>
  </div>
</div>', 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image4.png?tr=w-1200,q-80,f-auto', 'Tư vấn chuyển đổi số cấp tỉnh | VDCD Gia Lai', 'Tư vấn chuyển đổi số từ bài toán thực tế đến lộ trình khả thi. Khảo sát hiện trạng, xây dựng danh mục ưu tiên và dashboard giám sát toàn diện cho địa phương.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'c0110001-0000-4000-a000-000000000004', 'program-thumb-tu-van-chuyen-doi-so-cap-tinh'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-012345678905', 'Hội thảo, sự kiện đổi mới sáng tạo', 'hoi-thao-su-kien', 'Diễn đàn chia sẻ tri thức công nghệ, kết nối mạng lưới doanh nghiệp, nhà khoa học và xúc tiến các chương trình đổi mới sáng tạo toàn diện.', '<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Keyword chính: hệ sinh thái khởi nghiệp sáng tạo Gia Lai</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Keyword phụ: Trung tâm Đổi mới Sáng tạo Gia Lai, khởi nghiệp sáng tạo Gia Lai, liên kết 3 nhà, chuyển đổi số Gia Lai, đổi mới sáng tạo, hỗ trợ startup, khoa học công nghệ Gia Lai.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Kết nối “3 nhà” - Xây dựng hệ sinh thái khởi nghiệp sáng tạo Gia Lai từ những bài toán thực tế</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Ngày 18/05/2026, Hội thảo truyền thông chính sách về khởi nghiệp sáng tạo được tổ chức tại Gia Lai, tạo không gian kết nối giữa cơ quan quản lý, trường đại học, doanh nghiệp và cộng đồng khởi nghiệp. Trong đó, mô hình liên kết “3 nhà” - Nhà nước, Nhà trường và Doanh nghiệp - được xác định là một trong những nền tảng quan trọng để đưa công nghệ, tri thức và nguồn lực đến gần hơn với những bài toán thực tế của thị trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đối với Trung tâm Đổi mới Sáng tạo Gia Lai (VDCD Gia Lai), một hệ sinh thái đổi mới sáng tạo chỉ thực sự vận hành khi các thành phần bên trong có khả năng kết nối và bổ trợ cho nhau.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Nhà nước tạo hành lang và môi trường phát triển. Nhà trường cung cấp tri thức, nghiên cứu và nguồn nhân lực. Doanh nghiệp đưa ra bài toán, thị trường và trực tiếp chuyển hóa công nghệ thành sản phẩm, dịch vụ.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Khi ba nguồn lực này cùng vận hành trong một hệ thống, đổi mới sáng tạo có thể đi xa hơn các hoạt động phong trào để tiến tới những kết quả cụ thể: ý tưởng được thử nghiệm, công nghệ được ứng dụng và doanh nghiệp tạo ra giá trị mới.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image80.png?tr=w-1200,q-80,f-auto" alt="VDCD Gia Lai" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  
</div>

<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hội thảo tạo không gian kết nối giữa cơ quan quản lý, trường đại học, doanh nghiệp và cộng đồng khởi nghiệp sáng tạo tại Gia Lai.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Từ hỗ trợ khởi nghiệp đến kiến tạo hệ sinh thái</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Sự phát triển của một startup không chỉ phụ thuộc vào chất lượng ý tưởng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Một dự án có thể sở hữu giải pháp tốt nhưng vẫn gặp khó khăn khi thiếu dữ liệu, công nghệ, chuyên gia, thị trường hoặc nguồn lực để kiểm chứng mô hình. Đây cũng là những điểm nghẽn thường xuất hiện trong quá trình phát triển của doanh nghiệp đổi mới sáng tạo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Vì vậy, xây dựng hệ sinh thái không đơn thuần là gia tăng số lượng chương trình hỗ trợ mà cần tạo ra mạng lưới có khả năng đưa đúng nguồn lực đến đúng dự án vào đúng thời điểm.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tại hội thảo, những vấn đề về tiếp cận công nghệ, thị trường, cơ chế hỗ trợ và mức độ liên kết giữa các chủ thể trong hệ sinh thái đã được đặt ra. Đồng thời, tư duy hỗ trợ doanh nghiệp cũng được mở rộng theo hướng chủ động kiến tạo môi trường để đổi mới sáng tạo phát triển.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Với cách tiếp cận đó, startup không phải chủ thể duy nhất của hệ sinh thái. Các cơ quan quản lý, trường đại học, doanh nghiệp công nghệ, chuyên gia và nhà đầu tư đều trở thành những mắt xích trong cùng một chuỗi giá trị.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Phát biểu khai mạc hội thảo, ông Trần Kim Kha - Giám đốc Sở Khoa học và Công nghệ tỉnh Gia Lai nhấn mạnh: Khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số đang trở thành động lực quan trọng thúc đẩy phát triển kinh tế - xã hội nhanh và bền vững. Nghị quyết số 57-NQ/TW của Bộ Chính trị đã xác định phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là “đột phá quan trọng hàng đầu”, góp phần nâng cao năng lực cạnh tranh quốc gia.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image34.png?tr=w-1200,q-80,f-auto" alt="VDCD Gia Lai" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  
</div>

<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Ông Trần Kim Kha - Giám đốc Sở KH&CN phát biểu khai mạc hội thảo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">VDCD Gia Lai - Kết nối bài toán với giải pháp</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tại chương trình, Trung tâm Đổi mới Sáng tạo Gia Lai giới thiệu mô hình trung tâm đổi mới sáng tạo do doanh nghiệp làm chủ, với định hướng tập trung vào khả năng triển khai và nhu cầu thực tế của thị trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thay vì bắt đầu bằng câu hỏi “công nghệ nào đang là xu hướng?”, cách tiếp cận của Trung tâm hướng đến câu hỏi quan trọng hơn: Doanh nghiệp đang gặp vấn đề gì và công nghệ có thể giải quyết vấn đề đó như thế nào?</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Từ bài toán cụ thể, Trung tâm có thể kết nối doanh nghiệp với đơn vị công nghệ, chuyên gia, trường đại học hoặc các nguồn lực phù hợp để phát triển giải pháp.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mô hình này tạo thành một pipeline tương đối rõ ràng:</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Bài toán → Giải pháp → Thử nghiệm → Đánh giá → Triển khai → Mở rộng.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Công nghệ vì vậy không phải đích đến cuối cùng. Giá trị nằm ở việc công nghệ có thể giúp doanh nghiệp tối ưu vận hành, nâng cao năng suất, phát triển sản phẩm mới hay tạo ra lợi thế cạnh tranh như thế nào.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image104.png?tr=w-1200,q-80,f-auto" alt="VDCD Gia Lai" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  
</div>

<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đại diện Công ty Cổ phần Trung tâm Đổi mới sáng tạo Gia Lai (VDCD Gia Lai) giới thiệu mô hình trung tâm đổi mới sáng tạo do doanh nghiệp làm chủ.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Công nghệ và chuyển đổi số phải tạo ra giá trị đo lường được</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Một nội dung quan trọng khác tại chương trình là khả năng ứng dụng khoa học – công nghệ và chuyển đổi số vào hoạt động của doanh nghiệp. Các vấn đề từ truy xuất nguồn gốc, quản trị dữ liệu đến các giải pháp chuyển đổi số được đặt trong bối cảnh thực tế thay vì tiếp cận công nghệ như một xu hướng độc lập.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đây cũng là nguyên tắc quan trọng khi triển khai chuyển đổi số. Một hệ thống mới chỉ thực sự có giá trị khi nó giải quyết được một điểm nghẽn. Một nền tảng dữ liệu chỉ có ý nghĩa khi dữ liệu có thể hỗ trợ quá trình vận hành và ra quyết định. Một giải pháp tự động hóa chỉ hiệu quả khi giúp giảm thao tác, thời gian hoặc chi phí.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Do đó, hiệu quả của đổi mới sáng tạo cần được đánh giá thông qua outcome – kết quả mà doanh nghiệp và người dùng thực sự nhận được – thay vì chỉ dựa trên số lượng công nghệ được triển khai.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Liên kết “3 nhà” để rút ngắn khoảng cách từ nghiên cứu đến thị trường</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hội thảo cũng đánh dấu nhiều hoạt động ký kết hợp tác giữa các thành phần của hệ sinh thái. Trong đó có thỏa thuận giữa Sở Khoa học và Công nghệ Gia Lai và Trung tâm Đổi mới Sáng tạo Gia Lai, giữa Sở Khoa học và Công nghệ với Trường Đại học FPT tại Quy Nhơn, cùng thỏa thuận hợp tác giữa VDCD Gia Lai và Trường Đại học Quy Nhơn.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Các kết nối này tạo nền tảng cho một mô hình hợp tác rộng hơn giữa chính sách nghiên cứu  đào tạo công nghệ doanh nghiệp thị trường.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đặc biệt, sự tham gia của các trường đại học giúp mở rộng nguồn lực nghiên cứu và nguồn nhân lực trẻ cho hệ sinh thái. Những kết quả nghiên cứu tiềm năng có thêm cơ hội tiếp cận bài toán của doanh nghiệp, được thử nghiệm trong môi trường thực tế và tiến gần hơn đến khả năng thương mại hóa.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Ở chiều ngược lại, doanh nghiệp có thể đưa nhu cầu thực tế trở lại môi trường đào tạo và nghiên cứu, giúp rút ngắn khoảng cách giữa kiến thức, công nghệ và yêu cầu của thị trường.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image12.png?tr=w-1200,q-80,f-auto" alt="VDCD Gia Lai" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  
</div>

<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đại diện Sở KH&CN Gia Lai và Công ty Cổ phần Trung tâm Đổi mới sáng tạo Gia Lai (VDCD Gia Lai) ký kết thỏa thuận hợp tác phát triển hệ sinh thái khởi nghiệp sáng tạo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đồng hành cùng 30 doanh nghiệp và 10 dự án khởi nghiệp sáng tạo</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Một trong những mục tiêu cụ thể được VDCD Gia Lai đặt ra tại chương trình là kết nối và đồng hành cùng 30 doanh nghiệp cùng 10 nhóm, cá nhân khởi nghiệp sáng tạo trong quá trình phát triển sản phẩm, hoàn thiện ý tưởng và mở rộng khả năng kết nối với hệ sinh thái. Đây là bước chuyển từ xây dựng mạng lưới sang triển khai trên những đối tượng cụ thể.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Tùy theo giai đoạn phát triển, mỗi dự án sẽ có nhu cầu khác nhau: hoàn thiện sản phẩm, tiếp cận công nghệ, tìm kiếm chuyên gia, kiểm chứng thị trường, xây dựng mô hình kinh doanh hoặc kết nối với các nguồn lực tiếp theo. Vai trò của hệ sinh thái là giúp những nhu cầu đó tìm được đúng điểm kết nối.</p>

<div class="my-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
  <img src="https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image72.png?tr=w-1200,q-80,f-auto" alt="VDCD Gia Lai" class="w-full h-auto object-cover max-h-[550px]" loading="lazy" />
  
</div>

<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đại diện VDCD Gia Lai trao cam kết hỗ trợ cho các doanh nghiệp, dự án khởi nghiệp sáng tạo trên địa bàn tỉnh.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Một hệ sinh thái được đo bằng kết quả</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Đối với Trung tâm Đổi mới Sáng tạo Gia Lai, số lượng sự kiện hay kết nối không phải thước đo cuối cùng của một hệ sinh thái đổi mới sáng tạo.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Điều quan trọng hơn là sau những kết nối đó, bao nhiêu bài toán tìm được giải pháp, bao nhiêu ý tưởng bước vào giai đoạn thử nghiệm, bao nhiêu công nghệ được ứng dụng và bao nhiêu doanh nghiệp tạo ra giá trị mới.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Mô hình liên kết “3 nhà” vì vậy không chỉ là một cấu trúc hợp tác. Đây là cách tạo ra một vòng tuần hoàn nguồn lực: chính sách mở đường cho đổi mới; trường đại học cung cấp tri thức và con người; doanh nghiệp đưa công nghệ vào thị trường; còn kết quả từ thị trường tiếp tục tạo ra những bài toán mới cho nghiên cứu và đổi mới.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Thông qua việc mở rộng mạng lưới hợp tác và triển khai các chương trình hỗ trợ cụ thể, Trung tâm Đổi mới Sáng tạo Gia Lai hướng đến xây dựng một hệ sinh thái nơi ý tưởng có không gian để thử nghiệm, doanh nghiệp có công nghệ để tăng trưởng và những kết nối có thể chuyển hóa thành giá trị thực tế cho địa phương.</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Hội nghị Xúc tiến đầu tư</p>
<p class="text-secondary dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-4">Từ khóa chính: Hội nghị Xúc tiến đầu tư tỉnh Gia Lai năm 2026</p>

<div class="project-style-cta border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 md:p-14 space-y-6 relative overflow-hidden transition-all duration-300 text-center my-12">
  <div class="flex items-center justify-center gap-2 text-accent-red font-mono text-xs font-bold uppercase tracking-widest mb-1">
    <span class="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
    Hội thảo & Sự kiện
  </div>

  <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold font-heading tracking-tight uppercase max-w-3xl mx-auto leading-tight text-zinc-950 dark:text-white transition-colors duration-300">
    Diễn đàn kết nối hệ sinh thái số Gia Lai
  </h3>

  <p class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed pb-2 transition-colors duration-300 font-sans">
    Đăng ký tham dự các chương trình hội thảo, diễn đàn chuyển đổi số và sự kiện đổi mới sáng tạo để mở rộng mạng lưới hợp tác.
  </p>

  <div class="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
    <a
      href="/contact"
      class="program-cta-btn cta-btn-primary inline-flex items-center gap-3 pl-6 pr-4 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent-red hover:text-white dark:hover:bg-accent-red dark:hover:text-white transition-all duration-300 shadow-lg group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none !no-underline"
      style="text-decoration: none !important;"
    >
      <span>ĐĂNG KÝ THAM GIA</span>
      <span class="w-8 h-8 bg-white/10 dark:bg-black/10 flex items-center justify-center text-inherit group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </span>
    </a>

    <a
      href="/contact"
      class="program-cta-btn cta-btn-secondary inline-flex items-center gap-3 pl-6 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono text-xs font-bold uppercase tracking-widest hover:border-accent-red hover:text-accent-red transition-all duration-300 backdrop-blur-sm group focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:outline-none cursor-pointer !no-underline"
      style="text-decoration: none !important;"
    >
      <span>TRAO ĐỔI VỚI TRUNG TÂM</span>
      <span class="w-8 h-8 bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-inherit group-hover:bg-accent-red/10 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </span>
    </a>
  </div>
</div>', 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/doc_images/solution_image101.png?tr=w-1200,q-80,f-auto', 'Hội thảo, sự kiện đổi mới sáng tạo | VDCD Gia Lai', 'Diễn đàn chia sẻ tri thức công nghệ, kết nối mạng lưới doanh nghiệp, nhà khoa học và xúc tiến các chương trình đổi mới sáng tạo toàn diện.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'c0110001-0000-4000-a000-000000000005', 'program-thumb-hoi-thao-su-kien');

-- ------------------------------------------------------------------------------
-- TABLE: solution (19 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "solution" ("id", "title", "slug", "short_description", "content", "thumbnail", "meta_title", "meta_description", "is_published", "created_at", "updated_at", "field_id", "thumbnail_file_id", "website_url") VALUES
  ('9446a120-855a-4f3c-a028-e3948cfe74b5', 'Trung tâm Bản đồ số', 'trung-tam-ban-do-so', 'Cung cấp các dịch vụ bay quét 3D, trắc địa số hóa và thành lập bản đồ địa hình độ chính xác cao bằng máy bay không người lái.', 'Cung cấp các dịch vụ bay quét 3D, trắc địa số hóa và thành lập bản đồ địa hình độ chính xác cao bằng máy bay không người lái.', 'https://vdcd.vn/wp-content/uploads/2024/03/5-768x431.jpg', 'Trung tâm Bản đồ số | VDCD', 'Cung cấp các dịch vụ bay quét 3D, trắc địa số hóa và thành lập bản đồ địa hình độ chính xác cao bằng máy bay không người lái.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', 'solution-thumb-trung-tam-ban-do-so', 'https://vietflycam.vn/dich-vu/bay-quet-3d-trac-dia-so-va-thanh-lap-ban-do'),
  ('72d9f19f-af32-4233-afe6-4d5e74d91a14', 'Viện Thiết Kế Số', 'vien-thiet-ke-so', 'Nghiên cứu, phát triển ứng dụng mô hình thông tin công trình (BIM) và các giải pháp thiết kế số trong lĩnh vực xây dựng, kiến trúc.', 'Nghiên cứu, phát triển ứng dụng mô hình thông tin công trình (BIM) và các giải pháp thiết kế số trong lĩnh vực xây dựng, kiến trúc.', 'https://vdcd.vn/wp-content/uploads/2024/03/picture1_8463e044ab0c465da2d031f6af1a4c5f_master-768x768.png', 'Viện Thiết Kế Số | VDCD', 'Nghiên cứu, phát triển ứng dụng mô hình thông tin công trình (BIM) và các giải pháp thiết kế số trong lĩnh vực xây dựng, kiến trúc.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-vien-thiet-ke-so', 'https://bimv.vn/'),
  ('8601ae3f-e0e3-45c5-ba1c-e7de47b20abd', 'Trung Tâm Giám Sát Số', 'trung-tam-giam-sat-so', 'Cung cấp hệ thống Auto Timelapse giám sát thông minh tiến độ xây dựng công trình, nông nghiệp và môi trường một cách tự động, trực quan.', 'Cung cấp hệ thống Auto Timelapse giám sát thông minh tiến độ xây dựng công trình, nông nghiệp và môi trường một cách tự động, trực quan.', 'https://vdcd.vn/wp-content/uploads/2024/03/3123-768x512.jpg', 'Trung Tâm Giám Sát Số | VDCD', 'Cung cấp hệ thống Auto Timelapse giám sát thông minh tiến độ xây dựng công trình, nông nghiệp và môi trường một cách tự động, trực quan.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-trung-tam-giam-sat-so', 'https://autotimelapse.com'),
  ('c159272a-0884-4e1a-b664-5f8e0ad78054', 'Trung tâm dữ liệu siêu máy tính và đào tạo AI', 'trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai', 'Xây dựng hạ tầng tính toán hiệu năng cao (HPC) và tổ chức các chương trình đào tạo trí tuệ nhân tạo chuyên sâu phục vụ chuyển đổi số doanh nghiệp.', 'Xây dựng hạ tầng tính toán hiệu năng cao (HPC) và tổ chức các chương trình đào tạo trí tuệ nhân tạo chuyên sâu phục vụ chuyển đổi số doanh nghiệp.', 'https://vdcd.vn/wp-content/uploads/2025/10/z7173282299491_651f9e392555944f94acd55dab050480-768x576.jpg', 'Trung tâm dữ liệu siêu máy tính và đào tạo AI | VDCD', 'Xây dựng hạ tầng tính toán hiệu năng cao (HPC) và tổ chức các chương trình đào tạo trí tuệ nhân tạo chuyên sâu phục vụ chuyển đổi số doanh nghiệp.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e1760c66-386b-4de3-8490-5d71680649cf', 'solution-thumb-trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai', 'https://vdcd.vn/services/trung-tam-du-lieu-sieu-may-tinh-va-dao-tao-ai/'),
  ('2626ca50-c83c-4712-b055-620cf5996f33', 'Viện Nghiên cứu công nghệ không gian và dưới nước', 'vien-nghien-cuu-cong-nghe-khong-gian-va-duoi-nuoc', 'Nghiên cứu và ứng dụng các công nghệ tiên tiến trong không gian vũ trụ và thám hiểm, đo đạc môi trường dưới nước.', 'Nghiên cứu và ứng dụng các công nghệ tiên tiến trong không gian vũ trụ và thám hiểm, đo đạc môi trường dưới nước.', 'https://vdcd.vn/wp-content/uploads/2025/10/Vien-khong-gian-va-duoi-nuoc-BK-768x499.jpg', 'Viện Nghiên cứu công nghệ không gian và dưới nước | VDCD', 'Nghiên cứu và ứng dụng các công nghệ tiên tiến trong không gian vũ trụ và thám hiểm, đo đạc môi trường dưới nước.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e1760c66-386b-4de3-8490-5d71680649cf', 'solution-thumb-vien-nghien-cuu-cong-nghe-khong-gian-va-duoi-nuoc', 'https://iig.vn'),
  ('4b124ed2-25ae-4e1d-b408-538f470043ec', 'Trung tâm phần mềm VDCD – Soft', 'trung-tam-phan-mem-vdcd-soft', 'Phát triển các phần mềm quản lý doanh nghiệp, giải pháp chuyển đổi số chuyên sâu phục vụ hệ sinh thái kinh tế vùng và cả nước.', 'Phát triển các phần mềm quản lý doanh nghiệp, giải pháp chuyển đổi số chuyên sâu phục vụ hệ sinh thái kinh tế vùng và cả nước.', 'https://vdcd.vn/wp-content/uploads/2024/03/Untitled-1-01-1-768x768.png', 'Trung tâm phần mềm VDCD – Soft | VDCD', 'Phát triển các phần mềm quản lý doanh nghiệp, giải pháp chuyển đổi số chuyên sâu phục vụ hệ sinh thái kinh tế vùng và cả nước.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-trung-tam-phan-mem-vdcd-soft', 'https://geneat.vn'),
  ('f9ba2c8b-6f6b-4f4c-b259-f1c718e3544b', 'Trung Tâm Đổi Mới Sáng Tạo Tỉnh', 'trung-tam-doi-moi-sang-tao-tinh', 'Hỗ trợ ươm tạo khởi nghiệp, phát triển ý tưởng sáng tạo và thúc đẩy chuyển giao công nghệ tại địa phương.', 'Hỗ trợ ươm tạo khởi nghiệp, phát triển ý tưởng sáng tạo và thúc đẩy chuyển giao công nghệ tại địa phương.', 'https://vdcd.vn/wp-content/uploads/2025/11/S3-1-1-768x590.jpg', 'Trung Tâm Đổi Mới Sáng Tạo Tỉnh | VDCD', 'Hỗ trợ ươm tạo khởi nghiệp, phát triển ý tưởng sáng tạo và thúc đẩy chuyển giao công nghệ tại địa phương.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-trung-tam-doi-moi-sang-tao-tinh', 'https://vdcd.vn/services/trung-tam-doi-moi-sang-tao-tinh/'),
  ('5ebe0e7b-1b5f-44a1-bd8a-d874625e2c7b', 'Trung Tâm Chuyển giao Công Nghệ', 'trung-tam-chuyen-giao-cong-nghe', 'Cầu nối chuyển giao các công nghệ tiên tiến từ viện nghiên cứu, trường đại học đến các doanh nghiệp địa phương ứng dụng thực tiễn.', 'Cầu nối chuyển giao các công nghệ tiên tiến từ viện nghiên cứu, trường đại học đến các doanh nghiệp địa phương ứng dụng thực tiễn.', 'https://vdcd.vn/wp-content/uploads/2025/10/BOT06612-768x512.jpg', 'Trung Tâm Chuyển giao Công Nghệ | VDCD', 'Cầu nối chuyển giao các công nghệ tiên tiến từ viện nghiên cứu, trường đại học đến các doanh nghiệp địa phương ứng dụng thực tiễn.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-trung-tam-chuyen-giao-cong-nghe', 'https://vdcd.vn/services/trung-tam-chuyen-giao-cong-nghe/'),
  ('b7558158-7043-488f-b189-51bc1728035a', 'Máy Bay Việt', 'may-bay-viet', 'Đơn vị cung cấp giải pháp máy bay không người lái phục vụ nông nghiệp thông minh, khảo sát công nghiệp và quay chụp chuyên nghiệp.', 'Đơn vị cung cấp giải pháp máy bay không người lái phục vụ nông nghiệp thông minh, khảo sát công nghiệp và quay chụp chuyên nghiệp.', 'https://vdcd.vn/wp-content/uploads/2025/10/1WUpukaXKpD5fkPMSNblWMSh6WCwXJ6Jj6f9AaF0YHj7OHjPJMzUbLBU1IEVPY2B2vQ-768x432.jpg', 'Máy Bay Việt | VDCD', 'Đơn vị cung cấp giải pháp máy bay không người lái phục vụ nông nghiệp thông minh, khảo sát công nghiệp và quay chụp chuyên nghiệp.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', 'solution-thumb-may-bay-viet', 'https://maybayviet.com'),
  ('b6b431e4-4ea6-4908-a38d-ad45e8e00df9', 'Trung tâm phát triển Robot & AI', 'trung-tam-phat-trien-robot-ai', 'Nghiên cứu chế tạo các hệ thống cánh tay robot tự động hóa, xe tự hành (AGV) kết hợp trí tuệ nhân tạo nhận diện hình ảnh và tối ưu vận hành.', 'Nghiên cứu chế tạo các hệ thống cánh tay robot tự động hóa, xe tự hành (AGV) kết hợp trí tuệ nhân tạo nhận diện hình ảnh và tối ưu vận hành.', 'https://vdcd.vn/wp-content/uploads/2024/03/ImageForArticle_702_172159750532-768x432.jpg', 'Trung tâm phát triển Robot & AI | VDCD', 'Nghiên cứu chế tạo các hệ thống cánh tay robot tự động hóa, xe tự hành (AGV) kết hợp trí tuệ nhân tạo nhận diện hình ảnh và tối ưu vận hành.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e1760c66-386b-4de3-8490-5d71680649cf', 'solution-thumb-trung-tam-phat-trien-robot-ai', 'https://vdcd.vn/services/trung-tam-phat-trien-robot-ai/'),
  ('5c7a3230-66c9-4e2e-beef-9cbf31a2421e', 'Trung Tâm Sản Xuất Phim', 'trung-tam-san-xuat-phim', 'Sản xuất video clip giới thiệu dự án, quay phim khảo sát, flycam sự kiện chuyên nghiệp với trang thiết bị hiện đại hàng đầu.', 'Sản xuất video clip giới thiệu dự án, quay phim khảo sát, flycam sự kiện chuyên nghiệp với trang thiết bị hiện đại hàng đầu.', 'https://vdcd.vn/wp-content/uploads/2025/10/75474-768x576.jpg', 'Trung Tâm Sản Xuất Phim | VDCD', 'Sản xuất video clip giới thiệu dự án, quay phim khảo sát, flycam sự kiện chuyên nghiệp với trang thiết bị hiện đại hàng đầu.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '8cf42e59-62b2-44f9-9ab6-9adfa4ff12a7', 'solution-thumb-trung-tam-san-xuat-phim', 'https://vietflycam.vn/dich-vu/quay-phim-chup-anh-bang-flycam'),
  ('7b2d1698-d06a-4002-990d-f3557f027140', 'Trung tâm nghiên cứu và phát triển sản phẩm R&D', 'trung-tam-nghien-cuu-va-phat-trien-san-pham-rd', 'Đội ngũ chuyên gia chuyên nghiên cứu phát triển các sản phẩm phần cứng và giải pháp công nghệ mới bắt kịp xu hướng thế giới.', 'Đội ngũ chuyên gia chuyên nghiên cứu phát triển các sản phẩm phần cứng và giải pháp công nghệ mới bắt kịp xu hướng thế giới.', 'https://vdcd.vn/wp-content/uploads/2024/03/64576458-768x512.jpg', 'Trung tâm nghiên cứu và phát triển sản phẩm R&D | VDCD', 'Đội ngũ chuyên gia chuyên nghiên cứu phát triển các sản phẩm phần cứng và giải pháp công nghệ mới bắt kịp xu hướng thế giới.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e1760c66-386b-4de3-8490-5d71680649cf', 'solution-thumb-trung-tam-nghien-cuu-va-phat-trien-san-pham-rd', 'https://vdcd.vn/services/trung-tam-nghien-cuu-va-phat-trien-san-pham/'),
  ('6e922f73-1e8a-4446-99e2-dbec49419db4', 'Nông nghiệp - Lâm nghiệp', 'nong-nghiep-lam-nghiep', 'Giải pháp nông nghiệp thông minh, giúp tối ưu hóa canh tác, tối ưu chi phí và truy xuất nguồn gốc dễ dàng.', 'Giải pháp nông nghiệp thông minh, giúp tối ưu hóa canh tác, tối ưu chi phí và truy xuất nguồn gốc dễ dàng.', 'https://vdcd.vn/wp-content/uploads/2026/06/Ban-sao-cua-IMG_2462-1024x768.jpg', 'Nông nghiệp - Lâm nghiệp | VDCD', 'Giải pháp nông nghiệp thông minh, giúp tối ưu hóa canh tác, tối ưu chi phí và truy xuất nguồn gốc dễ dàng.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', 'solution-thumb-nong-nghiep-lam-nghiep', '/solution/nong-nghiep-lam-nghiep'),
  ('2b1ea734-43ae-48f9-833e-dda1b7df1551', 'Giám sát an ninh', 'an-ninh-giam-sat-an-ninh', 'Ứng dụng công nghệ AutoTimelapse giám sát trực quan 24/7, tự động cảnh báo xâm nhập và lưu trữ bảo mật.', 'Ứng dụng công nghệ AutoTimelapse giám sát trực quan 24/7, tự động cảnh báo xâm nhập và lưu trữ bảo mật.', 'https://vdcd.vn/wp-content/uploads/2026/06/z7896992273679_a63ab25fd7af7b68be795587ac4a41fb-1-1024x683.jpg', 'Giám sát an ninh | VDCD', 'Ứng dụng công nghệ AutoTimelapse giám sát trực quan 24/7, tự động cảnh báo xâm nhập và lưu trữ bảo mật.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-an-ninh-giam-sat-an-ninh', '/solution/an-ninh-giam-sat-an-ninh'),
  ('e39bd0a0-1f85-42fb-b9c3-268ad88bcb94', 'Điện - Năng lượng', 'dien-nang-luong', 'Hệ sinh thái số hóa tích hợp giúp tối ưu khảo sát, bảo trì lưới điện và giám sát an toàn.', 'Hệ sinh thái số hóa tích hợp giúp tối ưu khảo sát, bảo trì lưới điện và giám sát an toàn.', 'https://vdcd.vn/wp-content/uploads/2026/06/Dien-gio-Quang-Tri-1-1410x720.jpg', 'Điện - Năng lượng | VDCD', 'Hệ sinh thái số hóa tích hợp giúp tối ưu khảo sát, bảo trì lưới điện và giám sát an toàn.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-dien-nang-luong', '/solution/dien-nang-luong'),
  ('179fa443-256e-487d-8028-c2fa16567181', 'Khai thác khoáng sản', 'tai-nguyen-khai-thac-khoang-san', 'Giải pháp số hóa toàn diện khu vực mỏ giúp kiểm soát trạm cân, minh bạch hóa dữ liệu và tối ưu vận hành mỏ.', 'Giải pháp số hóa toàn diện khu vực mỏ giúp kiểm soát trạm cân, minh bạch hóa dữ liệu và tối ưu vận hành mỏ.', 'https://vdcd.vn/wp-content/uploads/2026/06/z7903688360376_37c98f8dadd2f5e6419362c107fe4ca4-1-1024x509.jpg', 'Khai thác khoáng sản | VDCD', 'Giải pháp số hóa toàn diện khu vực mỏ giúp kiểm soát trạm cân, minh bạch hóa dữ liệu và tối ưu vận hành mỏ.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-tai-nguyen-khai-thac-khoang-san', '/solution/tai-nguyen-khai-thac-khoang-san'),
  ('ae1465ef-94da-46df-b35f-d254f9e5f008', 'Tài nguyên môi trường', 'quan-ly-tai-nguyen-quan-trac-moi-truong', 'Giải pháp quan trắc môi trường giúp theo dõi dữ liệu thời gian thực, cảnh báo sớm rủi ro sinh thái.', 'Giải pháp quan trắc môi trường giúp theo dõi dữ liệu thời gian thực, cảnh báo sớm rủi ro sinh thái.', 'https://vdcd.vn/wp-content/uploads/2026/06/z7913610376494_aabfc4669de386a5916480d8fb3f34cd-1024x490.jpg', 'Tài nguyên môi trường | VDCD', 'Giải pháp quan trắc môi trường giúp theo dõi dữ liệu thời gian thực, cảnh báo sớm rủi ro sinh thái.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5192c2da-2ca6-4c81-bbaa-fb0e9d4e02ae', 'solution-thumb-quan-ly-tai-nguyen-quan-trac-moi-truong', '/solution/quan-ly-tai-nguyen-quan-trac-moi-truong'),
  ('e621aa78-097e-4b73-8d2c-8b74c433b100', 'Du lịch thông minh - Số hóa di sản', 'du-lich-thong-minh-so-hoa-di-san', 'Ứng dụng công nghệ để số hóa di sản, xây dựng bản đồ du lịch thông minh và nâng tầm trải nghiệm thực tế ảo.', 'Ứng dụng công nghệ để số hóa di sản, xây dựng bản đồ du lịch thông minh và nâng tầm trải nghiệm thực tế ảo.', 'https://vdcd.vn/wp-content/uploads/2026/06/Lotte-Mall-1-1-1-scaled.jpg', 'Du lịch thông minh - Số hóa di sản | VDCD', 'Ứng dụng công nghệ để số hóa di sản, xây dựng bản đồ du lịch thông minh và nâng tầm trải nghiệm thực tế ảo.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '8cf42e59-62b2-44f9-9ab6-9adfa4ff12a7', 'solution-thumb-du-lich-thong-minh-so-hoa-di-san', '/solution/du-lich-thong-minh-so-hoa-di-san'),
  ('52a1acf2-6453-4eb5-9226-4a55b4a46b7c', 'Cứu hộ cứu nạn', 'cuu-ho-cuu-nan-phong-chong-thien-tai', 'Ứng dụng công nghệ tích hợp giúp cảnh báo sớm rủi ro thiên tai và hỗ trợ tìm kiếm cứu nạn.', 'Ứng dụng công nghệ tích hợp giúp cảnh báo sớm rủi ro thiên tai và hỗ trợ tìm kiếm cứu nạn.', 'https://vdcd.vn/wp-content/uploads/2026/06/z7908953163351_e6a394ecff68dca617c06ebed9a5ecbc-1024x768.jpg', 'Cứu hộ cứu nạn | VDCD', 'Ứng dụng công nghệ tích hợp giúp cảnh báo sớm rủi ro thiên tai và hỗ trợ tìm kiếm cứu nạn.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '5292c9c5-7499-4353-9430-11aa730c63d8', 'solution-thumb-cuu-ho-cuu-nan-phong-chong-thien-tai', '/solution/cuu-ho-cuu-nan-phong-chong-thien-tai');

-- ------------------------------------------------------------------------------
-- TABLE: project (16 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "project" ("id", "title", "slug", "overview", "thumbnail", "year", "meta_title", "meta_description", "is_published", "created_at", "updated_at", "field_id", "province_id", "thumbnail_file_id", "challenge", "challenge_image", "challenge_image_file_id", "services", "discipline", "transformation_before", "transformation_before_file_id", "transformation_after", "transformation_after_file_id", "technical_highlights", "next_project_slug") VALUES
  ('d4cc07c9-5ad3-4a29-be63-c95563517bf7', 'Vân Phong – Khánh Hòa', 'van-phong-khanh-hoa', 'Khảo sát địa hình dự án Vân Phong – Khánh Hòa. Trọn gói sản phẩm trắc địa toàn diện phục vụ quy hoạch khu kinh tế chiến lược.', 'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg', 2024, 'Vân Phong – Khánh Hòa | VDCD', 'Khảo sát địa hình dự án Vân Phong – Khánh Hòa. Trọn gói sản phẩm trắc địa toàn diện phục vụ quy hoạch khu kinh tế chiến lược.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '21f123a9-a48f-425f-bb8a-b871e6013fa1', 'project-thumb-van-phong-khanh-hoa', 'Khu kinh tế Vân Phong nằm ở phía Bắc tỉnh Khánh Hòa, với tổng quy mô các dự án lên đến hàng nghìn hecta. Bay quét địa hình được tiến hành với mục đích thu hình ảnh tổng quan về khu vực, phục vụ việc định hướng quy hoạch và lên concept cho các mục tiêu thiết kế về sau.', NULL, NULL, 'Khảo sát thành lập bản vẽ 2D,Khảo sát thành lập bản vẽ 3D,Bản vẽ địa hình 1/500,Bay quét Drone chuyên nghiệp', 'Khảo sát địa hình & Trắc địa', 'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2025/11/z6246996465902_d2b58a023e87326b3d6b828d09049fa4-1024x618-1.jpg', NULL, '[{"label":"Diện tích khảo sát","value":"Hàng nghìn ha"},{"label":"Địa hình cấp 1","value":"600 ha/ngày"},{"label":"Địa hình cấp 6","value":"100 ha/ngày"},{"label":"Sản phẩm bàn giao","value":"2D, 3D, 1/500"},{"label":"Công nghệ","value":"Drone + LiDAR"},{"label":"Chủ đầu tư","value":"Sun Group"}]'::jsonb, 'lotte-mall-vo-chi-cong'),
  ('652e4771-4d89-4968-a4d6-f72e0beded5c', 'Trung tâm thương mại Lotte Mall', 'lotte-mall-vo-chi-cong', 'Giám sát, quản lý công trình xây dựng Lotte Mall Võ Chí Công ứng dụng công nghệ cao. Theo dõi tiến độ thi công toàn diện.', 'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg', 2024, 'Trung tâm thương mại Lotte Mall | VDCD', 'Giám sát, quản lý công trình xây dựng Lotte Mall Võ Chí Công ứng dụng công nghệ cao. Theo dõi tiến độ thi công toàn diện.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '5dc27894-c279-4ce3-86c6-b609a5671564', 'project-thumb-lotte-mall-vo-chi-cong', 'Lotte Mall Võ Chí Công là tổ hợp thương mại – dịch vụ – căn hộ quy mô lớn tại Tây Hồ, Hà Nội. Dự án yêu cầu giám sát liên tục 24/7 trên nhiều góc quay khác nhau, ghi nhận chính xác tiến độ từng hạng mục.', NULL, NULL, 'AutoTimelapse đa góc,Video timelapse 4K,Báo cáo tiến độ tự động,Giám sát quản lý công trình', 'Giám sát xây dựng', 'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/481910989_2375973832761147_7242746415740845603_n-1.jpg', NULL, '[{"label":"Vị trí","value":"Tây Hồ, Hà Nội"},{"label":"Loại hình","value":"Tổ hợp TM–DV"},{"label":"Giám sát","value":"24/7"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"Video","value":"4K UHD"},{"label":"Chủ đầu tư","value":"Lotte Group"}]'::jsonb, 'becamex-binh-duong'),
  ('4be7085f-1f0c-4723-b920-220fdba2a786', 'Tòa nhà Becamex Bình Dương', 'becamex-binh-duong', 'AutoTimelapse đồng hành cùng Becamex Tower Bình Dương – giải pháp giám sát công trình cao tầng hiện đại, nền tảng cho đô thị thông minh.', 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg', 2023, 'Tòa nhà Becamex Bình Dương | VDCD', 'AutoTimelapse đồng hành cùng Becamex Tower Bình Dương – giải pháp giám sát công trình cao tầng hiện đại, nền tảng cho đô thị thông minh.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '0237f2ca-535d-4dec-9dd3-1f12be723bb8', 'project-thumb-becamex-binh-duong', 'Becamex Tower là tòa nhà biểu tượng của thành phố mới Bình Dương. Thách thức thi công cao tầng đòi hỏi giải pháp AutoTimelapse – công nghệ điều hành công trình hiện đại, giám sát toàn diện từ móng đến hoàn thiện.', NULL, NULL, 'AutoTimelapse cao tầng,Giám sát thi công 24/7,Phân tích tiến độ AI,Báo cáo so sánh kế hoạch – thực tế', 'Giám sát cao tầng', 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg', NULL, '[{"label":"Vị trí","value":"TP. Bình Dương"},{"label":"Loại hình","value":"Văn phòng TM–DV"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"Giám sát","value":"24/7"},{"label":"Ứng dụng","value":"Đô thị thông minh"},{"label":"Chủ đầu tư","value":"Becamex IDC"}]'::jsonb, 'the-terra-an-hung'),
  ('5dc03588-17a9-43de-8a89-f9082c5dd18c', 'The Terra An Hưng', 'the-terra-an-hung', 'VDCD triển khai giám sát tự động tại The Terra An Hưng, giúp Văn Phú – Invest quản lý tiến độ số hóa và xây dựng đô thị thông minh.', 'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg', 2023, 'The Terra An Hưng | VDCD', 'VDCD triển khai giám sát tự động tại The Terra An Hưng, giúp Văn Phú – Invest quản lý tiến độ số hóa và xây dựng đô thị thông minh.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '5dc27894-c279-4ce3-86c6-b609a5671564', 'project-thumb-the-terra-an-hung', 'Dự án The Terra An Hưng là khu đô thị phức hợp với nhiều tòa nhà xây dựng song song. Thách thức lớn nhất là giám sát đồng thời nhiều hạng mục trên diện rộng và tích hợp dữ liệu vào hệ thống quản lý dự án.', NULL, NULL, 'AutoTimelapse đa điểm,Tích hợp hệ thống quản lý,Video timelapse quảng bá,Báo cáo định kỳ tự động', 'Giám sát đô thị thông minh', 'https://vdcd.vn/wp-content/uploads/2024/03/the-terra-an-hung-1-1-1.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg', NULL, '[{"label":"Vị trí","value":"Hà Đông, Hà Nội"},{"label":"Chủ đầu tư","value":"Văn Phú – Invest"},{"label":"Giám sát","value":"Đa điểm 24/7"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"Tích hợp","value":"Quản lý dự án"},{"label":"Loại hình","value":"Khu đô thị"}]'::jsonb, 'thap-ba-ponagar'),
  ('3f7dd1d3-1636-4d3f-9ede-d20300f5a6c5', 'Tháp Bà Ponagar', 'thap-ba-ponagar', 'Khảo sát địa hình khu di tích Tháp Bà Ponagar – Nha Trang. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, mô hình 3D, bản đồ 1/500 và VR360.', 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png', 2024, 'Tháp Bà Ponagar | VDCD', 'Khảo sát địa hình khu di tích Tháp Bà Ponagar – Nha Trang. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, mô hình 3D, bản đồ 1/500 và VR360.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '21f123a9-a48f-425f-bb8a-b871e6013fa1', 'project-thumb-thap-ba-ponagar', 'Tháp Bà Ponagar là di tích lịch sử cấp quốc gia với hơn 1.000 năm tuổi. Việc khảo sát và số hóa phải đảm bảo không gây ảnh hưởng đến kiến trúc cổ, đồng thời cung cấp dữ liệu chính xác về hiện trạng công trình.', NULL, NULL, 'Khảo sát thành lập bản vẽ 2D,Khảo sát thành lập bản vẽ 3D,Bản vẽ địa hình 1/500,VR360 toàn cảnh', 'Bảo tồn di sản & Trắc địa', 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/3d-thap-ba-ponagar.png', NULL, '[{"label":"Niên đại di tích","value":"1.000+ năm"},{"label":"Sản phẩm","value":"2D, 3D, VR360"},{"label":"Tỷ lệ bản đồ","value":"1/500"},{"label":"Mô hình 3D","value":"Point Cloud HD"},{"label":"VR360","value":"12K"},{"label":"Công nghệ","value":"LiDAR + Drone"}]'::jsonb, 'sun-marina-ha-long'),
  ('860cbdc1-04a0-4101-9c45-54836f8702c7', 'Sun Marina Hạ Long', 'sun-marina-ha-long', 'AutoTimelapse triển khai tại khu đô thị Sun Marina Hạ Long – giải pháp giám sát toàn diện cho đô thị ven biển hiện đại.', 'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg', 2024, 'Sun Marina Hạ Long | VDCD', 'AutoTimelapse triển khai tại khu đô thị Sun Marina Hạ Long – giải pháp giám sát toàn diện cho đô thị ven biển hiện đại.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '0237f2ca-535d-4dec-9dd3-1f12be723bb8', 'project-thumb-sun-marina-ha-long', 'Sun Marina Hạ Long nằm trong vịnh Hạ Long — di sản thiên nhiên thế giới. Công trình xây dựng phải tuân thủ nghiêm ngặt các quy định bảo vệ môi trường, đồng thời đảm bảo tiến độ thi công trong điều kiện khí hậu biển.', NULL, NULL, 'AutoTimelapse ven biển,Giám sát môi trường xung quanh,Video marketing timelapse,Báo cáo tiến độ trực tuyến', 'Giám sát công trình ven biển', 'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg', NULL, '[{"label":"Vị trí","value":"Vịnh Hạ Long"},{"label":"Chủ đầu tư","value":"Sun Group"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"Giám sát","value":"24/7"},{"label":"Loại hình","value":"Khu đô thị"},{"label":"Đặc thù","value":"Ven biển"}]'::jsonb, 'son-tra-da-nang'),
  ('08a0962f-3e5e-4a65-8fcd-8e9d4520f936', 'Sơn Trà – Đà Nẵng', 'son-tra-da-nang', 'Trọn gói sản phẩm trắc địa toàn diện phục vụ xây dựng quy hoạch bán đảo Sơn Trà. Sản phẩm 2D, bản vẽ 1/500, mô hình 3D.', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png', 2025, 'Sơn Trà – Đà Nẵng | VDCD', 'Trọn gói sản phẩm trắc địa toàn diện phục vụ xây dựng quy hoạch bán đảo Sơn Trà. Sản phẩm 2D, bản vẽ 1/500, mô hình 3D.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '6aa2210d-50aa-47ef-a348-f366d47f6acb', 'project-thumb-son-tra-da-nang', 'Bán đảo Sơn Trà có địa hình phức tạp với rừng nguyên sinh và hệ sinh thái nhạy cảm. Việc khảo sát đòi hỏi bay quét drone chính xác trên địa hình đồi núi ven biển và xử lý dữ liệu lớn thành sản phẩm trắc địa phục vụ quy hoạch.', NULL, NULL, 'Sản phẩm bản vẽ 2D,Bản vẽ 1/500 chi tiết,Mô hình 3D,Giải pháp trắc địa toàn diện', 'Trắc địa & Quy hoạch', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/467126771_1099508525515820_4642314407752063642_n-1024x683-1.jpg', NULL, '[{"label":"Diện tích","value":"4,439 ha"},{"label":"Sản phẩm","value":"2D, 3D, 1/500"},{"label":"Công nghệ","value":"Drone + GNSS"},{"label":"Địa hình","value":"Đồi núi ven biển"},{"label":"Tỷ lệ","value":"1/500"},{"label":"Mục đích","value":"Quy hoạch"}]'::jsonb, 'san-bay-van-don'),
  ('79b3457b-45c9-4354-b4a7-2bae9b1d3262', 'Sân bay Vân Đồn', 'san-bay-van-don', 'Khảo sát địa hình và ứng dụng công nghệ LiDAR Scan tại Sân bay Vân Đồn. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, 3D, VR360.', 'https://vdcd.vn/wp-content/uploads/2025/11/467741379_1104256805040992_4651998732288142886_n-1024x512-1.jpg', 2023, 'Sân bay Vân Đồn | VDCD', 'Khảo sát địa hình và ứng dụng công nghệ LiDAR Scan tại Sân bay Vân Đồn. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, 3D, VR360.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '0237f2ca-535d-4dec-9dd3-1f12be723bb8', 'project-thumb-san-bay-van-don', 'Sân bay Vân Đồn là sân bay tư nhân đầu tiên tại Việt Nam. Quy mô xây dựng rộng lớn yêu cầu khảo sát đa điểm với ứng dụng công nghệ LiDAR Scan, bao phủ toàn bộ khu vực đường băng, nhà ga và hạ tầng phụ trợ.', NULL, NULL, 'Khảo sát thành lập bản vẽ 2D,Khảo sát thành lập bản vẽ 3D,Bản vẽ địa hình 1/500,VR360 toàn cảnh,Ứng dụng LiDAR Scan', 'Trắc địa hạ tầng hàng không', 'https://vdcd.vn/wp-content/uploads/2024/03/467321399_1099508478849158_37644.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-edited.png', NULL, '[{"label":"Diện tích","value":"325 ha"},{"label":"Công nghệ","value":"LiDAR Scan"},{"label":"Sản phẩm","value":"2D, 3D, VR360"},{"label":"Tỷ lệ bản đồ","value":"1/500"},{"label":"Chủ đầu tư","value":"Sun Group"},{"label":"Hình ảnh","value":"10 bộ"}]'::jsonb, 'san-bay-quoc-te-phu-quoc'),
  ('bc7e2db1-8ce1-4785-8b7b-5e43a3794249', 'Sân Bay Quốc Tế Phú Quốc', 'san-bay-quoc-te-phu-quoc', 'VDCD triển khai giải pháp AutoTimelapse giám sát công trình tại cảng hàng không quốc tế Phú Quốc – cửa ngõ du lịch hàng đầu Việt Nam.', 'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg', 2023, 'Sân Bay Quốc Tế Phú Quốc | VDCD', 'VDCD triển khai giải pháp AutoTimelapse giám sát công trình tại cảng hàng không quốc tế Phú Quốc – cửa ngõ du lịch hàng đầu Việt Nam.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '0237f2ca-535d-4dec-9dd3-1f12be723bb8', 'project-thumb-san-bay-quoc-te-phu-quoc', 'Cảng hàng không quốc tế Phú Quốc vận hành song song với giai đoạn mở rộng. Hệ thống giám sát phải đảm bảo an toàn hàng không tuyệt đối, không gây ảnh hưởng đến hoạt động bay. Công nghệ tiên tiến cho giám sát công trình hiệu quả.', NULL, NULL, 'AutoTimelapse an toàn hàng không,Giám sát mở rộng nhà ga,Video timelapse quảng bá,Hỗ trợ chuyên nghiệp', 'Giám sát hạ tầng hàng không', 'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg', NULL, '[{"label":"Vị trí","value":"Phú Quốc"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"An toàn","value":"ICAO cấp 4E"},{"label":"Giám sát","value":"24/7"},{"label":"Loại hình","value":"Sân bay quốc tế"},{"label":"Chất lượng","value":"Cam kết chuyên nghiệp"}]'::jsonb, 'nha-hat-ho-tay'),
  ('bc52b3f0-cec1-45dc-bcae-d8526d0018d4', 'Nhà hát Hồ Tây', 'nha-hat-ho-tay', 'Lắp đặt hệ thống giám sát công trình AutoTimelapse cho dự án Nhà hát Hồ Tây – công trình văn hóa biểu tượng Hà Nội.', 'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg', 2024, 'Nhà hát Hồ Tây | VDCD', 'Lắp đặt hệ thống giám sát công trình AutoTimelapse cho dự án Nhà hát Hồ Tây – công trình văn hóa biểu tượng Hà Nội.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '5dc27894-c279-4ce3-86c6-b609a5671564', 'project-thumb-nha-hat-ho-tay', 'Nhà hát Hồ Tây là dự án văn hóa biểu tượng của Hà Nội với kiến trúc phức tạp. Hệ thống AutoTimelapse cần ghi lại toàn bộ quá trình xây dựng với chất lượng hình ảnh cao nhất, phục vụ quản lý tiến độ và truyền thông.', NULL, NULL, 'AutoTimelapse giám sát công trình,Ghi hình 24/7 chất lượng cao,Báo cáo tiến độ tự động,Video timelapse truyền thông', 'Giám sát công trình văn hóa', 'https://vdcd.vn/wp-content/uploads/2024/03/nha-hat-ho-tay.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg', NULL, '[{"label":"Vị trí","value":"Hồ Tây, Hà Nội"},{"label":"Loại hình","value":"Công trình văn hóa"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"Giám sát","value":"24/7"},{"label":"Chất lượng","value":"Video HD"},{"label":"Ý nghĩa","value":"Biểu tượng Hà Nội"}]'::jsonb, 'le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam'),
  ('014919c9-8a23-4fc3-a585-1f2d9d323d75', 'Lễ Diễu binh 80 năm Quốc khánh', 'le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam', 'Việt-Flycam tự hào ghi dấu ấn bằng những thước phim trên cao cùng Đại lễ A80 – Lễ Diễu binh kỷ niệm 80 năm Quốc khánh Việt Nam.', 'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg', 2025, 'Lễ Diễu binh 80 năm Quốc khánh | VDCD', 'Việt-Flycam tự hào ghi dấu ấn bằng những thước phim trên cao cùng Đại lễ A80 – Lễ Diễu binh kỷ niệm 80 năm Quốc khánh Việt Nam.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '5dc27894-c279-4ce3-86c6-b609a5671564', 'project-thumb-le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam', 'Ghi hình đại lễ diễu binh kỷ niệm 80 năm Quốc khánh đòi hỏi bay drone chính xác trong không phận được kiểm soát nghiêm ngặt, với yêu cầu an ninh tuyệt đối và chất lượng hình ảnh điện ảnh.', NULL, NULL, 'Bay quay phim drone chuyên nghiệp,Ghi hình sự kiện trên cao,Hậu kỳ video điện ảnh,Sản xuất phim tài liệu', 'Sản xuất phim & Sự kiện', 'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2025/10/75474.jpg', NULL, '[{"label":"Sự kiện","value":"Đại lễ A80"},{"label":"Địa điểm","value":"Quảng trường BĐ"},{"label":"Công nghệ","value":"Drone cinema"},{"label":"An ninh","value":"Cấp quốc gia"},{"label":"Chất lượng","value":"4K Cinema"},{"label":"Đơn vị","value":"Việt-Flycam"}]'::jsonb, 'sun-world-ba-na-hills'),
  ('b9060cb6-4ec9-48cf-b9ea-081ec49c70c4', 'Sun World Bà Nà Hills', 'sun-world-ba-na-hills', 'Scan 3D hiện trạng Khu du lịch Sun World Bà Nà Hills – Đà Nẵng. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, 3D và bản vẽ 1/500.', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg', 2024, 'Sun World Bà Nà Hills | VDCD', 'Scan 3D hiện trạng Khu du lịch Sun World Bà Nà Hills – Đà Nẵng. Trọn gói sản phẩm trắc địa gồm bản vẽ 2D, 3D và bản vẽ 1/500.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '6aa2210d-50aa-47ef-a348-f366d47f6acb', 'project-thumb-sun-world-ba-na-hills', 'Khu du lịch Sun World Bà Nà Hills nằm trên đỉnh núi Bà Nà ở độ cao 1.489m. Việc scan 3D toàn bộ khu vực đòi hỏi bay drone trong điều kiện thời tiết núi cao với gió mạnh, sương mù và mưa bất chợt.', NULL, NULL, 'Scan 3D hiện trạng,Sản phẩm bản vẽ 2D,Bản vẽ 1/500 chi tiết,Mô hình 3D toàn khu vực', 'Trắc địa & Scan 3D', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_72-min-1024x593-1.png', NULL, '[{"label":"Độ cao","value":"1,489 m"},{"label":"Công nghệ","value":"Scan 3D"},{"label":"Sản phẩm","value":"2D, 3D, 1/500"},{"label":"Chủ đầu tư","value":"Sun Group"},{"label":"Hình ảnh","value":"7 bộ"},{"label":"Đặc thù","value":"Địa hình núi cao"}]'::jsonb, 'dien-gio-phong-nguyen-phong-huy-quang-tri'),
  ('6a12ae83-e169-4e00-9edc-b30d19f58de5', 'Điện gió Phong Nguyên Quảng Trị', 'dien-gio-phong-nguyen-phong-huy-quang-tri', 'AutoTimelapse tối ưu giám sát công trình điện gió Phong Nguyên Phong Huy Quảng Trị – theo dõi tiến độ xây dựng turbine gió quy mô lớn.', 'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp', 2023, 'Điện gió Phong Nguyên Quảng Trị | VDCD', 'AutoTimelapse tối ưu giám sát công trình điện gió Phong Nguyên Phong Huy Quảng Trị – theo dõi tiến độ xây dựng turbine gió quy mô lớn.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '0237f2ca-535d-4dec-9dd3-1f12be723bb8', 'project-thumb-dien-gio-phong-nguyen-phong-huy-quang-tri', 'Dự án điện gió Phong Nguyên Phong Huy tại Quảng Trị triển khai trên địa hình đồi núi rộng lớn. Giám sát xây dựng turbine gió ở độ cao lớn đòi hỏi hệ thống camera chịu gió mạnh và truyền dữ liệu ổn định.', NULL, NULL, 'AutoTimelapse công trình điện gió,Giám sát tiến độ xây lắp turbine,Video timelapse dự án năng lượng,Báo cáo tiến độ', 'Giám sát năng lượng tái tạo', 'https://vdcd.vn/wp-content/uploads/2025/11/chi-phi-quay-timelapse-1-e1665396002939.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp', NULL, '[{"label":"Vị trí","value":"Quảng Trị"},{"label":"Loại hình","value":"Điện gió"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"Đặc thù","value":"Chịu gió mạnh"},{"label":"Giám sát","value":"24/7"},{"label":"Năng lượng","value":"Tái tạo"}]'::jsonb, 'cao-oc-thuong-mai-hai-phong'),
  ('bb18e6ea-a28b-4005-85b2-4d3ec77275e5', 'Cao Ốc Thương Mại Hải Phòng', 'cao-oc-thuong-mai-hai-phong', 'Thiết kế cao ốc thương mại Hải Phòng – dự án thiết kế kiến trúc số với phối cảnh ban ngày và ban đêm ấn tượng.', 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg', 2024, 'Cao Ốc Thương Mại Hải Phòng | VDCD', 'Thiết kế cao ốc thương mại Hải Phòng – dự án thiết kế kiến trúc số với phối cảnh ban ngày và ban đêm ấn tượng.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '0237f2ca-535d-4dec-9dd3-1f12be723bb8', 'project-thumb-cao-oc-thuong-mai-hai-phong', 'Thiết kế cao ốc thương mại tại Hải Phòng yêu cầu phối cảnh kiến trúc 3D chất lượng cao cho cả ban ngày và ban đêm, phục vụ trình bày với nhà đầu tư và xin giấy phép xây dựng.', NULL, NULL, 'Thiết kế kiến trúc 3D,Phối cảnh ban ngày,Phối cảnh ban đêm,Render chất lượng cao', 'Thiết kế kiến trúc số', 'https://vdcd.vn/wp-content/uploads/2025/10/banngay01_1f0f4785d29046d19e06af1ef0ef7f19_master-1.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg', NULL, '[{"label":"Vị trí","value":"Hải Phòng"},{"label":"Loại hình","value":"Cao ốc TM"},{"label":"Sản phẩm","value":"3D Render"},{"label":"Phối cảnh","value":"Ngày + Đêm"},{"label":"Chất lượng","value":"8K Render"},{"label":"Lĩnh vực","value":"Thiết kế số"}]'::jsonb, 'benh-vien-da-chien-ha-noi'),
  ('426ba0c6-31c8-4cc0-b120-a35e369ba6a7', 'Bệnh viện dã chiến Hà Nội', 'benh-vien-da-chien-ha-noi', 'Thần tốc hoàn thiện bệnh viện dã chiến Hà Nội – VDCD là đơn vị cập nhật tiến độ thi công bệnh viện dã chiến phục vụ chống dịch COVID-19.', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png', 2021, 'Bệnh viện dã chiến Hà Nội | VDCD', 'Thần tốc hoàn thiện bệnh viện dã chiến Hà Nội – VDCD là đơn vị cập nhật tiến độ thi công bệnh viện dã chiến phục vụ chống dịch COVID-19.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', '5dc27894-c279-4ce3-86c6-b609a5671564', 'project-thumb-benh-vien-da-chien-ha-noi', 'Bệnh viện dã chiến Hà Nội được xây dựng thần tốc trong bối cảnh dịch COVID-19. VDCD cần triển khai hệ thống giám sát ngay lập tức để ghi lại toàn bộ quá trình xây dựng với tiến độ chạy đua thời gian.', NULL, NULL, 'AutoTimelapse giám sát thần tốc,Cập nhật tiến độ real-time,Video timelapse tài liệu,Báo cáo tiến độ cho chính quyền', 'Giám sát công trình khẩn cấp', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png', NULL, 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png', NULL, '[{"label":"Bối cảnh","value":"COVID-19"},{"label":"Tiến độ","value":"Thần tốc"},{"label":"Giám sát","value":"Real-time"},{"label":"Công nghệ","value":"AutoTimelapse"},{"label":"Ý nghĩa","value":"Chống dịch"},{"label":"Vị trí","value":"Hà Nội"}]'::jsonb, 'bai-xep-phu-yen'),
  ('0fb14fff-ff7f-43a7-a793-e9ee76d0c0a0', 'Bãi Xép – Phú Yên', 'bai-xep-phu-yen', 'Khảo sát địa hình 1/500 chi tiết dự án Bãi Xép – Phú Yên. Trọn gói sản phẩm trắc địa phục vụ thiết kế xây dựng khu du lịch ven biển.', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg', 2024, 'Bãi Xép – Phú Yên | VDCD', 'Khảo sát địa hình 1/500 chi tiết dự án Bãi Xép – Phú Yên. Trọn gói sản phẩm trắc địa phục vụ thiết kế xây dựng khu du lịch ven biển.', TRUE, '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', 'e20f8cfa-92dd-4302-a746-fe50562e19b4', 'ab9278d5-0a6b-4d27-84c1-c0d48cb03961', 'project-thumb-bai-xep-phu-yen', 'Bãi Xép là điểm du lịch nổi tiếng tại Phú Yên với bờ biển hoang sơ. Khảo sát địa hình phục vụ thiết kế xây dựng khu du lịch đòi hỏi độ chính xác cao trên địa hình ven biển đá ghềnh phức tạp.', NULL, NULL, 'Sản phẩm bản vẽ 2D,Bản vẽ 1/500 chi tiết,Mô hình 3D,VR 360 toàn cảnh', 'Trắc địa & Khảo sát ven biển', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg', NULL, 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-min-1024x537-1.png', NULL, '[{"label":"Vị trí","value":"Bãi Xép, Phú Yên"},{"label":"Sản phẩm","value":"2D, 3D, VR360"},{"label":"Tỷ lệ","value":"1/500"},{"label":"Công nghệ","value":"Flycam"},{"label":"Mục đích","value":"Thiết kế XD"},{"label":"Địa hình","value":"Ven biển đá"}]'::jsonb, 'van-phong-khanh-hoa');

-- ------------------------------------------------------------------------------
-- TABLE: slide_detail_blog (1 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "slide_detail_blog" ("id", "slide_id", "title", "subtitle", "slug", "excerpt", "hero_image_url", "hero_image_file_id", "seo_title", "meta_description", "content", "is_published", "published_at", "created_at", "updated_at") VALUES
  ('0ed4fe1b-e479-4403-964e-0324ec4abf56', '2609eb18-f74a-451d-a01c-bff702a8ada7', 'SỐ HÓA DỮ LIỆU ĐẤT ĐAI', 'Từ hiện trạng ngoài thực địa đến cơ sở dữ liệu đồng bộ', 'so-hoa-du-lieu-dat-dai', 'Trung tâm Đổi mới Sáng tạo Gia Lai kết nối công nghệ UAV, GNSS, AI và GIS để hỗ trợ thu thập hiện trạng, lập bản đồ địa chính, chuẩn hóa hồ sơ và xây dựng cơ sở dữ liệu đất đai có khả năng tra cứu, cập nhật và khai thác lâu dài.
Giải pháp hướng đến một mục tiêu rõ ràng: biến dữ liệu đất đai phân tán thành nguồn dữ liệu thống nhất, có thể kiểm chứng và phục vụ hiệu quả công tác quản lý tại địa phương.
', 'https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/so-hoa-du-lieu-dat-dai/1788429125390-645daf7e4079.jpg', '6a994347ead997d09af95759', ' Số hóa dữ liệu đất đai bằng UAV và AI | VDCD Gia Lai', 'Ứng dụng UAV, AI và GIS để đo đạc hiện trạng, lập bản đồ địa chính, chuẩn hóa hồ sơ và xây dựng cơ sở dữ liệu đất đai đồng bộ.', '{"blocks":[{"id":"blk_1788429655652_33ioy2","text":"KHI DỮ LIỆU CHƯA THEO KỊP HIỆN TRẠNG","type":"heading","level":2,"spacing":{"marginTop":32}},{"id":"blk_1788429750875_9pmoxx","text":"Dữ liệu đất đai được hình thành qua nhiều thời kỳ, tồn tại dưới nhiều dạng như bản đồ giấy, giấy chứng nhận quyền sử dụng đất, hồ sơ địa chính và các tệp dữ liệu riêng lẻ.\n\nTại một số khu vực, thông tin trên hồ sơ chưa được cập nhật kịp thời theo biến động ngoài thực địa. Dữ liệu còn phân tán, thiếu đồng bộ hoặc chưa thể kết nối giữa bản đồ, thông tin người sử dụng đất và hồ sơ pháp lý.\n\nNhững hạn chế này gây khó khăn cho việc tra cứu, chỉnh lý biến động, lập quy hoạch, bồi thường, giải phóng mặt bằng và giải quyết thủ tục hành chính. Vì vậy, số hóa dữ liệu đất đai không đơn thuần là chuyển hồ sơ giấy lên máy tính. Điều quan trọng hơn là xây dựng được một nguồn dữ liệu <b>đúng, đủ, sạch, thống nhất và có khả năng cập nhật thường xuyên.</b>","type":"paragraph"},{"id":"blk_1788429911938_dl5kp6","text":"SỐ HÓA DỮ LIỆU ĐẤT ĐAI LÀ GÌ?","type":"heading","level":2},{"id":"p_iy8q9a_mtld36ii","text":"Số hóa dữ liệu đất đai là quá trình thu thập, chuyển đổi, chuẩn hóa và liên kết bản đồ địa chính, giấy chứng nhận, hồ sơ pháp lý, thông tin người sử dụng đất và dữ liệu hiện trạng thành một cơ sở dữ liệu số thống nhất.\n\nQuá trình này bao gồm:\n","type":"paragraph"},{"id":"ls_7iy5a1_mtld3nuz","type":"list","items":["Số hóa giấy chứng nhận, hồ sơ địa chính và bản đồ giấy.","Đo đạc, lập mới hoặc chỉnh lý bản đồ theo hiện trạng.","Kiểm tra, chuẩn hóa và xác thực thông tin.","Xây dựng dữ liệu không gian và thuộc tính cho từng thửa đất.","Liên kết bản đồ với hồ sơ pháp lý và tài liệu gốc.","Tạo mã định danh riêng cho từng thửa đất.","Tích hợp dữ liệu vào phần mềm quản lý đất đai."]},{"id":"p_2wk1db_mtld4x42","text":"Sản phẩm cuối cùng không chỉ là một tấm bản đồ số, mà là một hệ thống dữ liệu có thể phục vụ quản lý, tra cứu, chia sẻ và tiếp tục cập nhật trong tương lai.","type":"paragraph"},{"id":"blk_1788436256141_2uy909","text":"GIẢI PHÁP CÔNG NGHỆ ĐƯỢC ỨNG DỤNG","type":"heading","level":2},{"id":"blk_1788436277188_h9rtyo","text":"UAV thu thập dữ liệu hiện trạng","type":"heading","level":3},{"id":"blk_1788436292724_etfm4y","text":"UAV được sử dụng để bay chụp và thu thập dữ liệu không gian trên diện rộng. Dữ liệu sau xử lý có thể tạo thành bình đồ ảnh trực giao, đám mây điểm, mô hình số địa hình và bản đồ hiện trạng 2D, 3D.&nbsp;<br>","type":"paragraph"},{"id":"blk_1788436306158_fjr2on","alt":"","url":"https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/so-hoa-du-lieu-dat-dai/1788436397551-c4572c34e687.png","type":"image","fileId":"6a995fb5ead997d09ad6ce7b","caption":"Bản đồ số 2D"},{"id":"blk_1788436467301_9yn4c1","alt":"","url":"https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/so-hoa-du-lieu-dat-dai/1788436472589-dcec0e8d7b7e.png","type":"image","fileId":"6a995ffcead997d09ad84b22","caption":"Bản đồ số 3D"},{"id":"blk_1788436500168_2y38f9","text":"So với phương pháp thu thập hoàn toàn thủ công, UAV giúp mở rộng phạm vi khảo sát, tăng khả năng quan sát tổng thể và rút ngắn thời gian triển khai tại hiện trường.&nbsp;<br>","type":"paragraph"},{"id":"blk_1788436514088_gdw7rb","text":"GNSS kiểm soát độ chính xác","type":"heading","level":3},{"id":"blk_1788436535855_1hvn3y","text":"Hệ thống GNSS và các điểm khống chế mặt đất được sử dụng để xác định tọa độ, kiểm tra sai số và bảo đảm dữ liệu thu thập được gắn đúng vị trí trong hệ tọa độ của dự án.&nbsp;<br>","type":"paragraph"},{"id":"blk_1788436542088_au1q4s","text":"AI hỗ trợ nhận diện ranh giới","type":"heading","level":3},{"id":"blk_1788436567837_0t67o0","text":"AI hỗ trợ phân tích hình ảnh, lọc những yếu tố gây nhiễu như cây cối, bóng râm, phương tiện và nhận diện sơ bộ ranh giới nhà, đất, đường giao thông cùng các địa vật theo hiện trạng. Kết quả do AI tạo ra là nguồn dữ liệu hỗ trợ cán bộ chuyên môn, không thay thế việc xác lập ranh giới pháp lý. Ranh giới thửa đất vẫn phải được đối chiếu với hồ sơ địa chính, kiểm tra ngoài thực địa, lấy ý kiến người sử dụng đất và xác nhận bởi cơ quan có thẩm quyền.&nbsp;<br>","type":"paragraph"},{"id":"blk_1788447033234_8dcg1n","alt":"","url":"https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/so-hoa-du-lieu-dat-dai/1788447044600-9d0ad7694575.png","type":"image","fileId":"6a998948ead997d09a1f72d5","caption":"Ứng dụng UAV và AI để nhận diện ranh thửa"},{"id":"blk_1788447070118_vbdqro","text":"GIS quản lý và khai thác dữ liệu","type":"heading","level":3},{"id":"blk_1788447082865_ufahxl","text":"Dữ liệu bản đồ được vector hóa và quản lý trên nền tảng GIS. Mỗi thửa đất có thể được liên kết với thông tin người sử dụng, loại đất, diện tích, biến động và các hồ sơ liên quan. Dữ liệu sau hoàn thiện được tổ chức thành cơ sở dữ liệu tập trung, phục vụ tra cứu, phân quyền, cập nhật và tích hợp với các nền tảng quản lý đất đai phù hợp.&nbsp;<br>","type":"paragraph"},{"id":"blk_1788447097833_61e7e2","text":"QUY TRÌNH TRIỂN KHAI","type":"heading","level":2},{"id":"blk_a2b110e8-00c8-44f2-a41b-8de2ffc6fc2e","type":"section","title":"Khảo sát và chuẩn bị","number":"01","children":[{"id":"sec_child_1788449878598_vpde","text":"Thu thập hồ sơ hiện có, khảo sát địa bàn, kiểm tra điều kiện triển khai, xây dựng kế hoạch kỹ thuật và phối hợp với các đơn vị liên quan.&nbsp;<br>","type":"paragraph"}]},{"id":"blk_738a93d5-5d31-4b14-a983-3c85398306ad","type":"section","title":"Bay chụp và xử lý dữ liệu","number":"02","children":[{"id":"sec_child_1788449914014_nzvc","text":"Thiết lập điểm khống chế, thiết kế tuyến bay UAV và thu thập dữ liệu. Hình ảnh được xử lý để xây dựng bình đồ ảnh, mô hình số và bản đồ hiện trạng.&nbsp;<br>","type":"paragraph"}]},{"id":"blk_ef831ff1-0fc6-4e84-9364-30bf3b2820b4","type":"section","title":"Nhận diện và đối soát","number":"03","children":[{"id":"sec_child_1788449933445_pu41","text":"AI hỗ trợ nhận diện sơ bộ ranh giới. Cán bộ chuyên môn chồng lớp dữ liệu mới với bản đồ và hồ sơ địa chính, đo bổ sung tại các khu vực chưa rõ ràng, đồng thời hướng dẫn người dân kê khai và xác nhận thông tin.&nbsp;<br>","type":"paragraph"}]},{"id":"blk_ac784798-bcab-451e-b06b-2703bb968a49","type":"section","title":"Xây dựng cơ sở dữ liệu","number":"04","children":[{"id":"sec_child_1788449947716_yrqf","text":"Bản đồ được vector hóa, gắn thông tin thuộc tính và liên kết với hồ sơ đất đai đã số hóa. Mỗi thửa đất được tạo mã định danh để quản lý và truy xuất thống nhất.&nbsp;<br>","type":"paragraph"}]},{"id":"blk_4f2b9066-bd28-4766-bb56-e81cfa044b59","type":"section","title":"Kiểm tra và tích hợp","number":"05","children":[{"id":"sec_child_1788449965643_lsm1","text":"Dữ liệu được kiểm tra chất lượng, đối soát và chuyển đến cơ quan có thẩm quyền để xác thực, ký số và tích hợp vào hệ thống quản lý đất đai.&nbsp;<br>","type":"paragraph"}]},{"id":"blk_61c04c19-835c-4a03-b92c-2ab9cf5f17c5","text":"SẢN PHẨM CÓ THỂ BÀN GIAO","type":"heading","level":2},{"id":"blk_0a48e437-a758-4f78-8a5b-1bd375fb8a0e","text":"Tùy theo yêu cầu và phạm vi dự án, sản phẩm có thể bao gồm:&nbsp;<br>","type":"paragraph"},{"id":"blk_0ea7cb20-272d-4e3d-87fe-c7b5c43e7ea0","type":"list","items":["Bình đồ ảnh trực giao khu vực khảo sát."]},{"id":"blk_ed4dd3c4-303b-435f-9f4f-3af10b30bf7c","type":"list","items":["Bản đồ địa chính số và bản đồ hiện trạng."]},{"id":"blk_66a94e6d-2e4a-45cb-b1eb-1b522df6e3d7","type":"list","items":["Mô hình số địa hình hoặc mô hình 3D."]},{"id":"blk_8dc23676-5257-44bd-b27b-330f49a0b84c","type":"list","items":["Dữ liệu không gian của từng thửa đất."]},{"id":"blk_6ff61d3c-4716-44bc-ac36-bad87c0313c3","type":"list","items":["Thông tin thuộc tính được chuẩn hóa."]},{"id":"blk_2fb1b57d-12ba-4d2b-974c-86edc8f9d7d0","type":"list","items":["Hồ sơ pháp lý được số hóa và liên kết."]},{"id":"blk_87c0d3fc-370e-4ec4-82cb-f012f9992039","type":"list","items":["Mã định danh riêng cho từng thửa đất."]},{"id":"blk_7909ad59-da7c-4636-850a-8835a64554b4","type":"list","items":["Tệp dữ liệu theo định dạng kỹ thuật yêu cầu."]},{"id":"blk_2ceea3f0-31bb-4ca2-a6dc-19283f1e0011","type":"list","items":["Cơ sở dữ liệu có khả năng tích hợp với phần mềm quản lý."]},{"id":"blk_33b12d61-7156-460a-96f5-99b055a98390","alt":"","url":"https://ik.imagekit.io/eo8dcxsjx8/vdcd/slides/so-hoa-du-lieu-dat-dai/1788450143257-09aafd2e7b77.png","type":"image","fileId":"6a999562ead997d09a889e61","caption":"Giao diện bản đồ số với ranh giới thửa đất và bảng thông tin thuộc tính"},{"id":"blk_8c85dbd5-77ec-47dd-8457-7c45f69d2d9f","text":"GIÁ TRỊ MANG LẠI","type":"heading","level":2},{"id":"blk_a47a6469-0bb1-4460-9830-ac7214cd8dc2","text":"Đối với cơ quan quản lý","type":"heading","level":3},{"id":"blk_5e211bfe-2274-44da-a560-d4446ad4b788","type":"list","items":["Quản lý dữ liệu tập trung, trực quan và có hệ thống."]},{"id":"blk_0d9b1976-c878-4023-a5d0-79499f8de445","type":"list","items":["Rút ngắn thời gian tra cứu, kiểm tra và tổng hợp thông tin."]},{"id":"blk_50832cc4-60d3-4a95-a2bc-8cdbca195c31","type":"list","items":["Hỗ trợ chỉnh lý biến động và quản lý hiện trạng sử dụng đất."]},{"id":"blk_981a68fb-96fc-469d-afb4-9d7e09e2e74a","type":"list","items":["Cung cấp dữ liệu phục vụ quy hoạch, bồi thường và giải phóng mặt bằng."]},{"id":"blk_8f06f1f9-08de-4cff-b3e7-df6eeee8d823","type":"list","items":["Hạn chế sự thiếu thống nhất giữa hồ sơ và thực địa."]},{"id":"blk_442a8151-9ac1-472c-882a-9eb5794cad2f","type":"list","items":["Hỗ trợ ra quyết định dựa trên dữ liệu có khả năng kiểm chứng."]},{"id":"blk_0a28aa0a-2cfa-4bab-a109-f462842a9609","text":"Đối với người dân","type":"heading","level":3},{"id":"blk_678b1d72-563a-476a-9c6f-195acfa11956","type":"list","items":["Thông tin đất đai được đối soát và quản lý rõ ràng hơn."]},{"id":"blk_3b1951a8-e3b4-4f81-a3e8-e8b35da7a0d3","type":"list","items":["Hạn chế việc phải cung cấp lại nhiều lần những hồ sơ đã có."]},{"id":"blk_5bd00174-55b3-4a04-92e7-e5d084e31a4e","type":"list","items":["Hỗ trợ tra cứu và thực hiện dịch vụ công trực tuyến."]},{"id":"blk_82ea5327-5757-45d0-aead-6b83f7ae8c3b","type":"list","items":["Góp phần rút ngắn thời gian giải quyết thủ tục hành chính."]},{"id":"blk_9fd7c01d-0277-4291-8749-15f3f0bb375f","text":"Đối với địa phương","type":"heading","level":3},{"id":"blk_554573f8-6cda-4d70-93ce-4fc7e7171677","type":"list","items":["Hình thành nguồn dữ liệu dùng chung."]},{"id":"blk_bf87601c-ccd8-4d2d-a69c-b25a145ca920","type":"list","items":["Nâng cao tính minh bạch trong quản lý đất đai."]},{"id":"blk_2404d878-8413-4b4a-8ded-d549daa9e535","type":"list","items":["Tạo nền tảng phục vụ quy hoạch và phát triển kinh tế - xã hội."]},{"id":"blk_5cc1d32e-42a7-413e-b276-55d5226d2ea4","type":"list","items":["Hỗ trợ kết nối dữ liệu đất đai với các hệ thống quản lý chuyên ngành."]},{"id":"blk_6046d0f1-0f70-4acc-b554-f89bf19d9288","text":"NĂNG LỰC ĐƯỢC KIỂM CHỨNG TỪ THỰC TIỄN","type":"heading","level":2},{"id":"blk_d86db20e-af02-4a08-aafa-90ebdd942856","text":"Trung tâm Đổi mới Sáng tạo Gia Lai đã triển khai bay quét UAV và xây dựng bản đồ hiện trạng 2D, 3D tại các tuyến quốc lộ đi qua xã Tây Sơn. Trên nền dữ liệu bản đồ số, AI được ứng dụng để nhận diện vị trí hư hỏng mặt đường, khoanh vùng khu vực hành lang đường bộ bị lấn chiếm và hỗ trợ đánh số nhà tự động.&nbsp;<br>","type":"paragraph"},{"id":"blk_d9407dab-5af2-4767-96ca-cc6e58de0244","text":"Kết quả này cho thấy năng lực triển khai đồng bộ từ thu thập dữ liệu hiện trường, xử lý bản đồ đến phân tích và khai thác dữ liệu phục vụ quản lý. Bên cạnh đó, mạng lưới công nghệ do VDCD Gia Lai kết nối có kinh nghiệm triển khai khảo sát địa hình, đo đạc bản đồ số, lập hồ sơ kỹ thuật thửa đất và xử lý dữ liệu 2D, 3D tại nhiều khu vực trên cả nước.&nbsp;<br>","type":"paragraph"},{"id":"blk_777aafc0-7da8-43cd-8ccf-6487311b7fee","text":"VAI TRÒ CỦA TRUNG TÂM ĐỔI MỚI SÁNG TẠO GIA LAI","type":"heading","level":2},{"id":"blk_2a7e3e41-ace6-44db-88a5-761b01eb1070","text":"VDCD Gia Lai đóng vai trò kết nối nguồn lực công nghệ, chuyên gia và đội ngũ triển khai để tư vấn, khảo sát và đề xuất giải pháp phù hợp với nhu cầu thực tế của từng địa phương.<br><br>Năng lực kết nối bao gồm:<span style=\"font-size: 0.9375rem;\">&nbsp;</span>","type":"paragraph"},{"id":"blk_f3f0a391-7446-49dd-a155-ef584a51c246","type":"list","items":["Đội ngũ khảo sát nội nghiệp và ngoại nghiệp."]},{"id":"blk_cb4f0cc3-6317-4531-88ef-c4c238b16157","type":"list","items":["Công nghệ UAV, GNSS, AI và GIS."]},{"id":"blk_61fbe94f-cf1c-42bc-b627-4d4f81461e55","type":"list","items":["Năng lực xử lý dữ liệu hiện trạng 2D, 3D."]},{"id":"blk_3706c0af-71ee-4097-8b1e-455a6d6a2aea","type":"list","items":["Phần mềm quản lý và khai thác dữ liệu."]},{"id":"blk_95e9aa34-ef4a-4047-96da-84756f05334e","type":"list","items":["Hạ tầng lưu trữ, tích hợp và chia sẻ dữ liệu."]},{"id":"blk_0f370ae8-99ef-48a8-baf5-8f9fc18022fc","type":"list","items":["Mạng lưới chuyên gia trong lĩnh vực trắc địa, bản đồ và chuyển đổi số."]},{"id":"blk_8e59e681-441d-4159-895d-67d4f404ebd1","text":"Trung tâm Đổi mới Sáng tạo Gia Lai không thay thế chức năng quản lý nhà nước hoặc thẩm quyền xác lập pháp lý về đất đai. Vai trò của VDCD Gia Lai là cung cấp giải pháp công nghệ và phối hợp triển khai kỹ thuật theo yêu cầu của cơ quan có thẩm quyền.&nbsp;<br>","type":"paragraph"},{"id":"blk_11506582-390e-4f8a-b677-d6f99decc84c","text":"XÂY DỰNG DỮ LIỆU ĐÚNG TỪ THỰC ĐỊA","type":"heading","level":2},{"id":"blk_3f12cdec-37ac-4e45-93af-7425c2ae3db7","text":"Một cơ sở dữ liệu đất đai chỉ thực sự có giá trị khi thông tin trên hệ thống phản ánh đúng hiện trạng, được liên kết với hồ sơ pháp lý và có khả năng tiếp tục cập nhật.\n<br><br>Với sự kết hợp giữa UAV, AI, GIS, phần mềm và đội ngũ chuyên môn, Trung tâm Đổi mới Sáng tạo Gia Lai hướng đến việc đưa công nghệ vào giải quyết nhu cầu thực tế, từng bước hình thành nền tảng dữ liệu đất đai đồng bộ, minh bạch và phục vụ quản lý lâu dài.&nbsp;<br>","type":"paragraph"}],"version":1,"heroMeta":{"caption":"Ứng dụng UAV và AI để số hóa dữ liệu đất đai","placement":"below_desc"}}'::jsonb, TRUE, '2026-09-03T12:29:22.052Z', '2026-09-02T20:34:24.089Z', '2026-09-03T08:48:05.365Z');

-- ------------------------------------------------------------------------------
-- TABLE: project_image (54 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "project_image" ("id", "url", "caption", "order", "project_id", "file_id", "size") VALUES
  ('6f183330-a1cf-4899-bf1e-e65697a6ec9a', 'https://vdcd.vn/wp-content/uploads/2025/11/L1003913-1-1024x683-1.jpg', 'Toàn cảnh khu kinh tế Vân Phong từ trên cao', 0, 'd4cc07c9-5ad3-4a29-be63-c95563517bf7', 'project-img-van-phong-khanh-hoa-1', 'large'),
  ('0c0baf6e-01d4-42c9-bb37-014ad36b5af3', 'https://vdcd.vn/wp-content/uploads/2025/11/z6230086515847_880a32e4555a0e1a2092fafe725ba010-1-edited-1024x768.jpg', 'Khảo sát thực địa tại Vân Phong', 1, 'd4cc07c9-5ad3-4a29-be63-c95563517bf7', 'project-img-van-phong-khanh-hoa-2', 'small'),
  ('be6ca33a-9e4d-4829-bb03-cbd976f403c8', 'https://vdcd.vn/wp-content/uploads/2025/11/z6246976510436_a1885eca27bd88117afc251ceab774be-edited.jpg', 'Drone bay quét địa hình khu vực ven biển', 2, 'd4cc07c9-5ad3-4a29-be63-c95563517bf7', 'project-img-van-phong-khanh-hoa-3', 'small'),
  ('2b744bc2-049a-46dd-b29b-1c47ebe2c63a', 'https://vdcd.vn/wp-content/uploads/2025/11/z6246996465902_d2b58a023e87326b3d6b828d09049fa4-1024x618-1.jpg', 'Bản đồ địa hình số khu kinh tế', 3, 'd4cc07c9-5ad3-4a29-be63-c95563517bf7', 'project-img-van-phong-khanh-hoa-4', 'large'),
  ('d006ac7f-944a-4f49-838d-32fe0f0f10a7', 'https://vdcd.vn/wp-content/uploads/2025/11/z6249184485226_65353c2131876581d63d52ac58854302-1024x683-1.jpg', 'Đội ngũ khảo sát tại hiện trường', 4, 'd4cc07c9-5ad3-4a29-be63-c95563517bf7', 'project-img-van-phong-khanh-hoa-5', 'small'),
  ('39b4447c-c5f9-4191-8fb4-57b63b8de168', 'https://vdcd.vn/wp-content/uploads/2025/11/IMG_7134-edited-2048x1536-1-1024x768.jpg', 'Thiết bị bay quét LiDAR', 5, 'd4cc07c9-5ad3-4a29-be63-c95563517bf7', 'project-img-van-phong-khanh-hoa-6', 'small'),
  ('c6a82251-5148-4393-b987-1ba53620a1ac', 'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1-1-1-scaled.jpg', 'Tổ hợp Lotte Mall nhìn từ trên cao', 0, '652e4771-4d89-4968-a4d6-f72e0beded5c', 'project-img-lotte-mall-vo-chi-cong-1', 'large'),
  ('aff7e270-a4e2-42a6-b1c0-b891605dbbcc', 'https://vdcd.vn/wp-content/uploads/2024/03/481910989_2375973832761147_7242746415740845603_n-1.jpg', 'Hệ thống camera giám sát tại công trường', 1, '652e4771-4d89-4968-a4d6-f72e0beded5c', 'project-img-lotte-mall-vo-chi-cong-2', 'small'),
  ('3764062b-e0bf-4e20-b213-54e986e8db71', 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-du-an-becamex2-atl-1024x683-1.jpeg', 'Becamex Tower – Biểu tượng đô thị Bình Dương', 0, '4be7085f-1f0c-4723-b920-220fdba2a786', 'project-img-becamex-binh-duong-1', 'large'),
  ('40452363-1174-4130-a704-426e18421c0a', 'https://vdcd.vn/wp-content/uploads/2025/11/Thiet-ke-chua-co-ten-5-1.jpg', 'Phối cảnh tổng thể The Terra An Hưng', 0, '5dc03588-17a9-43de-8a89-f9082c5dd18c', 'project-img-the-terra-an-hung-1', 'large'),
  ('2113c2e6-bf85-465b-bab8-86695f53bb85', 'https://vdcd.vn/wp-content/uploads/2024/03/the-terra-an-hung-1-1-1.jpg', 'Giai đoạn thi công khu đô thị', 1, '5dc03588-17a9-43de-8a89-f9082c5dd18c', 'project-img-the-terra-an-hung-2', 'small'),
  ('677c4777-0d3a-47ab-b83b-fac172357716', 'https://vdcd.vn/wp-content/uploads/2024/03/497670130_1264939388971481_6818461079310841617_n-1024x768.jpg', 'Hệ thống camera giám sát tại công trường', 2, '5dc03588-17a9-43de-8a89-f9082c5dd18c', 'project-img-the-terra-an-hung-3', 'small'),
  ('e666cdda-df8d-4358-aaf6-b25e2ba954ad', 'https://vdcd.vn/wp-content/uploads/2025/11/11-1024x680-1.png', 'Tháp Bà Ponagar – Di sản Chăm Pa', 0, '3f7dd1d3-1636-4d3f-9ede-d20300f5a6c5', 'project-img-thap-ba-ponagar-1', 'large'),
  ('ef4712fc-f447-4ad1-9c68-4c59a29f101d', 'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-1024x768.jpg', 'Bản vẽ 2D khảo sát di tích', 1, '3f7dd1d3-1636-4d3f-9ede-d20300f5a6c5', 'project-img-thap-ba-ponagar-2', 'small'),
  ('e69a0fab-8bcd-4673-b6a2-b89ac28cc457', 'https://vdcd.vn/wp-content/uploads/2024/03/3d-thap-ba-ponagar.png', 'Mô hình 3D quần thể tháp', 2, '3f7dd1d3-1636-4d3f-9ede-d20300f5a6c5', 'project-img-thap-ba-ponagar-3', 'small'),
  ('7e528a0f-e16b-45be-9ee4-7ef306c66984', 'https://vdcd.vn/wp-content/uploads/2024/03/z6227939792173_a593ec4952ff2e1679658730cd16b032-1024x582-1.jpg', 'Toàn cảnh khu di tích từ trên cao', 3, '3f7dd1d3-1636-4d3f-9ede-d20300f5a6c5', 'project-img-thap-ba-ponagar-4', 'large'),
  ('f697582b-f7d7-4860-9485-5a4fb1751922', 'https://vdcd.vn/wp-content/uploads/2024/03/screenshot1-15-1024x490-1.jpg', 'VR360 tham quan thực tế ảo', 4, '3f7dd1d3-1636-4d3f-9ede-d20300f5a6c5', 'project-img-thap-ba-ponagar-5', 'small'),
  ('755eb891-4857-4660-99e4-d63c78328b0f', 'https://vdcd.vn/wp-content/uploads/2024/03/2d-thap-ba-ponagar-2-1-1024x768.jpg', 'Chi tiết bản vẽ kiến trúc', 5, '3f7dd1d3-1636-4d3f-9ede-d20300f5a6c5', 'project-img-thap-ba-ponagar-6', 'small'),
  ('1f8239f7-2f5b-4cb8-8732-8f8a104f324b', 'https://vdcd.vn/wp-content/uploads/2024/03/13632_12-11-2025-11-30-00-1-1-scaled.jpg', 'Sun Marina Hạ Long – Đô thị ven biển', 0, '860cbdc1-04a0-4101-9c45-54836f8702c7', 'project-img-sun-marina-ha-long-1', 'large'),
  ('f834f481-515c-4cac-b6a7-0ee451eeea7b', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_76-min-1024x609-1.png', 'Toàn cảnh bán đảo Sơn Trà', 0, '08a0962f-3e5e-4a65-8fcd-8e9d4520f936', 'project-img-son-tra-da-nang-1', 'large'),
  ('af2240b7-375c-4ce8-8276-0b2037e9b61d', 'https://vdcd.vn/wp-content/uploads/2024/03/467126771_1099508525515820_4642314407752063642_n-1024x683-1.jpg', 'Đội ngũ khảo sát tại Sơn Trà', 1, '08a0962f-3e5e-4a65-8fcd-8e9d4520f936', 'project-img-son-tra-da-nang-2', 'small'),
  ('2df04497-e9f6-4036-891d-5ca493e0b582', 'https://vdcd.vn/wp-content/uploads/2025/11/467741379_1104256805040992_4651998732288142886_n-1024x512-1.jpg', 'Sân bay Vân Đồn nhìn từ trên cao', 0, '79b3457b-45c9-4354-b4a7-2bae9b1d3262', 'project-img-san-bay-van-don-1', 'large'),
  ('598ffd57-04d7-4fb2-a3ca-562f0153df6e', 'https://vdcd.vn/wp-content/uploads/2024/03/467321399_1099508478849158_37644.jpg', 'Quá trình khảo sát khu vực nhà ga', 1, '79b3457b-45c9-4354-b4a7-2bae9b1d3262', 'project-img-san-bay-van-don-2', 'small'),
  ('af8a09a4-627e-4050-a16e-cd06382b5fc7', 'https://vdcd.vn/wp-content/uploads/2024/03/466682223_1099508235515849_3883118592529925754_n-1024x683-1.jpg', 'Thiết bị LiDAR tại đường băng', 2, '79b3457b-45c9-4354-b4a7-2bae9b1d3262', 'project-img-san-bay-van-don-3', 'small'),
  ('2703e9f3-44c5-4c82-9432-e168b071f542', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-edited.png', 'Bản đồ số 3D sân bay', 3, '79b3457b-45c9-4354-b4a7-2bae9b1d3262', 'project-img-san-bay-van-don-4', 'large'),
  ('f578364d-54a8-44cd-984c-5ecf18361d21', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_1-edited-1024x768.png', 'Mô hình 3D nhà ga hành khách', 4, '79b3457b-45c9-4354-b4a7-2bae9b1d3262', 'project-img-san-bay-van-don-5', 'small'),
  ('2b655dd5-9e1f-4e68-9792-99b5648fd029', 'https://vdcd.vn/wp-content/uploads/2024/03/screenshot1-14-1024x490-1.jpg', 'VR360 toàn cảnh sân bay', 5, '79b3457b-45c9-4354-b4a7-2bae9b1d3262', 'project-img-san-bay-van-don-6', 'small'),
  ('cceb7227-2f18-403f-a0b9-aaad862c3d52', 'https://vdcd.vn/wp-content/uploads/2024/03/cang-hkqt-phu-quoc-1750338379-62.jpg', 'Cảng hàng không quốc tế Phú Quốc', 0, 'bc7e2db1-8ce1-4785-8b7b-5e43a3794249', 'project-img-san-bay-quoc-te-phu-quoc-1', 'large'),
  ('ffdc45bc-69f2-4de4-be16-b0f8f7406b16', 'https://vdcd.vn/wp-content/uploads/2024/03/Nha-Hat-Opera-Ha-Noi-1.jpeg', 'Phối cảnh Nhà hát Hồ Tây', 0, 'bc52b3f0-cec1-45dc-bcae-d8526d0018d4', 'project-img-nha-hat-ho-tay-1', 'large'),
  ('02c0bbe8-10e6-4e22-9560-34e8eef861fa', 'https://vdcd.vn/wp-content/uploads/2024/03/nha-hat-ho-tay.jpg', 'Công trường xây dựng nhà hát', 1, 'bc52b3f0-cec1-45dc-bcae-d8526d0018d4', 'project-img-nha-hat-ho-tay-2', 'small'),
  ('4385d10a-19fa-435c-b31a-d6d6f59fd68f', 'https://vdcd.vn/wp-content/uploads/2024/03/514970510_1308500817948671_3336272050708746027_n-1-1024x768.jpg', 'Camera AutoTimelapse lắp đặt tại công trường', 2, 'bc52b3f0-cec1-45dc-bcae-d8526d0018d4', 'project-img-nha-hat-ho-tay-3', 'small'),
  ('b3215498-bc4b-463d-881e-a4b825f670c1', 'https://vdcd.vn/wp-content/uploads/2024/03/514760343_1308500777948675_797658922111612414_n-1-1024x768.jpg', 'Tiến độ thi công nhà hát', 3, 'bc52b3f0-cec1-45dc-bcae-d8526d0018d4', 'project-img-nha-hat-ho-tay-4', 'large'),
  ('58b0c229-813a-49b9-b19f-938036cc7cd8', 'https://vdcd.vn/wp-content/uploads/2024/03/Anh-40-1.jpg', 'Lễ Diễu binh kỷ niệm 80 năm Quốc khánh', 0, '014919c9-8a23-4fc3-a585-1f2d9d323d75', 'project-img-le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam-1', 'large'),
  ('b90588ca-ee20-408b-9e3d-bb6fcfda313a', 'https://vdcd.vn/wp-content/uploads/2025/10/75474.jpg', 'Toàn cảnh đại lễ từ trên cao', 1, '014919c9-8a23-4fc3-a585-1f2d9d323d75', 'project-img-le-dieu-binh-ky-niem-80-nam-quoc-khanh-viet-nam-2', 'large'),
  ('3b893210-a862-4dc9-baa8-8df3dd4d6273', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-100854-min.jpg', 'Sun World Bà Nà Hills – Cầu Vàng', 0, 'b9060cb6-4ec9-48cf-b9ea-081ec49c70c4', 'project-img-sun-world-ba-na-hills-1', 'large'),
  ('0fdb7f03-bd72-4643-98ee-f6a9dc8d5cd5', 'https://vdcd.vn/wp-content/uploads/2024/03/du-an-van-don-1-scaled.jpg', 'Scan 3D khu vực Bà Nà', 1, 'b9060cb6-4ec9-48cf-b9ea-081ec49c70c4', 'project-img-sun-world-ba-na-hills-2', 'small'),
  ('e6f2585e-b65e-4247-80a5-1e86f0cf214e', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_71-min-1024x570-1.png', 'Mô hình 3D toàn cảnh', 2, 'b9060cb6-4ec9-48cf-b9ea-081ec49c70c4', 'project-img-sun-world-ba-na-hills-3', 'small'),
  ('2669e231-fca8-4f68-959c-3b4429017e7f', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_72-min-1024x593-1.png', 'Bản vẽ 2D chi tiết', 3, 'b9060cb6-4ec9-48cf-b9ea-081ec49c70c4', 'project-img-sun-world-ba-na-hills-4', 'large'),
  ('b380a57f-afe1-44c9-8b8e-36df5310e658', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-04-101052-min-1024x498-1.png', 'Point cloud 3D khu vui chơi', 4, 'b9060cb6-4ec9-48cf-b9ea-081ec49c70c4', 'project-img-sun-world-ba-na-hills-5', 'small'),
  ('5b4918fa-b0cf-4236-8c69-9766d0fed156', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot-2024-07-10-135726-min-1024x492-1.png', 'Bản vẽ tỷ lệ 1/500', 5, 'b9060cb6-4ec9-48cf-b9ea-081ec49c70c4', 'project-img-sun-world-ba-na-hills-6', 'small'),
  ('b7303db3-bb12-4150-87c4-c13cadc2ad92', 'https://vdcd.vn/wp-content/uploads/2025/11/hinh-anh-dien-gio-quang-tri-atl.webp', 'Điện gió Quảng Trị – Timelapse', 0, '6a12ae83-e169-4e00-9edc-b30d19f58de5', 'project-img-dien-gio-phong-nguyen-phong-huy-quang-tri-1', 'large'),
  ('54655b10-096d-4178-93fd-32914651251e', 'https://vdcd.vn/wp-content/uploads/2025/11/chi-phi-quay-timelapse-1-e1665396002939.jpg', 'Quá trình lắp đặt turbine', 1, '6a12ae83-e169-4e00-9edc-b30d19f58de5', 'project-img-dien-gio-phong-nguyen-phong-huy-quang-tri-2', 'small'),
  ('82427503-8ad3-4ede-a3a0-7699611b41ee', 'https://vdcd.vn/wp-content/uploads/2024/03/hinh-anh-dien-gio-quang-tri-atl-1.webp', 'Toàn cảnh trại điện gió', 2, '6a12ae83-e169-4e00-9edc-b30d19f58de5', 'project-img-dien-gio-phong-nguyen-phong-huy-quang-tri-3', 'small'),
  ('21ec8f0f-208c-4699-83f1-33c2e3e42c04', 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1-1.jpg', 'Phối cảnh ban đêm cao ốc Hải Phòng', 0, 'bb18e6ea-a28b-4005-85b2-4d3ec77275e5', 'project-img-cao-oc-thuong-mai-hai-phong-1', 'large'),
  ('45dca8c7-54d8-413b-ac9b-4dd9efeade84', 'https://vdcd.vn/wp-content/uploads/2025/10/banngay01_1f0f4785d29046d19e06af1ef0ef7f19_master-1.jpg', 'Phối cảnh ban ngày – Góc chính diện', 1, 'bb18e6ea-a28b-4005-85b2-4d3ec77275e5', 'project-img-cao-oc-thuong-mai-hai-phong-2', 'small'),
  ('9a189458-9339-4a1a-873e-141c92e16671', 'https://vdcd.vn/wp-content/uploads/2025/10/banngay02_ea3cc501664d4538a1c6a908b4406887_master-1.jpg', 'Phối cảnh ban ngày – Góc phối cảnh', 2, 'bb18e6ea-a28b-4005-85b2-4d3ec77275e5', 'project-img-cao-oc-thuong-mai-hai-phong-3', 'small'),
  ('7853f4f6-262d-48c7-9b08-2ae919fa3bcd', 'https://vdcd.vn/wp-content/uploads/2025/10/bandem02_dd69a81dbb584714a217e6e18854faf2_master-1.jpg', 'Phối cảnh ban đêm – Toàn cảnh', 3, 'bb18e6ea-a28b-4005-85b2-4d3ec77275e5', 'project-img-cao-oc-thuong-mai-hai-phong-4', 'large'),
  ('7d1ce141-8f21-4137-b0f9-5fb87a7553ea', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot-2025-11-12-161452-1.png', 'Bệnh viện dã chiến Hà Nội – Xây dựng thần tốc', 0, '426ba0c6-31c8-4cc0-b120-a35e369ba6a7', 'project-img-benh-vien-da-chien-ha-noi-1', 'large'),
  ('36f8dbdb-1521-4d24-a3da-5fd171c1e1a6', 'https://vdcd.vn/wp-content/uploads/2025/11/Screenshot_1-copy1-1024x722-1.jpg', 'Bãi Xép – Phú Yên từ trên cao', 0, '0fb14fff-ff7f-43a7-a793-e9ee76d0c0a0', 'project-img-bai-xep-phu-yen-1', 'large'),
  ('d14a9694-b3a3-446a-a58e-0c56ddfb7404', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_8-copy-1024x665-1.jpg', 'Bản vẽ 2D khu vực ven biển', 1, '0fb14fff-ff7f-43a7-a793-e9ee76d0c0a0', 'project-img-bai-xep-phu-yen-2', 'small'),
  ('c180f905-6943-4827-a24c-127a5060d888', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_1-copy-1024x673-1.jpg', 'Mô hình 3D bãi biển', 2, '0fb14fff-ff7f-43a7-a793-e9ee76d0c0a0', 'project-img-bai-xep-phu-yen-3', 'small'),
  ('f8d48231-db1f-45fb-89ee-595e96b59273', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_4-min-1024x528-1.png', 'Bản vẽ tỷ lệ 1/500', 3, '0fb14fff-ff7f-43a7-a793-e9ee76d0c0a0', 'project-img-bai-xep-phu-yen-4', 'large'),
  ('d1e6f219-a7ec-42d8-8aaa-8709bdd8d9a2', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_3-min-1024x537-1.png', 'Point cloud 3D bãi đá', 4, '0fb14fff-ff7f-43a7-a793-e9ee76d0c0a0', 'project-img-bai-xep-phu-yen-5', 'small'),
  ('543b3404-7333-41d3-a7cd-53ef83e0ab5a', 'https://vdcd.vn/wp-content/uploads/2024/03/Screenshot_73-min-1024x537-1.png', 'VR360 toàn cảnh bãi Xép', 5, '0fb14fff-ff7f-43a7-a793-e9ee76d0c0a0', 'project-img-bai-xep-phu-yen-6', 'small');

-- ------------------------------------------------------------------------------
-- TABLE: article (10 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "article" ("id", "title", "slug", "content", "thumbnail", "category", "tags", "meta_title", "meta_description", "is_published", "published_at", "created_at", "updated_at", "project_id", "program_id", "solution_id", "thumbnail_file_id") VALUES
  ('78543435-99dd-4420-b6b1-c811e3ad8a7f', 'Trung tâm Đổi mới Sáng tạo Gia Lai ký kết hợp tác chiến lược với Vietedge thúc đẩy chuyển đổi số', 'trung-tam-dmst-gia-lai-ky-ket-vietedge', '<p>Tháng 7/2026, Công ty Cổ phần Trung tâm Đổi mới Sáng tạo Gia Lai (thành viên VDCD Group) chính thức ký kết Biên bản ghi nhớ hợp tác (MOU) với Vietedge — đơn vị tiên phong trong lĩnh vực công nghệ và đầu tư số tại Việt Nam.</p><h2>Nội dung hợp tác</h2><ul><li>Thúc đẩy hệ sinh thái công nghệ và đổi mới sáng tạo tại tỉnh Gia Lai</li><li>Xúc tiến thương mại, kết nối đầu tư vào các dự án công nghệ số</li><li>Phát triển nguồn nhân lực số chất lượng cao cho khu vực Tây Nguyên</li><li>Chuyển giao công nghệ và ứng dụng giải pháp AI, IoT, dữ liệu lớn</li></ul>', 'https://picsum.photos/seed/trung-tam-dmst-gia-lai-ky-ket-vietedge/800/500', 'Tin tức', 'hợp tác,Vietedge,đổi mới sáng tạo,chuyển đổi số,Gia Lai', 'Trung tâm Đổi mới Sáng tạo Gia Lai ký kết hợp tác chiến lược với Vietedge thúc đẩy chuyển đổi số | VDCD', 'Trung tâm Đổi mới Sáng tạo Gia Lai và Vietedge ký kết MOU thúc đẩy hệ sinh thái công nghệ, chuyển đổi số tại Tây Nguyên.', TRUE, '2026-07-18T09:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, 'a1b2c3d4-e5f6-4a7b-8c9d-012345678903', NULL, 'article-thumb-trung-tam-dmst-gia-lai-ky-ket-vietedge'),
  ('150af21c-a54f-4882-b5ed-4ba351ba9cc4', 'Xã Tây Sơn trở thành "Xã hạt nhân số" đầu tiên của tỉnh Gia Lai', 'xa-tay-son-xa-hat-nhan-so-dau-tien-gia-lai', '<p>Xã Tây Sơn (huyện An Khê, Gia Lai) được UBND tỉnh lựa chọn làm đơn vị thí điểm xây dựng mô hình "Xã hạt nhân về khoa học công nghệ, đổi mới sáng tạo và chuyển đổi số", với sự phối hợp của Trung tâm Đổi mới Sáng tạo Gia Lai (VDCD).</p><h2>Kết quả đạt được</h2><ul><li>100% thủ tục hành chính xử lý trực tuyến — thời gian đăng ký hộ kinh doanh giảm từ 3 ngày xuống 3 giờ</li><li>Tỷ lệ hài lòng của người dân đạt 100%</li><li>Triển khai mô hình "chợ số" — tiểu thương thanh toán không dùng tiền mặt</li><li>Tỷ lệ phủ sóng 5G đạt 99,3% dân số</li></ul>', 'https://picsum.photos/seed/xa-tay-son-xa-hat-nhan-so-dau-tien-gia-lai/800/500', 'Chuyển đổi số', 'xã hạt nhân số,Tây Sơn,chuyển đổi số,chính quyền số,Gia Lai', 'Xã Tây Sơn trở thành "Xã hạt nhân số" đầu tiên của tỉnh Gia Lai | VDCD', 'Mô hình xã hạt nhân số tại Tây Sơn giảm thời gian TTHC từ 3 ngày xuống 3 giờ, phủ sóng 5G 99,3% dân số.', TRUE, '2026-07-12T14:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, NULL, NULL, 'article-thumb-xa-tay-son-xa-hat-nhan-so-dau-tien-gia-lai'),
  ('8f25d11f-0a0a-4017-85b0-059d82407cae', 'VDCD Group ký MOU với Trường Đại học Quy Nhơn — Xây dựng hệ sinh thái khởi nghiệp trong môi trường đại học', 'vdcd-ky-mou-dai-hoc-quy-nhon', '<p>Ngày 18/05/2026, Trường Đại học Quy Nhơn và Công ty Cổ phần Trung tâm Đổi mới Sáng tạo Gia Lai (thành viên VDCD Group) chính thức ký kết Bản thỏa thuận hợp tác (MOU).</p><h2>Nội dung hợp tác trọng tâm</h2><ul><li>Xây dựng hệ sinh thái khởi nghiệp đổi mới sáng tạo trong môi trường đại học</li><li>Chuyển giao công nghệ và ứng dụng kết quả nghiên cứu vào thực tiễn doanh nghiệp</li><li>Đào tạo nguồn nhân lực chất lượng cao trong các lĩnh vực AI, IoT, GIS, UAV</li></ul>', 'https://picsum.photos/seed/vdcd-ky-mou-dai-hoc-quy-nhon/800/500', 'Sự kiện', 'Đại học Quy Nhơn,hợp tác,khởi nghiệp,đào tạo,nhân lực', 'VDCD Group ký MOU với Trường Đại học Quy Nhơn — Xây dựng hệ sinh thái khởi nghiệp trong môi trường đại học | VDCD', 'VDCD Group ký kết hợp tác với Đại học Quy Nhơn xây dựng hệ sinh thái khởi nghiệp, chuyển giao công nghệ.', TRUE, '2026-05-20T08:30:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, 'a1b2c3d4-e5f6-4a7b-8c9d-012345678903', NULL, 'article-thumb-vdcd-ky-mou-dai-hoc-quy-nhon'),
  ('241de565-78be-4e38-8e83-43224eb9a174', 'Khánh thành hạ tầng Data Center và 6 phòng Lab chuyên ngành tại Trung tâm ĐMST Gia Lai', 'khanh-thanh-data-center-phong-lab-trung-tam-dmst-gia-lai', '<p>Trung tâm Đổi mới Sáng tạo Gia Lai chính thức đưa vào vận hành hệ thống hạ tầng công nghệ hiện đại, bao gồm Data Center, siêu máy tính AI và 6 phòng lab chuyên ngành.</p><h2>6 phòng Lab chuyên ngành</h2><ul><li><strong>Lab UAV:</strong> Bay chụp, khảo sát địa hình, lập bản đồ 3D</li><li><strong>Lab AI:</strong> Xử lý ảnh, nhận diện, chatbot, phân tích dữ liệu</li><li><strong>Lab GIS:</strong> Hệ thống thông tin địa lý, bản đồ số, quy hoạch</li><li><strong>Lab Nông nghiệp công nghệ cao:</strong> IoT cảm biến, tưới tự động</li><li><strong>Lab Công nghệ sinh học:</strong> Nuôi cấy mô, phân tích mẫu</li><li><strong>Lab STEM:</strong> Giáo dục STEM cho học sinh, sinh viên</li></ul>', 'https://picsum.photos/seed/khanh-thanh-data-center-phong-lab-trung-tam-dmst-gia-lai/800/500', 'Tin tức', 'Data Center,phòng lab,AI,UAV,GIS,hạ tầng,Gia Lai', 'Khánh thành hạ tầng Data Center và 6 phòng Lab chuyên ngành tại Trung tâm ĐMST Gia Lai | VDCD', 'VDCD đưa vào vận hành Data Center, siêu máy tính AI và 6 phòng lab chuyên ngành UAV, AI, GIS, Nông nghiệp, STEM.', TRUE, '2026-06-25T10:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, NULL, NULL, 'article-thumb-khanh-thanh-data-center-phong-lab-trung-tam-dmst-gia-lai'),
  ('c798a7bf-9038-41a8-8c80-3a025b0df0ce', 'Ứng dụng UAV/Drone trong đo đạc, lập bản đồ địa chính — VDCD triển khai thành công tại Hà Tĩnh', 'ung-dung-uav-drone-do-dac-ban-do-dia-chinh-ha-tinh', '<p>VDCD Group đã triển khai thành công công nghệ bay không người lái (UAV/Drone) trong công tác đo đạc, lập bản đồ địa chính tại xã Đồng Tiến, tỉnh Hà Tĩnh.</p><h2>Quy trình triển khai</h2><ul><li>Bay chụp ảnh hàng không bằng drone chuyên dụng</li><li>Xử lý ảnh, tạo bản đồ trực ảnh độ phân giải cao</li><li>Chiết xuất dữ liệu ranh giới thửa đất</li><li>Cung cấp bản đồ số phục vụ quản lý đất đai</li></ul><h2>Hiệu quả</h2><p>Giảm 70% thời gian khảo sát, tăng độ chính xác gấp 3 lần so với phương pháp truyền thống.</p>', 'https://picsum.photos/seed/ung-dung-uav-drone-do-dac-ban-do-dia-chinh-ha-tinh/800/500', 'Công nghệ', 'UAV,drone,đo đạc,bản đồ,địa chính,GIS,Hà Tĩnh', 'Ứng dụng UAV/Drone trong đo đạc, lập bản đồ địa chính — VDCD triển khai thành công tại Hà Tĩnh | VDCD', 'VDCD triển khai công nghệ drone đo đạc, lập bản đồ địa chính tại Hà Tĩnh — giảm 70% thời gian khảo sát.', TRUE, '2026-06-15T09:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, NULL, '9446a120-855a-4f3c-a028-e3948cfe74b5', 'article-thumb-ung-dung-uav-drone-do-dac-ban-do-dia-chinh-ha-tinh'),
  ('45894c54-3fb4-4727-8616-27092bcd1eb6', 'Sở KH&CN An Giang, Hiệp hội Doanh nghiệp tỉnh và VDCD Group ký kết hợp tác phát triển hệ sinh thái khởi nghiệp', 'so-khcn-an-giang-hiep-hoi-dn-vdcd-ky-ket-khoi-nghiep', '<p>Ngày 28/07/2026, tại TP. Long Xuyên, Sở Khoa học và Công nghệ tỉnh An Giang, Hiệp hội Doanh nghiệp tỉnh An Giang và VDCD Group chính thức ký kết hợp tác ba bên.</p><h2>Mô hình Trung tâm ĐMST</h2><p>VDCD Group đề xuất xây dựng Trung tâm Đổi mới Sáng tạo tỉnh An Giang theo hình thức xã hội hóa — 100% vốn doanh nghiệp, không sử dụng ngân sách nhà nước.</p><h2>Quy trình hỗ trợ</h2><p>Khảo sát nhu cầu → Tư vấn giải pháp → Demo thử nghiệm → Triển khai thực tế → Đào tạo vận hành.</p>', 'https://picsum.photos/seed/so-khcn-an-giang-hiep-hoi-dn-vdcd-ky-ket-khoi-nghiep/800/500', 'Sự kiện', 'An Giang,Sở KH&CN,khởi nghiệp,hệ sinh thái,ký kết', 'Sở KH&CN An Giang, Hiệp hội Doanh nghiệp tỉnh và VDCD Group ký kết hợp tác phát triển hệ sinh thái khởi nghiệp | VDCD', 'VDCD Group ký kết 3 bên với Sở KH&CN và Hiệp hội DN An Giang phát triển hệ sinh thái khởi nghiệp.', TRUE, '2026-07-28T10:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, 'a1b2c3d4-e5f6-4a7b-8c9d-012345678901', NULL, 'article-thumb-so-khcn-an-giang-hiep-hoi-dn-vdcd-ky-ket-khoi-nghiep'),
  ('35b8fd1a-bab2-4292-a18c-c68995395a74', 'VDCD Group mở rộng mô hình Trung tâm ĐMST tại Quảng Ninh, Cao Bằng và Hưng Yên', 'vdcd-mo-rong-mo-hinh-dmst-quang-ninh-cao-bang-hung-yen', '<p>Trong năm 2026, VDCD Group tiếp tục mở rộng mô hình "Trung tâm Đổi mới sáng tạo do doanh nghiệp làm chủ" ra nhiều tỉnh thành trên cả nước.</p><h2>Tiến độ triển khai</h2><ul><li><strong>Lạng Sơn (02/2026):</strong> Sở KH&CN họp xem xét đề án thành lập</li><li><strong>Hưng Yên (03/2026):</strong> Làm việc về phương án đầu tư</li><li><strong>Quảng Ninh (03/2026):</strong> Đề xuất thành lập phục vụ kinh tế biển và du lịch số</li><li><strong>Cao Bằng (07/2026):</strong> UBND tỉnh họp cho ý kiến về đề án</li></ul><p>VDCD Group hiện sở hữu hệ sinh thái với 12 trung tâm nghiên cứu chuyên sâu.</p>', 'https://picsum.photos/seed/vdcd-mo-rong-mo-hinh-dmst-quang-ninh-cao-bang-hung-yen/800/500', 'Tin tức', 'mở rộng,Quảng Ninh,Cao Bằng,Hưng Yên,Lạng Sơn,ĐMST', 'VDCD Group mở rộng mô hình Trung tâm ĐMST tại Quảng Ninh, Cao Bằng và Hưng Yên | VDCD', 'VDCD Group mở rộng mô hình Trung tâm ĐMST do doanh nghiệp làm chủ tại nhiều tỉnh thành trên cả nước.', TRUE, '2026-07-05T08:30:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, NULL, NULL, 'article-thumb-vdcd-mo-rong-mo-hinh-dmst-quang-ninh-cao-bang-hung-yen'),
  ('25f0be1e-789a-449a-86a7-aca8781acf59', 'AutoTimelapse — Giải pháp giám sát công trình thông minh 24/7 của VDCD Group', 'autotimelapse-giai-phap-giam-sat-cong-trinh-thong-minh', '<p>AutoTimelapse là giải pháp giám sát trực quan công trình 24/7 do VDCD Group phát triển.</p><h2>Tính năng nổi bật</h2><ul><li>Camera thông minh kết hợp AI — giám sát 24/7</li><li>Tự động tạo video timelapse, so sánh tiến độ thực tế với kế hoạch</li><li>Cảnh báo sớm các sai lệch về tiến độ, an toàn lao động</li><li>Dashboard quản lý trực quan — truy cập từ xa qua web và mobile</li></ul><p>Hệ thống đã được triển khai thành công trên nhiều gói thầu quan trọng của các dự án hạ tầng lớn trên cả nước.</p>', 'https://picsum.photos/seed/autotimelapse-giai-phap-giam-sat-cong-trinh-thong-minh/800/500', 'Công nghệ', 'AutoTimelapse,giám sát công trình,AI,camera thông minh,timelapse', 'AutoTimelapse — Giải pháp giám sát công trình thông minh 24/7 của VDCD Group | VDCD', 'AutoTimelapse — giải pháp giám sát trực quan công trình 24/7 bằng AI, tự động tạo timelapse và cảnh báo sớm.', TRUE, '2026-06-01T08:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', '652e4771-4d89-4968-a4d6-f72e0beded5c', NULL, '8601ae3f-e0e3-45c5-ba1c-e7de47b20abd', 'article-thumb-autotimelapse-giai-phap-giam-sat-cong-trinh-thong-minh'),
  ('9012572f-07d9-45d5-927c-367696cd1051', 'Hội thảo truyền thông chính sách khởi nghiệp sáng tạo — VDCD giới thiệu mô hình ĐMST do doanh nghiệp làm chủ', 'hoi-thao-truyen-thong-chinh-sach-khoi-nghiep-sang-tao-gia-lai', '<p>Tháng 5/2026, Sở Khoa học và Công nghệ tỉnh Gia Lai tổ chức Hội thảo truyền thông chính sách khởi nghiệp sáng tạo.</p><h2>Các giải pháp được giới thiệu</h2><ul><li>Hạ tầng dữ liệu số và bản đồ số cho quản lý đô thị</li><li>Ứng dụng AI trong nông nghiệp thông minh</li><li>Giải pháp UAV/Drone cho khảo sát và giám sát</li><li>Chương trình hỗ trợ chuyển đổi số cho doanh nghiệp SME</li></ul>', 'https://picsum.photos/seed/hoi-thao-truyen-thong-chinh-sach-khoi-nghiep-sang-tao-gia-lai/800/500', 'Sự kiện', 'hội thảo,khởi nghiệp,Sở KH&CN,Gia Lai,chính sách', 'Hội thảo truyền thông chính sách khởi nghiệp sáng tạo — VDCD giới thiệu mô hình ĐMST do doanh nghiệp làm chủ | VDCD', 'VDCD giới thiệu mô hình Trung tâm ĐMST do doanh nghiệp làm chủ tại Hội thảo chính sách khởi nghiệp Gia Lai.', TRUE, '2026-05-10T09:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, 'a1b2c3d4-e5f6-4a7b-8c9d-012345678905', NULL, 'article-thumb-hoi-thao-truyen-thong-chinh-sach-khoi-nghiep-sang-tao-gia-lai'),
  ('7e21a3c4-3c12-49b2-a23b-417f95ff0785', 'Phong trào "Bình dân học vụ số" tại Gia Lai — VDCD đồng hành cùng Tổ công nghệ số cộng đồng', 'binh-dan-hoc-vu-so-gia-lai-vdcd-to-cong-nghe-so', '<p>Trung tâm Đổi mới Sáng tạo Gia Lai (VDCD) phối hợp cùng các Tổ công nghệ số cộng đồng triển khai phong trào "Bình dân học vụ số".</p><h2>Nội dung hỗ trợ</h2><ul><li>Hướng dẫn cài đặt và sử dụng ứng dụng iGiaLai</li><li>Đăng ký tài khoản định danh điện tử (VNeID)</li><li>Sử dụng thanh toán không dùng tiền mặt qua ví điện tử, QR Code</li><li>Bảo mật thông tin cá nhân trên không gian mạng</li></ul><p>Phong trào đã tiếp cận hơn 2.000 người dân trong 3 tháng đầu, với tỷ lệ cài đặt ứng dụng thành công đạt trên 85%.</p>', 'https://picsum.photos/seed/binh-dan-hoc-vu-so-gia-lai-vdcd-to-cong-nghe-so/800/500', 'Chuyển đổi số', 'bình dân học vụ số,iGiaLai,công dân số,cộng đồng,Gia Lai', 'Phong trào "Bình dân học vụ số" tại Gia Lai — VDCD đồng hành cùng Tổ công nghệ số cộng đồng | VDCD', 'VDCD hỗ trợ hơn 2.000 người dân Gia Lai cài đặt ứng dụng số qua phong trào Bình dân học vụ số.', TRUE, '2026-04-20T08:00:00.000Z', '2026-08-31T20:04:50.107Z', '2026-08-31T20:04:50.107Z', NULL, NULL, NULL, 'article-thumb-binh-dan-hoc-vu-so-gia-lai-vdcd-to-cong-nghe-so');

COMMIT;

-- Finished successfully.
