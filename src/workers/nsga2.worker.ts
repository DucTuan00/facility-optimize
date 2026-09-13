// Web Worker for NSGA-II Genetic Algorithm
// 100% Client-side execution for zero UI blocking

interface Gene {
  material: 1 | 2 | 3 | 4; // 1: BTCT, 2: CSTT, 3: HDPE, 4: Sành
  method: 1 | 2 | 3 | 4;   // 1: TCN, 2: TTMM, 3: SCL, 4: SCN
}

interface Individual {
  id: string;
  chromosome: Gene[];
  cost: number;            // 1.000 đ
  costBillion: number;     // Tỷ đ
  materialCost: number;
  constructionCost: number;
  lifespan: number;        // Năm
  traffic: number;         // Xe/h
  rank?: number;
  crowdingDistance?: number;
}

// 18 đoạn cống theo Bảng 1
const SEGMENTS = [
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

// Tuổi thọ theo vật liệu (Bảng 2)
const LIFESPANS: Record<number, number> = { 1: 25, 2: 30, 3: 50, 4: 100 };

// Đơn giá vật liệu thô (Bảng 2)
const RAW_PRICES: Record<number, Record<number, number>> = {
  1: { 200: 183, 250: 208, 300: 270, 350: 283, 500: 445, 700: 697 },
  2: { 200: 167, 250: 261, 300: 414, 350: 501, 500: 855, 700: 1316 },
  3: { 200: 235, 250: 313, 300: 392, 350: 523, 500: 908, 700: 1688 },
  4: { 200: 257, 250: 337, 300: 416, 350: 545, 500: 1267, 700: 2831 },
};

function getMaterialPrice(material: number, D: number): number {
  const pMap = RAW_PRICES[material];
  if (pMap[D] !== undefined) return pMap[D];

  const dKeys = Object.keys(pMap)
    .map(Number)
    .sort((a, b) => a - b);
  for (let i = 0; i < dKeys.length - 1; i++) {
    const d1 = dKeys[i];
    const d2 = dKeys[i + 1];
    if (D >= d1 && D <= d2) {
      return pMap[d1] + ((pMap[d2] - pMap[d1]) * (D - d1)) / (d2 - d1);
    }
  }
  return 0;
}

function repairGene(gene: Gene): Gene {
  const method = gene.method;
  let material = gene.material;
  if (method === 3 || method === 4) {
    material = 1; // SCL, SCN bắt buộc BTCT
  }
  return { material, method };
}

function calcConstructionCost(method: number, D: number, H: number): number {
  switch (method) {
    case 1: // TCN
      return 22 * D + 12062;
    case 2: // TTMM
      return 0.009 * (D * D) + 550 * (H * H) + 0.9 * D * H - 1168 * H + 1.4 * D + 4299;
    case 3: // SCL
      return 55 * D + 15288;
    case 4: // SCN
      return 60 * D + 5400;
    default:
      return 0;
  }
}

function evaluateChromosome(chromosome: Gene[], id?: string): Individual {
  let matCost = 0;
  let conCost = 0;
  let totalLife = 0;
  let traffic = 0;

  for (let i = 0; i < 18; i++) {
    const gene = chromosome[i];
    const seg = SEGMENTS[i];

    if (gene.method === 1 || gene.method === 2) {
      const unitP = getMaterialPrice(gene.material, seg.D);
      matCost += unitP * seg.Lh;
    }

    conCost += calcConstructionCost(gene.method, seg.D, seg.H);
    totalLife += LIFESPANS[gene.material];

    if (gene.method === 2) {
      traffic += seg.f;
    }
  }

  const totalCost = matCost + conCost;
  return {
    id: id || `ind-${Math.random().toString(36).substring(2, 9)}`,
    chromosome: chromosome.map((g) => ({ ...g })),
    cost: totalCost,
    costBillion: Math.round((totalCost / 1_000_000) * 1000) / 1000,
    materialCost: matCost,
    constructionCost: conCost,
    lifespan: Math.round((totalLife / 18) * 10) / 10,
    traffic,
  };
}

// Pareto Dominance check: Cost MIN, Lifespan MAX, Traffic MIN
function dominates(p: Individual, q: Individual): boolean {
  const notWorse =
    p.cost <= q.cost && p.lifespan >= q.lifespan && p.traffic <= q.traffic;
  const strictlyBetter =
    p.cost < q.cost || p.lifespan > q.lifespan || p.traffic < q.traffic;
  return notWorse && strictlyBetter;
}

// Fast Non-dominated Sorting (Optimized index-based $O(MN^2)$)
function fastNonDominatedSort(population: Individual[]): Individual[][] {
  const n = population.length;
  const indexFronts: number[][] = [[]];
  const S: number[][] = Array.from({ length: n }, () => []);
  const domCount: number[] = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      if (dominates(population[i], population[j])) {
        S[i].push(j);
      } else if (dominates(population[j], population[i])) {
        domCount[i]++;
      }
    }
    if (domCount[i] === 0) {
      population[i].rank = 1;
      indexFronts[0].push(i);
    }
  }

  let curr = 0;
  while (indexFronts[curr] && indexFronts[curr].length > 0) {
    const nextFront: number[] = [];
    for (const pIdx of indexFronts[curr]) {
      for (const qIdx of S[pIdx]) {
        domCount[qIdx]--;
        if (domCount[qIdx] === 0) {
          population[qIdx].rank = curr + 2;
          nextFront.push(qIdx);
        }
      }
    }
    curr++;
    if (nextFront.length > 0) {
      indexFronts.push(nextFront);
    }
  }

  return indexFronts.map((f) => f.map((idx) => population[idx]));
}

// Crowding Distance Assignment
function assignCrowdingDistance(front: Individual[]): void {
  const l = front.length;
  if (l === 0) return;
  if (l === 1) {
    front[0].crowdingDistance = Infinity;
    return;
  }
  if (l === 2) {
    front[0].crowdingDistance = Infinity;
    front[1].crowdingDistance = Infinity;
    return;
  }

  for (const ind of front) {
    ind.crowdingDistance = 0;
  }

  const objectives: Array<{
    key: 'cost' | 'lifespan' | 'traffic';
    mult: number;
  }> = [
    { key: 'cost', mult: 1 },
    { key: 'lifespan', mult: 1 },
    { key: 'traffic', mult: 1 },
  ];

  for (const obj of objectives) {
    front.sort((a, b) => a[obj.key] - b[obj.key]);
    front[0].crowdingDistance = Infinity;
    front[l - 1].crowdingDistance = Infinity;

    const range = front[l - 1][obj.key] - front[0][obj.key];
    if (range > 0) {
      for (let i = 1; i < l - 1; i++) {
        if (front[i].crowdingDistance !== Infinity) {
          front[i].crowdingDistance! +=
            (front[i + 1][obj.key] - front[i - 1][obj.key]) / range;
        }
      }
    }
  }
}

// Binary Tournament Selection
function binaryTournament(p1: Individual, p2: Individual): Individual {
  const r1 = p1.rank ?? 9999;
  const r2 = p2.rank ?? 9999;
  if (r1 < r2) return p1;
  if (r2 < r1) return p2;
  const cd1 = p1.crowdingDistance ?? 0;
  const cd2 = p2.crowdingDistance ?? 0;
  return cd1 >= cd2 ? p1 : p2;
}

// Two-point Crossover
function twoPointCrossover(p1: Gene[], p2: Gene[], pC: number): [Gene[], Gene[]] {
  if (Math.random() > pC) {
    return [
      p1.map((g) => ({ ...g })),
      p2.map((g) => ({ ...g })),
    ];
  }

  const cut1 = Math.floor(Math.random() * 17);
  const cut2 = cut1 + 1 + Math.floor(Math.random() * (18 - cut1 - 1));

  const c1: Gene[] = [];
  const c2: Gene[] = [];

  for (let i = 0; i < 18; i++) {
    if (i >= cut1 && i <= cut2) {
      c1.push(repairGene({ ...p2[i] }));
      c2.push(repairGene({ ...p1[i] }));
    } else {
      c1.push(repairGene({ ...p1[i] }));
      c2.push(repairGene({ ...p2[i] }));
    }
  }

  return [c1, c2];
}

// Mutation Operator
function mutate(chromosome: Gene[], pM: number): Gene[] {
  return chromosome.map((gene) => {
    if (Math.random() < pM) {
      const newMethod = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
      let newMaterial: 1 | 2 | 3 | 4;
      if (newMethod === 3 || newMethod === 4) {
        newMaterial = 1;
      } else {
        newMaterial = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
      }
      return repairGene({ material: newMaterial, method: newMethod });
    }
    return repairGene(gene);
  });
}

// Random Individual Generator
function generateRandomChromosome(): Gene[] {
  const res: Gene[] = [];
  for (let i = 0; i < 18; i++) {
    const method = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
    let material: 1 | 2 | 3 | 4;
    if (method === 3 || method === 4) {
      material = 1;
    } else {
      material = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
    }
    res.push(repairGene({ material, method }));
  }
  return res;
}

// Worker state and message listener
let shouldStop = false;

self.onmessage = async (e: MessageEvent) => {
  const data = e.data;
  if (!data) return;

  if (data.type === 'STOP') {
    shouldStop = true;
    return;
  }

  if (data.type === 'START') {
    shouldStop = false;
    const startTime = performance.now();
    const params = data.params || {
      popSize: 100,
      maxGenerations: 320,
      crossoverProb: 0.9,
      mutationProb: 0.08,
    };

    const Np = Math.max(20, Math.min(params.popSize, 400));
    const Ng = Math.max(10, Math.min(params.maxGenerations, 1000));
    const Pc = params.crossoverProb ?? 0.9;
    const Pm = params.mutationProb ?? 0.08;

    // Khởi tạo quần thể ban đầu Np
    let population: Individual[] = [];
    for (let i = 0; i < Np; i++) {
      const chrom = generateRandomChromosome();
      population.push(evaluateChromosome(chrom, `gen0-${i}`));
    }

    // Phân tầng ban đầu
    let fronts = fastNonDominatedSort(population);
    for (const f of fronts) {
      assignCrowdingDistance(f);
    }

    const reportInterval = Math.max(2, Math.floor(Ng / 50)); // Báo cáo ~50 lần trong suốt quá trình

    // Vòng lặp các thế hệ NSGA-II
    for (let gen = 1; gen <= Ng; gen++) {
      if (shouldStop) {
        self.postMessage({ type: 'STOPPED' });
        return;
      }

      // 1. Tạo quần thể con Q_t kích thước Np bằng Tournament + Crossover + Mutation
      const offspring: Individual[] = [];
      while (offspring.length < Np) {
        const i1 = Math.floor(Math.random() * Np);
        const i2 = Math.floor(Math.random() * Np);
        const p1 = binaryTournament(population[i1], population[i2]);

        const i3 = Math.floor(Math.random() * Np);
        const i4 = Math.floor(Math.random() * Np);
        const p2 = binaryTournament(population[i3], population[i4]);

        const [c1Genes, c2Genes] = twoPointCrossover(p1.chromosome, p2.chromosome, Pc);
        const m1Genes = mutate(c1Genes, Pm);
        const m2Genes = mutate(c2Genes, Pm);

        offspring.push(evaluateChromosome(m1Genes, `gen${gen}-${offspring.length}`));
        if (offspring.length < Np) {
          offspring.push(evaluateChromosome(m2Genes, `gen${gen}-${offspring.length}`));
        }
      }

      // 2. Gộp quần thể cha và con R_t = P_t U Q_t (2 * Np)
      const combined = [...population, ...offspring];

      // 3. Phân tầng không vượt trội trên quần thể gộp 2N
      fronts = fastNonDominatedSort(combined);

      // 4. Chọn lọc Np cá thể tốt nhất cho thế hệ tiếp theo
      const newPop: Individual[] = [];
      for (const front of fronts) {
        assignCrowdingDistance(front);
        if (newPop.length + front.length <= Np) {
          newPop.push(...front);
        } else {
          const needed = Np - newPop.length;
          front.sort((a, b) => (b.crowdingDistance ?? 0) - (a.crowdingDistance ?? 0));
          newPop.push(...front.slice(0, needed));
          break;
        }
      }

      population = newPop;

      // 5. Gửi message báo tiến độ về Main Thread định kỳ
      if (gen % reportInterval === 0 || gen === Ng || gen === 1) {
        const currentFront1 = fronts[0] || population;
        let minCost = Infinity;
        let maxLife = -Infinity;
        let minTraffic = Infinity;

        for (const ind of currentFront1) {
          if (ind.costBillion < minCost) minCost = ind.costBillion;
          if (ind.lifespan > maxLife) maxLife = ind.lifespan;
          if (ind.traffic < minTraffic) minTraffic = ind.traffic;
        }

        self.postMessage({
          type: 'PROGRESS',
          progress: {
            generation: gen,
            maxGenerations: Ng,
            percent: Math.round((gen / Ng) * 100),
            paretoCount: currentFront1.length,
            currentBest: {
              minCost: Math.round(minCost * 100) / 100,
              maxLife: Math.round(maxLife * 10) / 10,
              minTraffic,
            },
            // Gửi mẫu tập Pareto để cập nhật biểu đồ theo thời gian thực
            sampleFront: currentFront1.slice(0, 150),
          },
        });

        // Yield execution to allow message dispatching and user interrupt handling
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    // Hoàn thành: Lấy toàn bộ nghiệm Pareto Front 1
    const finalFronts = fastNonDominatedSort(population);
    const finalPareto = finalFronts[0] || population;
    assignCrowdingDistance(finalPareto);

    // Lọc trùng lặp nghiệm trên không gian mục tiêu
    const uniquePareto: Individual[] = [];
    const seen = new Set<string>();
    for (const ind of finalPareto) {
      const key = `${ind.costBillion.toFixed(3)}_${ind.lifespan.toFixed(1)}_${ind.traffic}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePareto.push(ind);
      }
    }

    const elapsedMs = Math.round(performance.now() - startTime);

    self.postMessage({
      type: 'COMPLETE',
      paretoFront: uniquePareto,
      elapsedMs,
    });
  }
};
