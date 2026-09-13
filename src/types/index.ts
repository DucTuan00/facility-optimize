export type MaterialType = 1 | 2 | 3 | 4; // 1: BTCT, 2: CSTT, 3: HDPE, 4: Sành
export type MethodType = 1 | 2 | 3 | 4;   // 1: TCN (không mở móng), 2: TTMM (mở móng), 3: SCL (sửa chữa lớn), 4: SCN (sửa chữa nhỏ)

export interface PipeSegment {
  id: number;
  name: string;
  D: number;    // Đường kính ống (mm)
  Lh: number;   // Chiều dài hư hỏng (m)
  H: number;    // Độ sâu chôn cống (m)
  f: number;    // Lưu lượng giao thông bình thường (xe/giờ)
}

export interface Gene {
  material: MaterialType;
  method: MethodType;
}

export interface SegmentCostDetail {
  segmentId: number;
  segmentName: string;
  D: number;
  Lh: number;
  H: number;
  f: number;
  material: MaterialType;
  method: MethodType;
  materialName: string;
  materialColor: string;
  methodName: string;
  methodColor: string;
  unitPrice: number;       // Đơn giá vật liệu (1.000 đ/m)
  materialCost: number;    // C_vl,i (1.000 đ)
  constructionCost: number;// C_tc,i (1.000 đ)
  totalCost: number;       // C_vl,i + C_tc,i (1.000 đ)
  totalCostBillion: number;// (tỷ đồng)
  lifespan: number;        // Y_i (năm)
  trafficImpact: number;   // a_i * f_i (xe/h)
}

export interface Individual {
  id: string;
  chromosome: Gene[];
  cost: number;            // C_ct (1.000 đ)
  costBillion: number;     // C_ct quy đổi ra tỷ VNĐ
  materialCost: number;    // C_vl (1.000 đ)
  constructionCost: number;// C_tc (1.000 đ)
  lifespan: number;        // SL (năm)
  traffic: number;         // GT (xe/giờ)
  rank?: number;
  crowdingDistance?: number;
  mcdaScore?: number;
  segmentDetails?: SegmentCostDetail[];
  isPreset?: 'A' | 'B' | 'C';
}

export interface AlgorithmParams {
  popSize: number;         // Kích thước quần thể Np (50 - 300, mặc định 100)
  maxGenerations: number;  // Số thế hệ Ng (100 - 600, mặc định 320)
  crossoverProb: number;   // Xác suất lai ghép Pc (0.8 - 0.95, mặc định 0.90)
  mutationProb: number;    // Xác suất đột biến Pm (0.01 - 0.15, mặc định 0.08)
}

export interface AlgorithmProgress {
  generation: number;
  maxGenerations: number;
  percent: number;
  paretoCount: number;
  currentBest: {
    minCost: number;      // Tỷ VNĐ
    maxLife: number;      // Năm
    minTraffic: number;   // Xe/giờ
  };
  sampleFront?: Individual[];
}

export type WorkerInMessage =
  | { type: 'START'; params: AlgorithmParams }
  | { type: 'STOP' };

export type WorkerOutMessage =
  | { type: 'PROGRESS'; progress: AlgorithmProgress }
  | { type: 'COMPLETE'; paretoFront: Individual[]; elapsedMs: number }
  | { type: 'STOPPED' }
  | { type: 'ERROR'; message: string };

export interface WeightPreferences {
  costWeight: number;      // 0 - 100%
  lifespanWeight: number;  // 0 - 100%
  trafficWeight: number;   // 0 - 100%
}

export interface MaterialMeta {
  id: MaterialType;
  code: string;
  name: string;
  fullName: string;
  lifespan: number;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
}

export interface MethodMeta {
  id: MethodType;
  code: string;
  name: string;
  fullName: string;
  disruptsTraffic: boolean;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
}
