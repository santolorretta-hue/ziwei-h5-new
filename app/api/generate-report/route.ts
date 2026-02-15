import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, gender, birthDate, birthTime } = body;

    // 1. 拆解日期 (为了配合你的 Python 参数)
    const dateObj = new Date(birthDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hour = parseInt(birthTime.split(':')[0]);

    console.log("正在呼叫 Python 大脑...");

    // ============================================================
    // 🎯 修正点 1：精准指向 /api/calc
    // ============================================================
    const myApiUrl = "https://ziwei-calc.vercel.app/api/calc"; 

    const apiResponse = await fetch(myApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      // ============================================================
      // 🎯 修正点 2：参数名严格对应你的 Python Class (PaipanRequest)
      // ============================================================
      body: JSON.stringify({ 
        year: year, 
        month: month, 
        day: day, 
        hour: hour, 
        gender: gender, // Python 里定义的是 gender
        minute: 0       // 补齐 minute 参数
      }),
    });

    if (!apiResponse.ok) {
      // 打印出 Python 返回的错误详情，方便调试
      const errorText = await apiResponse.text();
      console.error("Python API 报错:", errorText);
      throw new Error(`排盘服务连接失败 (${apiResponse.status}): ${errorText}`);
    }

    // 2. 拿到精准排盘数据
    const responseJson = await apiResponse.json();
    
    // 注意：你的 Python 返回结构是 { meta: ..., result: ..., formatted_output: ... }
    // 我们主要把 formatted_output (全文本报告) 和 result (数据) 喂给 AI
    const chartData = responseJson.result; 
    const fullText = responseJson.formatted_output;

    console.log("拿到数据，准备解盘...");

    // 3. 喂给 AI 解读
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `你是一位紫微斗数大师。
          我将为你提供一份【精准的程序排盘结果】。
          
          请注意：
          1. 用户的排盘信息（宫位、星曜、四化）已经完全计算好了，**绝对不要**自己重新排盘，必须以我提供的内容为准。
          2. 重点解读【来因宫】的含义，以及流年（2026年）的运势。
          3. 语气要温暖、给人力量。`
        },
        {
          role: "user",
          content: `这是计算出的详细命盘信息：\n\n${fullText}\n\n请为命主【${name}】（${gender}）进行2026流年运势的深度解读。`
        }
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ result: `大师正在闭关（错误：${error.message}）` });
  }
}