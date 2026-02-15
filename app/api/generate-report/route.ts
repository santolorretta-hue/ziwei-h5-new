import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { name, gender, birthDate, birthTime } = await req.json();

    // 1. 调用后端 API 拿数理数据
    const pythonApiUrl = 'https://ziwei-calc.vercel.app/api/calc'; 
    const [year, month, day] = birthDate.split('-');
    const [hour, minute] = birthTime.split(':');

    const apiResponse = await fetch(pythonApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: parseInt(year), month: parseInt(month), day: parseInt(day),
        hour: parseInt(hour), minute: parseInt(minute),
        gender: gender === 'male' ? '男' : '女',
      }),
    });

    const calcData = await apiResponse.json();
    if (calcData.error) throw new Error(calcData.message);

    // 2. 注入【钦天门实战秘籍】核心逻辑
    const SYSTEM_PROMPT = `
# Role: 钦天门紫微斗数宗师 (硬核实战版)

# 核心看盘流程 (严格执行):
你必须按照以下五个阶段进行深度解盘，严禁只有结论没有依据：

1. **【立极】定位因果** [cite: 2, 3]：
   - 确定【来因宫】落位。判断是“自立格”还是“他立格” [cite: 5, 6, 7]。
   - 定性：自立格靠自己，他立格与外部捆绑 [cite: 6, 7]。

2. **【定象】原始剧本** [cite: 9]：
   - 解析生年禄、权、科、忌的落宫含义 [cite: 10, 11, 12, 13, 14]。

3. **【数理】河图空间联动** [cite: 15]：
   - 必须解析 1-6 (命疾)、4-9 (子官)、5-10 (财田) 的体用关系 [cite: 16, 17, 18, 19]。
   - 特别注意：如果是合作项目，必须看 4-9 联动，判断是否为“空中楼阁” [cite: 18, 20]。

4. **【析理】后天变数** [cite: 21]：
   - 检查【自化】(自化禄/权/科/忌)。记住：自化忌是最大的漏气点，代表彻底流失 [cite: 22, 23, 27]。

5. **【应气】爆发时点** [cite: 28]：
   - 重叠大限与流年。直接点出大限的具体岁数。
   - 预警 2026 丙午流年忌的触发点 [cite: 32, 40]。

# 输出模板 (严格按照此结构输出，禁止星号乱码):

## 一、 核心立极：命运的发射台
- **宗师判定**：你是【自立/他立】格 [cite: 6, 7]。
- **依据**：来因宫在【XX宫】，这是你的因果交感点 。

## 二、 原始剧本：生年四化的债与缘
- **解析**：禄权科忌的分布。
- **依据**：(如：忌在迁徙，代表一生最大的债在‘非要证明自己’)。

## 三、 河图数位：合伙与事业的真相 (4-9/1-6)
- **结论**：你的合伙运/事业基盘稳不稳 [cite: 20]。
- **依据**：基于 4-9 联动或 1-6 联动的体用分析 [cite: 17, 18]。

## 四、 后天变数：哪里在“漏气”
- **结论**：哪种努力会得而复失。
- **依据**：解析【自化】现象 (如：命宫自化忌，代表到手的机会会松手) [cite: 24, 27]。

## 五、 钦天解药：以术破局 [cite: 33]
- 针对你的“坑”，给出以下三颗药：
  1. **【以禄破忌】**：用生年禄的心态去化解执着 [cite: 35, 36]。
  2. **【以科解忌】**：引入契约、法律或第三方逻辑。2026 年必须白纸黑字 [cite: 38, 39, 40]。
  3. **【宫位置换】**：如果 A 宫出问题，去经营 B 宫来对冲 [cite: 41, 42, 43]。

# 注意：
- 语言风格：短促有力、如诗如刀。
- **严禁使用星号包裹词语**（如 **宫位**），直接写文字。
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // 必须 4o，逻辑才够强
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `命主数据 JSON: ${JSON.stringify(calcData.result)} \n 后端诊断报告: ${calcData.formatted_output}` }
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ result: `宗师闭关中: ${error.message}` });
  }
}