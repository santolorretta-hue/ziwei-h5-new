'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. 获取数据的逻辑
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        
        // 调用我们刚刚写好的强力 API
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        
        const data = await res.json();
        setResult(data.result || "未生成内容，请重试。");
        
      } catch (e) {
        setResult('网络拥堵，宗师正在重新连接...');
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.get('name')) {
      fetchData();
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#0f0720] text-gray-200 p-6 sm:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* 返回按钮 */}
        <Link href="/" className="inline-block mb-8 text-purple-400 hover:text-purple-300 transition-colors">
          ← 返回重新测算
        </Link>

        {loading ? (
          /* 加载动画 */
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
             <p className="text-purple-400 animate-pulse tracking-widest">宗师正在观星推演...</p>
          </div>
        ) : (
          /* 结果展示卡片 */
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
            
            {/* 🌟 核心修复：Prose + ReactMarkdown 彻底消灭乱码 */}
            <article className="
              prose prose-invert prose-purple max-w-none
              prose-headings:text-purple-400 prose-headings:font-bold prose-headings:tracking-wide
              prose-p:text-gray-300 prose-p:leading-loose
              prose-strong:text-purple-300 prose-strong:font-bold
              prose-li:text-gray-300
            ">
              <ReactMarkdown>{result}</ReactMarkdown>
            </article>

            <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600 italic">
              —— 钦天门宗师 AI 灵魂手术室 ——
            </div>
          </div>
        )}
      </div>
    </main>
  );
}