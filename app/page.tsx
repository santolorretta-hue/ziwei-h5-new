'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 表单数据初始状态
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male', 
    birthDate: '',
    birthTime: '00:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 开始转圈

    // 拼装跳转参数
    const query = new URLSearchParams(formData).toString();
    
    // 延迟 800ms 让用户看到转圈动画，更有仪式感
    setTimeout(() => {
      router.push(`/report?${query}`);
    }, 800);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0f0720] font-sans">
      
      {/* 背景装饰：流动的紫光 */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 主卡片 */}
      <div className="z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* 卡片顶部的光效条 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white mb-2 tracking-tight">
            紫微 AI 命理
          </h1>
          <p className="text-purple-300/60 text-xs tracking-[0.3em] uppercase">
            钦天门秘传 · GPT-4o 灵魂解盘
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 姓名输入 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-1">缘主姓名</label>
            <input 
              required
              type="text" 
              placeholder="请输入您的姓名"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* 性别选择 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-1">性别 (阴阳)</label>
            <div className="flex bg-black/30 rounded-xl p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setFormData({...formData, gender: 'male'})}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${formData.gender === 'male' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-500 hover:text-gray-300'}`}
              >
                乾造 (男)
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, gender: 'female'})}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${formData.gender === 'female' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' : 'text-gray-500 hover:text-gray-300'}`}
              >
                坤造 (女)
              </button>
            </div>
          </div>

          {/* 出生日期 */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs text-gray-400 ml-1">出生日期 (公历)</label>
              <input 
                required
                type="date" 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all [color-scheme:dark]"
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
            <div className="w-1/3 space-y-2">
              <label className="text-xs text-gray-400 ml-1">时辰</label>
              <input 
                type="time" 
                defaultValue="00:00"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all [color-scheme:dark] text-center"
                onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                正在开启命盘...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                立即测算 2026 运势 <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}