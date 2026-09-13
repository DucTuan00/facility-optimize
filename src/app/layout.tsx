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
  title: "Hệ thống Tối ưu hóa Cải tạo Thoát nước Đô thị | NSGA-II",
  description:
    "Công cụ hỗ trợ ra quyết định tối ưu hóa đa mục tiêu lựa chọn phương án cải tạo hệ thống thoát nước đô thị sử dụng giải thuật di truyền NSGA-II",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-slate-50 text-slate-800 min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans">
        {children}
      </body>
    </html>
  );
}
