'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function ReportContent() {
  const searchParams = useSearchParams();
  
  // 1. 获取 URL 里的参数
  const name = searchParams.get('name') || '缘主';
  const gender = searchParams.get('gender') === 'male' ? '男' : '女';
  const birthDate = searchParams.get('birthDate');
  const birthTime = searchParams.get('birthTime');
  const calendarType = searchParams.get('calendarType') === 'lunar' ? '农历' : '公历';

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState('');

  useEffect(() => {
    // 2. 页面加载后，立即呼叫后端 API
    async function fetchReport() {
      try {
        console.log("正在请求 AI 算命...");
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, gender, birthDate, birthTime, calendarType }),
        });

        const data = await res.json();
        
        if (data.result) {
          setReport(data.result); // 拿到结果，显示出来
        } else {
          setReport("大师正在闭关（API连接失败，请检查Key）");
        }
      } catch (e) {
        console.error(e);
        setReport("网络连接中断，天机难测。");
      } finally {
        setLoading(false); // 结束转圈
      }
    }

    if (birthDate) {
      fetchReport();
    }
  }, [name, gender, birthDate, birthTime, calendarType]);

  // --- 界面部分 ---

  // 状态 A: 加载中（转圈圈）
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0720] flex flex-col items-center justify-center text-purple-200">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse tracking-widest">钦天门紫微排盘中...</p>
        <p className="text-xs text-gray-500 mt-2">正在推算 2026 流年四化</p>
      </div>
    );
  }

  // 状态 B: 显示结果
  return (
    <div className="min-h-screen bg-[#0f0720] p-6 text-white">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* 头部信息 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
            2026 丙午流年命书
          </h1>
          <div className="mt-2 text-xs text-purple-400 border border-purple-800/50 rounded-full py-1 px-3 inline-block bg-black/30">
            {name} · {gender} · {birthDate} {birthTime}
          </div>
        </div>

        {/* AI 报告卡片 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="prose prose-invert prose-purple max-w-none">
             {/* 简单的 Markdown 渲染：按行显示 */}
             {report.split('\n').map((line, i) => (
               <p key={i} className={`leading-relaxed ${line.startsWith('#') ? 'font-bold text-lg text-purple-200 mt-6' : 'text-gray-300'}`}>
                 {line.replace(/#/g, '')}
               </p>
             ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="text-center pb-10">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">
            ← 返回重新测算
          </Link>
        </div>

      </div>
    </div>
  );
}

// 必须加 Suspense，否则构建会报错
export default function ReportPage() {
  return (
    <Suspense fallback={<div className="text-white text-center pt-20">加载组件中...</div>}>
      <ReportContent />
    </Suspense>
  );
}