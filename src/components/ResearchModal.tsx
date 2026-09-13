'use client';

import React from 'react';
import { X, BookOpen, Calculator, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { MATERIAL_INFO } from '@/lib/constants';
import { PRECALCULATED_PRICES } from '@/lib/interpolation';

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchModal: React.FC<ResearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 text-slate-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Cơ sở Lý thuyết & Mô hình Toán học
            </h2>
            <p className="text-xs text-slate-500">
              Nguồn: Đặng Minh Hải (2018), Tạp chí Khoa học Kỹ thuật Thủy lợi và Môi trường (Số 63, 12/2018)
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              1. Bối cảnh &amp; Bộ Dữ liệu Nghiên cứu Mẫu (Case Study)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Mô hình áp dụng cho mạng lưới thoát nước đô thị với các đặc tính kỹ thuật điển hình (độ sâu chôn cống từ 1.0 m đến 6.0 m, đường kính từ 300 mm đến 600 mm). Bộ dữ liệu thực nghiệm gồm <span className="font-semibold text-slate-900">18 đoạn cống bị hư hỏng nghiêm trọng</span> (chiều dài hư hỏng $L_h$ vượt quá 25% chiều dài đoạn cống) được dùng để hiệu chuẩn và kiểm chứng tính hiệu quả của giải thuật tối ưu hóa đa mục tiêu NSGA-II.
            </p>
          </div>

          {/* Section 2: Mathematical Objectives */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              2. Ba Hàm Mục Tiêu Tối Ưu (3 Objective Functions)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Objective 1 */}
              <div className="p-3.5 rounded-lg bg-white border border-emerald-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  Mục tiêu 1: Chi phí C_ct
                </div>
                <div className="text-sm font-bold text-slate-900 mb-2">TỐI THIỂU HÓA (MIN)</div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs font-mono text-emerald-800 mb-2">
                  C_ct = C_vl + C_tc
                </div>
                <p className="text-xs text-slate-600">
                  Tổng chi phí mua sắm ống mới (C_vl) cộng với tổng chi phí thi công xây lắp (C_tc). Khi sửa chữa (SCL, SCN), chi phí mua vật liệu mới C_i = 0.
                </p>
              </div>

              {/* Objective 2 */}
              <div className="p-3.5 rounded-lg bg-white border border-sky-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 mb-1">
                  Mục tiêu 2: Tuổi thọ SL
                </div>
                <div className="text-sm font-bold text-slate-900 mb-2">TỐI ĐA HÓA (MAX)</div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs font-mono text-sky-800 mb-2">
                  SL = (1/18) * Σ Y_i
                </div>
                <p className="text-xs text-slate-600">
                  Tuổi thọ trung bình toàn hệ thống sau cải tạo (năm), phụ thuộc vào vật liệu thay thế: BTCT (25 năm), CSTT (30 năm), HDPE (50 năm), Sành (100 năm).
                </p>
              </div>

              {/* Objective 3 */}
              <div className="p-3.5 rounded-lg bg-white border border-amber-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                  Mục tiêu 3: Giao thông GT
                </div>
                <div className="text-sm font-bold text-slate-900 mb-2">TỐI THIỂU HÓA (MIN)</div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs font-mono text-amber-800 mb-2">
                  GT = Σ a_i * f_i
                </div>
                <p className="text-xs text-slate-600">
                  Mức độ gây ùn tắc giao thông (xe/giờ). Hệ số a_i = 1 nếu đào hở mở móng (TTMM) và a_i = 0 nếu thi công ngầm (TCN) hoặc sửa chữa tại chỗ.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Cost formulas */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">
              3. Công thức Chi phí Thi công C_tc,i (1.000 VNĐ) theo Yang &amp; Su (2007)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-emerald-700 font-bold block mb-1">TCN (Không mở móng):</span>
                C_tc = 22 * D + 12062
              </div>
              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-rose-700 font-bold block mb-1">TTMM (Mở móng đào hở):</span>
                C_tc = 0.009*D² + 550*H² + 0.9*D*H - 1168*H + 1.4*D + 4299
              </div>
              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-purple-700 font-bold block mb-1">SCL (Sửa chữa lớn):</span>
                C_tc = 55 * D + 15288
              </div>
              <div className="p-2.5 rounded bg-white border border-slate-200">
                <span className="text-sky-700 font-bold block mb-1">SCN (Sửa chữa nhỏ):</span>
                C_tc = 60 * D + 5400
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              * Trong đó $D$ tính bằng mm ($300, 400, 500, 600$), $H$ tính bằng mét ($2.5 \div 6.0$ m).
            </p>
          </div>

          {/* Section 4: Materials & Constraints */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              4. Ràng buộc Kỹ thuật & Bảng Đơn giá Nội suy (1.000 VNĐ/m)
            </h3>
            <div className="mb-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Ràng buộc không gian nghiệm:</span> Nếu áp dụng phương pháp Sửa chữa lớn (SCL, CM=3) hoặc Sửa chữa nhỏ (SCN, CM=4) thì bắt buộc vật liệu là Bê tông cốt thép ($M_i = 1$). Chỉ khi thay thế cống mới (TCN hoặc TTMM) mới được chọn 1 trong 4 loại vật liệu.
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Vật liệu</th>
                    <th className="py-2 px-3">Tuổi thọ</th>
                    <th className="py-2 px-3">D=300mm</th>
                    <th className="py-2 px-3 text-blue-700">D=400mm (Nội suy)</th>
                    <th className="py-2 px-3">D=500mm</th>
                    <th className="py-2 px-3 text-blue-700">D=600mm (Nội suy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                  {Object.values(MATERIAL_INFO).map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-semibold text-slate-900">{mat.name} ({mat.fullName})</td>
                      <td className="py-2 px-3 text-slate-600">{mat.lifespan} năm</td>
                      <td className="py-2 px-3">{PRECALCULATED_PRICES[mat.id][300]}</td>
                      <td className="py-2 px-3 text-blue-700 font-bold">{PRECALCULATED_PRICES[mat.id][400]}</td>
                      <td className="py-2 px-3">{PRECALCULATED_PRICES[mat.id][500]}</td>
                      <td className="py-2 px-3 text-blue-700 font-bold">{PRECALCULATED_PRICES[mat.id][600]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Genetic Algorithm */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              5. Thuật toán NSGA-II trong Web Worker
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Giải thuật di truyền đa mục tiêu NSGA-II (Deb et al., 2002) tiến hành phân tầng không vượt trội (Fast Non-dominated Sorting) kết hợp tính toán khoảng cách mật độ (Crowding Distance) để bảo toàn tính đa dạng trên mặt Pareto. Toán tử lai ghép 2 điểm (Two-point Crossover) và đột biến tự kiểm soát ràng buộc bảo đảm mọi cá thể sinh ra đều là nghiệm khả thi. Quá trình tính toán chạy trên luồng phụ Web Worker độc lập, không gây giật lag trình duyệt.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
