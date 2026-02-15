import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化 OpenAI (会自动读取你刚才设的 .env.local 里的 Key)
const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, birthDate, birthTime, gender } = body;

    // 1. 【模拟排盘数据】
    // 注意：这里暂时用假数据代替真实的排盘 API。
    // 等你以后有了真正的紫微斗数排盘接口，在这里替换掉即可。
    const mockZiweiChart = {
      命宫: "紫微、七杀",
      来因宫: "官禄宫", 
      生年四化: ["破军化禄", "巨门化权", "太阴化科", "贪狼化忌"],
      流年: "2026丙午年",
      流年命宫: "午宫 (无主星)",
      流年四化: ["天同化禄", "天机化权", "文昌化科", "廉贞化忌"]
    };

    // 2. 召唤 AI 进行解盘
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 或者用 gpt-3.5-turbo，为了省钱建议先用 mini
      messages: [
        {
          role: "system",
          content: `你是一位精通【钦天门（华山派）】紫微斗数的宗师，师承蔡明宏大师。
          请根据用户的排盘数据，用“缘起缘灭”的视角，生成一份2026年流年运势报告。
          
          要求：
          1. 必须提及“来因宫”对命运的影响。
          2. 重点分析“流年四化”对财运和事业的引动。
          3. 语气要高深但充满关怀，像一位得道高人。
          4. 输出格式支持 Markdown（可以加粗、分段）。`
        },
        {
          role: "user",
          content: `缘主姓名：${name}
          性别：${gender === 'male' ? '男' : '女'}
          生辰：${birthDate} ${birthTime}
          
          排盘核心数据：${JSON.stringify(mockZiweiChart)}
          
          请为我批算2026年的事业与财运。`
        }
      ],
    });

    const aiReport = completion.choices[0].message.content;

    // 3. 把结果返回给前端
    return NextResponse.json({ result: aiReport });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: '算命的人太多，天机暂时泄露不出来（报错了）' }, { status: 500 });
  }
}