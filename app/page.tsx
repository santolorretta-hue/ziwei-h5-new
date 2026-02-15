'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReport = async () => {
      try {
        // 1. 获取 URL 参数
        const params = Object.fromEntries(searchParams.entries());
        
        // 2. 调用你的 API (这里假设你的 API 路由是 /api/generate-report)
        const response = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });

        const data = await response.json();
        setResult(data.report || '未能生成报告，请稍后再试。');
      } catch (error) {
        console.error('生成失败:', error);
        setResult('算力火爆，宗师正在闭关，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.get('name')) {
      generateReport();
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#0f0720] text-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* 顶部返回按钮 */}
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors">
          <span className="mr-2">←</span> 返回重新测算
        </Link>

        {loading ? (
          /* 加载状态：宗师运功动画 */
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-purple-400 tracking-[0.2em] animate-pulse">宗师正在观星排盘，请稍候...</p>
          </div>
        ) : (
          /* 结果展示区域：灵魂手术室 */
          <div className="relative">
            {/* 背景装饰光效 */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              
              {/* 报告头部装饰 */}
              <div className="h-2 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              
              <div className="p-6 sm:p-12">
                <div className="text-center mb-12">
                  <h2 className="text-purple-400 text-sm tracking-[0.3em] mb-2">2026 丙午流年 · 灵魂命书</h2>
                  <div className="h-[1px] w-20 bg-purple-500/30 mx-auto"></div>
                </div>

                {/* 🌟 核心：使用 ReactMarkdown 渲染结果 */}
                <article className="
                  prose 
                  prose-invert 
                  prose-purple 
                  max-w-none 
                  
                  /* 自定义 Markdown 样式，消除 * 号并加粗 */
                  prose-headings:font-bold 
                  prose-h1:text-3xl prose-h1:text-purple-400 prose-h1:mb-8
                  prose-h2:text-2xl prose-h2:text-purple-300 prose-h2:mt-12 prose-h2:border-b prose-h2:border-purple-500/20 prose-h2:pb-2
                  prose-strong:text-purple-300 prose-strong:bg-purple-500/10 prose-strong:px-1 prose-strong:rounded
                  prose-p:text-gray-300 prose-p:leading-loose prose-p:mb-6
                  prose-li:text-gray-300
                ">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </article>

                {/* 底部落款 */}
                <div className="mt-16 pt-8 border-t border-white/5 text-center">
                  <p className="text-xs text-gray-500 tracking-widest uppercase">
                    —— 钦天门宗师 AI 灵魂手术室 ——
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}