# 📖 Hướng Dẫn Chủ Động Seed Dữ Liệu Vào VPS

Tài liệu này hướng dẫn cách chủ động kích hoạt (trigger) nạp dữ liệu mẫu/dữ liệu chuẩn (`full-database-seed.sql`) trực tiếp vào cơ sở dữ liệu PostgreSQL trên máy chủ VPS.

---

## 🌟 Cách 1: Sử Dụng GitHub Actions (Khuyên Dùng — 1 Click Trên Web)

Đây là phương thức tiện lợi, an toàn và trực quan nhất. Bạn không cần cài đặt SSH hay gõ lệnh trên máy tính cá nhân.

### Bước 1: Truy cập tab Actions trên GitHub
1. Mở trình duyệt và truy cập repository:
   👉 **`https://github.com/VDCD-GiaLai/VDCD_Backend/actions`**
2. Ở danh sách workflow bên cột trái, chọn **"Seed Database to VPS"**.

### Bước 2: Kích hoạt Workflow
1. Bấm vào nút **"Run workflow"** (nút màu xanh ở góc trên bên phải).
2. Một hộp thoại tùy chọn sẽ xuất hiện:

| Tùy chọn | Mô tả | Giá trị đề xuất |
|---|---|---|
| **Use workflow from** | Branch chứa code | Chọn `feature/sync-programs-seed-cleanup` hoặc `deployment` |
| **Phương thức seed dữ liệu** (`seed_mode`) | `sql_file`: Nạp trực tiếp file `full-database-seed.sql` vào container Postgres.<br>`typeorm_script`: Chạy script TypeORM. | `sql_file` *(Mặc định, nhanh và chuẩn nhất)* |
| **Tự động sao lưu database** (`auto_backup`) | Tự động chạy `pg_dump` nén ra file `.sql.gz` trước khi nạp data mới | `true` *(Khuyên luôn bật)* |
| **Xóa Redis cache** (`clear_cache`) | Xóa cache Redis (`FLUSHDB`) để frontend cập nhật dữ liệu ngay | `true` *(Khuyên luôn bật)* |
| **Xác nhận thực thi** (`confirm_action`) | Nhập `YES` để xác nhận thực thi, tránh bấm nhầm | `YES` |

3. Bấm nút màu xanh **"Run workflow"** để bắt đầu.

### Bước 3: Theo dõi kết quả
- Bấm vào lượt chạy vừa tạo để xem log thời gian thực.
- Quá trình seed thường diễn ra trong **15 - 30 giây**.
- Kết thúc workflow, phần tóm tắt (**Summary**) sẽ hiển thị bảng số lượng bản ghi của từng bảng:
  - `admin_user`: 3 rows
  - `organization`: 1 row
  - `program`: 5 rows (5 chương trình chuẩn VDCD)
  - `solution`: 19 rows (12 trung tâm + các giải pháp)
  - `project`: 16 rows
  - `project_image`: 54 rows
  - `article`: 10 rows

---

## 💻 Cách 2: Chạy Thủ Công Từ Máy Local (Dành Cho Lập Trình Viên)

Nếu bạn có SSH key kết nối trực tiếp đến VPS, bạn có thể thực thi nhanh bằng 1 dòng lệnh terminal:

### Dành cho Linux / macOS / Git Bash:
```bash
# 1. Tạo backup trước khi seed
ssh -p <PORT> <USER>@<HOST> "docker exec vdcd-postgres pg_dump -U vdcd_user -d vdcd_db --no-owner --no-privileges | gzip > /opt/vdcd/backups/vdcd_db_pre_seed_\$(date +%Y%m%d_%H%M%S).sql.gz"

# 2. Đẩy file SQL trực tiếp vào container PostgreSQL
cat docs/full-database-seed.sql | ssh -p <PORT> <USER>@<HOST> "docker exec -i vdcd-postgres psql -U vdcd_user -d vdcd_db"

# 3. Xóa cache Redis
ssh -p <PORT> <USER>@<HOST> "docker exec vdcd-redis redis-cli FLUSHDB"
```

### Dành cho Windows PowerShell:
```powershell
# Chạy script PowerShell tự động có sẵn:
.\deploy\scripts\seed-vps.ps1

# Hoặc chạy lệnh một dòng pipe trực tiếp:
Get-Content docs/full-database-seed.sql | ssh -p <PORT> <USER>@<HOST> "docker exec -i vdcd-postgres psql -U vdcd_user -d vdcd_db"
```

---

## 🛡️ Cách 3: Khôi Phục Dữ Liệu Cũ (Rollback) Khi Cần Thiết

Mỗi khi bạn chạy seed với tùy chọn `auto_backup: true`, một bản sao lưu toàn bộ cơ sở dữ liệu trước thời điểm seed sẽ được lưu tại:
`/opt/vdcd/backups/vdcd_db_pre_seed_YYYYMMDD_HHMMSS.sql.gz` trên VPS.

Để khôi phục lại dữ liệu cũ, chỉ cần SSH vào VPS và chạy:

```bash
cd /opt/vdcd

# 1. Liệt kê các bản backup gần nhất
ls -lh backups/vdcd_db_pre_seed_*.sql.gz

# 2. Khôi phục từ bản backup mong muốn (thay TÊN_FILE_BACKUP)
gunzip < backups/vdcd_db_pre_seed_20260904_141000.sql.gz | docker exec -i vdcd-postgres psql -U vdcd_user -d vdcd_db

# 3. Xóa cache Redis sau khi khôi phục
docker exec vdcd-redis redis-cli FLUSHDB
```

---

## 🔍 Kiểm Tra Sau Khi Seed

Sau khi nạp dữ liệu thành công, bạn có thể kiểm tra trực tiếp qua API:
1. **Kiểm tra 5 chương trình**: `GET https://api.doimoisangtaogialai.vn/api/v1/programs`
2. **Kiểm tra 12 trung tâm & giải pháp**: `GET https://api.doimoisangtaogialai.vn/api/v1/solutions`
3. **Kiểm tra dự án**: `GET https://api.doimoisangtaogialai.vn/api/v1/projects`
4. **Giao diện người dùng**: Truy cập website `https://vdcd-gialai.vercel.app/solution` hoặc `https://vdcd-gialai.vercel.app/programs` để thấy dữ liệu đồng bộ tức thì.
