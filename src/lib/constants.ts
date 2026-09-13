import { MaterialMeta, MethodMeta, PipeSegment, AlgorithmParams } from '@/types';

/**
 * 18 đoạn cống hư hỏng cần cải tạo theo Bảng 1 trong bài báo:
 * Đặng Minh Hải (2018), Tạp chí Khoa học Kỹ thuật Thủy lợi và Môi trường.
 * D: Đường kính ống (mm)
 * Lh: Chiều dài cống bị hỏng (m)
 * H: Độ sâu chôn cống (m)
 * f: Lưu lượng giao thông bình thường (phương tiện/giờ)
 */
export const SEWER_SEGMENTS: PipeSegment[] = [
  { id: 1, name: '2-3', D: 600, Lh: 111, H: 6.0, f: 50 },
  { id: 2, name: '4-5', D: 600, Lh: 190, H: 5.0, f: 39 },
  { id: 3, name: '8-9', D: 400, Lh: 160, H: 4.0, f: 100 },
  { id: 4, name: '11-12', D: 300, Lh: 210, H: 3.0, f: 80 },
  { id: 5, name: '21-22', D: 400, Lh: 90, H: 4.0, f: 50 },
  { id: 6, name: '32-33', D: 500, Lh: 115, H: 4.0, f: 20 },
  { id: 7, name: '34-35', D: 400, Lh: 95, H: 4.0, f: 40 },
  { id: 8, name: '36-37', D: 300, Lh: 180, H: 2.5, f: 50 },
  { id: 9, name: '47-48', D: 600, Lh: 220, H: 3.0, f: 25 },
  { id: 10, name: '57-58', D: 300, Lh: 110, H: 4.5, f: 50 },
  { id: 11, name: '60-61', D: 300, Lh: 120, H: 3.0, f: 14 },
  { id: 12, name: '70-71', D: 500, Lh: 140, H: 4.5, f: 25 },
  { id: 13, name: '84-85', D: 600, Lh: 90, H: 5.0, f: 50 },
  { id: 14, name: '83-149', D: 300, Lh: 110, H: 3.0, f: 60 },
  { id: 15, name: '86-120', D: 400, Lh: 130, H: 4.5, f: 90 },
  { id: 16, name: '88-100', D: 400, Lh: 120, H: 4.0, f: 50 },
  { id: 17, name: '92-93', D: 300, Lh: 110, H: 3.0, f: 100 },
  { id: 18, name: '141-142', D: 300, Lh: 140, H: 3.5, f: 50 },
];

/**
 * Bảng 2: Thông tin 4 loại vật liệu thay thế và tuổi thọ cống
 * Định kiểu màu sắc thanh lịch, độ tương phản cao cho Light Mode
 */
export const MATERIAL_INFO: Record<number, MaterialMeta> = {
  1: {
    id: 1,
    code: 'BTCT',
    name: 'BTCT',
    fullName: 'Bê tông cốt thép',
    lifespan: 25,
    color: '#475569',
    textColor: 'text-slate-700',
    bgLight: 'bg-slate-100',
    borderColor: 'border-slate-300',
  },
  2: {
    id: 2,
    code: 'CSTT',
    name: 'CSTT',
    fullName: 'Cốt sợi thủy tinh',
    lifespan: 30,
    color: '#0891b2',
    textColor: 'text-cyan-800',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  3: {
    id: 3,
    code: 'HDPE',
    name: 'HDPE',
    fullName: 'Nhựa HDPE',
    lifespan: 50,
    color: '#2563eb',
    textColor: 'text-blue-800',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  4: {
    id: 4,
    code: 'Sành',
    name: 'Sành',
    fullName: 'Sành tráng men',
    lifespan: 100,
    color: '#d97706',
    textColor: 'text-amber-900',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
};

/**
 * Phương pháp cải tạo theo Hình 2 (Light Mode)
 */
export const METHOD_INFO: Record<number, MethodMeta> = {
  1: {
    id: 1,
    code: 'TCN',
    name: 'TCN',
    fullName: 'Thay thế không mở móng (Thi công ngầm)',
    disruptsTraffic: false,
    color: '#16a34a',
    textColor: 'text-emerald-800',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  2: {
    id: 2,
    code: 'TTMM',
    name: 'TTMM',
    fullName: 'Thay thế mở móng (Đào hở)',
    disruptsTraffic: true,  // a_i = 1 -> Gây ùn tắc giao thông
    color: '#dc2626',
    textColor: 'text-red-800',
    bgLight: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  3: {
    id: 3,
    code: 'SCL',
    name: 'SCL',
    fullName: 'Sửa chữa lớn (BTCT)',
    disruptsTraffic: false,
    color: '#7c3aed',
    textColor: 'text-purple-800',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  4: {
    id: 4,
    code: 'SCN',
    name: 'SCN',
    fullName: 'Sửa chữa nhỏ (BTCT)',
    disruptsTraffic: false,
    color: '#0284c7',
    textColor: 'text-sky-800',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
};

/**
 * Bảng 2. Đơn giá vật liệu cống thoát nước Ci (1.000 VNĐ / m) theo D (mm)
 */
export const MATERIAL_PRICES_RAW: Record<number, Record<number, number>> = {
  1: { 200: 183, 250: 208, 300: 270, 350: 283, 500: 445, 700: 697 },       // BTCT
  2: { 200: 167, 250: 261, 300: 414, 350: 501, 500: 855, 700: 1316 },      // CSTT
  3: { 200: 235, 250: 313, 300: 392, 350: 523, 500: 908, 700: 1688 },      // HDPE
  4: { 200: 257, 250: 337, 300: 416, 350: 545, 500: 1267, 700: 2831 },     // Sành
};

/**
 * Thông số mặc định tối ưu hóa NSGA-II theo nghiên cứu
 */
export const DEFAULT_PARAMS: AlgorithmParams = {
  popSize: 100,          // Kích thước quần thể ban đầu Np
  maxGenerations: 320,   // Số thế hệ tiến hóa Ng
  crossoverProb: 0.90,   // Xác suất lai ghép Pc
  mutationProb: 0.08,    // Xác suất đột biến Pm
};
