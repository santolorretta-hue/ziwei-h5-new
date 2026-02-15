import "./globals.css"; // 核心：引入 Tailwind 样式
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "紫微 AI 命理",
  description: "AI 驱动的紫微斗数流年运势分析",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      {/* 这里的 bg-[#0f0720] 确保了全屏即使没内容也是深紫色 */}
      <body className={`${inter.className} bg-[#0f0720] text-white`}>
        {children}
      </body>
    </html>
  );
}