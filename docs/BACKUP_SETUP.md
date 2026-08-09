# 🗄️ Google Drive Database Backup - Setup Guide

Hướng dẫn thiết lập tự động backup database PostgreSQL lên Google Drive.

---

## 📋 Tổng quan

Hệ thống backup tự động thực hiện các bước:

1. **Dump** database PostgreSQL ra file `.sql`
2. **Compress** file SQL bằng gzip (level 9)
3. **Upload** file `.sql.gz` lên Google Drive
4. **Cleanup** các bản backup cũ (giữ lại N bản gần nhất)

Cronjob mặc định chạy **mỗi ngày lúc 2:00 AM**.

---

## 🔧 Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới (ví dụ: `vdcd-backup`)
3. Vào **APIs & Services** → **Library**
4. Tìm và Enable **Google Drive API**

---

## 🔑 Bước 2: Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Chọn Application type: **Web application**
4. Đặt tên (ví dụ: `VDCD Backup`)
5. Trong **Authorized redirect URIs**, thêm:
   ```
   http://localhost:3333/callback
   ```
6. Click **Create**
7. Copy **Client ID** và **Client Secret**

> ⚠️ **Lưu ý**: Nếu chưa cấu hình OAuth Consent Screen, vào **OAuth consent screen** → chọn **External** → điền thông tin cần thiết → thêm scope `Google Drive API - .../auth/drive.file` → thêm email test user.

---

## 📁 Bước 3: Tạo folder backup trên Google Drive

1. Mở [Google Drive](https://drive.google.com/)
2. Tạo folder mới (ví dụ: `VDCD Backups`)
3. Mở folder → copy **Folder ID** từ URL:
   ```
   https://drive.google.com/drive/folders/<FOLDER_ID>
   ```

---

## 🎫 Bước 4: Lấy Refresh Token

Chạy script lấy token trong project Backend:

```bash
npx ts-node src/scripts/get-drive-token.ts <CLIENT_ID> <CLIENT_SECRET>
```

**Ví dụ:**
```bash
npx ts-node src/scripts/get-drive-token.ts \
  914376923849-xxxxx.apps.googleusercontent.com \
  GOCSPX-xxxxx
```

Script sẽ:
1. In ra URL authorization → mở trong browser
2. Đăng nhập Google → cho phép quyền truy cập Drive
3. In ra **Refresh Token** trong terminal

> 💡 **Nếu port 3333 bị chiếm**: chạy `npx kill-port 3333` trước.

---

## ⚙️ Bước 5: Cấu hình Environment Variables

Thêm vào file `.env` (hoặc `.env.development`):

```env
# Google Drive Backup
GOOGLE_DRIVE_FOLDER_ID=<folder_id_from_step_3>
GOOGLE_DRIVE_CLIENT_ID=<client_id_from_step_2>
GOOGLE_DRIVE_CLIENT_SECRET=<client_secret_from_step_2>
GOOGLE_DRIVE_REFRESH_TOKEN=<refresh_token_from_step_4>
BACKUP_CRON=0 2 * * *
BACKUP_RETAIN_COUNT=30
```

| Biến | Mô tả | Mặc định |
|------|--------|----------|
| `GOOGLE_DRIVE_FOLDER_ID` | ID folder trên Drive để lưu backup | (bắt buộc) |
| `GOOGLE_DRIVE_CLIENT_ID` | OAuth2 Client ID | (bắt buộc) |
| `GOOGLE_DRIVE_CLIENT_SECRET` | OAuth2 Client Secret | (bắt buộc) |
| `GOOGLE_DRIVE_REFRESH_TOKEN` | OAuth2 Refresh Token | (bắt buộc) |
| `BACKUP_CRON` | Cron schedule cho backup | `0 2 * * *` (2AM) |
| `BACKUP_RETAIN_COUNT` | Số bản backup giữ lại trên Drive | `30` |

---

## 🧪 Bước 6: Test Backup

Chạy test thủ công:

```bash
npx ts-node -r tsconfig-paths/register src/scripts/test-backup.ts
```

**Kết quả thành công:**
```
🚀 Starting database backup...
✅ Database dumped: .../vdcd_db_2026-08-09T03-33-15.sql
✅ Compressed: .../vdcd_db_2026-08-09T03-33-15.sql.gz
✅ Uploaded to Google Drive (fileId: 1Ji_xxx)
🎉 Backup completed in 3.0s — vdcd_db_2026-08-09T03-33-15.sql.gz
```

Kiểm tra file đã xuất hiện trong folder Google Drive.

---

## 🔄 Bước 7: Restore Database từ Backup

### 1. Download file `.sql.gz` từ Google Drive

### 2. Giải nén file

**Windows (7-Zip):**
- Chuột phải vào file `.sql.gz` → 7-Zip → Extract Here

**Linux/Mac:**
```bash
gunzip vdcd_db_2026-08-09T03-33-15.sql.gz
```

### 3. Restore vào PostgreSQL

**Development (Docker):**
```bash
docker exec -i vdcd-postgres psql -U vdcd_user -d vdcd_db < vdcd_db_2026-08-09T03-33-15.sql
```

**Production:**
```bash
psql -h <DB_HOST> -U vdcd_user -d vdcd_db < vdcd_db_2026-08-09T03-33-15.sql
```

**Linux (giải nén + restore 1 lệnh):**
```bash
gunzip -c backup.sql.gz | psql -h localhost -U vdcd_user -d vdcd_db
```

---

## 📂 Cấu trúc Code

```
src/
├── config/
│   └── google-drive.config.ts     # Config Google Drive credentials
├── modules/
│   ├── backup/
│   │   ├── backup.module.ts       # Backup module
│   │   └── backup.service.ts      # Logic: dump → compress → upload → cleanup
│   └── cronjob/
│       ├── cronjob.module.ts      # Import BackupModule
│       └── cronjob.service.ts     # Cron schedule backup
└── scripts/
    ├── get-drive-token.ts         # Script lấy OAuth2 refresh token
    └── test-backup.ts             # Script test backup thủ công
```

---

## ❓ Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `EADDRINUSE: port 3333` | Port đang bị chiếm | `npx kill-port 3333` |
| `Authorization timed out` | Không authorize trong 5 phút | Chạy lại script, mở URL nhanh hơn |
| `redirect_uri_mismatch` | Chưa thêm redirect URI trong GCP | Thêm `http://localhost:3333/callback` vào OAuth Client |
| `Service Accounts do not have storage quota` | Dùng Service Account với Drive cá nhân | Chuyển sang OAuth2 (theo hướng dẫn trên) |
| `invalid_grant` | Refresh token hết hạn | Chạy lại `get-drive-token.ts` để lấy token mới |
| `pg_dump: command not found` | Không có pg_dump trong container | Kiểm tra container name: `BACKUP_PG_CONTAINER=vdcd-postgres` |

---

## 🔒 Lưu ý bảo mật

- **KHÔNG commit** file `.env` chứa credentials lên Git
- Refresh token có thời hạn dài nhưng có thể bị revoke nếu đổi password Google
- Trong production, nên dùng **secret manager** (Azure Key Vault, AWS Secrets Manager) thay vì env file
