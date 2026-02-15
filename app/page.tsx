'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male', 
    calendarType: 'solar',
    birthDate: '',
    birthTime: '00:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 开始转圈

    // 拼装跳转参数
    const query = new URLSearchParams(formData).toString();
    
    console.log("正在尝试跳转到:", `/report?${query}`);

    // 延迟 1 秒让用户看到转圈动画，然后跳转
    setTimeout(() => {
      router.push(`/report?${query}`);
    }, 1000);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0f0720]">
      
      {/* 装饰背景 */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 主卡片 */}
      <div className="z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">紫微 AI 命理</h1>
          <p className="text-gray-400 text-xs tracking-widest">钦天门秘传 · 真太阳时校正</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 姓名 */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 ml-1">缘主姓名</label>
            <input 
              required
              type="text" 
              placeholder="请输入姓名"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* 性别 (已修改：只显示男/女) */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-2 ml-1">性别</label>
              <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'male'})}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.gender === 'male' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  男
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'female'})}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.gender === 'female' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  女
                </button>
              </div>
            </div>
            
            <div className="flex-1">
               <label className="block text-xs text-gray-400 mb-2 ml-1">历法</label>
               <select 
                  className="w-full h-[46px] bg-black/40 border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                  onChange={(e) => setFormData({...formData, calendarType: e.target.value})}
               >
                 <option value="solar" className="text-black">📅 公历</option>
                 <option value="lunar" className="text-black">🌙 农历</option>
               </select>
            </div>
          </div>

          {/* 日期 */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 ml-1">出生日期</label>
            <input 
              required
              type="date" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
            />
          </div>

          {/* 时辰 */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 ml-1">出生时辰</label>
            <input 
              type="time" 
              defaultValue="00:00"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? '正在前往排盘...' : '立即测算 2026 运势'}
          </button>
        </form>
      </div>
    </main>
  );
}