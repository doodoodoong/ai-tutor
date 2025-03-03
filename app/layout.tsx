import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "장산GPT",
  description: "장산초등학교 학생을 위한 AI 채팅 서비스",
  icon: "/jangsan.png"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-black`}>{children}</body>
    </html>
  );
}
