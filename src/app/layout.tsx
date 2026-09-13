import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tối ưu hóa Cải tạo Hệ thống Thoát nước TP. Sầm Sơn | NSGA-II",
  description:
    "Mô hình tối ưu hóa đa mục tiêu lựa chọn phương án cải tạo hệ thống thoát nước TP. Sầm Sơn, Thanh Hóa sử dụng giải thuật di truyền NSGA-II (Đặng Minh Hải, 2018)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-black font-sans">
        {children}
      </body>
    </html>
  );
}
