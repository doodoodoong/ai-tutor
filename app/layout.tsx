import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 학습 도우미",
  description: "증도초등학교 학생을 위한 AI 채팅 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="flex h-screen">
          <aside className="w-64 bg-white shadow-md">
            {/* 사이드바 내용 */}
          </aside>
          <main className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm p-4">
              <h1 className="text-xl font-semibold">AI 학습 도우미</h1>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
