'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 表单数据：新增了 calendarType (历法)
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male', 
    calendarType: 'solar', // 默认为公历
    birthDate: '',
    birthTime: '00:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 拼装跳转参数
    const query = new URLSearchParams(formData).toString();
    
    // 延迟跳转，让动画飞一会儿
    setTimeout(() => {
      router.push(`/report?${query}`);
    }, 800);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050511] font-sans selection:bg-purple-500/30 text-white">
      
      {/* 🌌 核心背景升级：科技感网格 + 深空光晕 */}
      {/* 1. 基础网格线 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* 2. 顶部紫色极光 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-purple-600/20 rounded-[100%] blur-[100px] pointer-events-none"></div>
      
      {/* 3. 底部蓝色深渊 */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 主卡片：玻璃拟态 + 边框发光 */}
      <div className="z-10 w-full max-w-[440px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
        
        {/* 卡片顶部的扫描光效 */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70"></div>

        {/* 标题区：已删除副标题 */}
        <div className="text-center mb-10 mt-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-100 to-purple-400 tracking-tight drop-shadow-sm">
            紫微 AI 命理
          </h1>
          {/* 这里原本的副标题已去除 */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 姓名输入 */}
          <div className="space-y-2 group">
            <label className="text-xs text-purple-200/60 ml-1 tracking-wider uppercase">缘主姓名</label>
            <div className="relative">
              <input 
                required
                type="text" 
                placeholder="请输入您的姓名"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {/* 输入框右侧小图标 */}
              <div className="absolute right-4 top-3.5 text-gray-600">✎</div>
            </div>
          </div>

          {/* 性别选择 (已去除乾造/坤造) */}
          <div className="space-y-2">
            <label className="text-xs text-purple-200/60 ml-1 tracking-wider uppercase">性别</label>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setFormData({...formData, gender: 'male'})}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${formData.gender === 'male' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                ♂ 男
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, gender: 'female'})}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${formData.gender === 'female' ? 'bg-gradient-to-br from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                ♀ 女
              </button>
            </div>
          </div>

          {/* 📅 新增功能：历法选择 */}
          <div className="space-y-2">
            <label className="text-xs text-purple-200/60 ml-1 tracking-wider uppercase">历法选择</label>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setFormData({...formData, calendarType: 'solar'})}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${formData.calendarType === 'solar' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                公历 (阳历)
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, calendarType: 'lunar'})}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${formData.calendarType === 'lunar' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                农历 (阴历)
              </button>
            </div>
          </div>

          {/* 出生日期 & 时辰 */}
          <div className="flex gap-3">
            <div className="flex-[2] space-y-2">
              <label className="text-xs text-purple-200/60 ml-1 tracking-wider uppercase">出生日期</label>
              <input 
                required
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs text-purple-200/60 ml-1 tracking-wider uppercase">时辰</label>
              <input 
                type="time" 
                defaultValue="00:00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-center focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
              />
            </div>
          </div>
          
          {/* 提交按钮：流光特效 */}
          <button 
            type="submit" 
            disabled={loading}
            className="group relative w-full mt-8 overflow-hidden rounded-xl bg-purple-600 p-[1px] focus:outline-none active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-2 bg-[#0a0514] h-full px-4 py-4 rounded-[11px] group-hover:bg-opacity-80 transition-colors">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  <span className="text-white font-bold tracking-widest text-sm">连接时空...</span>
                </>
              ) : (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 font-bold tracking-widest text-lg">
                    立即测算
                  </span>
                  <span className="text-purple-300 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </div>
          </button>
          
          <div className="text-center">
            <p className="text-[10px] text-gray-600 font-mono">POWERED BY CHIN-TIAN ALGORITHM</p>
          </div>

        </form>
      </div>
    </main>
  );
}