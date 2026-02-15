'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        setResult(data.result);
      } catch (e) {
        setResult('算力火爆，请稍后再试。');
      } finally {
        setLoading(false);
      }
    };
    if (searchParams.get('name')) fetchData();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#0f0720] text-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-purple-400 mb-8 inline-block">← 返回</Link>

        {loading ? (
          <div className="py-20 text-center animate-pulse text-purple-400">宗师正在观星推演...</div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* 🌟 核心：使用 ReactMarkdown 配合 prose 类名 */}
            <article className="prose prose-invert prose-purple max-w-none 
              prose-headings:text-purple-400 prose-headings:border-b prose-headings:border-purple-500/20 prose-headings:pb-2
              prose-strong:text-purple-300 prose-strong:bg-purple-500/10 prose-strong:px-1
              prose-p:leading-relaxed">
              <ReactMarkdown>{result}</ReactMarkdown>
            </article>
            
            <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500 italic">
              —— 钦天门宗师 AI 灵魂手术室 ——
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


// 强制触发更新 v1.0