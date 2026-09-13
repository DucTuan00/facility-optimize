import { Gene, Individual, SegmentCostDetail } from '@/types';
import { SEWER_SEGMENTS, MATERIAL_INFO, METHOD_INFO } from './constants';
import { getMaterialUnitPrice } from './interpolation';

/**
 * Đảm bảo nghiệm tuân thủ chặt chẽ ràng buộc logic (Hình 2 trong bài báo):
 * - Nếu Phương pháp là SCL (3) hoặc SCN (4) -> Bắt buộc Vật liệu là BTCT (1)
 * - Nếu Phương pháp là TCN (1) hoặc TTMM (2) -> Vật liệu thuộc {1, 2, 3, 4}
 */
export function repairGene(gene: Gene): Gene {
  const method = gene.method;
  let material = gene.material;

  if (method === 3 || method === 4) {
    material = 1; // BTCT
  } else {
    // Đảm bảo material nằm trong khoảng 1..4
    if (material < 1 || material > 4) {
      material = 1;
    }
  }

  return { material, method };
}

/**
 * Sửa toàn bộ chromosome 18 đoạn cống
 */
export function repairChromosome(chromosome: Gene[]): Gene[] {
  return chromosome.map((gene) => repairGene(gene));
}

/**
 * Tính toán chi phí thi công Ctc,i (1.000 VNĐ) cho 1 đoạn cống theo công thức (3) -> (6) trong bài báo:
 * D: mm, H: m
 */
export function calculateConstructionCost(method: number, D: number, H: number): number {
  switch (method) {
    case 1: // TCN - Thay thế không mở móng
      return 22 * D + 12062;
    case 2: // TTMM - Thay thế mở móng
      return 0.009 * (D * D) + 550 * (H * H) + 0.9 * D * H - 1168 * H + 1.4 * D + 4299;
    case 3: // SCL - Sửa chữa lớn
      return 55 * D + 15288;
    case 4: // SCN - Sửa chữa nhỏ
      return 60 * D + 5400;
    default:
      return 0;
  }
}

/**
 * Đánh giá chi tiết từng đoạn cống (18 đoạn) cho 1 cá thể
 */
export function evaluateSegmentDetails(chromosome: Gene[]): SegmentCostDetail[] {
  const validGenes = repairChromosome(chromosome);

  return SEWER_SEGMENTS.map((seg, idx) => {
    const gene = validGenes[idx];
    const matMeta = MATERIAL_INFO[gene.material];
    const methMeta = METHOD_INFO[gene.method];

    // Chi phí vật liệu: với SCL và SCN không tính mua ống mới (C_i = 0)
    let unitPrice = 0;
    let materialCost = 0;
    if (gene.method === 1 || gene.method === 2) {
      unitPrice = getMaterialUnitPrice(gene.material, seg.D);
      materialCost = unitPrice * seg.Lh;
    }

    // Chi phí thi công
    const constructionCost = calculateConstructionCost(gene.method, seg.D, seg.H);
    const totalCost = materialCost + constructionCost;
    const totalCostBillion = totalCost / 1_000_000;

    // Ảnh hưởng giao thông: a_i = 1 nếu TTMM (mở móng), 0 nếu ngầm / sửa chữa
    const trafficImpact = methMeta.disruptsTraffic ? seg.f : 0;

    return {
      segmentId: seg.id,
      segmentName: seg.name,
      D: seg.D,
      Lh: seg.Lh,
      H: seg.H,
      f: seg.f,
      material: gene.material,
      method: gene.method,
      materialName: matMeta.name,
      materialColor: matMeta.color,
      methodName: methMeta.name,
      methodColor: methMeta.color,
      unitPrice,
      materialCost,
      constructionCost,
      totalCost,
      totalCostBillion,
      lifespan: matMeta.lifespan,
      trafficImpact,
    };
  });
}

/**
 * Đánh giá 3 hàm mục tiêu toán học cho một cá thể nghiệm:
 * 1. Tổng chi phí cải tạo C_ct (1.000 VNĐ) -> MIN
 * 2. Tuổi thọ trung bình hệ thống SL (năm) -> MAX
 * 3. Mức độ ảnh hưởng giao thông GT (xe/giờ) -> MIN
 */
export function evaluateIndividual(chromosome: Gene[], id?: string): Individual {
  const segmentDetails = evaluateSegmentDetails(chromosome);

  let totalMaterialCost = 0;
  let totalConstructionCost = 0;
  let totalLifespan = 0;
  let totalTraffic = 0;

  for (const detail of segmentDetails) {
    totalMaterialCost += detail.materialCost;
    totalConstructionCost += detail.constructionCost;
    totalLifespan += detail.lifespan;
    totalTraffic += detail.trafficImpact;
  }

  const totalCost = totalMaterialCost + totalConstructionCost;
  const averageLifespan = Math.round((totalLifespan / SEWER_SEGMENTS.length) * 10) / 10;
  const costBillion = Math.round((totalCost / 1_000_000) * 1000) / 1000;

  return {
    id: id || `ind-${Math.random().toString(36).substring(2, 9)}`,
    chromosome: chromosome.map((g) => ({ ...g })),
    cost: totalCost,
    costBillion,
    materialCost: totalMaterialCost,
    constructionCost: totalConstructionCost,
    lifespan: averageLifespan,
    traffic: totalTraffic,
    segmentDetails,
  };
}

/**
 * So sánh quan hệ vượt trội Pareto (Pareto Dominance):
 * p vượt trội q (p dominates q) khi:
 * - p không tồi hơn q ở bất kỳ mục tiêu nào
 * - p tốt hơn q ở ít nhất 1 mục tiêu
 * (Cost: MIN, Lifespan: MAX, Traffic: MIN)
 */
export function dominates(p: Individual, q: Individual): boolean {
  const notWorse =
    p.cost <= q.cost &&
    p.lifespan >= q.lifespan &&
    p.traffic <= q.traffic;

  const strictlyBetter =
    p.cost < q.cost ||
    p.lifespan > q.lifespan ||
    p.traffic < q.traffic;

  return notWorse && strictlyBetter;
}
