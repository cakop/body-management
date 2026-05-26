import { useState } from 'react';
import type { BMIResult, AIPlan } from '../types';

interface Props {
  bmiResult: BMIResult;
}

const API_URL = 'https://api.deepseek.com/chat/completions';
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

function buildPrompt(r: BMIResult): string {
  const { bmi, category, gender, age, height, weight } = r;
  const bmr = gender === 'male'
    ? (10 * weight + 6.25 * height - 5 * age + 5).toFixed(0)
    : (10 * weight + 6.25 * height - 5 * age - 161).toFixed(0);
  const tdee = (parseFloat(bmr) * 1.55).toFixed(0);

  return `你是一位专业的健身教练和营养师。请根据以下用户数据，制定个性化的运动和饮食计划。

用户信息：
- 性别：${gender === 'male' ? '男' : '女'}
- 年龄：${age} 岁
- 身高：${height} cm
- 体重：${weight} kg
- BMI：${bmi.toFixed(1)}（${category}）
- 每日基础代谢：${bmr} kcal
- 每日消耗估算：${tdee} kcal

请返回严格符合以下结构的 JSON（不要包含任何其他文字）：
{
  "exercise_plan": [
    { "name": "运动名称", "type": "有氧/力量/柔韧", "frequency": "每周次数", "duration": "每次时长", "notes": "注意事项" }
  ],
  "meal_plan": [
    { "meal": "早餐/午餐/晚餐/加餐", "foods": "具体食物", "calories": "热量 kcal", "notes": "说明" }
  ]
}

要求：
1. 运动计划包含 4-5 项不同类型的运动，覆盖有氧、力量、柔韧
2. 饮食计划包含一天 4 餐（早餐、午餐、晚餐、加餐），热量总和接近 TDEE
3. 所有建议必须基于用户的 BMI 分类（${category}）进行针对性调整
4. 用中文回复，JSON 字段也使用中文值`;
}

export default function AIPlanner({ bmiResult }: Props) {
  const [plan, setPlan] = useState<AIPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      setError('请先在 .env 文件中配置 VITE_DEEPSEEK_API_KEY');
      return;
    }

    setLoading(true);
    setError('');
    setPlan(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: '你是一个专业的健身和营养教练。你只返回 JSON，不返回任何其他文字。' },
            { role: 'user', content: buildPrompt(bmiResult) },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API 请求失败 (${res.status})`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error('API 返回为空');

      // Extract JSON from possible markdown code block
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('无法解析 AI 返回的 JSON');

      const parsed: AIPlan = JSON.parse(jsonMatch[0]);

      if (!parsed.exercise_plan?.length || !parsed.meal_plan?.length) {
        throw new Error('AI 返回的数据不完整');
      }

      setPlan(parsed);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '未知错误';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card ai-planner">
      <h2>AI 智能生成计划</h2>
      <p className="ai-desc">
        基于你的身体数据，由 DeepSeek AI 自动拆解为运动与饮食子任务
      </p>

      {!plan && !loading && !error && (
        <button className="btn btn-primary ai-btn" onClick={generate}>
          开始生成运动与饮食计划
        </button>
      )}

      {loading && (
        <div className="ai-loading">
          <div className="ai-spinner" />
          <p>AI 正在为你生成个性化计划…</p>
        </div>
      )}

      {error && (
        <div className="ai-error">
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={generate}>重试</button>
        </div>
      )}

      {plan && (
        <>
          <div className="ai-plan-grid">
            {/* Exercise plan */}
            <div className="ai-plan-card">
              <h3>运动计划</h3>
              <div className="ai-task-list">
                {plan.exercise_plan.map((t, i) => (
                  <div key={i} className="ai-task-item exercise">
                    <div className="ai-task-header">
                      <span className="ai-task-num">{i + 1}</span>
                      <span className="ai-task-name">{t.name}</span>
                      <span className={`ai-tag ${t.type === '有氧' ? 'tag-cardio' : t.type === '力量' ? 'tag-strength' : 'tag-flex'}`}>
                        {t.type}
                      </span>
                    </div>
                    <div className="ai-task-meta">
                      <span>{t.frequency}</span>
                      <span className="ai-meta-sep">|</span>
                      <span>{t.duration}</span>
                    </div>
                    <p className="ai-task-notes">{t.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal plan */}
            <div className="ai-plan-card">
              <h3>饮食计划</h3>
              <div className="ai-task-list">
                {plan.meal_plan.map((t, i) => (
                  <div key={i} className="ai-task-item meal">
                    <div className="ai-task-header">
                      <span className="ai-task-num">{i + 1}</span>
                      <span className="ai-task-name">{t.meal}</span>
                      <span className="ai-tag tag-calories">{t.calories} kcal</span>
                    </div>
                    <p className="ai-task-foods">{t.foods}</p>
                    <p className="ai-task-notes">{t.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ marginTop: 16, width: '100%' }} onClick={generate} disabled={loading}>
            重新生成
          </button>
        </>
      )}
    </div>
  );
}
