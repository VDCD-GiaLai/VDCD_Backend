# PROJECT & SLIDE DETAIL BLOG ARCHITECTURE AUDIT (PHASE 01)

> **Mục tiêu**: Nghiên cứu, đánh giá toàn diện hiện trạng kiến trúc `Project` và `Slide Detail Blog` trên cả 2 repository (**Backend** và **Admin**).  
> **Cam kết Phase 01**: **Không sửa đổi hoặc thực thi mã nguồn**. Phân tích hiện trạng, khả năng tái sử dụng `shared/content-editor`, luồng upload/ImageKit và đánh giá rủi ro chuyển đổi dữ liệu.

---

## 1. TỔNG QUAN VÀ TRẠNG THÁI HIỆN TẠI (EXECUTIVE SUMMARY)

| Tiêu chí | Project Module | Slide Detail Blog Module |
| :--- | :--- | :--- |
| **Loại nội dung** | Trang dự án thực tế dạng chuyên mục (Case study / Portfolio). | Trang bài viết chuyên sâu đính kèm theo Slide giới thiệu. |
| **Mô hình lưu trữ nội dung** | **Phân mảnh (Fragmented SQL)**:<br>- `overview` (`text`)<br>- `challenge` (`text`) + `challenge_image`<br>- `transformation_before` + `transformation_after`<br>- `technical_highlights` (`jsonb` key-value)<br>- Bảng quan hệ `project_image` (Gallery ảnh) | **Hợp nhất (Unified JSONB Document)**:<br>- Cột `content` (`jsonb`) chứa `BlogDocument` (`version: 1`, `blocks: ContentBlock[]`). |
| **Giao diện soạn thảo Admin** | Form truyền thống sử dụng `RichTextEditor` cơ bản, input file riêng lẻ, dynamic array (`useFieldArray`) và bảng quản lý gallery `ProjectGallery`. | Bộ biên tập hiện đại 4 chế độ: **Thông tin**, **Khối (Block Editor)**, **Trực quan (Visual Editor)**, **Đọc bài (Document Reader)**. |
| **Luồng Upload ImageKit** | Upload tập trung vào thư mục chung `/vdcd/projects`, chưa hỗ trợ phân nhánh theo `slug` dự án. | Chuẩn hóa theo thư mục thực thể có scoped subfolder: `/vdcd/slides/{slug}` hoặc `/vdcd/slides/detail-blogs`. |
| **Cơ chế xác thực & Dọn rác** | Có `confirmUpload` và `deleteFile` khi xóa dự án/ảnh gallery, nhưng không có diff tự động cho nội dung inline. | Theo dõi `fileId` từng khối inline, diff tự động khi cập nhật để dọn ảnh mồ côi (`cleanupImages`), kiểm tra hợp lệ trước khi publish. |
| **Độ tương thích `shared/content-editor`** | Chưa tích hợp (đang dùng form cũ và rich text editor rời). | Đã hoàn thiện và là nền tảng gốc được trích xuất thành `shared/content-editor`. |

---

## 2. KIẾN TRÚC CURRENT PROJECT

### 2.1. Backend Architecture

#### Entity & Database Models
1. **`Project` Entity** (`src/modules/project/entities/project.entity.ts`):
   - Bảng DB: `project`
   - Khóa chính: `id` (`uuid`, `DEFAULT uuid_generate_v4()`)
   - Metadata cơ bản:
     - `title` (`varchar(255)`, bắt buộc)
     - `slug` (`varchar(255)`, `unique`, index)
     - `thumbnail` (`varchar`, URL) + `thumbnail_file_id` (`varchar`, ImageKit fileId)
     - `year` (`int`, năm thực hiện dự án)
     - `field_id` (`ManyToOne` tới `OperationField`, `onDelete: SET NULL`)
     - `province_id` (`ManyToOne` tới `Province`, `onDelete: SET NULL`)
   - Trường chi tiết nội dung (được thêm từ migration `1785671319054-add-project-detail-fields.ts`):
     - `overview` (`text`, mô tả tổng quan ban đầu)
     - `challenge` (`text`, bài toán/thách thức thực tế)
     - `challenge_image` (`varchar`) + `challenge_image_file_id` (`varchar`)
     - `services` (`simple-array`, danh sách dịch vụ VDCD cung cấp)
     - `discipline` (`varchar`, chuyên ngành/lĩnh vực kỹ thuật)
     - `transformation_before` (`varchar`) + `transformation_before_file_id` (`varchar`)
     - `transformation_after` (`varchar`) + `transformation_after_file_id` (`varchar`)
     - `technical_highlights` (`jsonb`, mảng `{ label: string, value: string }[]`)
     - `next_project_slug` (`varchar`, slug dự án kế tiếp phục vụ điều hướng)
   - SEO & Xuất bản:
     - `meta_title` (`varchar(255)`)
     - `meta_description` (`varchar(255)`)
     - `is_published` (`boolean`, mặc định `false`)
   - Quan hệ:
     - `images`: `OneToMany` tới `ProjectImage` (`cascade: true`)
     - `Article`: `OneToMany` (bảng `article` có `project_id`)

2. **`ProjectImage` Entity** (`src/modules/project/entities/project-image.entity.ts`):
   - Bảng DB: `project_image`
   - Khóa chính: `id` (`uuid`)
   - `project_id`: Khóa ngoại trỏ về `project(id)` (`onDelete: CASCADE`)
   - `url` (`varchar`, bắt buộc)
   - `caption` (`varchar`, có thể null)
   - `order` (`int`, thứ tự hiển thị, mặc định 0)
   - `size` (`varchar`, `'small' | 'large'`, mặc định `'small'`)
   - `file_id` (`varchar`, ImageKit file ID phục vụ xác nhận và xóa)

#### Backend DTOs & Validation
- `CreateProjectDto`: Sử dụng `class-validator` (`@IsString()`, `@IsUUID()`, `@IsInt()`, `@Min(1990)`, `@Max(2100)`, `@ValidateNested()`, `@Type(() => TechnicalHighlightDto)`).
- `UpdateProjectDto`: Kế thừa `PartialType(CreateProjectDto)`.
- `AddImagesDto`: Nhận multipart files và chuỗi `captions` JSON.
- `ReorderImagesDto`: Mảng `{ id: string, order: number }[]`.
- `TogglePublishDto`: `@IsBoolean() isPublished`.
- `ProjectFilterDto`: Pagination (`page`, `limit`), `search`, `fieldId`, `provinceId`, `year`, `isPublished`.

#### Controller & Service (`src/modules/project/`)
- **Controller**: `ProjectController` (`/projects`):
  - Hỗ trợ Swagger decorators đầy đủ (`@ApiTags('Projects')`).
  - Guards: `JwtAuthGuard`, `RolesGuard`.
- **Service**: `ProjectService`:
  - `generateSlug`: Dùng `slugify(title, { lower: true, locale: 'vi' })`. Nếu trùng thì thêm timestamp `-${Date.now()}`.
  - `findAll`: Lọc `is_published = true`, join `field`, `province`.
  - `findAllAdmin`: Lọc theo quyền admin (bao gồm draft), hỗ trợ filter đa tiêu chí.
  - `findOneBySlug`: Trả về dự án kèm `images` sắp xếp theo `order ASC`, đồng thời truy vấn thêm `relatedArticles` (tối đa 5 bài viết gắn `project.id`) và `relatedProjects` (tối đa 3 dự án khác).
  - `togglePublish`: Cập nhật trực tiếp `isPublished` vào DB, **không kiểm tra tính đầy đủ của nội dung**.
  - `addImages`: Sử dụng `uploadService.uploadProjectImage(file, uploadedBy)` tải lên ImageKit, lưu bản ghi `ProjectImage`, sau đó gọi `uploadService.confirmUpload`.

---

### 2.2. Admin Architecture

#### Trang & Giao diện hiện tại (`vdcd-admin/src/app/(dashboard)/projects`)
- `projects/page.tsx`: Bảng danh sách dự án với thanh tìm kiếm, bộ lọc trạng thái, thao tác sửa, toggle xuất bản và xóa.
- `projects/new/page.tsx` & `projects/[id]/page.tsx`:
  - Sử dụng `react-hook-form` kết hợp `zodResolver(projectSchema)`.
  - **Nội dung mô tả**: Dùng 2 khung `RichTextEditor` độc lập:
    1. RichTextEditor cho `overview`
    2. RichTextEditor cho `challenge`
  - **Upload ảnh đơn lẻ**: Các thẻ `<input type="file">` riêng lẻ cho `thumbnail`, `challengeImage`, `transformationBefore`, `transformationAfter` gọi hàm `uploadImage(file, "project")`.
  - **Thông số kỹ thuật & Dịch vụ**: Dùng `useFieldArray` render danh sách input động.
  - **Thư viện ảnh Gallery (`ProjectGallery.tsx`)**: Component quản lý danh sách ảnh gallery riêng biệt qua các API chuyên biệt: `useUploadProjectImages`, `useReorderProjectImages`, `useDeleteProjectImage`.

---

## 3. KIẾN TRÚC CURRENT SLIDE DETAIL BLOG

### 3.1. Backend Architecture

#### Entity & Database Model (`src/modules/slide-detail-blog/`)
- Bảng DB: `slide_detail_blog` (tạo từ migration `1788254709454-AddSlideDetailBlog.ts`).
- Khóa chính: `id` (`uuid`).
- Khóa ngoại liên kết Slide: `slide_id` (`uuid`, `OneToOne` tới `slide`, `unique`, `onDelete: CASCADE`).
- Metadata: `title`, `subtitle`, `slug` (`unique`), `excerpt`, `hero_image_url`, `hero_image_file_id`, `seo_title`, `meta_description`.
- **Cột lõi Document**:
  ```typescript
  @Column({
    type: 'jsonb',
    default: () => `'{"version":1,"blocks":[]}'`,
  })
  content: Record<string, any>;
  ```
- Trạng thái xuất bản: `is_published` (`boolean`), `published_at` (`timestamp`).

#### Shared Document Contract (`src/common/types/document-content.types.ts`)
Slide Detail Blog sử dụng hợp đồng tài liệu khối chuẩn hóa gồm 9 loại khối:
1. `HeadingBlock`: `level: 1 | 2 | 3 | 4 | 5 | 6`, `text: string`, `fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'`.
2. `ParagraphBlock`: `text: string`.
3. `ImageBlock`: `url: string`, `fileId?: string`, `mediaId?: string`, `alt: string`, `caption?: string`.
4. `ListBlock` & `OrderedListBlock`: `items: (string | ListItem)[]`, hỗ trợ đệ quy đa tầng `children?: (ListBlock | OrderedListBlock)[]`.
5. `QuoteBlock`: `text: string`, `author?: string`, `citation?: string`.
6. `HighlightBlock`: `text: string`, `style?: string`.
7. `SectionBlock`: `number?: string`, `title: string`, `children: SectionChildBlock[]`.
8. `CtaBlock`: `label: string`, `url: string`.

#### Controller & Service Rules
- **Kiểm soát xuất bản chặt chẽ (`togglePublish`)**:
  - Không cho phép publish nếu `blocks.length === 0` (bài viết trắng).
  - Không cho phép publish nếu `title` rỗng.
  - Tự động gán `publishedAt = new Date()` trong lần đầu tiên publish.
- **Vòng đời hình ảnh thông minh (Image Lifecycle Management)**:
  - Tự động bóc tách toàn bộ `fileId` từ cây khối thông qua `extractImageFileIds`.
  - Tự động xác nhận upload (`confirmUpload`) để tránh cronjob dọn file mồ côi.
  - Tự động so sánh (diff) danh sách ảnh trước và sau khi lưu; bất kỳ ảnh nào bị xóa khỏi nội dung khối sẽ được gọi ImageKit API xóa ngay (`cleanupImages`).
  - Khi xóa bài viết (`remove`), xóa toàn bộ hero image và tất cả các ảnh nằm trong content blocks trên ImageKit.

---

### 3.2. Admin Shared Content Editor Architecture

Trong `vdcd-admin/src/shared/content-editor`, hệ thống editor đã được module hóa cao độ:

```
vdcd-admin/src/shared/content-editor/
├── block-editor/             # Giao diện quản lý danh sách khối tuần tự
├── blocks/                   # Từng component biên tập cho từng loại khối:
│   ├── HeadingBlockItem.tsx  # H1-H6, chọn level và styling
│   ├── ParagraphBlockItem.tsx# Văn bản đoạn văn
│   ├── ImageBlockItem.tsx    # Upload ảnh, caption, alt
│   ├── ListBlockItem.tsx     # Danh sách thụt lề, reorder, lồng con
│   ├── CtaBlockItem.tsx      # Nút kêu gọi hành động
│   ├── SectionBlockItem.tsx  # Gom nhóm khối có số thứ tự
│   └── BlockPicker.tsx       # Menu thêm khối mới
├── visual-editor/            # Canvas tương tác WYSIWYG trực quan:
│   ├── VisualEditorCanvas.tsx
│   ├── VisualEditorToolbar.tsx
│   ├── VisualEditorBlock.tsx
│   ├── InsertZone.tsx
│   └── PropertyPanel.tsx
├── reader/                   # Chế độ đọc hoàn chỉnh không công cụ sửa
│   └── DocumentReader.tsx
├── renderer/                 # Bộ chuyển đổi hiển thị khối dùng chung
│   ├── DocumentContentRenderer.tsx
│   └── DocumentPreviewContainer.tsx
├── media/                    # Upload ngữ cảnh tự động
│   └── DocumentUploadContext.tsx (DocumentUploadProvider)
├── history/                  # Máy trạng thái Undo/Redo 50 bước
│   └── useEditorHistory.ts
├── paste/                    # Chuẩn hóa dán văn bản & phân cấp danh sách
│   ├── list-parser.ts
│   ├── list-helpers.ts
│   └── useSanitizedPaste.ts
└── typography/               # Định nghĩa hệ thống cỡ chữ, khoảng cách
    ├── constants.ts
    └── types.ts
```

---

## 4. BẢNG SO SÁNH: REUSABLE VÀ DUPLICATED COMPONENTS

### 4.1. Khả năng tái sử dụng (Reusable Components đã sẵn sàng cho Project)

| Thành phần có sẵn trong `src/shared/content-editor` | Ứng dụng cho Project | Lợi ích |
| :--- | :--- | :--- |
| `BlockEditor` | Biên tập các phần trình bày chi tiết của Case Study dự án. | Không phụ thuộc vào HTML text area thô sơ, kiểm soát cấu trúc chặt chẽ. |
| `VisualEditorCanvas` | Soạn thảo trực quan nội dung dự án như trên trang landing page. | Cải thiện UX biên tập viên tối đa, nhìn thấy kết quả ngay khi nhập. |
| `DocumentReader` & `DocumentPreviewContainer` | Tab "Đọc bài" kiểm tra hiển thị trước khi xuất bản dự án. | Đảm bảo tính nhất quán 100% giữa admin preview và website. |
| `DocumentUploadProvider` | Tự động route ảnh dự án vào `/vdcd/projects/{slug}`. | Tránh upload phân mảnh, cô lập tài nguyên theo slug dự án. |
| `useSanitizedPaste` & `list-parser` | Dán danh sách hạng mục, giải pháp từ file Word/Notion sang. | Giữ nguyên cấu trúc cây danh sách phân cấp không bị phẳng. |
| `useEditorHistory` | Hỗ trợ Ctrl+Z / Ctrl+Y (50 bước). | An toàn cho người dùng khi biên soạn nội dung dài. |
| Backend `extractImageFileIds` & `validateBlogContent` | Kiểm tra tính hợp lệ của document và dọn dẹp ảnh mồ côi. | ImageKit không bị lãng phí dung lượng bởi ảnh thừa. |

### 4.2. Các thành phần trùng lặp hoặc phân mảnh hiện tại (Duplicated / Legacy)

| Thành phần hiện tại | Vấn đề | Hướng giải quyết |
| :--- | :--- | :--- |
| `vdcd-admin/src/features/slide-detail-blogs/components/BlockEditor` | Bản sao cục bộ trùng lặp với `src/shared/content-editor`. | Đã có `shared/content-editor`; các feature mới như `Solution`, `Article`, `Program` đều dùng chung `shared`. `Project` chỉ cần import từ `src/shared/content-editor`. |
| `RichTextEditor` trong `projects/new` và `projects/[id]` | Lưu HTML thô vào cột `overview` và `challenge`, không kiểm soát được cấu trúc thẻ hay rủi ro XSS. | Thay thế hoặc nâng cấp phần nội dung bài viết chi tiết sang `BlogDocument`. |
| `ProjectGallery` (`project_image` table) vs `ImageBlock` | Quản lý ảnh dự án qua bảng SQL riêng biệt `project_image` (có `size`: `'small' | 'large'`), trong khi các module khác dùng `ImageBlock` inline. | Đánh giá kiến trúc lai (Hybrid) hoặc tích hợp khối Gallery chuyên dụng vào Document. |
| `uploadImage(file, "project")` | Luôn upload vào thư mục gốc `/vdcd/projects`, không có subfolder theo slug như `article`, `program`, `solution`. | Nâng cấp API upload backend để nhận `slug` hoặc `tempFolderKey` như Solution. |

---

## 5. ĐỐI SOÁT BACKEND & ADMIN APIS

### 5.1. Backend APIs

#### Project Module APIs
| Phương thức | Đường dẫn API | Phân quyền | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects` | Public | Danh sách dự án đã xuất bản (`isPublished: true`), phân trang và lọc theo lĩnh vực, tỉnh thành, năm. |
| `GET` | `/projects/all` | Admin (`superadmin`, `editor`) | Danh sách toàn bộ dự án (cả draft), hỗ trợ lọc trạng thái xuất bản. |
| `GET` | `/projects/:slug` | Public | Chi tiết dự án theo slug kèm `field`, `province`, `images` (sắp xếp theo `order ASC`), `relatedArticles` và `relatedProjects`. |
| `POST` | `/projects` | Admin (`superadmin`, `editor`) | Tạo dự án mới, tự động sinh slug nếu chưa có, gọi `confirmUpload` cho các ảnh đại diện, thách thức, chuyển đổi. |
| `PATCH` | `/projects/:id` | Admin (`superadmin`, `editor`) | Cập nhật dự án, kiểm tra trùng slug, xóa ảnh thumbnail cũ trên ImageKit nếu có thay đổi. |
| `PATCH` | `/projects/:id/publish` | Admin (`superadmin`, `editor`) | Bật/tắt trạng thái xuất bản (`isPublished`). **Chưa kiểm tra độ đầy đủ của nội dung**. |
| `DELETE` | `/projects/:id` | Admin (`superadmin`) | Xóa dự án, đồng thời xóa thumbnail và toàn bộ ảnh gallery trên ImageKit. |
| `POST` | `/projects/:id/images` | Admin (`superadmin`, `editor`) | Upload tối đa 20 ảnh gallery vào thư mục `/vdcd/projects`, lưu vào bảng `project_image`. |
| `PATCH` | `/projects/:id/images/reorder`| Admin (`superadmin`, `editor`) | Cập nhật lại thứ tự (`order`) hiển thị của danh sách ảnh gallery. |
| `DELETE` | `/projects/:id/images/:imageId`| Admin (`superadmin`, `editor`) | Xóa 1 ảnh gallery trong DB và xóa file tương ứng trên ImageKit. |

#### Slide Detail Blog Module APIs
| Phương thức | Đường dẫn API | Phân quyền | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| `GET` | `/slide-detail-blogs/by-slide/:slideId` | Public | Lấy bài viết chi tiết đã xuất bản theo Slide ID. |
| `GET` | `/slide-detail-blogs/:slug` | Public | Lấy bài viết chi tiết đã xuất bản theo Slug (chỉ trả các trường public, có cache/chọn lọc). |
| `GET` | `/slide-detail-blogs/all` | Admin (`superadmin`, `editor`) | Danh sách bài viết admin (loại trừ trường `content` nặng để tối ưu tốc độ mạng). |
| `GET` | `/slide-detail-blogs/admin/:id` | Admin (`superadmin`, `editor`) | Lấy đầy đủ thông tin bài viết và nội dung JSONB theo ID. |
| `GET` | `/slide-detail-blogs/admin/by-slide/:slideId` | Admin (`superadmin`, `editor`) | Lấy bài viết (kể cả bản nháp) theo Slide ID. |
| `POST` | `/slide-detail-blogs` | Admin (`superadmin`, `editor`) | Tạo bài viết chi tiết, validate cấu trúc `content`, xác nhận upload file trong khối. |
| `PATCH` | `/slide-detail-blogs/:id` | Admin (`superadmin`, `editor`) | Cập nhật bài viết, diff và xóa ảnh mồ côi khỏi ImageKit, xác nhận ảnh mới. |
| `PATCH` | `/slide-detail-blogs/:id/publish` | Admin (`superadmin`, `editor`) | Xuất bản: kiểm tra `content.blocks` không được rỗng, tiêu đề không được để trống. |
| `DELETE` | `/slide-detail-blogs/:id` | Admin (`superadmin`) | Xóa bài viết và dọn dẹp hero image + tất cả ảnh inline trên ImageKit. |

#### Upload Module APIs liên quan
- `POST /upload/image/project`: Hiện tại upload thẳng vào folder `projects` (không có tham số `slug` hay `subfolder`).
- `POST /upload/image/solution` (và `/article`, `/program`): Nhận `slug`, `title`, `tempFolderKey`, lưu đúng đường dẫn `/vdcd/{module}/{slug}`.

---

### 5.2. Admin APIs & Client Hooks

| Chức năng | Hooks trong Project (`features/projects/api.ts`) | Hooks trong Solution (`features/solutions/api.ts`) |
| :--- | :--- | :--- |
| **Lấy danh sách** | `useProjects(filters)` gọi `/api/projects/all` | `useSolutions(filters)` gọi `/api/solutions` |
| **Lấy chi tiết** | `useProject(id)` (lọc từ cache danh sách) | `useSolution(id)` gọi `/api/solutions/:id` |
| **Tạo mới** | `useCreateProject()` gửi `ProjectFormData` (chứa `overview`, `challenge` string) | `useCreateSolution()` gửi `SolutionFormData` (chứa `content: BlogDocument`) |
| **Cập nhật** | `useUpdateProject(id)` gửi `Partial<ProjectFormData>` | `useUpdateSolution(id)` gửi `Partial<SolutionFormData>` |
| **Xuất bản** | `usePublishProject()` gọi `PATCH /api/projects/:id/publish` | `useTogglePublishSolution()` gọi `PATCH /api/solutions/:id/publish` |
| **Xóa** | `useDeleteProject()` gọi `DELETE /api/projects/:id` | `useDeleteSolution()` gọi `DELETE /api/solutions/:id` |
| **Quản lý Gallery** | `useUploadProjectImages`, `useReorderProjectImages`, `useDeleteProjectImage` | **Không cần API riêng**: Ảnh được biên tập trực tiếp qua `ImageBlock` bên trong `content` Document. |

---

## 6. LUỒNG UPLOAD & QUẢN TRỊ IMAGEKIT

### 6.1. Hiện trạng Luồng Upload của Project
```
[Client Admin]
     │
     ├── 1. Chọn ảnh (Thumbnail / Challenge / Transformation)
     │      ↓
     │      POST /api/upload/image/project (BFF Proxy hoặc Direct)
     │      ↓
     │      Backend: UploadService.uploadProjectImage
     │      Folder: /vdcd/projects  (TẤT CẢ DỰ ÁN DÙNG CHUNG 1 THƯ MỤC)
     │      Lưu bản ghi tạm vào bảng `upload_temp` (confirmed: false)
     │
     ├── 2. Chọn ảnh Gallery
     │      ↓
     │      POST /api/projects/:id/images (Multipart form)
     │      ↓
     │      Backend: ProjectService.addImages
     │      Folder: /vdcd/projects
     │      Tạo bản ghi bảng `project_image`
     │      Gọi UploadService.confirmUpload(fileId) (confirmed: true)
     │
     └── 3. Bấm Submit Form
            ↓
            POST /api/projects hoặc PATCH /api/projects/:id
            Backend gọi confirmUpload cho các trường đơn lẻ.
```

### 6.2. Luồng Upload Chuẩn Hóa của Slide Detail Blog / Solution
```
[Client Admin: DocumentUploadProvider folder="solution|project" subfolder="{slug|tempKey}"]
     │
     ├── 1. Kéo thả / Chọn ảnh trong BlockEditor hoặc VisualEditor
     │      ↓
     │      uploadDocumentImage(file)
     │      ↓
     │      POST /api/upload/image/solution?slug={slug}&tempFolderKey={key}
     │      ↓
     │      Backend: UploadService.uploadSolutionImage
     │      Folder: /vdcd/solutions/{slug}  (CÔ LẬP THEO TỪNG THỰC THỂ)
     │      Lưu bản ghi tạm vào bảng `upload_temp` (confirmed: false)
     │      Trả về { url, fileId, width, height } gắn trực tiếp vào ImageBlock
     │
     ├── 2. Bấm Lưu (Submit Form)
     │      ↓
     │      PUT /api/solutions/:id (gửi toàn bộ DocumentContent)
     │      ↓
     │      Backend Service:
     │      - extractImageFileIds(newContent)
     │      - Gọi confirmUpload cho tất cả fileId mới
     │      - So sánh với oldContent, tìm orphan fileIds và gọi ImageKit.deleteFile ngay lập tức
     │
     └── 3. Cơ chế bảo vệ:
            - Cronjob 24h quét `upload_temp` xóa file chưa confirm (ảnh tải lên nhưng hủy form).
            - Xóa toàn bộ ảnh liên kết khi xóa thực thể cha.
```

---

## 7. RÀ SOÁT DỮ LIỆU THỰC TẾ & ĐÁNH GIÁ RỦI RO (MIGRATION RISKS)

### 7.1. Số liệu thực tế từ Database (`vdcd_db`)

Kiểm tra trực tiếp trên cơ sở dữ liệu PostgreSQL thực tế:
- **Tổng số Project trong hệ thống**: **16** bản ghi.
- **Số Project đã xuất bản (`is_published: true`)**: **16 / 16** (100% đang live trên production).
- **Số lượng ảnh trong bảng `project_image` (Gallery)**: **54** ảnh.
- **Tình trạng cột `overview`**: 16/16 bản ghi có nội dung văn bản.
  - **Kiểm tra mã HTML trong `overview`**: **0 / 16** bản ghi chứa thẻ HTML (100% là chuỗi văn bản sạch, độ dài 80 – 200 ký tự).
- **Tình trạng cột `challenge`**: 16/16 bản ghi có nội dung văn bản.
  - **Kiểm tra mã HTML trong `challenge`**: **0 / 16** bản ghi chứa thẻ HTML (100% là văn bản sạch).
- **Tình trạng `transformation_before` & `transformation_after`**: 16/16 bản ghi đều có ảnh so sánh trước/sau.
- **Tình trạng `technical_highlights`**: 16/16 bản ghi có dữ liệu JSONB (`[{ label, value }]`).

### 7.2. Các rủi ro tiềm ẩn và Thách thức chuyển đổi

#### Rủi ro 1: Phá vỡ Giao diện Frontend Website Công khai (`VDCD_gialai_frontend`)
- **Phát hiện**: Trang chi tiết dự án trên website công khai (`VDCD_gialai_frontend/src/components/projects/detail/project-detail-content.tsx`) hiện tại là một trang chuyên đề tương tác cao với GSAP animation được bóc tách thành nhiều phần độc lập:
  1. `ProjectDetailHero`: Hiển thị tiêu đề, lĩnh vực, năm thực hiện.
  2. `ProjectDetailInfo`: Hiển thị thông tin dịch vụ và đoạn `overview`.
  3. `ProjectDetailChallenge`: Hiển thị bài toán thực tế `challenge` và ảnh `challenge_image`.
  4. `ProjectDetailTransformation`: Slider so sánh trực quan thực tế và số hóa (`transformation_before` / `transformation_after`).
  5. `ProjectDetailHighlights`: Bảng chỉ số kỹ thuật nổi bật (`technical_highlights`).
  6. `ProjectDetailGallery`: Lưới trưng bày 54 ảnh dự án (`images` với size `small` / `large`).
  7. `ProjectDetailRelatedArticles`: Tin tức liên quan.
- **Rủi ro**: Nếu gộp toàn bộ các trường này thành một chuỗi khối `content: BlogDocument` duy nhất và xóa bỏ các cột cũ, giao diện trang chi tiết dự án công khai sẽ bị vỡ hoàn toàn nếu Frontend chưa được viết lại đồng bộ.

#### Rủi ro 2: Quan hệ Khóa ngoại với Module Article
- Bảng `article` hiện có cột khóa ngoại `project_id` trỏ tới `project(id)`.
- Khi lấy chi tiết dự án (`findOneBySlug`), backend tự động tìm các bài viết có liên quan.
- Bất kỳ thay đổi cấu trúc bảng `project` nào cũng **bắt buộc phải giữ nguyên khóa chính UUID `id` và quan hệ này**.

#### Rủi ro 3: Bảng `project_image` vs Khối `ImageBlock`
- Bảng `project_image` hiện quản lý 54 ảnh với thuộc tính `size` (`small` hoặc `large`) và `order`.
- Trong khi đó, `ImageBlock` của `shared/content-editor` chỉ có `url`, `alt`, `caption`.
- Cần quyết định rõ phương án:
  - **Phương án A (Khuyến nghị - Hybrid Architecture)**: Giữ nguyên bảng `project_image` làm Thư viện ảnh (Gallery) của dự án, giữ các trường đặc thù (`transformationBefore/After`, `technicalHighlights`), và bổ sung/nâng cấp trường nội dung chi tiết bài viết (Case Study Narrative) thành `content: JSONB` sử dụng `shared/content-editor`.
  - **Phương án B (Toàn diện Document)**: Mở rộng `DocumentContent` để hỗ trợ khối `GalleryBlock` và khối `BeforeAfterBlock`, sau đó chuyển 54 ảnh và 16 cặp ảnh before/after vào trong Document.

#### Rủi ro 4: Cấu trúc Thư mục ImageKit
- 54 ảnh gallery và các ảnh đại diện của 16 dự án hiện nay đang nằm rải rác hoặc trỏ tới domain cũ (`https://vdcd.vn/wp-content/uploads/...`).
- Khi chuẩn hóa sang `/vdcd/projects/{slug}`, các ảnh URL tuyệt đối cũ vẫn phải hoạt động bình thường, không được tự ý xóa hoặc thay đổi URL nếu chưa di chuyển xong dữ liệu trên CDN.

---

## 8. KẾT LUẬN & ĐỀ XUẤT CHO CÁC PHASE TIẾP THEO

1. **Khẳng định về việc trích xuất Component**:
   - Hoàn toàn **CÓ THỂ** và **NÊN** tái sử dụng `src/shared/content-editor` trong `vdcd-admin`. Thư viện dùng chung này đã được hoàn thiện chuẩn mực, hỗ trợ Block Editor, Visual Editor Canvas, Document Reader, Document Upload Provider và đã tích hợp thành công cho cả `SlideDetailBlog`, `Article`, `Program`, `Solution`.
2. **Hướng kiến trúc đề xuất cho Project**:
   - Bổ sung trường `content: JSONB` (`{"version": 1, "blocks": []}`) cho `project`.
   - Giữ nguyên các metadata kỹ thuật phục vụ layout đặc thù (`technicalHighlights`, `transformationBefore/After`, `year`, `discipline`, `services`).
   - Nâng cấp API upload backend: thêm route `POST /upload/image/project/:slug` (và query `slug`) để tuân thủ quy ước thư mục `/vdcd/projects/{slug}`.
   - Thêm bộ kiểm tra xuất bản: chỉ cho phép xuất bản khi dự án có nội dung và tiêu đề hợp lệ.
3. **Tuyệt đối không thay đổi mã nguồn trong Phase 01** theo đúng chỉ thị yêu cầu.
