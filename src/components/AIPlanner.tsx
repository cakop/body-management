import { useState } from 'react';
import type { BMIResult, AIPlan } from '../types';

interface Props {
  bmiResult: BMIResult;
}

function calcBMR(r: BMIResult): number {
  return r.gender === 'male'
    ? 10 * r.weight + 6.25 * r.height - 5 * r.age + 5
    : 10 * r.weight + 6.25 * r.height - 5 * r.age - 161;
}

function generateLocalPlan(r: BMIResult): AIPlan {
  const bmr = calcBMR(r);
  const tdee = bmr * 1.55;
  const { category } = r;

  const exercises: Record<string, { name: string; type: string; frequency: string; duration: string; notes: string }[]> = {
    '偏瘦': [
      { name: '杠铃深蹲', type: '力量', frequency: '每周 3 次', duration: '每组 8-10 次 × 4 组', notes: '从空杆开始逐步加重量，注意膝盖不要内扣' },
      { name: '哑铃卧推', type: '力量', frequency: '每周 3 次', duration: '每组 8-10 次 × 4 组', notes: '控制离心节奏，感受胸肌发力' },
      { name: '引体向上 / 高位下拉', type: '力量', frequency: '每周 2-3 次', duration: '每组力竭 × 4 组', notes: '可用弹力带辅助，优先保证动作幅度' },
      { name: '快走', type: '有氧', frequency: '每周 2 次', duration: '每次 20-30 分钟', notes: '心率控制在 120-140，不要做大量有氧消耗热量' },
      { name: '瑜伽拉伸', type: '柔韧', frequency: '每周 2 次', duration: '每次 15-20 分钟', notes: '重点放松髋部和肩部，提升关节活动度' },
    ],
    '正常': [
      { name: '跑步 / 跳绳', type: '有氧', frequency: '每周 3-4 次', duration: '每次 30-40 分钟', notes: '保持心率在 130-150，可交替进行' },
      { name: '深蹲 + 硬拉', type: '力量', frequency: '每周 2-3 次', duration: '每组 10-12 次 × 4 组', notes: '复合动作为主，高效刺激全身肌群' },
      { name: '俯卧撑 / 哑铃推举', type: '力量', frequency: '每周 2-3 次', duration: '每组力竭 × 3 组', notes: '在家也能做，保持上肢力量' },
      { name: '平板支撑', type: '力量', frequency: '每周 3-4 次', duration: '每次 3 组，每组至力竭', notes: '收紧核心，身体呈一条直线' },
      { name: '瑜伽 / 普拉提', type: '柔韧', frequency: '每周 1-2 次', duration: '每次 30 分钟', notes: '提升柔韧性和身体控制力' },
    ],
    '偏胖': [
      { name: '快走 / 慢跑', type: '有氧', frequency: '每周 4-5 次', duration: '每次 40-50 分钟', notes: '从快走开始，逐步过渡到慢跑，保护膝关节' },
      { name: '游泳 / 骑行', type: '有氧', frequency: '每周 2-3 次', duration: '每次 30-45 分钟', notes: '低冲击有氧，对关节友好' },
      { name: '深蹲 + 弓步', type: '力量', frequency: '每周 3 次', duration: '每组 12-15 次 × 3 组', notes: '自重即可，重在动作标准' },
      { name: '弹力带划船', type: '力量', frequency: '每周 2-3 次', duration: '每组 15 次 × 3 组', notes: '训练背部肌肉，改善体态' },
      { name: '拉伸放松', type: '柔韧', frequency: '每周 3 次', duration: '每次 15 分钟', notes: '运动后拉伸，减少肌肉酸痛' },
    ],
    '肥胖': [
      { name: '快走', type: '有氧', frequency: '每周 5 次', duration: '每次 30-45 分钟', notes: '从 20 分钟开始逐步增加，关注心率（110-130）' },
      { name: '水中行走 / 游泳', type: '有氧', frequency: '每周 2-3 次', duration: '每次 30 分钟', notes: '水中运动减少关节压力，适合大体重' },
      { name: '坐姿哑铃训练', type: '力量', frequency: '每周 2-3 次', duration: '每组 12-15 次 × 3 组', notes: '坐着完成减少腰膝负担' },
      { name: '弹力带训练', type: '力量', frequency: '每周 2 次', duration: '每组 15 次 × 3 组', notes: '低风险抗阻训练，逐步建立力量基础' },
      { name: '静态拉伸', type: '柔韧', frequency: '每天', duration: '每次 10-15 分钟', notes: '改善柔韧性，缓解运动后紧绷' },
    ],
  };

  const mealConfigs: Record<string, { meals: { meal: string; foods: string; calories: number; notes: string }[]; deficit: number }> = {
    '偏瘦': {
      deficit: 300, // surplus
      meals: [
        { meal: '早餐', foods: '全麦面包 2 片 + 鸡蛋 2 个 + 全脂牛奶 250ml + 香蕉 1 根', calories: 0, notes: '高蛋白开启一天，不要空腹训练' },
        { meal: '午餐', foods: '米饭 200g + 鸡胸肉 / 牛肉 150g + 炒时蔬 + 豆腐', calories: 0, notes: '主食和蛋白质都要足量' },
        { meal: '晚餐', foods: '红薯 / 杂粮饭 150g + 鱼肉 150g + 西兰花 + 坚果一小把', calories: 0, notes: '优质脂肪和蛋白，睡前 2 小时吃完' },
        { meal: '加餐', foods: '酸奶 + 燕麦 + 蛋白粉（可选）', calories: 0, notes: '下午或训练后补充，帮助肌肉恢复' },
      ],
    },
    '正常': {
      deficit: 0,
      meals: [
        { meal: '早餐', foods: '全麦三明治（鸡蛋 + 生菜 + 火腿） + 豆浆 / 牛奶 250ml', calories: 0, notes: '均衡搭配，碳水蛋白都要有' },
        { meal: '午餐', foods: '杂粮饭 150g + 瘦肉 / 鱼 120g + 两种以上蔬菜', calories: 0, notes: '饭前喝半杯水，先吃蔬菜后吃肉' },
        { meal: '晚餐', foods: '荞麦面 / 糙米饭 100g + 鸡胸 / 虾仁 100g + 蔬菜沙拉', calories: 0, notes: '晚餐适当减少碳水，保证蛋白和纤维' },
        { meal: '加餐', foods: '水果 + 无糖酸奶 / 坚果 10g', calories: 0, notes: '下午感到饿的时候吃，避免正餐过量' },
      ],
    },
    '偏胖': {
      deficit: 400,
      meals: [
        { meal: '早餐', foods: '燕麦粥（燕麦 40g + 脱脂牛奶） + 水煮蛋 1 个 + 苹果半个', calories: 0, notes: '高纤维早餐，增加饱腹感' },
        { meal: '午餐', foods: '杂粮饭 100g + 去皮鸡肉 / 鱼肉 120g + 大量蔬菜', calories: 0, notes: '先吃蔬菜再吃主食，细嚼慢咽' },
        { meal: '晚餐', foods: '蒸红薯 / 南瓜 100g + 虾仁 / 豆腐 100g + 凉拌蔬菜', calories: 0, notes: '清淡为主，晚上 7 点前吃完' },
        { meal: '加餐', foods: '黄瓜 / 圣女果 / 无糖豆浆 200ml', calories: 0, notes: '低热量加餐，避免饥饿时暴食' },
      ],
    },
    '肥胖': {
      deficit: 500,
      meals: [
        { meal: '早餐', foods: '水煮蛋 2 个 + 全麦面包 1 片 + 黑咖啡 / 无糖豆浆', calories: 0, notes: '高蛋白低碳水，减少饥饿感' },
        { meal: '午餐', foods: '杂粮饭 80g + 鸡胸肉 / 鱼肉 150g + 水煮蔬菜不限量', calories: 0, notes: '肉类选蒸煮做法，蔬菜可多吃增加饱腹感' },
        { meal: '晚餐', foods: '蔬菜汤 + 豆腐 100g + 菌菇类', calories: 0, notes: '晚餐少碳水，以蔬菜和蛋白为主' },
        { meal: '加餐', foods: '黄瓜条 / 无糖酸奶 100g', calories: 0, notes: '只在真正饿的时候吃' },
      ],
    },
  };

  const ex = exercises[category] ?? exercises['正常'];
  const mc = mealConfigs[category] ?? mealConfigs['正常'];

  // Distribute target calories across meals
  const target = tdee + mc.deficit;
  const mealCalSplit = [0.30, 0.35, 0.25, 0.10]; // breakfast, lunch, dinner, snack
  const mealPlan = mc.meals.map((m, i) => ({
    ...m,
    calories: `${Math.round(target * mealCalSplit[i])}`,
  }));

  return { exercise_plan: ex, meal_plan: mealPlan };
}

export default function AIPlanner({ bmiResult }: Props) {
  const [plan, setPlan] = useState<AIPlan | null>(null);

  const generate = () => {
    setPlan(generateLocalPlan(bmiResult));
  };

  return (
    <div className="card ai-planner">
      <h2>智能生成计划</h2>
      <p className="ai-desc">
        基于你的身体数据，自动匹配运动与饮食方案
      </p>

      {!plan && (
        <button className="btn btn-primary ai-btn" onClick={generate}>
          生成运动与饮食计划
        </button>
      )}

      {plan && (
        <>
          <div className="ai-plan-grid">
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

          <button className="btn btn-secondary" style={{ marginTop: 16, width: '100%' }} onClick={generate}>
            重新生成
          </button>
        </>
      )}
    </div>
  );
}
