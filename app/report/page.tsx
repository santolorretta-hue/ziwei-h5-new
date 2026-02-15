'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

// 1. 内部内容组件
function ReportContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasParams, setHasParams] = useState(false);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    // 没参数 = 直接访问了链接 = 显示空状态
    if (!params.name) {
      setHasParams(false);
      return;
    }

    // 有参数 = 开始请求
    setHasParams(true);
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        setResult(data.result || "宗师正在闭关，请稍后重试。");
      } catch (e) {
        setResult('网络拥堵，请重试。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Loading 状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
         <div className="relative">
           <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
           <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-b-purple-300/50 rounded-full animate-spin-slow"></div>
         </div>
         <p className="mt-8 text-purple-300 font-medium tracking-[0.2em] animate-pulse">
           宗师正在排盘推演...
         </p>
         <p className="mt-2 text-xs text-gray-500">正在连接钦天四化数据库</p>
      </div>
    );
  }

  // 空状态 (返回不了的原因可能在这里，现在加了按钮)
  if (!hasParams) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-6 opacity-50">🔮</div>
        <h3 className="text-xl text-gray-300 font-bold mb-4">未检测到命盘数据</h3>
        <Link href="/" className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors shadow-lg">
          ← 返回首页重新输入
        </Link>
      </div>
    );
  }

  // 正常结果
  return (
    <div className="relative">
      {/* 结果卡片 */}
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-12 border border-white/10 shadow-2xl min-h-[500px]">
        
        {/* 顶部装饰 */}
        <div className="flex justify-center mb-10">
           <div className="h-1 w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-50"></div>
        </div>

        <article className="
          prose prose-invert prose-purple max-w-none
          /* 标题样式 */
          prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-br prose-headings:from-purple-200 prose-headings:to-purple-400
          prose-headings:font-bold prose-headings:tracking-wide 
          prose-h1:text-3xl prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-6 prose-h1:mb-10
          prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6
          
          /* 正文样式 */
          prose-p:text-gray-300 prose-p:leading-8 prose-p:text-base prose-p:tracking-wide
          
          /* 重点加粗样式 - 解决星号问题的关键 */
          prose-strong:text-purple-300 prose-strong:font-bold prose-strong:bg-purple-900/30 prose-strong:px-1.5 prose-strong:py-0.5 prose-strong:rounded
          
          /* 列表样式 */
          prose-li:text-gray-300 prose-li:marker:text-purple-500
        ">
          <ReactMarkdown>{result}</ReactMarkdown>
        </article>

        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600 tracking-[0.3em] uppercase opacity-70">
            —— 钦天门 · 命不由天 ——
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. 主页面 (包含 Suspense 防弹衣)
export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[#0f0720] text-gray-200 p-4 sm:p-8 font-sans relative">
      {/* 顶部导航栏 */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center z-10 relative">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          <span>重新测算</span>
        </Link>
        <div className="text-xs font-mono text-purple-500/50 border border-purple-500/20 px-3 py-1 rounded">
          VER: 4.0-Pro
        </div>
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        <Suspense fallback={<div className="text-center py-20 text-gray-500">正在初始化...</div>}>
          <ReportContent />
        </Suspense>
      </div>
    </main>
  );
}