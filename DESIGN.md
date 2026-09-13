# HƯỚNG DẪN THIẾT KẾ GIAO DIỆN (DESIGN SYSTEM SPECIFICATION)
**Hệ thống Quản lý & Tối ưu hóa Cải tạo Mạng lưới Thoát nước Đô thị**

---

## 1. Triết lý Thiết kế (Design Philosophy)

Mục tiêu là xây dựng một **phần mềm công cụ kỹ thuật chuyên ngành (Civil Engineering Decision-Support Tool)** chuẩn mực, tối giản, chuyên nghiệp và đáng tin cậy.

### Nguyên tắc cốt lõi:
1. **Loại bỏ "AI Slop" & Hiệu ứng thừa**:
   - Tuyệt đối **không** dùng gradient tím - cyan (purple/neon gradient), không bóng mờ phát sáng (glow blur), không particle lấp lánh, không badge gắn sao trang trí vô nghĩa.
   - Không lồng ghép card-in-card quá nhiều tầng gây rối mắt.
2. **Ưu tiên Light Mode (Sáng sủa, Tương phản cao)**:
   - Nền sáng trang nhã (#ffffff và #f8fafc) tương tự các phần mềm kỹ thuật, dashboard nghiên cứu của viện khoa học và các công cụ hiện đại (như Linear, Notion, Vercel Dashboard).
   - Chữ đậm, nét viền thanh mảnh 1px (#e2e8f0), độ tương phản đạt chuẩn WCAG AA+.
3. **Giảm tải thông tin cho người mới (Progressive Disclosure)**:
   - Thông tin quan trọng nhất hiển thị ngay: 3 số liệu then chốt (**Tổng chi phí**, **Tuổi thọ cống**, **Mức tắc đường**).
   - Chia bố cục theo cấu trúc 3 phần logic:
     - **Phần 1: Bảng điều khiển phương án**: Chọn nhanh 3 phương án A/B/C hoặc cấu hình chạy NSGA-II (các tham số $N_p, N_g, P_c, P_m$ được thu gọn trong mục mở rộng).
     - **Phần 2: Phân tích & So sánh**: Biểu đồ Pareto (2D / 3D) và Bộ lọc trọng số MCDA dạng công cụ chấm điểm trực quan.
     - **Phần 3: Bảng thanh tra 18 đoạn cống**: Bảng số liệu chi tiết có bộ lọc tìm kiếm và nút xuất file báo cáo.
4. **Màu sắc mang tính chức năng (Functional Colors Only)**:
   - Màu sắc chỉ được dùng để phân biệt trạng thái dữ liệu (data visualization), không dùng để trang trí lòe loẹt.

---

## 2. Bảng Màu Chuẩn (Color Palette)

### Nền & Viền (Surfaces & Borders)
- **Nền chính (App Background)**: `#f8fafc` (Slate 50)
- **Nền thẻ/thành phần (Card Surface)**: `#ffffff` (Pure White)
- **Nền phụ/Bảng (Subtle Surface)**: `#f1f5f9` (Slate 100)
- **Đường viền chính (Primary Border)**: `#e2e8f0` (Slate 200) - viền 1px sắc nét
- **Đường viền nhấn (Active/Focus Border)**: `#0f172a` (Slate 900) hoặc `#2563eb` (Blue 600)

### Hệ màu Chữ (Typography Hierarchy)
- **Tiêu đề chính & Số liệu then chốt**: `#0f172a` (Slate 900) - Font Sans Bold / Mono Bold
- **Chữ nội dung (Body text)**: `#334155` (Slate 700)
- **Chữ phụ trợ/Nhãn (Labels & Muted)**: `#64748b` (Slate 500)
- **Số liệu & Mã kỹ thuật**: Dùng font số đơn cách (Monospace) như `font-mono`

### Màu Chức năng & Mục tiêu (Functional Accents)
- **Mục tiêu 1 - Chi phí (Cost)**:
  - Chữ: `#15803d` (Green 700)
  - Nền badge: `#f0fdf4` (Green 50)
  - Viền: `#bbf7d0` (Green 200)
- **Mục tiêu 2 - Tuổi thọ (Lifespan)**:
  - Chữ: `#0369a1` (Sky 700)
  - Nền badge: `#f0f9ff` (Sky 50)
  - Viền: `#bae6fd` (Sky 200)
- **Mục tiêu 3 - Giao thông (Traffic)**:
  - Chữ: `#b45309` (Amber 700)
  - Nền badge: `#fffbeb` (Amber 50)
  - Viền: `#fde68a` (Amber 200)

### Màu Vật liệu Cống (Bảng 2)
- **BTCT**: Nền `#f1f5f9`, chữ `#475569`, viền `#cbd5e1`
- **CSTT**: Nền `#ecfeff`, chữ `#0e7490`, viền `#a5f3fc`
- **HDPE**: Nền `#eff6ff`, chữ `#1d4ed8`, viền `#bfdbfe`
- **Sành**: Nền `#fef3c7`, chữ `#b45309`, viền `#fde68a`

### Màu Phương pháp Thi công (Hình 2)
- **TCN (Không mở móng)**: `#16a34a` (Xanh lá sạch - Không ảnh hưởng đường)
- **TTMM (Đào hở)**: `#dc2626` (Đỏ cảnh báo - Gây ùn tắc giao thông)
- **SCL (Sửa lớn)**: `#7c3aed` (Tím nhạt trang nhã)
- **SCN (Sửa nhỏ)**: `#0284c7` (Xanh lam nhạt)

---

## 3. Hệ thống Thành phần (Component Rules)

### Thẻ (Cards)
- `bg-white border border-slate-200 rounded-xl shadow-xs`
- Không bóng đổ quá lớn (loại bỏ `shadow-2xl`, dùng `shadow-sm` hoặc `border` đơn thuần).
- Khoảng đệm (padding) chuẩn: `p-5` hoặc `p-6`.

### Nút bấm (Buttons)
- **Nút chính (Primary CTA)**:
  - Nền đen/xanh navy tối `bg-slate-900 text-white hover:bg-slate-800`
  - Bo góc `rounded-lg`, font chữ `text-sm font-medium`.
- **Nút phụ (Secondary)**:
  - Nền trắng, viền xám: `bg-white border border-slate-300 text-slate-700 hover:bg-slate-50`.
- **Nút Danger (Dừng thuật toán)**:
  - `bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100`.

### Thẻ Phương án mẫu (Preset Cards)
- Dạng nút chọn lựa (Radio Card) rõ ràng.
- Thẻ chưa chọn: viền xám nhạt `border-slate-200 bg-white`.
- Thẻ đang chọn: viền xanh `border-blue-600 bg-blue-50/40 ring-1 ring-blue-600`.

### Biểu đồ Pareto (Charts)
- Nền biểu đồ màu trắng `#ffffff`.
- Trục tọa độ, lưới màu xám nhạt `#f1f5f9` / `#e2e8f0`.
- Tooltip sạch sẽ, nền trắng viền xám với chữ đen sắc nét.

### Bảng Dữ liệu 18 Đoạn cống (Table)
- Header cố định, nền xám thanh lịch `#f8fafc`, chữ xám `#475569`, border `#e2e8f0`.
- Hàng chẵn / lẻ hoặc hover nhẹ `#f8fafc`.
- Các con số căn phải, font mono dễ so sánh cột.
