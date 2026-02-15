'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

// 1. 定义一个“干活”的内部组件 (这里面使用 useSearchParams)
function ReportContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        
        // 只有当有参数时才请求
        if (!params.name) return;

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

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
         <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
         <p className="text-purple-400 animate-pulse tracking-widest">宗师正在观星推演...</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
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
  );
}

// 2. 定义主页面组件 (给上面的组件穿上 Suspense 防弹衣)
// ⚠️ 这才是 Next.js 编译不报错的关键！
export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[#0f0720] text-gray-200 p-6 sm:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-8 text-purple-400 hover:text-purple-300 transition-colors">
          ← 返回重新测算
        </Link>

        {/* 🌟 核心修复：Suspense 边界 */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
             <p className="text-purple-400 animate-pulse tracking-widest">正在加载界面...</p>
          </div>
        }>
          <ReportContent />
        </Suspense>

      </div>
    </main>
  );
}