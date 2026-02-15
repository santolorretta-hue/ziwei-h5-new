import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Lunar } from 'lunar-javascript'; // 引入农历库

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { name, gender, calendarType, birthDate, birthTime } = body;

    // ==========================================
    // 📅 核心修复：处理农历转公历逻辑
    // ==========================================
    
    // 1. 拆解前端传来的日期 (格式: YYYY-MM-DD)
    let [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);

    // 2. 如果用户选了“农历”，在这里转成公历
    if (calendarType === 'lunar') {
      try {
        console.log(`正在将农历 ${year}年${month}月${day}日 转换为公历...`);
        
        // 实例化农历日期 (注意：fromYmd 的月份不需要 -1)
        const lunarDate = Lunar.fromYmd(year, month, day);
        const solarDate = lunarDate.getSolar(); // 转为公历对象

        // 更新变量为公历数据
        year = solarDate.getYear();
        month = solarDate.getMonth();
        day = solarDate.getDay();

        console.log(`转换成功：公历 ${year}年${month}月${day}日`);
      } catch (e) {
        throw new Error("农历日期无效，请检查是否选择了不存在的闰月日期");
      }
    }

    // ==========================================
    // 🚀 调用 Python 排盘 (发送公历数据)
    // ==========================================
    
    const pythonApiUrl = "https://ziwei-calc.vercel.app/api/calc"; 
    
    // 注意：无论用户选什么，这里发给 Python 的永远是转换好的【公历】
    const apiResponse = await fetch(pythonApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year, 
        month, 
        day,
        hour, 
        minute: minute || 0,
        gender: gender === 'male' ? '男' : '女',
        name: name
      }),
    });

    if (!apiResponse.ok) {
      throw new Error(`排盘服务连接异常: ${apiResponse.status}`);
    }

    const calcData = await apiResponse.json();
    
    // 准备数据
    const dataString = JSON.stringify(calcData.result, null, 2);
    const expertText = calcData.formatted_output || "";

    // ==========================================
    // 🧙‍♂️ 宗师 AI 解析 (保持原样)
    // ==========================================
    const SYSTEM_PROMPT = `
# Role: 钦天门紫微斗数宗师 (Deep Soul Surgeon)

# 核心任务：
你必须基于用户提供的排盘数据，严格按照【钦天五阶段断命流程】进行深度解析。
**严禁废话**，每一个结论都必须附带**【技术判定依据】** (判定依据：XX星在XX宫/XX四化/XX联动)。

# 阶段一：【立极】找准源头
- **动作**：根据【来因宫】判断命主是“自立格”还是“他立格”。
- **判定逻辑**：
  - 自立格 (命、疾、财、官、田、福)：成败由己，因果不求人。
  - 他立格 (兄、夫、子、迁、友、父)：成败、债务深度捆绑他人。
- **输出要求**：直接点出“你这一世的发射台在【XX宫】，属于【XX格】”。

# 阶段二：【定象】原始剧本
- **动作**：解析生年四化 (禄权科忌) 的落宫。
- **判定逻辑**：
  - 禄 (缘)：福报与生机所在。
  - 忌 (债)：终结、执着与亏欠所在。
- **输出要求**：告诉命主哪里是他的人生“坑”(忌)，哪里是他的“源”(禄)。

# 阶段三：【数理】河图空间联动
- **动作**：必须解析【1-6 共宗】(命疾) 和【4-9 为友】(子官) 的体用关系。
- **重点解析**：如果来因在子女(4)，必须看官禄(9)。若官禄不好，则合伙/项目是“空中楼阁”。

# 阶段四：【析理】后天变数
- **动作**：检查各宫位的【自化】。
- **判定逻辑**：自化忌是最大的漏气点，代表彻底流失、半途而废。
- **输出要求**：明确指出哪个领域命主会“得而复失”。

# 阶段五：【应气】时空爆发点
- **动作**：解析【大限】(10年运) 和 【2026 丙午流年】。
- **判定逻辑**：当流年命宫重叠大限忌，或流年干引发廉贞忌，即为爆发点。

# 宗师解药 (钦天三法)
针对命主的死结，必须给出三条具体建议：
1. **【以禄破忌】** (心态)：用生年禄宫位的心态去化解忌的执着。
2. **【以科解忌】** (契约)：引入“科”的逻辑(贵人/文书/合同)。2026年必须白纸黑字。
3. **【宫位置换】** (行动)：若A宫(如子女)出问题，去经营B宫(如官禄)来对冲。

# 输出格式规范：
1. **结论先行**：不要堆砌术语，先说人话，后补依据。
   - 例：“你的合伙运很差 (判定依据：子女宫自化忌，且冲官禄宫)。”
2. **排版美学**：保持短促有力，分段清晰。
3. **严禁星号**：不要在关键词周围加星号，直接写文字。
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `
            命主姓名：${name}
            性别：${gender}
            历法：${calendarType === 'lunar' ? '农历' : '公历'} ${body.birthDate}
            (系统已自动校正为公历：${year}-${month}-${day})
            
            【Python排盘核心数据】
            ${dataString}
            
            【专家诊断文本参考】
            ${expertText}
            
            请开始你的“灵魂手术”，必须包含技术判定依据。
          ` 
        }
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ result: `宗师正在闭关（错误：${error.message}）` });
  }
}