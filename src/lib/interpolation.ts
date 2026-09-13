import { MATERIAL_PRICES_RAW } from './constants';
import { MaterialType } from '@/types';

/**
 * Hàm nội suy tuyến tính (Linear Interpolation) đơn giá cống Ci (1.000 VNĐ/m) theo đường kính D (mm).
 * Dựa theo Bảng 2 của bài báo với các mốc chuẩn: [200, 250, 300, 350, 500, 700].
 * Các đường kính trong bài toán thực tế gồm: 300, 400, 500, 600 mm.
 */
export function getMaterialUnitPrice(materialId: MaterialType, D: number): number {
  const priceMap = MATERIAL_PRICES_RAW[materialId];
  if (!priceMap) {
    throw new Error(`Loại vật liệu không hợp lệ: ${materialId}`);
  }

  // Nếu đường kính có sẵn chính xác trong bảng dữ liệu
  if (priceMap[D] !== undefined) {
    return priceMap[D];
  }

  const diameters = Object.keys(priceMap)
    .map(Number)
    .sort((a, b) => a - b);

  // Nếu ngoài dải, chặn biên dưới hoặc biên trên
  if (D <= diameters[0]) {
    return priceMap[diameters[0]];
  }
  if (D >= diameters[diameters.length - 1]) {
    return priceMap[diameters[diameters.length - 1]];
  }

  // Tìm 2 mốc kề nhau d1 <= D <= d2
  for (let i = 0; i < diameters.length - 1; i++) {
    const d1 = diameters[i];
    const d2 = diameters[i + 1];

    if (D >= d1 && D <= d2) {
      const p1 = priceMap[d1];
      const p2 = priceMap[d2];
      // Công thức nội suy tuyến tính: P(D) = P1 + (P2 - P1) * (D - D1) / (D2 - D1)
      const interpolated = p1 + ((p2 - p1) * (D - d1)) / (d2 - d1);
      return Math.round(interpolated * 100) / 100;
    }
  }

  return 0;
}

/**
 * Bảng đơn giá chuẩn đã nội suy cho 4 đường kính thực tế xuất hiện trong 18 đoạn cống:
 * 300mm, 400mm, 500mm, 600mm
 */
export const PRECALCULATED_PRICES: Record<MaterialType, Record<number, number>> = {
  1: {
    300: getMaterialUnitPrice(1, 300), // 270
    400: getMaterialUnitPrice(1, 400), // 337.00
    500: getMaterialUnitPrice(1, 500), // 445
    600: getMaterialUnitPrice(1, 600), // 571.00
  },
  2: {
    300: getMaterialUnitPrice(2, 300), // 414
    400: getMaterialUnitPrice(2, 400), // 619.00
    500: getMaterialUnitPrice(2, 500), // 855
    600: getMaterialUnitPrice(2, 600), // 1085.50
  },
  3: {
    300: getMaterialUnitPrice(3, 300), // 392
    400: getMaterialUnitPrice(3, 400), // 651.33
    500: getMaterialUnitPrice(3, 500), // 908
    600: getMaterialUnitPrice(3, 600), // 1298.00
  },
  4: {
    300: getMaterialUnitPrice(4, 300), // 416
    400: getMaterialUnitPrice(4, 400), // 785.67
    500: getMaterialUnitPrice(4, 500), // 1267
    600: getMaterialUnitPrice(4, 600), // 2049.00
  },
};
