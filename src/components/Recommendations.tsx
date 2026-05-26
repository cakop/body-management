import type { BMIResult } from '../types';
import AIPlanner from './AIPlanner';

interface Props {
  bmiResult: BMIResult | null;
}

export default function Recommendations({ bmiResult }: Props) {
  if (!bmiResult) {
    return (
      <div className="card">
        <div className="empty-state">请先在 BMI 计算器中输入数据，然后查看个性化建议</div>
      </div>
    );
  }

  const { bmi, category, gender, age, height, weight } = bmiResult;
  const heightM = height / 100;
  const idealLow = (18.5 * heightM * heightM).toFixed(1);
  const idealHigh = (24 * heightM * heightM).toFixed(1);
  const diff = weight - parseFloat(idealHigh);
  const bmr = gender === 'male'
    ? (10 * weight + 6.25 * height - 5 * age + 5)
    : (10 * weight + 6.25 * height - 5 * age - 161);
  const tdee = (bmr * 1.55).toFixed(0);

  const tipSets: Record<string, string[]> = {
    '偏瘦': [
      '每天增加 300-500 kcal 热量摄入，以健康方式增重',
      '多餐少食，每天 5-6 餐，每餐营养均衡',
      '增加力量训练，促进肌肉增长（每周 3-4 次）',
      '多吃优质蛋白质：鸡蛋、鱼肉、鸡胸肉、豆制品',
      '保证充足睡眠（7-8 小时），促进身体恢复',
      '摄入健康脂肪：坚果、牛油果、橄榄油',
    ],
    '正常': [
      '保持当前体重，维持均衡饮食和规律运动',
      '每周至少 150 分钟中等强度有氧运动',
      '搭配力量训练，提升基础代谢率（每周 2-3 次）',
      '多吃蔬菜水果，保证膳食纤维摄入',
      '每天饮水 1.5-2 升，促进新陈代谢',
      '定期监测体重，保持在理想范围内',
    ],
    '偏胖': [
      `建议减重约 ${diff.toFixed(1)} kg 至理想范围`,
      '控制每日热量摄入，制造 300-500 kcal 热量缺口',
      '增加有氧运动：快走、跑步、游泳（每周 4-5 次，每次 40 分钟）',
      '减少精制碳水和含糖饮料摄入',
      '每餐先吃蔬菜和蛋白质，最后吃主食',
      '记录饮食日记，提高对食物的觉察',
    ],
    '肥胖': [
      `建议减重约 ${diff.toFixed(1)} kg，设定阶段性目标`,
      '咨询医生或营养师，制定个性化减重方案',
      '从低强度运动开始，逐步增加强度（快走→慢跑）',
      '严格控糖：戒含糖饮料、甜点、精制碳水',
      '保证蛋白质摄入，防止减重过程中肌肉流失',
      '关注腰围变化（男 &lt;90cm, 女 &lt;85cm）',
    ],
  };

  const tips = tipSets[category] ?? tipSets['正常'];

  return (
    <div className="card">
      <h2>个性化健康建议</h2>
      <p className="rec-subtitle">
        基于你的 BMI <strong>{bmi.toFixed(1)}</strong>（{category}），
        年龄 {age} 岁，{gender === 'male' ? '男性' : '女性'}
      </p>
      <div className="rec-card">
        <div className="rec-item">
          <div className="icon">🎯</div>
          <div className="val">{idealLow} – {idealHigh} kg</div>
          <div className="lbl">理想体重范围</div>
        </div>
        <div className="rec-item">
          <div className="icon">🔥</div>
          <div className="val">{bmr.toFixed(0)} kcal</div>
          <div className="lbl">基础代谢率 (BMR)</div>
        </div>
        <div className="rec-item">
          <div className="icon">⚡</div>
          <div className="val">{tdee} kcal</div>
          <div className="lbl">每日消耗 (TDEE)</div>
        </div>
      </div>
      <div className="tips">
        <h3>健康建议</h3>
        {tips.map((t, i) => <div key={i} className="tip-item">{t}</div>)}
      </div>

      <AIPlanner bmiResult={bmiResult} />
    </div>
  );
}
