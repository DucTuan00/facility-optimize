import { Gene, Individual } from '@/types';
import { evaluateIndividual } from './evaluation';

/**
 * 3 Phương án mẫu (Presets) trích xuất từ nghiên cứu thực nghiệm của bài báo:
 *
 * Phương án A (Min CPCT):
 * - Chi phí cải tạo nhỏ nhất: ~1,25 tỷ đồng
 * - Tuổi thọ trung bình: 27 năm
 * - Ảnh hưởng giao thông: 253 phương tiện/giờ
 * - Dữ liệu chi tiết từ Bảng 4 trong bài báo
 */
export const PRESET_A_GENES: Gene[] = [
  { material: 1, method: 4 }, // 1 (2-3): BTCT, SCN
  { material: 1, method: 2 }, // 2 (4-5): BTCT, TTMM
  { material: 1, method: 1 }, // 3 (8-9): BTCT, TCN
  { material: 1, method: 4 }, // 4 (11-12): BTCT, SCN
  { material: 3, method: 1 }, // 5 (21-22): HDPE, TCN
  { material: 1, method: 4 }, // 6 (32-33): BTCT, SCN
  { material: 1, method: 4 }, // 7 (34-35): BTCT, SCN
  { material: 1, method: 4 }, // 8 (36-37): BTCT, SCN
  { material: 1, method: 2 }, // 9 (47-48): BTCT, TTMM
  { material: 1, method: 2 }, // 10 (57-58): BTCT, TTMM
  { material: 1, method: 2 }, // 11 (60-61): BTCT, TTMM
  { material: 1, method: 2 }, // 12 (70-71): BTCT, TTMM
  { material: 1, method: 4 }, // 13 (84-85): BTCT, SCN
  { material: 1, method: 2 }, // 14 (83-149): BTCT, TTMM
  { material: 4, method: 1 }, // 15 (86-120): Sành, TCN
  { material: 1, method: 4 }, // 16 (88-100): BTCT, SCN
  { material: 1, method: 4 }, // 17 (92-93): BTCT, SCN
  { material: 2, method: 2 }, // 18 (141-142): CSTT, TTMM
];

/**
 * Phương án B (Max Tuổi Thọ):
 * - Tuổi thọ trung bình cao nhất: 78 năm
 * - Vật liệu sành chiếm 61.1% (11 đoạn), HDPE 11.2%, CSTT 5.6%, BTCT 16.7%
 * - Chi phí đầu tư cao (khoảng 1.88 - 2.29 tỷ đồng)
 * - Dữ liệu chi tiết từ Bảng 5 trong bài báo
 */
export const PRESET_B_GENES: Gene[] = [
  { material: 4, method: 2 }, // 1 (2-3): Sành, TTMM
  { material: 3, method: 2 }, // 2 (4-5): HDPE, TTMM
  { material: 1, method: 2 }, // 3 (8-9): BTCT, TTMM
  { material: 4, method: 1 }, // 4 (11-12): Sành, TCN
  { material: 4, method: 1 }, // 5 (21-22): Sành, TCN
  { material: 4, method: 2 }, // 6 (32-33): Sành, TTMM
  { material: 4, method: 1 }, // 7 (34-35): Sành, TCN
  { material: 4, method: 1 }, // 8 (36-37): Sành, TCN
  { material: 1, method: 2 }, // 9 (47-48): BTCT, TTMM
  { material: 4, method: 1 }, // 10 (57-58): Sành, TCN
  { material: 4, method: 1 }, // 11 (60-61): Sành, TCN
  { material: 1, method: 2 }, // 12 (70-71): BTCT, TTMM
  { material: 2, method: 1 }, // 13 (84-85): CSTT, TCN
  { material: 3, method: 1 }, // 14 (83-149): HDPE, TCN
  { material: 4, method: 1 }, // 15 (86-120): Sành, TCN
  { material: 4, method: 2 }, // 16 (88-100): Sành, TTMM
  { material: 4, method: 1 }, // 17 (92-93): Sành, TCN
  { material: 4, method: 2 }, // 18 (141-142): Sành, TTMM
];

/**
 * Phương án C (Min Tắc Đường):
 * - Ảnh hưởng giao thông nhỏ nhất: 0 xe/giờ
 * - 100% thi công ngầm và sửa chữa: 72.2% SCN (13 đoạn), 22.2% TCN (4 đoạn), 5.6% SCL (1 đoạn)
 * - Dữ liệu chi tiết từ Bảng 5 trong bài báo
 */
export const PRESET_C_GENES: Gene[] = [
  { material: 1, method: 4 }, // 1 (2-3): BTCT, SCN
  { material: 1, method: 4 }, // 2 (4-5): BTCT, SCN
  { material: 1, method: 4 }, // 3 (8-9): BTCT, SCN
  { material: 1, method: 4 }, // 4 (11-12): BTCT, SCN
  { material: 4, method: 1 }, // 5 (21-22): Sành, TCN
  { material: 1, method: 4 }, // 6 (32-33): BTCT, SCN
  { material: 1, method: 4 }, // 7 (34-35): BTCT, SCN
  { material: 1, method: 3 }, // 8 (36-37): BTCT, SCL
  { material: 1, method: 4 }, // 9 (47-48): BTCT, SCN
  { material: 1, method: 4 }, // 10 (57-58): BTCT, SCN
  { material: 4, method: 1 }, // 11 (60-61): Sành, TCN
  { material: 1, method: 4 }, // 12 (70-71): BTCT, SCN
  { material: 1, method: 4 }, // 13 (84-85): BTCT, SCN
  { material: 3, method: 1 }, // 14 (83-149): HDPE, TCN
  { material: 4, method: 1 }, // 15 (86-120): Sành, TCN
  { material: 1, method: 4 }, // 16 (88-100): BTCT, SCN
  { material: 1, method: 4 }, // 17 (92-93): BTCT, SCN
  { material: 1, method: 4 }, // 18 (141-142): BTCT, SCN
];

export function getPresetIndividuals(): { A: Individual; B: Individual; C: Individual } {
  const indA = evaluateIndividual(PRESET_A_GENES, 'preset-A');
  indA.isPreset = 'A';

  const indB = evaluateIndividual(PRESET_B_GENES, 'preset-B');
  indB.isPreset = 'B';

  const indC = evaluateIndividual(PRESET_C_GENES, 'preset-C');
  indC.isPreset = 'C';

  return { A: indA, B: indB, C: indC };
}

export interface PresetInfo {
  key: 'A' | 'B' | 'C';
  title: string;
  badge: string;
  highlightTag: string;
  costDesc: string;
  lifeDesc: string;
  trafficDesc: string;
  description: string;
  genes: Gene[];
}

export const PRESET_INFOS: PresetInfo[] = [
  {
    key: 'A',
    title: 'Phương án A (Min Chi phí)',
    badge: 'Tiết kiệm nhất',
    highlightTag: '1,25 tỷ VNĐ',
    costDesc: '1,25 tỷ VNĐ (nhỏ nhất)',
    lifeDesc: '27 năm',
    trafficDesc: '253 xe/giờ (7 đoạn mở móng)',
    description: 'Ưu tiên giảm tối đa ngân sách đầu tư ban đầu; vật liệu BTCT chiếm đa số (86.3%).',
    genes: PRESET_A_GENES,
  },
  {
    key: 'B',
    title: 'Phương án B (Max Tuổi thọ)',
    badge: 'Bền vững nhất',
    highlightTag: '78 năm',
    costDesc: '1,88 - 2,29 tỷ VNĐ',
    lifeDesc: '78 năm (lớn nhất)',
    trafficDesc: '348 xe/giờ',
    description: 'Ưu tiên độ bền vững thế kỷ; sử dụng vật liệu cống sành tráng men chiếm 61.1%.',
    genes: PRESET_B_GENES,
  },
  {
    key: 'C',
    title: 'Phương án C (Min Tắc đường)',
    badge: 'Không kẹt xe',
    highlightTag: '0 xe/giờ',
    costDesc: '~1,35 tỷ VNĐ',
    lifeDesc: '39 năm',
    trafficDesc: '0 xe/giờ (100% thi công ngầm)',
    description: 'Bảo vệ giao thông đô thị du lịch Sầm Sơn tuyệt đối; không đào xới mặt đường.',
    genes: PRESET_C_GENES,
  },
];
