'use client';

import React, { useMemo, useState } from 'react';
import { Individual } from '@/types';
import { MATERIAL_INFO, METHOD_INFO } from '@/lib/constants';
import {
  FileSpreadsheet,
  FileJson,
  Printer,
  Table,
  DollarSign,
  Clock,
  Car,
  Search,
} from 'lucide-react';

interface SegmentTableProps {
  solution: Individual | null;
}

export const SegmentTable: React.FC<SegmentTableProps> = ({ solution }) => {
  const [filterText, setFilterText] = useState('');
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

  // Filtered rows
  const filteredDetails = useMemo(() => {
    if (!details) return [];
    if (!filterText.trim()) return details;
    const q = filterText.toLowerCase();
    return details.filter(
      (d) =>
        d.segmentName.toLowerCase().includes(q) ||
        d.materialName.toLowerCase().includes(q) ||
        d.methodName.toLowerCase().includes(q)
    );
  }, [details, filterText]);

  if (!solution || !details || !stats) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs">
        <Table className="w-9 h-9 mx-auto mb-2 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-800">Chưa chọn phương án nào</h3>
        <p className="text-xs text-slate-500 mt-0.5">
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
    <div id="step3-table" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs scroll-mt-6">
      {/* Active Sync Alert */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-3.5 py-2 rounded-lg bg-blue-50/60 border border-blue-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-slate-600">Bảng này đang thể hiện phương án:</span>
          <strong className="text-slate-900 font-mono">{solution.id}</strong>
          {solution.isPreset ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Phương án mẫu {solution.isPreset}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              Nghiệm NSGA-II
            </span>
          )}
        </div>
        <span className="text-slate-500 text-[11px]">
          Tự động đồng bộ khi bạn bấm vào các nút hoặc kéo thanh trượt ở trên
        </span>
      </div>

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Chi tiết Phương án Cải tạo cho 18 Đoạn Cống
            </h2>
            {solution.isPreset && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                Phương án mẫu {solution.isPreset}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mã nghiệm: <span className="font-mono font-semibold text-slate-800">{solution.id}</span> • Tổng chiều dài cống hỏng: {details.reduce((s, d) => s + d.Lh, 0)} m
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Xuất CSV
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-600" />
            JSON
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            In
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
        <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-200">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Tổng Chi phí Cải tạo (C_ct)
            </span>
          </div>
          <div className="text-xl font-bold text-emerald-800 font-mono">
            {solution.costBillion.toFixed(3)} <span className="text-xs font-normal text-emerald-700">tỷ VNĐ</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 flex justify-between border-t border-emerald-200/60 pt-1.5">
            <span>Vật liệu: <strong className="font-mono">{(solution.materialCost / 1e6).toFixed(3)} tỷ</strong></span>
            <span>Thi công: <strong className="font-mono">{(solution.constructionCost / 1e6).toFixed(3)} tỷ</strong></span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-sky-50/40 border border-sky-200">
          <div className="flex items-center justify-between text-xs text-sky-800 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              Tuổi thọ Trung bình (SL)
            </span>
          </div>
          <div className="text-xl font-bold text-sky-800 font-mono">
            {solution.lifespan} <span className="text-xs font-normal text-sky-700">năm</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-700 border-t border-sky-200/60 pt-1.5 truncate">
            Sành: <strong>{stats.mat.sanh.pct}%</strong> • BTCT: <strong>{stats.mat.btct.pct}%</strong>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-50/40 border border-amber-200">
          <div className="flex items-center justify-between text-xs text-amber-900 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-600" />
              Mức Tắc đường (GT)
            </span>
          </div>
          <div className="text-xl font-bold text-amber-900 font-mono">
            {solution.traffic} <span className="text-xs font-normal text-amber-800">xe/giờ</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 border-t border-amber-200/60 pt-1.5">
            Mở móng (TTMM): <strong>{stats.meth.ttmm.count} đoạn</strong> • Không mở: <strong>{18 - stats.meth.ttmm.count} đoạn</strong>
          </div>
        </div>
      </div>

      {/* Structural breakdown badges & Filter */}
      <div className="mb-3 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-600 font-medium">Vật liệu:</span>
          <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
            Sành: {stats.mat.sanh.count} ({stats.mat.sanh.pct}%)
          </span>
          <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
            HDPE: {stats.mat.hdpe.count} ({stats.mat.hdpe.pct}%)
          </span>
          <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
            CSTT: {stats.mat.cstt.count} ({stats.mat.cstt.pct}%)
          </span>
          <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
            BTCT: {stats.mat.btct.count} ({stats.mat.btct.pct}%)
          </span>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo đoạn, vật liệu..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs rounded-md bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-[11px]">
            <tr>
              <th className="py-2.5 px-3">TT</th>
              <th className="py-2.5 px-3">Tên đoạn</th>
              <th className="py-2.5 px-3 text-right">D (mm)</th>
              <th className="py-2.5 px-3 text-right">Lh (m)</th>
              <th className="py-2.5 px-3 text-right">H (m)</th>
              <th className="py-2.5 px-3 text-right">f (xe/h)</th>
              <th className="py-2.5 px-3">Vật liệu</th>
              <th className="py-2.5 px-3">Phương pháp</th>
              <th className="py-2.5 px-3 text-right">Đơn giá VL (1.000đ/m)</th>
              <th className="py-2.5 px-3 text-right">Chi phí VL (1.000đ)</th>
              <th className="py-2.5 px-3 text-right">Chi phí TC (1.000đ)</th>
              <th className="py-2.5 px-3 text-right text-emerald-700">Tổng CP (1.000đ)</th>
              <th className="py-2.5 px-3 text-right text-amber-700">Tắc GT (xe/h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredDetails.map((row) => {
              const matMeta = MATERIAL_INFO[row.material];
              const methMeta = METHOD_INFO[row.method];

              return (
                <tr key={row.segmentId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-3 font-mono text-slate-500">{row.segmentId}</td>
                  <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">{row.segmentName}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">{row.D}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">{row.Lh}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">{row.H.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">{row.f}</td>

                  {/* Material badge */}
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border ${matMeta.bgLight} ${matMeta.textColor} ${matMeta.borderColor}`}
                    >
                      {matMeta.name} ({matMeta.lifespan}y)
                    </span>
                  </td>

                  {/* Method badge */}
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border ${methMeta.bgLight} ${methMeta.textColor} ${methMeta.borderColor}`}
                    >
                      {methMeta.name}
                    </span>
                  </td>

                  {/* Unit price */}
                  <td className="py-2 px-3 text-right font-mono text-slate-600">
                    {row.unitPrice > 0 ? row.unitPrice.toLocaleString('vi-VN') : '—'}
                  </td>

                  {/* Material cost */}
                  <td className="py-2 px-3 text-right font-mono text-slate-700">
                    {row.materialCost > 0
                      ? Math.round(row.materialCost).toLocaleString('vi-VN')
                      : '0'}
                  </td>

                  {/* Construction cost */}
                  <td className="py-2 px-3 text-right font-mono text-slate-700">
                    {Math.round(row.constructionCost).toLocaleString('vi-VN')}
                  </td>

                  {/* Total segment cost */}
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                    {Math.round(row.totalCost).toLocaleString('vi-VN')}
                  </td>

                  {/* Traffic impact */}
                  <td className="py-2 px-3 text-right font-mono">
                    {row.trafficImpact > 0 ? (
                      <span className="text-red-600 font-bold">+{row.trafficImpact}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-bold text-slate-800 border-t-2 border-slate-200">
            <tr>
              <td colSpan={2} className="py-2.5 px-3 text-slate-700 uppercase text-[11px]">
                Tổng cộng toàn mạng
              </td>
              <td className="py-2.5 px-3 text-right text-slate-400 font-mono">—</td>
              <td className="py-2.5 px-3 text-right font-mono text-blue-700">
                {details.reduce((sum, d) => sum + d.Lh, 0)} m
              </td>
              <td colSpan={5} className="py-2.5 px-3 text-right text-slate-500 font-normal">
                Tổng cộng:
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                {Math.round(solution.materialCost).toLocaleString('vi-VN')}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                {Math.round(solution.constructionCost).toLocaleString('vi-VN')}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-emerald-800 text-xs font-bold">
                {Math.round(solution.cost).toLocaleString('vi-VN')}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-amber-800 text-xs font-bold">
                {solution.traffic} xe/h
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
