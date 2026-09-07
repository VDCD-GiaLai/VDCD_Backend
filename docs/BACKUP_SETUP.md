# 🗄️ Hướng Dẫn Thiết Lập Tự Động Backup Database Lên Google Drive

Tài liệu này hướng dẫn chi tiết từng bước thiết lập luồng tự động sao lưu PostgreSQL lên Google Drive (áp dụng cho tài khoản Google cá nhân hoặc tài khoản tổ chức mới).

---

## 📋 Tổng Quan Luồng Hoạt Động

1. **Dump:** Xuất dữ liệu PostgreSQL ra file `.sql`.
2. **Compress:** Nén file `.sql` thành `.sql.gz` bằng gzip (level 9, giảm dung lượng ~85%).
3. **Upload:** Đẩy file nén lên thư mục Google Drive thông qua Google Drive API v3.
4. **Cleanup:** Quét và chỉ giữ lại số bản backup mới nhất theo cấu hình `BACKUP_RETAIN_COUNT` (mặc định 30 bản), tự xóa các bản cũ hơn.
5. **Dọn dẹp tạm thời:** Xóa các file `.sql` và `.sql.gz` trên ổ cứng server/local ngay sau khi upload xong.
6. **Lịch chạy:** Cronjob tự động kích hoạt vào **2:00 AM** mỗi ngày.

---

## 🚀 Các Bước Thiết Lập Cho Tài Khoản Google Mới

### Bước 1: Tạo Project trên Google Cloud và Bật Drive API

1. Đăng nhập vào tài khoản Google bạn muốn dùng để lưu backup.
2. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
3. Bấm vào dropdown chọn project ở thanh trên cùng → Chọn **New Project** (Dự án mới).
   - Đặt tên project (ví dụ: `VDCD-Database-Backup`) → Bấm **Create**.
   - Đảm bảo bạn đang chọn đúng project vừa tạo.
4. Bật Google Drive API:
   - Vào menu bên trái (biểu tượng ☰) → **APIs & Services** → **Library**.
   - Tìm kiếm từ khóa: `Google Drive API`.
   - Chọn **Google Drive API** → Bấm nút **Enable** (Bật).

---

### Bước 2: Cấu Hình OAuth Consent Screen (Cực Kỳ Quan Trọng)

> ⚠️ **LƯU Ý ĐẶC BIỆT:** Nếu bỏ qua bước bấm **Publish App**, Google sẽ để app ở trạng thái *Testing*, khiến Refresh Token **tự động hết hạn sau 7 ngày** (dẫn đến lỗi `invalid_grant`). Hãy làm chuẩn theo các bước dưới đây:

1. Vào menu **APIs & Services** → **OAuth consent screen** (Màn hình đồng ý OAuth).
2. Chọn loại người dùng: **External** (Bên ngoài) → Bấm **Create**.
3. **Thông tin ứng dụng (App information):**
   - **App name:** `VDCD Backup` (hoặc tên tùy thích).
   - **User support email:** Chọn email của bạn.
   - **Developer contact information:** Nhập email của bạn.
   - Bấm **Save and Continue** (Lưu và tiếp tục).
4. **Phạm vi quyền (Scopes):**
   - Bấm nút **Add or Remove Scopes**.
   - Tìm scope: `.../auth/drive.file` (*Xem, chỉnh sửa, tạo và xóa chỉ các tệp Google Drive cụ thể bạn dùng với ứng dụng này*).
   - Tích chọn scope này → Bấm **Update** → Bấm **Save and Continue**.
5. **Người dùng thử nghiệm (Test users):**
   - Bấm **Save and Continue** để bỏ qua (vì ta sẽ publish app ngay sau đây).
6. **Publish App (Để Token có hạn vĩnh viễn):**
   - Quay lại tab **OAuth consent screen**.
   - Dưới mục **Publishing status**, bấm nút **PUBLISH APP** (Xuất bản ứng dụng) → Bấm **Confirm**.
   - Trạng thái chuyển sang **In production**. Khi đó token tạo ra sẽ **không bao giờ hết hạn**.

---

### Bước 3: Tạo OAuth 2.0 Client ID & Secret

1. Vào menu **APIs & Services** → **Credentials** (Thông tin xác thực).
2. Bấm **+ CREATE CREDENTIALS** → Chọn **OAuth client ID**.
3. Điền thông tin:
   - **Application type:** Chọn **Web application**.
   - **Name:** `VDCD Backup Client`.
   - **Authorized redirect URIs** (URI chuyển hướng được phép): Bấm **+ ADD URI** và nhập chính xác:
     ```text
     http://localhost:3333/callback
     ```
4. Bấm **Create**.
5. Hộp thoại hiện ra: Copy và lưu lại **Client ID** và **Client Secret**:
   - `Client ID` (dạng `xxxxx.apps.googleusercontent.com`)
   - `Client Secret` (dạng `GOCSPX-xxxxx`)

---

### Bước 4: Tạo Thư Mục Lưu Backup Trên Google Drive

1. Mở [Google Drive](https://drive.google.com/) bằng chính tài khoản Google đó.
2. Bấm **Mới (+)** → **Thư mục mới** → Đặt tên (ví dụ: `VDCD_Database_Backups`).
3. Mở thư mục vừa tạo, nhìn lên thanh địa chỉ trình duyệt (URL):
   ```text
   https://drive.google.com/drive/folders/1KHIqAmqrUrk94pjjvTTP7G4YS5srnuLI
   ```
4. Chuỗi ký tự phía sau `folders/` chính là **`GOOGLE_DRIVE_FOLDER_ID`** (ví dụ: `1KHIqAmqrUrk94pjjvTTP7G4YS5srnuLI`). Hãy copy lại mã này.

---

### Bước 5: Chạy Script Lấy Refresh Token

Mở terminal tại thư mục `Backend`, chạy lệnh:

```bash
npx ts-node src/scripts/get-drive-token.ts <CLIENT_ID> <CLIENT_SECRET>
```

**Ví dụ:**
```bash
npx ts-node src/scripts/get-drive-token.ts 914376923849-xxxxx.apps.googleusercontent.com GOCSPX-xxxxx
```

**Quy trình xác thực trên trình duyệt:**
1. Script sẽ tự động bật trình duyệt (hoặc in ra đường link xác thực).
2. Chọn đúng tài khoản Google vừa cấu hình.
3. Nếu trình duyệt hiện màn hình cảnh báo *"Google chưa xác minh ứng dụng này"*:
   - Bấm vào **Nâng cao (Advanced)**.
   - Bấm vào link **Đi tới VDCD Backup (không an toàn)**.
4. Tích chọn quyền xem, tạo, sửa file Google Drive → Bấm **Tiếp tục**.
5. Màn hình báo `✅ Authorization successful!`.
6. Terminal sẽ hiển thị **`GOOGLE_DRIVE_REFRESH_TOKEN`** và tự động cập nhật vào file `.env.development`.

> 💡 *Nếu báo lỗi cổng 3333 bị chiếm, chạy: `npx kill-port 3333` rồi chạy lại.*

---

### Bước 6: Cấu Hình Biến Môi Trường (.env)

#### Môi trường Local (`.env.development`):
Cập nhật các biến sau:
```env
# Google Drive Backup
GOOGLE_DRIVE_FOLDER_ID=1KHIqAmqrUrk94pjjvTTP7G4YS5srnuLI
GOOGLE_DRIVE_CLIENT_ID=914376923849-xxxxx.apps.googleusercontent.com
GOOGLE_DRIVE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_DRIVE_REFRESH_TOKEN=1//0epci0PU3o4py...
BACKUP_CRON=0 2 * * *
BACKUP_RETAIN_COUNT=30
```

#### Môi trường Production VPS (`/opt/vdcd/.env`):
SSH vào server và thêm các biến tương tự vào file `/opt/vdcd/.env`.

| Biến | Ý nghĩa | Mặc định |
| :--- | :--- | :--- |
| `GOOGLE_DRIVE_FOLDER_ID` | ID thư mục Google Drive để chứa file backup | (Bắt buộc) |
| `GOOGLE_DRIVE_CLIENT_ID` | OAuth2 Client ID từ Google Cloud | (Bắt buộc) |
| `GOOGLE_DRIVE_CLIENT_SECRET` | OAuth2 Client Secret từ Google Cloud | (Bắt buộc) |
| `GOOGLE_DRIVE_REFRESH_TOKEN` | OAuth2 Refresh Token lấy được từ Bước 5 | (Bắt buộc) |
| `BACKUP_CRON` | Biểu thức Cron quy định giờ chạy backup tự động | `0 2 * * *` (2:00 AM) |
| `BACKUP_RETAIN_COUNT` | Số lượng bản backup tối đa giữ lại trên Drive | `30` |

---

### Bước 7: Kiểm Tra Chạy Thử (Testing)

#### 1. Chạy test thủ công tại Local:
Chạy lệnh sau tại thư mục `Backend`:
```bash
npx ts-node -r tsconfig-paths/register src/scripts/test-backup.ts
```

**Kết quả thành công:**
```text
🚀 Starting database backup...
✅ Database dumped: ...\tmp\backups\vdcd_db_2026-09-06T12-07-08.sql
✅ Compressed: ...\tmp\backups\vdcd_db_2026-09-06T12-07-08.sql.gz
✅ Uploaded to Google Drive (fileId: 1RjjDDFQMD3JdzPnG3m8CvOEe3bgEKO8U)
🎉 Backup completed in 9.3s — vdcd_db_2026-09-06T12-07-08.sql.gz

📋 Result: {
  "success": true,
  "fileName": "vdcd_db_2026-09-06T12-07-08.sql.gz"
}
```

Kiểm tra trên Google Drive: File `vdcd_db_YYYY-MM-DD...sql.gz` đã xuất hiện trong thư mục.

#### 2. Kích hoạt trên VPS Production:
Khởi động lại container backend để nhận các biến môi trường mới:
```bash
docker compose -f docker-compose.prod.yml restart backend
```

Bạn có thể kích hoạt chạy test 1 lần trên container production bằng lệnh:
```bash
docker exec -it vdcd-backend node -e "
  const { NestFactory } = require('@nestjs/core');
  const { AppModule } = require('./dist/app.module');
  const { BackupService } = require('./dist/modules/backup/backup.service');
  NestFactory.createApplicationContext(AppModule).then(async app => {
    const res = await app.get(BackupService).runBackup();
    console.log(res);
    await app.close();
  });
"
```

---

## 🔄 Hướng Dẫn Restore Database Từ File Backup

Khi xảy ra sự cố và cần phục hồi lại database từ Google Drive:

1. **Tải file:** Vào Google Drive tải file backup mong muốn (ví dụ `vdcd_db_2026-09-06.sql.gz`) về máy hoặc server.
2. **Giải nén file:**
   - **Linux / VPS:**
     ```bash
     gunzip vdcd_db_2026-09-06.sql.gz
     ```
   - **Windows:** Dùng phần mềm 7-Zip, click chuột phải → `7-Zip` → `Extract Here` để được file `.sql`.
3. **Phục hồi vào PostgreSQL:**
   - **Local Docker:**
     ```bash
     docker exec -i vdcd-postgres psql -U vdcd_user -d vdcd_db < vdcd_db_2026-09-06.sql
     ```
   - **VPS Production (Chạy thẳng từ file nén 1 dòng lệnh):**
     ```bash
     gunzip -c vdcd_db_2026-09-06.sql.gz | docker exec -i vdcd-postgres psql -U vdcd_user -d vdcd_db
     ```

---

## ❓ Bảng Xử Lý Sự Cố (Troubleshooting)

| Tình trạng lỗi | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| `invalid_grant: Bad Request` | Refresh token hết hạn hoặc app đang ở chế độ *Testing* quá 7 ngày | Vào OAuth Consent Screen bấm **Publish App** (chuyển sang In production), sau đó chạy lại lệnh Bước 5 để lấy Refresh Token vĩnh viễn. |
| `redirect_uri_mismatch` | Chưa thêm URL callback vào OAuth Client | Vào Google Cloud Console → Credentials → OAuth Client → Thêm `http://localhost:3333/callback` vào **Authorized redirect URIs**. |
| `Port 3333 is already in use` | Cổng 3333 bị ứng dụng khác chiếm | Chạy lệnh `npx kill-port 3333` rồi chạy lại script. |
| `File not found` / `404 folder` | `GOOGLE_DRIVE_FOLDER_ID` không đúng hoặc tài khoản chưa có quyền | Kiểm tra lại URL folder trên Drive, đảm bảo tài khoản cấp token là tài khoản sở hữu hoặc có quyền chỉnh sửa thư mục đó. |
| `pg_dump: command not found` | Môi trường thiếu công cụ `pg_dump` | Ở local cần bật container `vdcd-postgres`. Ở production, Dockerfile đã có sẵn `RUN apk add postgresql-client`. |
