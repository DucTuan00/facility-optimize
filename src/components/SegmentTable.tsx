'use client';

import React, { useMemo } from 'react';
import { Individual } from '@/types';
import { MATERIAL_INFO, METHOD_INFO } from '@/lib/constants';
import {
  FileSpreadsheet,
  FileJson,
  Printer,
  Table,
  Wrench,
  DollarSign,
  Clock,
  Car,
  PieChart,
} from 'lucide-react';

interface SegmentTableProps {
  solution: Individual | null;
}

export const SegmentTable: React.FC<SegmentTableProps> = ({ solution }) => {
  const details = solution?.segmentDetails;

  // Material & Method Distribution statistics
  const stats = useMemo(() => {
    if (!details) return null;
    const matCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const methCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

    for (const d of details) {
      matCounts[d.material]++;
      methCounts[d.method]++;
    }

    return {
      mat: {
        btct: { count: matCounts[1], pct: Math.round((matCounts[1] / 18) * 1000) / 10 },
        cstt: { count: matCounts[2], pct: Math.round((matCounts[2] / 18) * 1000) / 10 },
        hdpe: { count: matCounts[3], pct: Math.round((matCounts[3] / 18) * 1000) / 10 },
        sanh: { count: matCounts[4], pct: Math.round((matCounts[4] / 18) * 1000) / 10 },
      },
      meth: {
        tcn: { count: methCounts[1], pct: Math.round((methCounts[1] / 18) * 1000) / 10 },
        ttmm: { count: methCounts[2], pct: Math.round((methCounts[2] / 18) * 1000) / 10 },
        scl: { count: methCounts[3], pct: Math.round((methCounts[3] / 18) * 1000) / 10 },
        scn: { count: methCounts[4], pct: Math.round((methCounts[4] / 18) * 1000) / 10 },
      },
    };
  }, [details]);

  if (!solution || !details || !stats) {
    return (
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-8 text-center text-slate-400">
        <Table className="w-10 h-10 mx-auto mb-3 text-slate-600" />
        <h3 className="text-base font-semibold text-white">Chưa chọn phương án nào</h3>
        <p className="text-xs text-slate-400 mt-1">
          Vui lòng click chọn 1 nghiệm trên biểu đồ Pareto hoặc chọn 1 trong 3 phương án mẫu ở trên.
        </p>
      </div>
    );
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'TT',
      'Ten_Doan',
      'Duong_Kinh_D_mm',
      'Chieu_Dai_Hien_Huong_Lh_m',
      'Do_Sau_H_m',
      'Luu_Luong_Binh_Thuong_f_xe_h',
      'Vat_Lieu',
      'Phuong_Phap_Thi_Cong',
      'Don_Gia_Vat_Lieu_1000d_m',
      'Chi_Phi_Vat_Lieu_Cvl_1000d',
      'Chi_Phi_Thi_Cong_Ctc_1000d',
      'Tong_Chi_Phi_Doan_1000d',
      'Tong_Chi_Phi_Doan_Ty_VND',
      'Tuoi_Tho_Nam',
      'Tac_Dong_Giao_Thong_xe_h',
    ];

    const rows = details.map((d) => [
      d.segmentId,
      `"${d.segmentName}"`,
      d.D,
      d.Lh,
      d.H,
      d.f,
      `"${d.materialName}"`,
      `"${d.methodName}"`,
      d.unitPrice,
      Math.round(d.materialCost),
      Math.round(d.constructionCost),
      Math.round(d.totalCost),
      d.totalCostBillion.toFixed(4),
      d.lifespan,
      d.trafficImpact,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `phuong_an_cai_tao_${solution.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(solution, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `phuong_an_cai_tao_${solution.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Bảng Thanh tra Chi tiết 18 Đoạn Cống Hư hỏng (Segment Inspector)
            </h2>
            {solution.isPreset && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Phương án mẫu {solution.isPreset}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mã nghiệm: <span className="font-mono text-cyan-300">{solution.id}</span> • Số đoạn cống: 18 đoạn
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Xuất CSV
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-400" />
            Xuất JSON
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            In Báo cáo
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Tổng Chi phí Cải tạo C_ct
            </span>
            <span className="font-mono text-slate-400">1.000 VNĐ</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {solution.costBillion.toFixed(3)} <span className="text-sm font-semibold text-emerald-500">tỷ VNĐ</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between border-t border-slate-800/80 pt-1.5">
            <span>Vật liệu (C_vl): <strong className="text-slate-300">{(solution.materialCost / 1e6).toFixed(3)} tỷ</strong></span>
            <span>Thi công (C_tc): <strong className="text-slate-300">{(solution.constructionCost / 1e6).toFixed(3)} tỷ</strong></span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              Tuổi thọ Trung bình Toàn mạng lưới
            </span>
            <span className="font-mono text-slate-400">Mục tiêu 2</span>
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {solution.lifespan} <span className="text-sm font-semibold text-cyan-500">năm</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 truncate">
            Cơ cấu vật liệu: <strong className="text-amber-400">{stats.mat.sanh.pct}% Sành</strong>, <strong className="text-slate-300">{stats.mat.btct.pct}% BTCT</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-400" />
              Lưu lượng Giao thông bị Gián đoạn
            </span>
            <span className="font-mono text-slate-400">Mục tiêu 3</span>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {solution.traffic} <span className="text-sm font-semibold text-amber-500">xe/giờ</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
            Phương pháp: <strong className="text-red-400">{stats.meth.ttmm.count} đoạn mở móng</strong>, <strong className="text-emerald-400">{18 - stats.meth.ttmm.count} đoạn ngầm/sửa</strong>
          </div>
        </div>
      </div>

      {/* Structural breakdown badges */}
      <div className="mb-4 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-semibold">Tỷ lệ Vật liệu:</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Sành: {stats.mat.sanh.count} đoạn ({stats.mat.sanh.pct}%)
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
            HDPE: {stats.mat.hdpe.count} đoạn ({stats.mat.hdpe.pct}%)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            CSTT: {stats.mat.cstt.count} đoạn ({stats.mat.cstt.pct}%)
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-500/15 text-slate-300 border border-slate-500/30">
            BTCT: {stats.mat.btct.count} đoạn ({stats.mat.btct.pct}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-semibold">Phương pháp thi công:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            TCN: {stats.meth.tcn.count}
          </span>
          <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30">
            TTMM: {stats.meth.ttmm.count}
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
            SCL: {stats.meth.scl.count}
          </span>
          <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
            SCN: {stats.meth.scn.count}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-3">TT</th>
              <th className="py-3 px-3">Tên đoạn</th>
              <th className="py-3 px-3 text-right">D (mm)</th>
              <th className="py-3 px-3 text-right">Lh (m)</th>
              <th className="py-3 px-3 text-right">H (m)</th>
              <th className="py-3 px-3 text-right">f (xe/h)</th>
              <th className="py-3 px-3">Vật liệu thay thế</th>
              <th className="py-3 px-3">Phương pháp cải tạo</th>
              <th className="py-3 px-3 text-right">Đơn giá vật liệu (1.000đ/m)</th>
              <th className="py-3 px-3 text-right">Chi phí VL (1.000đ)</th>
              <th className="py-3 px-3 text-right">Chi phí TC (1.000đ)</th>
              <th className="py-3 px-3 text-right text-emerald-400">Tổng CP (1.000đ)</th>
              <th className="py-3 px-3 text-right text-amber-400">Tắc GT (xe/h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {details.map((row) => {
              const matMeta = MATERIAL_INFO[row.material];
              const methMeta = METHOD_INFO[row.method];

              return (
                <tr key={row.segmentId} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{row.segmentId}</td>
                  <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">{row.segmentName}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{row.D}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{row.Lh}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{row.H.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{row.f}</td>

                  {/* Material badge */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${matMeta.bgLight} ${matMeta.textColor} ${matMeta.borderColor}`}
                    >
                      {matMeta.name} ({matMeta.lifespan}y)
                    </span>
                  </td>

                  {/* Method badge */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${methMeta.bgLight} ${methMeta.textColor} ${methMeta.borderColor}`}
                    >
                      {methMeta.name}
                    </span>
                  </td>

                  {/* Unit price */}
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                    {row.unitPrice > 0 ? row.unitPrice.toLocaleString('vi-VN') : '—'}
                  </td>

                  {/* Material cost */}
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {row.materialCost > 0
                      ? Math.round(row.materialCost).toLocaleString('vi-VN')
                      : '0'}
                  </td>

                  {/* Construction cost */}
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {Math.round(row.constructionCost).toLocaleString('vi-VN')}
                  </td>

                  {/* Total segment cost */}
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                    {Math.round(row.totalCost).toLocaleString('vi-VN')}
                  </td>

                  {/* Traffic impact */}
                  <td className="py-2.5 px-3 text-right font-mono">
                    {row.trafficImpact > 0 ? (
                      <span className="text-red-400 font-bold">+{row.trafficImpact}</span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-950 font-bold text-slate-200 border-t border-slate-700">
            <tr>
              <td colSpan={2} className="py-3 px-3 text-slate-300 uppercase">
                Tổng cộng toàn mạng
              </td>
              <td className="py-3 px-3 text-right text-slate-400 font-mono">—</td>
              <td className="py-3 px-3 text-right font-mono text-cyan-400">
                {details.reduce((sum, d) => sum + d.Lh, 0)} m
              </td>
              <td colSpan={5} className="py-3 px-3 text-right text-slate-400 font-normal">
                Tổng chi phí = C_vl + C_tc:
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-300">
                {Math.round(solution.materialCost).toLocaleString('vi-VN')}
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-300">
                {Math.round(solution.constructionCost).toLocaleString('vi-VN')}
              </td>
              <td className="py-3 px-3 text-right font-mono text-emerald-400 text-sm">
                {Math.round(solution.cost).toLocaleString('vi-VN')}
              </td>
              <td className="py-3 px-3 text-right font-mono text-amber-400 text-sm">
                {solution.traffic} xe/h
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
