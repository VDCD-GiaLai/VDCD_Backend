-- ==============================================================================
-- VDCD DATABASE FULL SEED DUMP
-- Exported at: 2026-09-03T16:01:24.198Z
-- Database: postgres @ localhost
-- Total tables: 16
-- Total business records: 183
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
--   article             : 11 rows
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
-- TABLE: solution (6 rows)
-- ------------------------------------------------------------------------------
INSERT INTO "solution" ("id", "title", "slug", "short_description", "content", "thumbnail", "meta_title", "meta_description", "is_published", "created_at", "updated_at", "field_id", "thumbnail_file_id", "website_url", "published_at") VALUES
  ('b1000001-0000-4000-a000-000000000001', 'UAV - Khảo sát địa hình & Đo đạc trắc địa số', 'uav', 'Ứng dụng công nghệ UAV trong đo đạc trắc địa, thành lập bản đồ số 2D/3D, hỗ trợ thiết kế san lấp và số hóa hiện trạng.', '{"blocks":[{"id":"par_intro_uav","text":"Khảo sát địa hình bằng flycam là phương pháp sử dụng máy bay không người lái (UAV) để thu thập hình ảnh và dữ liệu không gian của khu vực cần khảo sát. Dữ liệu sau đó được xử lý bằng phần mềm chuyên dụng để tạo ra các sản phẩm bản đồ hoặc mô hình phục vụ công việc. So với cách khảo sát chỉ dựa vào thiết bị đo đạc mặt đất, UAV có khả năng bao quát khu vực rộng trong thời gian tương đối ngắn. Đây là lợi thế đáng chú ý đối với những công trình có diện tích lớn hoặc địa hình phức tạp.","type":"paragraph"},{"id":"sec_uav_1","type":"section","title":"Vai trò của công nghệ UAV trong đo đạc trắc địa","number":"01","children":[{"id":"par_uav_sec_0_desc","text":"Trắc địa là lĩnh vực liên quan đến việc xác định vị trí, tọa độ, độ cao, hình dạng, kích thước và hướng của địa hình cũng như các đối tượng trên bề mặt Trái đất. Dữ liệu trắc địa là cơ sở quan trọng cho nhiều hoạt động xây dựng và quản lý đất đai.","type":"paragraph"},{"id":"img_uav_sec_0","alt":"1. Vai trò của công nghệ UAV trong đo đạc trắc địa","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/uav_don_vi_khao_sat_dia_hinh.png?tr=w-1000,q-85,f-auto","type":"image","caption":"1. Vai trò của công nghệ UAV trong đo đạc trắc địa"},{"id":"list_uav_sec_0","type":"list","items":[{"id":"item_uav_sec_0_0","content":"Nguồn dữ liệu trực quan: Khi kết hợp UAV với quy trình xử lý dữ liệu số, việc khảo sát có thể tạo ra nguồn dữ liệu trực quan hơn về hiện trạng khu vực.","children":[]},{"id":"item_uav_sec_0_1","content":"Hỗ trợ nhiều bước của dự án: Doanh nghiệp có thể sử dụng kết quả khảo sát để hỗ trợ kiểm tra diện tích, lập bản đồ, thiết kế, quy hoạch hoặc chuẩn bị dữ liệu cho các bước tiếp theo.","children":[]},{"id":"item_uav_sec_0_2","content":"Năng lực chuyên môn cao: Một đơn vị khảo sát có chuyên môn không chỉ cần thiết bị bay mà còn phải có khả năng lập kế hoạch thu thập dữ liệu, kiểm soát chất lượng và xử lý kết quả chuẩn xác.","children":[]}],"listType":"bullet"}]},{"id":"sec_uav_2","type":"section","title":"Quy trình khảo sát địa hình bằng flycam 4 bước chuẩn hóa","number":"02","children":[{"id":"par_uav_sec_1_desc","text":"Một quy trình khảo sát hiệu quả cần được xây dựng dựa trên mục tiêu sử dụng dữ liệu ngay từ đầu. Việc xác định rõ yêu cầu giúp lựa chọn thiết bị, phương án thu thập và định dạng đầu ra phù hợp.","type":"paragraph"},{"id":"img_uav_sec_1","alt":"2. Quy trình khảo sát địa hình bằng flycam 4 bước chuẩn hóa","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/uav_dich_vu_khao_sat_dia_hinh.png?tr=w-1000,q-85,f-auto","type":"image","caption":"2. Quy trình khảo sát địa hình bằng flycam 4 bước chuẩn hóa"},{"id":"list_uav_sec_1","type":"list","items":[{"id":"item_uav_sec_1_0","content":"Bước 1: Xác định mục đích và phạm vi khảo sát: Kỹ thuật viên trao đổi với chủ đầu tư để xác định mục tiêu dự án (khảo sát hiện trạng, thành lập bản đồ, thiết kế, quy hoạch hoặc xây dựng). Từ đó xác định phạm vi khu vực, loại dữ liệu cần thu thập và sản phẩm đầu ra để tối ưu chi phí.","children":[]},{"id":"item_uav_sec_1_1","content":"Bước 2: Thu thập tài liệu và thông tin khu vực: Tiếp nhận giấy tờ thửa đất, ranh giới, tài liệu thiết kế, yêu cầu tỷ lệ bản đồ và định dạng dữ liệu đầu vào trước khi triển khai.","children":[]},{"id":"item_uav_sec_1_2","content":"Bước 3: Tiến hành bay chụp và thu thập dữ liệu: Vận hành UAV theo phương án bay đã xây dựng nhằm thu thập hình ảnh và dữ liệu toàn bộ khu vực. Kỹ thuật viên kiểm soát nghiêm túc các mốc khống chế mặt đất GCP.","children":[]},{"id":"item_uav_sec_1_3","content":"Bước 4: Xử lý dữ liệu và xuất sản phẩm: Xử lý dữ liệu hình ảnh thành bản đồ số 2D, 3D, bản đồ địa hình theo tỷ lệ 1/500, 1/2.000, 1/5.000, dữ liệu ảnh VR 360 Panorama và nền tảng lưu trữ số hóa.","children":[]}],"listType":"bullet"}]},{"id":"sec_uav_3","type":"section","title":"Khi nào nên sử dụng dịch vụ khảo sát địa hình bằng flycam?","number":"03","children":[{"id":"par_uav_sec_2_desc","text":"Dịch vụ khảo sát bằng UAV phù hợp với những đơn vị cần thu thập dữ liệu địa hình nhưng chưa có đầy đủ thiết bị hoặc nhân sự chuyên môn. Thay vì đầu tư toàn bộ hệ thống, doanh nghiệp có thể thuê đơn vị chuyên nghiệp thực hiện theo từng dự án.","type":"paragraph"},{"id":"img_uav_sec_2","alt":"3. Khi nào nên sử dụng dịch vụ khảo sát địa hình bằng flycam?","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/uav_khao_sat_dia_hinh_bang_uav.png?tr=w-1400,q-85,f-auto","type":"image","caption":"3. Khi nào nên sử dụng dịch vụ khảo sát địa hình bằng flycam?"},{"id":"list_uav_sec_2","type":"list","items":[{"id":"item_uav_sec_2_0","content":"Khảo sát nhanh địa bàn rộng: Khảo sát các công trình có diện tích lớn hoặc địa hình phức tạp trong thời gian ngắn.","children":[]},{"id":"item_uav_sec_2_1","content":"Chuẩn bị dữ liệu thi công xây dựng: Hỗ trợ đắc lực công tác đánh giá mặt bằng, thiết kế san lấp và lập phương án thi công.","children":[]},{"id":"item_uav_sec_2_2","content":"Tối ưu chi phí đầu tư: Tiếp cận công nghệ đo đạc hiện đại nhất mà không cần chi phí mua sắm thiết bị tốn kém.","children":[]},{"id":"item_uav_sec_2_3","content":"Kết hợp đa thiết bị: Tích hợp máy thủy bình, máy toàn đạc điện tử, máy định vị vệ tinh GPS RTK để đáp ứng mọi yêu cầu đo đạc khắt khe.","children":[]}],"listType":"bullet"}]},{"id":"sec_uav_4","type":"section","title":"Ứng dụng của khảo sát địa hình bằng UAV tại Gia Lai","number":"04","children":[{"id":"par_uav_sec_3_desc","text":"Dữ liệu thu thập từ UAV được xử lý thành nhiều dạng sản phẩm phục vụ công tác thiết kế, quy hoạch và xây dựng:","type":"paragraph"},{"id":"img_uav_sec_3","alt":"4. Ứng dụng của khảo sát địa hình bằng UAV tại Gia Lai","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/quet_3d.png?tr=w-1000,q-85,f-auto","type":"image","caption":"4. Ứng dụng của khảo sát địa hình bằng UAV tại Gia Lai"},{"id":"list_uav_sec_3","type":"list","items":[{"id":"item_uav_sec_3_0","content":"Thành lập bản đồ địa hình: Biên tập theo các tỷ lệ 1/500, 1/2.000, 1/5.000 phục vụ nghiên cứu và đánh giá hiện trạng khu vực.","children":[]},{"id":"item_uav_sec_3_1","content":"Thành lập bản đồ số 2D: Thể hiện trực quan hiện trạng trên mặt bằng với độ phân giải siêu cao.","children":[]},{"id":"item_uav_sec_3_2","content":"Xây dựng dữ liệu không gian 3D: Tái hiện mô hình 3 chiều giúp người dùng có góc nhìn trực quan về địa hình và công trình hiện hữu.","children":[]},{"id":"item_uav_sec_3_3","content":"Hỗ trợ thiết kế và san lấp: Phân tích độ cao, tính toán khối lượng đào đắp cho các dự án san lấp và xây dựng dân dụng.","children":[]},{"id":"item_uav_sec_3_4","content":"Số hóa và lưu trữ dữ liệu: Lưu trữ trên nền tảng đám mây và xử lý hình ảnh VR 360 Panorama phục vụ tra cứu lâu dài.","children":[]}],"listType":"bullet"}]},{"id":"sec_uav_5","type":"section","title":"Trung tâm Đổi mới sáng tạo Gia Lai cung cấp những giải pháp nào?","number":"05","children":[{"id":"par_uav_sec_4_desc","text":"Trung tâm Đổi mới sáng tạo Gia Lai giới thiệu nhóm giải pháp máy bay không người lái phục vụ bay quét 3D, trắc địa số và thành lập bản đồ cho các lĩnh vực địa chính, thiết kế, san lấp, duyệt quy hoạch, xây dựng dân dụng và bảo tồn di sản.","type":"paragraph"},{"id":"img_uav_sec_4","alt":"5. Trung tâm Đổi mới sáng tạo Gia Lai cung cấp những giải pháp nào?","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/dich_vu_quet_3d.png?tr=w-1000,q-85,f-auto","type":"image","caption":"5. Trung tâm Đổi mới sáng tạo Gia Lai cung cấp những giải pháp nào?"},{"id":"list_uav_sec_4","type":"list","items":[{"id":"item_uav_sec_4_0","content":"Quét 2D - 3D bằng UAV chuyên dụng độ chính xác centimet.","children":[]},{"id":"item_uav_sec_4_1","content":"Thành lập bản đồ số 2D và mô hình không gian 3D Mesh.","children":[]},{"id":"item_uav_sec_4_2","content":"Biên tập bản đồ địa hình chuẩn mực theo tọa độ VN-2000.","children":[]},{"id":"item_uav_sec_4_3","content":"Xử lý dữ liệu hình ảnh VR 360 Panorama và nền tảng lưu trữ hiển thị số.","children":[]}],"listType":"bullet"}]},{"id":"sec_uav_6","type":"section","title":"Những yếu tố cần lưu ý khi khảo sát địa hình bằng flycam","number":"06","children":[{"id":"par_uav_sec_5_desc","text":"Các lưu ý quan trọng để đảm bảo chất lượng sản phẩm khảo sát và kiểm soát chi phí:","type":"paragraph"},{"id":"img_uav_sec_5","alt":"6. Những yếu tố cần lưu ý khi khảo sát địa hình bằng flycam","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/dich_vu_quet_3d.png?tr=w-1000,q-85,f-auto","type":"image","caption":"6. Những yếu tố cần lưu ý khi khảo sát địa hình bằng flycam"},{"id":"list_uav_sec_5","type":"list","items":[{"id":"item_uav_sec_5_0","content":"Xác định rõ mục đích sử dụng: Phục vụ quy hoạch sẽ có yêu cầu khác với thiết kế, san lấp hoặc quản lý hiện trạng.","children":[]},{"id":"item_uav_sec_5_1","content":"Lựa chọn đơn vị chuyên nghiệp: Đội ngũ có kinh nghiệm vận hành UAV, năng lực xử lý dữ liệu và cung cấp đúng định dạng đầu ra.","children":[]},{"id":"item_uav_sec_5_2","content":"Thống nhất phạm vi & Sản phẩm bàn giao: Trao đổi cụ thể từ đầu giúp chủ đầu tư dễ kiểm soát tiến độ cũng như chi phí dự án.","children":[]}],"listType":"bullet"}]},{"id":"cta_uav","url":"/contact","type":"cta","label":"Liên hệ tư vấn giải pháp"}],"version":1}'::jsonb, 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/uav_khao_sat_dia_hinh_bang_flycam.png?tr=w-800,q-85,f-auto', 'UAV - Khảo sát địa hình & Đo đạc trắc địa số | VDCD Gia Lai', 'Ứng dụng công nghệ UAV trong đo đạc trắc địa, thành lập bản đồ số 2D/3D, hỗ trợ thiết kế san lấp và số hóa hiện trạng.', TRUE, '2026-09-05T08:29:21.415Z', '2026-09-05T08:29:21.415Z', '5292c9c5-7499-4353-9430-11aa730c63d8', NULL, '/solution/uav', '2026-08-31T17:00:00.000Z'),
  ('b1000001-0000-4000-a000-000000000002', 'AI - Trung tâm Phát triển Robot & AI', 'ai', 'Nghiên cứu và ứng dụng công nghệ robot thông minh tích hợp trí tuệ nhân tạo trong giáo dục, sản xuất, logistics và dịch vụ.', '{"blocks":[{"id":"par_intro_ai","text":"Trung tâm Phát triển Robot AI là đơn vị chuyên môn tập trung vào nghiên cứu, chế tạo và ứng dụng các giải pháp tự động hóa thông minh kết hợp trí tuệ nhân tạo. Đơn vị hướng đến việc giải quyết các bài toán thực tế trong sản xuất, nông nghiệp công nghệ cao, logistics và đào tạo nhân lực công nghệ cho khu vực Tây Nguyên.","type":"paragraph"},{"id":"sec_ai_1","type":"section","title":"Mục tiêu và Định hướng phát triển Robot AI","number":"01","children":[{"id":"par_ai_sec_0_desc","text":"Trung tâm xây dựng lộ trình nghiên cứu và phát triển toàn diện:","type":"paragraph"},{"id":"img_ai_sec_0","alt":"1. Mục tiêu và Định hướng phát triển Robot AI","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/he_thong_ai.png?tr=w-1000,q-85,f-auto","type":"image","caption":"1. Mục tiêu và Định hướng phát triển Robot AI"},{"id":"list_ai_sec_0","type":"list","items":[{"id":"item_ai_sec_0_0","content":"Nghiên cứu và phát triển robot thông minh tích hợp AI: Làm chủ thiết kế cơ khí chính xác và thuật toán điều khiển nhúng.","children":[]},{"id":"item_ai_sec_0_1","content":"Xây dựng các mô hình robot phục vụ nghiên cứu và đào tạo: Cung cấp nền tảng thực hành cho học viên, sinh viên và kỹ sư.","children":[]},{"id":"item_ai_sec_0_2","content":"Nghiên cứu khả năng tương tác giữa người và robot (HMI): Nâng cao tính an toàn và tiện lợi khi làm việc cùng robot.","children":[]},{"id":"item_ai_sec_0_3","content":"Ứng dụng AI vào điều khiển và tự động hóa robot: Điều hướng thông minh, tự tránh chướng ngại vật và tối ưu quỹ đạo di chuyển.","children":[]},{"id":"item_ai_sec_0_4","content":"Thử nghiệm các giải pháp robot trong môi trường thực tế: Đưa robot vào các nhà xưởng chế biến nông sản và kho bãi.","children":[]}],"listType":"bullet"}]},{"id":"sec_ai_2","type":"section","title":"Các nhóm giải pháp Robot và Tự động hóa thông minh","number":"02","children":[{"id":"par_ai_sec_1_desc","text":"Làm chủ từ khâu thiết kế phần cứng cơ khí, mạch điều khiển đến thuật toán phần mềm:","type":"paragraph"},{"id":"img_ai_sec_1","alt":"2. Các nhóm giải pháp Robot và Tự động hóa thông minh","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/ung_dung_ai.png?tr=w-1000,q-85,f-auto","type":"image","caption":"2. Các nhóm giải pháp Robot và Tự động hóa thông minh"},{"id":"list_ai_sec_1","type":"list","items":[{"id":"item_ai_sec_1_0","content":"Xe tự hành AGV/AMR trong nhà xưởng: Định vị SLAM & LiDAR, nhận diện vật cản và tự động vận chuyển hàng hóa 24/7.","children":[]},{"id":"item_ai_sec_1_1","content":"Cánh tay robot công nghiệp: Tự động hóa các khâu gắp đặt, đóng gói, phân loại và hàn cơ khí chính xác.","children":[]},{"id":"item_ai_sec_1_2","content":"Hệ thống điều khiển tập trung Fleet Management: Giám sát lộ trình, trạng thái pin và điều phối nhiều robot cùng hoạt động tối ưu.","children":[]}],"listType":"bullet"}]},{"id":"sec_ai_3","type":"section","title":"Ứng dụng Thị giác máy tính AI và Không gian FPT AI Campus","number":"03","children":[{"id":"par_ai_sec_2_desc","text":"Môi trường kết nối đào tạo, nghiên cứu chuyên sâu và chuyển giao tri thức cho địa phương:","type":"paragraph"},{"id":"img_ai_sec_2","alt":"3. Ứng dụng Thị giác máy tính AI và Không gian FPT AI Campus","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/ai_thong_minh.png?tr=w-1400,q-85,f-auto","type":"image","caption":"3. Ứng dụng Thị giác máy tính AI và Không gian FPT AI Campus"},{"id":"list_ai_sec_2","type":"list","items":[{"id":"item_ai_sec_2_0","content":"Camera AI phân loại nông sản: Nhận diện độ chín, kích thước và phát hiện khuyết tật trên băng chuyền tự động >99%.","children":[]},{"id":"item_ai_sec_2_1","content":"Hạ tầng máy chủ GPU phục vụ huấn luyện mô hình thị giác máy tính và robot.","children":[]},{"id":"item_ai_sec_2_2","content":"Kết nối đào tạo và nghiên cứu chuyên sâu với các trường đại học, viện công nghệ hàng đầu.","children":[]}],"listType":"bullet"}]},{"id":"sec_ai_4","type":"section","title":"Chuyển giao công nghệ và Đổi mới sản xuất cho doanh nghiệp","number":"04","children":[{"id":"par_ai_sec_3_desc","text":"Đồng hành cùng doanh nghiệp địa phương trong hành trình tự động hóa chuyển đổi số:","type":"paragraph"},{"id":"img_ai_sec_3","alt":"4. Chuyển giao công nghệ và Đổi mới sản xuất cho doanh nghiệp","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/he_thong_ai.png?tr=w-1000,q-85,f-auto","type":"image","caption":"4. Chuyển giao công nghệ và Đổi mới sản xuất cho doanh nghiệp"},{"id":"list_ai_sec_3","type":"list","items":[{"id":"item_ai_sec_3_0","content":"Giải phóng sức lao động con người khỏi các khâu nặng nhọc, nguy hiểm.","children":[]},{"id":"item_ai_sec_3_1","content":"Tối ưu chi phí sản xuất và nâng cao năng lực cạnh tranh cho nông sản xuất khẩu.","children":[]},{"id":"item_ai_sec_3_2","content":"Đội ngũ kỹ sư hỗ trợ kỹ thuật tại chỗ và bảo trì dài hạn.","children":[]}],"listType":"bullet"}]},{"id":"cta_ai","url":"/contact","type":"cta","label":"Liên hệ tư vấn giải pháp"}],"version":1}'::jsonb, 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/ai_thong_minh.png?tr=w-800,q-85,f-auto', 'AI - Trung tâm Phát triển Robot & AI | VDCD Gia Lai', 'Nghiên cứu và ứng dụng công nghệ robot thông minh tích hợp trí tuệ nhân tạo trong giáo dục, sản xuất, logistics và dịch vụ.', TRUE, '2026-09-05T08:29:21.415Z', '2026-09-05T08:29:21.415Z', '5292c9c5-7499-4353-9430-11aa730c63d8', NULL, '/solution/ai', '2026-08-31T17:00:00.000Z'),
  ('b1000001-0000-4000-a000-000000000003', 'AutoTimelapse - Giám sát thông minh 24/7', 'autotimelapse', 'Hệ thống Timelapse tự động hóa giám sát tiến độ công trình, nông nghiệp và môi trường, lưu trữ và chia sẻ dữ liệu trực tuyến.', '{"blocks":[{"id":"par_intro_autotimelapse","text":"AutoTimelapse cung cấp giải pháp giám sát thông minh tiến độ xây dựng công trình, nông nghiệp và môi trường một cách tự động, trực quan. Hình ảnh độ phân giải siêu nét từ 8MP đến 61MP được đồng bộ liên tục lên nền tảng đám mây, giúp theo dõi, quản lý và truyền thông dự án hiệu quả.","type":"paragraph"},{"id":"sec_autotimelapse_1","type":"section","title":"Thiết bị Camera AutoTimelapse chuyên dụng ngoài trời","number":"01","children":[{"id":"par_autotimelapse_sec_0_desc","text":"Được thiết kế đặc thù để ghi nhận mọi biến đổi của hiện trường liên tục theo chu kỳ:","type":"paragraph"},{"id":"img_autotimelapse_sec_0","alt":"1. Thiết bị Camera AutoTimelapse chuyên dụng ngoài trời","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/camera_timelapse_tu_dong.png?tr=w-1000,q-85,f-auto","type":"image","caption":"1. Thiết bị Camera AutoTimelapse chuyên dụng ngoài trời"},{"id":"list_autotimelapse_sec_0","type":"list","items":[{"id":"item_autotimelapse_sec_0_0","content":"Độ phân giải siêu nét từ 8MP đến 61MP: Đảm bảo hình ảnh sắc nét, phóng to không vỡ hạt, quan sát chi tiết biển số xe và từng hạng mục thi công.","children":[]},{"id":"item_autotimelapse_sec_0_1","content":"Chống chịu thời tiết khắc nghiệt: Chuẩn IP67 chống nước, chống bụi, chịu nhiệt độ cao và mưa bão dài ngày.","children":[]}],"listType":"bullet"}]},{"id":"sec_autotimelapse_2","type":"section","title":"Vận hành độc lập bằng Pin năng lượng mặt trời Solar & 4G/5G","number":"02","children":[{"id":"par_autotimelapse_sec_1_desc","text":"Hoàn hảo cho các dự án mới khởi công, vùng sâu vùng xa nơi chưa có lưới điện và internet:","type":"paragraph"},{"id":"img_autotimelapse_sec_1","alt":"2. Vận hành độc lập bằng Pin năng lượng mặt trời Solar & 4G/5G","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/he_thong_timelapse_tu_dong.png?tr=w-1000,q-85,f-auto","type":"image","caption":"2. Vận hành độc lập bằng Pin năng lượng mặt trời Solar & 4G/5G"},{"id":"list_autotimelapse_sec_1","type":"list","items":[{"id":"item_autotimelapse_sec_1_0","content":"Không cần kéo dây nguồn hay cáp mạng: Tích hợp tấm pin Solar và ắc quy Lithium dung lượng lớn hoạt động bền bỉ nhiều ngày mưa.","children":[]},{"id":"item_autotimelapse_sec_1_1","content":"Truyền dữ liệu tự động lên Cloud: Dữ liệu ảnh được mã hóa và tải lên máy chủ ngay sau khi chụp.","children":[]}],"listType":"bullet"}]},{"id":"sec_autotimelapse_3","type":"section","title":"Tự động chiết xuất Video Timelapse 4K/8K & Nền tảng điều hành","number":"03","children":[{"id":"par_autotimelapse_sec_2_desc","text":"Tua nhanh quá trình thi công qua nhiều tháng/năm chỉ trong một thước phim ấn tượng vài phút:","type":"paragraph"},{"id":"img_autotimelapse_sec_2","alt":"3. Tự động chiết xuất Video Timelapse 4K/8K & Nền tảng điều hành","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/dich_vu_auto_timelapse.png?tr=w-1400,q-85,f-auto","type":"image","caption":"3. Tự động chiết xuất Video Timelapse 4K/8K & Nền tảng điều hành"},{"id":"list_autotimelapse_sec_2","type":"list","items":[{"id":"item_autotimelapse_sec_2_0","content":"Tư liệu truyền thông đắt giá: Phục vụ báo cáo ban lãnh đạo, nhà đầu tư và quảng bá dự án trên mạng xã hội.","children":[]},{"id":"item_autotimelapse_sec_2_1","content":"Theo dõi đa điểm cầu trên Web/App: Ban quản lý có thể xem trực tuyến nhiều dự án cùng lúc từ bất kỳ đâu.","children":[]},{"id":"item_autotimelapse_sec_2_2","content":"Lưu trữ dữ liệu lịch sử không thể thay đổi: Cung cấp bằng chứng khách quan giải quyết tranh chấp tiến độ.","children":[]}],"listType":"bullet"}]},{"id":"sec_autotimelapse_4","type":"section","title":"Ứng dụng đa lĩnh vực của hệ thống AutoTimelapse","number":"04","children":[{"id":"par_autotimelapse_sec_3_desc","text":"Giải pháp linh hoạt phục vụ nhiều nhu cầu giám sát chuyên sâu:","type":"paragraph"},{"id":"img_autotimelapse_sec_3","alt":"4. Ứng dụng đa lĩnh vực của hệ thống AutoTimelapse","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/timelapse_tu_dong.png?tr=w-1000,q-85,f-auto","type":"image","caption":"4. Ứng dụng đa lĩnh vực của hệ thống AutoTimelapse"},{"id":"list_autotimelapse_sec_3","type":"list","items":[{"id":"item_autotimelapse_sec_3_0","content":"Giám sát công trình xây dựng: Theo dõi tiến độ móng, cọc, kết cấu và an toàn lao động.","children":[]},{"id":"item_autotimelapse_sec_3_1","content":"Nông nghiệp thông minh: Ghi lại chu kỳ sinh trưởng cây trồng, tích hợp mã QR truy xuất nguồn gốc bằng video.","children":[]},{"id":"item_autotimelapse_sec_3_2","content":"Giám sát an ninh và trật tự công cộng: Kết hợp cảm biến chuyển động cảnh báo xâm nhập trái phép.","children":[]}],"listType":"bullet"}]},{"id":"cta_autotimelapse","url":"/contact","type":"cta","label":"Liên hệ tư vấn giải pháp"}],"version":1}'::jsonb, 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/auto_timelapse_camera.png?tr=w-800,q-85,f-auto', 'AutoTimelapse - Giám sát thông minh 24/7 | VDCD Gia Lai', 'Hệ thống Timelapse tự động hóa giám sát tiến độ công trình, nông nghiệp và môi trường, lưu trữ và chia sẻ dữ liệu trực tuyến.', TRUE, '2026-09-05T08:29:21.415Z', '2026-09-05T08:29:21.415Z', '5292c9c5-7499-4353-9430-11aa730c63d8', NULL, '/solution/autotimelapse', '2026-08-31T17:00:00.000Z'),
  ('b1000001-0000-4000-a000-000000000004', 'VR360 - Không gian số trực quan & Scan 3D', 'vr360', 'Số hóa không gian thực tế 360 độ kết hợp quét laser 3D phục vụ quản lý hiện trường, xúc tiến du lịch và bảo tồn di sản.', '{"blocks":[{"id":"par_intro_vr360","text":"Dịch vụ VR360 và Scan 3D của VDCD Gia Lai ứng dụng công nghệ chụp ảnh toàn cảnh 360 độ trên không và mặt đất kết hợp công nghệ quét laser 3D độ chính xác cao. Giải pháp giúp số hóa toàn diện hiện trạng công trình, di tích lịch sử, bảo tàng và danh lam thắng cảnh, phục vụ hiệu quả cho xúc tiến du lịch, quy hoạch không gian và bảo tồn di sản văn hóa dân tộc.","type":"paragraph"},{"id":"sec_vr360_1","type":"section","title":"Tour thực tế ảo VR360 tương tác đa điểm","number":"01","children":[{"id":"par_vr360_sec_0_desc","text":"Tái hiện không gian thực tế sống động, cho phép người dùng tự do tham quan khám phá từ xa:","type":"paragraph"},{"id":"img_vr360_sec_0","alt":"1. Tour thực tế ảo VR360 tương tác đa điểm","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/scan_3d_cong_nghe_cao.png?tr=w-1000,q-85,f-auto","type":"image","caption":"1. Tour thực tế ảo VR360 tương tác đa điểm"},{"id":"list_vr360_sec_0","type":"list","items":[{"id":"item_vr360_sec_0_0","content":"Góc nhìn toàn cảnh 360 độ trên không bằng Flycam và mặt đất bằng máy ảnh chuyên dụng.","children":[]},{"id":"item_vr360_sec_0_1","content":"Hotspot tương tác thông minh: Chèn văn bản thuyết minh, âm thanh hướng dẫn, video clip, hình ảnh lịch sử và liên kết đặt dịch vụ.","children":[]},{"id":"item_vr360_sec_0_2","content":"Trải nghiệm mượt mà trên mọi thiết bị: Tương thích hoàn hảo với Smartphone, Tablet, PC và kính thực tế ảo VR.","children":[]}],"listType":"bullet"}]},{"id":"sec_vr360_2","type":"section","title":"Dịch vụ Scan vật thể 3D chính xác & Bảo tồn di sản","number":"02","children":[{"id":"par_vr360_sec_1_desc","text":"Quét 3D chi tiết từng milimet các cổ vật, hiện vật bảo tàng, tượng đài và công trình kiến trúc cổ:","type":"paragraph"},{"id":"img_vr360_sec_1","alt":"2. Dịch vụ Scan vật thể 3D chính xác & Bảo tồn di sản","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/scan_3d_chinh_xac.png?tr=w-1000,q-85,f-auto","type":"image","caption":"2. Dịch vụ Scan vật thể 3D chính xác & Bảo tồn di sản"},{"id":"list_vr360_sec_1","type":"list","items":[{"id":"item_vr360_sec_1_0","content":"Tái hiện mô hình 3D chân thực: Xem cận cảnh từng hoa văn, chi tiết điêu khắc và cấu trúc vật liệu.","children":[]},{"id":"item_vr360_sec_1_1","content":"Lưu trữ dữ liệu số vĩnh viễn: Phục vụ công tác nghiên cứu khoa học, trùng tu phục dựng khi có sự cố thiên tai.","children":[]},{"id":"item_vr360_sec_1_2","content":"Xuất định dạng chuẩn 3D: Dễ dàng tích hợp vào nền tảng Web 3D, Metaverse và in 3D hiện vật.","children":[]}],"listType":"bullet"}]},{"id":"sec_vr360_3","type":"section","title":"Bản đồ số du lịch thông minh và Xúc tiến điểm đến","number":"03","children":[{"id":"par_vr360_sec_2_desc","text":"Số hóa hệ sinh thái du lịch Gia Lai, kết nối các điểm danh lam thắng cảnh và di tích lịch sử.","type":"paragraph"},{"id":"img_vr360_sec_2","alt":"3. Bản đồ số du lịch thông minh và Xúc tiến điểm đến","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/dich_vu_scan_3d.png?tr=w-1400,q-85,f-auto","type":"image","caption":"3. Bản đồ số du lịch thông minh và Xúc tiến điểm đến"},{"id":"list_vr360_sec_2","type":"list","items":[{"id":"item_vr360_sec_2_0","content":"Quảng bá du lịch Gia Lai trên phạm vi toàn cầu không giới hạn khoảng cách địa lý.","children":[]},{"id":"item_vr360_sec_2_1","content":"Tăng cường thu hút du khách và tạo dấu ấn chuyển đổi số ngành văn hóa - du lịch.","children":[]},{"id":"item_vr360_sec_2_2","content":"Tích hợp chỉ đường thông minh và thông tin ẩm thực, lưu trú địa phương.","children":[]}],"listType":"bullet"}]},{"id":"sec_vr360_4","type":"section","title":"Trực quan hóa không gian quy hoạch kiến trúc 3D","number":"04","children":[{"id":"par_vr360_sec_3_desc","text":"Trình chiếu các dự án bất động sản, khu đô thị và không gian triển lãm ảo:","type":"paragraph"},{"id":"img_vr360_sec_3","alt":"4. Trực quan hóa không gian quy hoạch kiến trúc 3D","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/quet_3d.png?tr=w-1000,q-85,f-auto","type":"image","caption":"4. Trực quan hóa không gian quy hoạch kiến trúc 3D"},{"id":"list_vr360_sec_3","type":"list","items":[{"id":"item_vr360_sec_3_0","content":"Giúp các nhà đầu tư và người mua nhà hình dung rõ ràng không gian trước khi xây dựng.","children":[]},{"id":"item_vr360_sec_3_1","content":"Tối ưu chi phí bán hàng và tiếp thị dự án bất động sản từ xa.","children":[]}],"listType":"bullet"}]},{"id":"cta_vr360","url":"/contact","type":"cta","label":"Liên hệ tư vấn giải pháp"}],"version":1}'::jsonb, 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/scan_3d.png?tr=w-800,q-85,f-auto', 'VR360 - Không gian số trực quan & Scan 3D | VDCD Gia Lai', 'Số hóa không gian thực tế 360 độ kết hợp quét laser 3D phục vụ quản lý hiện trường, xúc tiến du lịch và bảo tồn di sản.', TRUE, '2026-09-05T08:29:21.415Z', '2026-09-05T08:29:21.415Z', '5292c9c5-7499-4353-9430-11aa730c63d8', NULL, '/solution/vr360', '2026-08-31T17:00:00.000Z'),
  ('b1000001-0000-4000-a000-000000000005', 'SmartScale - Trạm cân thông minh', 'smartscale', 'Số hóa quy trình cân xe, tự động nhận diện biển số, ghi nhận trọng lượng và quản lý dữ liệu tập trung chống gian lận.', '{"blocks":[{"id":"par_intro_smartscale","text":"SmartScale là giải pháp toàn diện giúp số hóa quy trình cân xe tại các mỏ khoáng sản, nhà máy chế biến nông sản, khu công nghiệp và trạm thu gom vật tư. Hệ thống vận hành dựa trên sự phối hợp giữa thiết bị cân, camera AI nhận diện biển số đa góc và phần mềm quản lý tập trung trên Web/App, loại bỏ hoàn toàn các rủi ro gian lận và sai sót thủ công.","type":"paragraph"},{"id":"sec_smartscale_1","type":"section","title":"SmartScale hoạt động như thế nào? Quy trình cân tự động 5 bước","number":"01","children":[{"id":"par_smartscale_sec_0_desc","text":"Quy trình khép kín tự động hóa hoàn toàn chỉ trong vài giây:","type":"paragraph"},{"id":"img_smartscale_sec_0","alt":"1. SmartScale hoạt động như thế nào? Quy trình cân tự động 5 bước","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/smart_scale_thong_minh.png?tr=w-1000,q-85,f-auto","type":"image","caption":"1. SmartScale hoạt động như thế nào? Quy trình cân tự động 5 bước"},{"id":"list_smartscale_sec_0","type":"list","items":[{"id":"item_smartscale_sec_0_0","content":"Xe đi vào khu vực cân: Cảm biến phát hiện phương tiện tiếp cận bàn cân.","children":[]},{"id":"item_smartscale_sec_0_1","content":"Camera AI nhận diện biển số: Tự động quét và đọc chính xác biển số xe trong 1 giây.","children":[]},{"id":"item_smartscale_sec_0_2","content":"Hệ thống camera giám sát vị trí xe: 4 camera chụp đồng thời biển số trước, sau, thùng xe và cabin.","children":[]},{"id":"item_smartscale_sec_0_3","content":"Cân tải trọng và khóa số liệu: Tự động ghi nhận khối lượng khi xe đứng yên đúng tâm cân.","children":[]},{"id":"item_smartscale_sec_0_4","content":"Xuất phiếu điện tử và lưu trữ Cloud: Đồng bộ dữ liệu tức thì lên hệ thống quản lý tập trung.","children":[]}],"listType":"bullet"}]},{"id":"sec_smartscale_2","type":"section","title":"Bộ 4 Camera giám sát chống gian lận toàn diện","number":"02","children":[{"id":"par_smartscale_sec_1_desc","text":"Loại bỏ triệt để các hành vi gian lận tải trọng và thất thoát hàng hóa:","type":"paragraph"},{"id":"img_smartscale_sec_1","alt":"2. Bộ 4 Camera giám sát chống gian lận toàn diện","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/smart_scale_cong_nghiep.png?tr=w-1000,q-85,f-auto","type":"image","caption":"2. Bộ 4 Camera giám sát chống gian lận toàn diện"},{"id":"list_smartscale_sec_1","type":"list","items":[{"id":"item_smartscale_sec_1_0","content":"Cảnh báo xe đỗ sai vị trí trên bàn cân (chân bánh đè mép cân làm giảm số cân).","children":[]},{"id":"item_smartscale_sec_1_1","content":"Cảnh báo lệch trọng lượng bì (Tare weight) bất thường so với lịch sử.","children":[]},{"id":"item_smartscale_sec_1_2","content":"Kiểm tra hình ảnh thùng hàng và đảm bảo tài xế đúng quy định.","children":[]}],"listType":"bullet"}]},{"id":"sec_smartscale_3","type":"section","title":"Quản lý tập trung qua Web/App và Liên thông ERP","number":"03","children":[{"id":"par_smartscale_sec_2_desc","text":"Giám đốc và quản lý theo dõi doanh thu và sản lượng mọi lúc mọi nơi:","type":"paragraph"},{"id":"img_smartscale_sec_2","alt":"3. Quản lý tập trung qua Web/App và Liên thông ERP","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/smart_scale_doanh_nghiep.png?tr=w-1400,q-85,f-auto","type":"image","caption":"3. Quản lý tập trung qua Web/App và Liên thông ERP"},{"id":"list_smartscale_sec_2","type":"list","items":[{"id":"item_smartscale_sec_2_0","content":"Theo dõi sản lượng và doanh thu từng trạm cân trên điện thoại di động theo thời gian thực.","children":[]},{"id":"item_smartscale_sec_2_1","content":"Tự động xuất phiếu cân điện tử, xuất hóa đơn và đối soát dữ liệu với phần mềm kế toán.","children":[]},{"id":"item_smartscale_sec_2_2","content":"Minh bạch dữ liệu nộp thuế tài nguyên và thanh tra nhà nước.","children":[]}],"listType":"bullet"}]},{"id":"sec_smartscale_4","type":"section","title":"Kinh nghiệm lựa chọn giải pháp SmartScale tại Gia Lai phù hợp","number":"04","children":[{"id":"par_smartscale_sec_3_desc","text":"Tư vấn cấu hình tối ưu chi phí và đáp ứng đúng nhu cầu vận hành thực tế:","type":"paragraph"},{"id":"img_smartscale_sec_3","alt":"4. Kinh nghiệm lựa chọn giải pháp SmartScale tại Gia Lai phù hợp","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/smart_scale_can_dien_tu.png?tr=w-1000,q-85,f-auto","type":"image","caption":"4. Kinh nghiệm lựa chọn giải pháp SmartScale tại Gia Lai phù hợp"},{"id":"list_smartscale_sec_3","type":"list","items":[{"id":"item_smartscale_sec_3_0","content":"Xác định lưu lượng xe: Lựa chọn cấu hình tốc độ cao cho các mỏ hoặc trạm có mật độ xe lớn.","children":[]},{"id":"item_smartscale_sec_3_1","content":"Kiểm tra độ phù hợp của bàn cân: Tương thích với các kích thước xe tải, xe container và điều kiện môi trường mỏ.","children":[]},{"id":"item_smartscale_sec_3_2","content":"Khả năng mở rộng và dịch vụ bảo trì kỹ thuật tại chỗ 24/7.","children":[]}],"listType":"bullet"}]},{"id":"cta_smartscale","url":"/contact","type":"cta","label":"Liên hệ tư vấn giải pháp"}],"version":1}'::jsonb, 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/smart_scale_can_dien_tu.png?tr=w-800,q-85,f-auto', 'SmartScale - Trạm cân thông minh | VDCD Gia Lai', 'Số hóa quy trình cân xe, tự động nhận diện biển số, ghi nhận trọng lượng và quản lý dữ liệu tập trung chống gian lận.', TRUE, '2026-09-05T08:29:21.415Z', '2026-09-05T08:29:21.415Z', '5292c9c5-7499-4353-9430-11aa730c63d8', NULL, '/solution/smartscale', '2026-08-31T17:00:00.000Z'),
  ('b1000001-0000-4000-a000-000000000006', 'Data Center - Siêu máy tính & Đào tạo AI', 'data-center', 'Hạ tầng tính toán hiệu năng cao HPC, nghiên cứu AI, đào tạo nhân lực và dịch vụ Colocation cho doanh nghiệp vùng.', '{"blocks":[{"id":"par_intro_data-center","text":"Trung tâm Dữ liệu Siêu máy tính và Đào tạo AI VDCD tập trung phát triển nền tảng hạ tầng phục vụ các nhu cầu lưu trữ, xử lý dữ liệu lớn, tính toán hiệu năng cao (HPC) và đào tạo nguồn nhân lực công nghệ thông tin chuyên sâu. Đây là hạ tầng nền tảng quan trọng phục vụ chương trình chuyển đổi số của tỉnh Gia Lai và khu vực Tây Nguyên.","type":"paragraph"},{"id":"sec_data-center_1","type":"section","title":"Data Center là gì? Hạ tầng dữ liệu và Năng lực tính toán HPC","number":"01","children":[{"id":"par_data-center_sec_0_desc","text":"Cơ sở hạ tầng chuyên biệt vận hành liên tục 24/7/365 với các tiêu chuẩn an toàn cao nhất:","type":"paragraph"},{"id":"img_data-center_sec_0","alt":"1. Data Center là gì? Hạ tầng dữ liệu và Năng lực tính toán HPC","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/data_center.png?tr=w-1000,q-85,f-auto","type":"image","caption":"1. Data Center là gì? Hạ tầng dữ liệu và Năng lực tính toán HPC"},{"id":"list_data-center_sec_0","type":"list","items":[{"id":"item_data-center_sec_0_0","content":"Hệ thống tủ Rack máy chủ tiêu chuẩn quốc tế: Bố trí luồng khí lạnh/nóng tối ưu tản nhiệt cho các cụm máy chủ mật độ cao.","children":[]},{"id":"item_data-center_sec_0_1","content":"Nguồn điện dự phòng kép UPS & Máy phát diesel: Đảm bảo độ sẵn sàng dịch vụ đạt 99.98%, không bị gián đoạn nguồn điện.","children":[]},{"id":"item_data-center_sec_0_2","content":"An ninh bảo mật đa tầng: Kiểm soát ra vào bằng sinh trắc học, camera giám sát 24/7 và hệ thống PCCC khí sạch FM-200.","children":[]}],"listType":"bullet"}]},{"id":"sec_data-center_2","type":"section","title":"Cụm Siêu máy tính phục vụ huấn luyện AI và Xử lý dữ liệu lớn","number":"02","children":[{"id":"par_data-center_sec_1_desc","text":"Năng lực tính toán cực lớn phục vụ các bài toán phức tạp:","type":"paragraph"},{"id":"img_data-center_sec_1","alt":"2. Cụm Siêu máy tính phục vụ huấn luyện AI và Xử lý dữ liệu lớn","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/trung_tam_du_lieu_data_center.png?tr=w-1000,q-85,f-auto","type":"image","caption":"2. Cụm Siêu máy tính phục vụ huấn luyện AI và Xử lý dữ liệu lớn"},{"id":"list_data-center_sec_1","type":"list","items":[{"id":"item_data-center_sec_1_0","content":"Xây dựng mô hình học máy (Machine Learning) và học sâu (Deep Learning).","children":[]},{"id":"item_data-center_sec_1_1","content":"Nhận diện và xử lý hình ảnh viễn thám, bản đồ không gian 3D GIS.","children":[]},{"id":"item_data-center_sec_1_2","content":"Xử lý ngôn ngữ tự nhiên và phát triển các giải pháp đô thị thông minh.","children":[]},{"id":"item_data-center_sec_1_3","content":"Dự báo xu hướng kinh tế - xã hội và hỗ trợ doanh nghiệp chuyển đổi số.","children":[]}],"listType":"bullet"}]},{"id":"sec_data-center_3","type":"section","title":"Vai trò trong Hệ sinh thái Công nghệ số & Đào tạo Nhân lực","number":"03","children":[{"id":"par_data-center_sec_2_desc","text":"Một trung tâm kết hợp giữa hạ tầng tính toán hiện đại và đào tạo nhân lực thực chiến:","type":"paragraph"},{"id":"img_data-center_sec_2","alt":"3. Vai trò trong Hệ sinh thái Công nghệ số & Đào tạo Nhân lực","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/trung_tam_du_lieu.png?tr=w-1400,q-85,f-auto","type":"image","caption":"3. Vai trò trong Hệ sinh thái Công nghệ số & Đào tạo Nhân lực"},{"id":"list_data-center_sec_2","type":"list","items":[{"id":"item_data-center_sec_2_0","content":"Đào tạo kỹ sư Trí tuệ Nhân tạo, Khoa học Dữ liệu và Xử lý Không gian thực tế.","children":[]},{"id":"item_data-center_sec_2_1","content":"Tạo môi trường thực hành trực tiếp trên cụm máy chủ GPU mạnh mẽ.","children":[]},{"id":"item_data-center_sec_2_2","content":"Cầu nối cung ứng nguồn nhân lực công nghệ cao cho thị trường lao động.","children":[]}],"listType":"bullet"}]},{"id":"sec_data-center_4","type":"section","title":"Dịch vụ Colocation & Trung tâm Điều phối Dữ liệu Vùng","number":"04","children":[{"id":"par_data-center_sec_3_desc","text":"Cho thuê chỗ đặt máy chủ và lưu trữ đám mây an toàn cho doanh nghiệp:","type":"paragraph"},{"id":"img_data-center_sec_3","alt":"4. Dịch vụ Colocation & Trung tâm Điều phối Dữ liệu Vùng","url":"https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/data_center_viet_nam.png?tr=w-1000,q-85,f-auto","type":"image","caption":"4. Dịch vụ Colocation & Trung tâm Điều phối Dữ liệu Vùng"},{"id":"list_data-center_sec_3","type":"list","items":[{"id":"item_data-center_sec_3_0","content":"Tiết kiệm chi phí đầu tư phòng máy chủ riêng cho các doanh nghiệp và tổ chức.","children":[]},{"id":"item_data-center_sec_3_1","content":"Trung tâm liên thông và lưu trữ dữ liệu đất đai, đô thị thông minh, nông nghiệp và môi trường.","children":[]}],"listType":"bullet"}]},{"id":"cta_data-center","url":"/contact","type":"cta","label":"Liên hệ tư vấn giải pháp"}],"version":1}'::jsonb, 'https://ik.imagekit.io/po0s6zxoj/vdcd/solutions/hd_images/data_center_viet_nam.png?tr=w-800,q-85,f-auto', 'Data Center - Siêu máy tính & Đào tạo AI | VDCD Gia Lai', 'Hạ tầng tính toán hiệu năng cao HPC, nghiên cứu AI, đào tạo nhân lực và dịch vụ Colocation cho doanh nghiệp vùng.', TRUE, '2026-09-05T08:29:21.415Z', '2026-09-05T08:29:21.415Z', '5292c9c5-7499-4353-9430-11aa730c63d8', NULL, '/solution/data-center', '2026-08-31T17:00:00.000Z');


