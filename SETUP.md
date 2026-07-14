# Hướng dẫn Cài đặt & Khởi chạy Dự án (Setup Guide)

Tài liệu này hướng dẫn chi tiết cách cài đặt và khởi chạy dự án VDCD Backend ở môi trường local development và Docker.

---

## 📌 Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Node.js**: Phiên bản **>= 22** (Khuyến nghị sử dụng các công cụ quản lý phiên bản Node như `nvm` hoặc `fnm`).
- **PNPM**: Phiên bản **>= 9.x** (Công cụ quản lý package thay thế npm/yarn). Bạn có thể kích hoạt bằng lệnh:
  ```bash
  corepack enable
  corepack prepare pnpm@9.15.4 --activate
  ```
- **PostgreSQL**: Phiên bản **15** (Hoặc chạy thông qua Docker).
- **Redis**: Phiên bản **7** (Hoặc chạy thông qua Docker).

---

## 🛠️ Bước 1: Cấu hình Môi trường (Environment Configuration)

Dự án sử dụng các file môi trường khác nhau tùy thuộc vào chế độ chạy. Để cấu hình cho development:

1. Tạo file `.env.development` bằng cách sao chép từ file [.env.example](.env.example):
   ```bash
   cp .env.example .env.development
   ```

2. Mở file `.env.development` và cấu hình các biến môi trường phù hợp với hệ thống của bạn:

| Biến môi trường | Giá trị mặc định | Mô tả |
| :--- | :--- | :--- |
| **App** | | |
| `NODE_ENV` | `development` | Môi trường hoạt động (`development`, `production`) |
| `PORT` | `3001` | Cổng chạy ứng dụng NestJS |
| **Database** | | |
| `DB_HOST` | `localhost` | Địa chỉ máy chủ PostgreSQL |
| `DB_PORT` | `5432` | Cổng kết nối PostgreSQL |
| `DB_NAME` | `vdcd_db` | Tên Database cho ứng dụng |
| `DB_USER` | `vdcd_user` | Tài khoản đăng nhập DB |
| `DB_PASSWORD` | | Mật khẩu đăng nhập DB |
| **JWT** | | |
| `JWT_SECRET` | *(Bắt buộc)* | Key bí mật để mã hóa Access Token |
| `JWT_EXPIRES_IN` | `15m` | Thời gian hết hạn của Access Token |
| `JWT_REFRESH_SECRET`| *(Bắt buộc)* | Key bí mật để mã hóa Refresh Token |
| `JWT_REFRESH_EXPIRES_IN`| `7d` | Thời gian hết hạn của Refresh Token |
| **Mail (SMTP)** | | |
| `MAIL_HOST` | `smtp.gmail.com` | Máy chủ SMTP gửi mail |
| `MAIL_PORT` | `587` | Cổng SMTP |
| `MAIL_SECURE` | `false` | Sử dụng SSL/TLS (`true`/`false`) |
| `MAIL_USER` | | Tài khoản email gửi |
| `MAIL_PASSWORD` | | Mật khẩu ứng dụng (App Password) gửi email |
| `MAIL_FROM` | `"VDCD <noreply@vdcd.vn>"`| Tên & Email người gửi hiển thị |
| `MAIL_ADMIN` | `admin@vdcd.vn` | Địa chỉ email nhận thông báo của Admin |
| `ADMIN_URL` | `http://localhost:3002` | Địa chỉ trang quản trị Admin (Frontend) |
| **CORS** | | |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:3002` | Danh sách domain được phép gọi API (phân tách bởi dấu phẩy) |
| **Redis** | | |
| `REDIS_HOST` | `localhost` | Địa chỉ máy chủ Redis |
| `REDIS_PORT` | `6379` | Cổng kết nối Redis |
| `REDIS_PASSWORD` | | Mật khẩu Redis (nếu có) |
| **ImageKit** | | |
| `IMAGEKIT_PUBLIC_KEY` | *(Cần điền)* | Public key từ tài khoản ImageKit |
| `IMAGEKIT_PRIVATE_KEY`| *(Cần điền)* | Private key từ tài khoản ImageKit |
| `IMAGEKIT_URL_ENDPOINT`| `https://ik.imagekit.io/your_id` | Đường dẫn CDN endpoint của ImageKit |

---

## 📦 Bước 2: Cài đặt Dependencies

Tại thư mục gốc của dự án, chạy lệnh sau để cài đặt các packages:
```bash
pnpm install
```

---

## 💾 Bước 3: Chạy Cơ sở dữ liệu & Redis

Bạn có thể khởi chạy nhanh các dịch vụ phụ trợ như PostgreSQL và Redis thông qua Docker:

```bash
# Khởi động PostgreSQL và Redis dưới nền
docker compose up -d postgres redis
```

*Lưu ý:*
- Container PostgreSQL (`vdcd-postgres`) sẽ tự động tạo cơ sở dữ liệu `vdcd_db` (hoặc tên theo `DB_NAME` bạn đặt trong `.env.development`).
- Docker container cũng sẽ thực thi file schema ban đầu từ thư mục `./docs/vdcd_schema.sql` ở lần chạy đầu tiên.

---

## 🔄 Bước 4: Chạy Migration và Seed dữ liệu

Khi cơ sở dữ liệu đã hoạt động, bạn cần khởi tạo các bảng và dữ liệu mẫu:

1. **Chạy các migration để dựng cấu trúc database:**
   ```bash
   pnpm run migration:run
   ```

2. **Khởi tạo dữ liệu mẫu (Seeding):**
   ```bash
   pnpm run seed
   ```
   *Lệnh này sẽ tự động tạo các bản ghi cơ bản (như tài khoản admin, cấu hình hệ thống ban đầu, v.v.).*

---

## 🚀 Bước 5: Khởi chạy Ứng dụng Backend

### Cách 1: Chạy trực tiếp trên môi trường Local (Khuyến nghị cho Development)
```bash
pnpm run start:dev
```
- Dự án sẽ được biên dịch và chạy ở chế độ **watch mode** (tự động reload khi code thay đổi).
- Mặc định API chạy tại: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- Swagger Documentation (Tài liệu API): [http://localhost:3001/api/docs](http://localhost:3001/api/docs) (Chỉ khả dụng trong chế độ Development).

### Cách 2: Chạy toàn bộ hệ thống bằng Docker Compose (Bao gồm cả Backend)
Nếu bạn muốn chạy ứng dụng và toàn bộ dịch vụ trong Docker, hãy chạy:
```bash
docker compose up --build
```
*Lệnh này sử dụng file [docker-compose.yaml](docker-compose.yaml) để build ứng dụng Backend từ [Dockerfile](Dockerfile) ở stage `deps` và mount mã nguồn hiện tại vào container để hỗ trợ hot-reload.*

---

## 🧪 Chạy Kiểm thử (Testing)

Dự án đi kèm các bộ test đơn vị (Unit test) và kiểm thử tích hợp (End-to-End test):

```bash
# Chạy Unit Tests
pnpm run test

# Chạy Unit Tests ở chế độ watch
pnpm run test:watch

# Chạy End-to-End (E2E) Tests
pnpm run test:e2e

# Xem độ phủ kiểm thử (Test Coverage)
pnpm run test:cov
```

---

## 🛠️ Các Lệnh Tiện ích khác cho Nhà phát triển

### 1. Quản lý Database Migrations (TypeORM)
- **Tạo migration mới tự động** (sau khi bạn sửa đổi hoặc thêm mới Entity trong mã nguồn):
  ```bash
  pnpm run migration:generate -- src/database/migrations/<TenMigration>
  ```
- **Chạy các migration chưa được áp dụng:**
  ```bash
  pnpm run migration:run
  ```
- **Hoàn tác (revert) migration gần nhất:**
  ```bash
  pnpm run migration:revert
  ```
- **Xem danh sách và trạng thái các migration:**
  ```bash
  pnpm run migration:show
  ```

### 2. Linting & Formatting
Dự án được tích hợp công cụ đảm bảo chất lượng mã nguồn:
- **Tự động format code** bằng Prettier:
  ```bash
  pnpm run format
  ```
- **Kiểm tra lỗi cú pháp và quy chuẩn viết code** bằng ESLint:
  ```bash
  pnpm run lint
  ```
- **Husky & Lint-staged**: Được thiết lập để tự động chạy kiểm tra lint và format khi bạn commit code qua git.

---

## ⚠️ Giải quyết một số lỗi thường gặp (Troubleshooting)

1. **Lỗi kết nối PostgreSQL / Redis trong Docker:**
   - Đảm bảo các cổng `5432` và `6379` trên máy local không bị chiếm dụng bởi các service cài đặt trực tiếp khác (ví dụ: Local PostgreSQL service chạy nền trên Windows).
   - Nếu bị chiếm dụng, bạn có thể thay đổi port mapping trong file [docker-compose.yaml](docker-compose.yaml) hoặc tắt các service cục bộ đó.

2. **Lỗi `ERR_EMPTY_RESPONSE` hoặc không thể kết nối tới localhost từ trình duyệt:**
   - Hãy chắc chắn rằng bạn cấu hình đúng `CORS_ORIGINS` trong `.env.development` để khớp với URL của client (Frontend).
   - Kiểm tra log container: `docker compose logs -f backend` hoặc `docker logs vdcd-backend-dev` để xem chi tiết lỗi.

3. **Cập nhật package mới:**
   - Khi có sự thay đổi trong [package.json](package.json), vui lòng chạy `pnpm install` thay vì `npm install` để tránh làm hỏng cấu trúc lockfile của pnpm (`pnpm-lock.yaml`).
