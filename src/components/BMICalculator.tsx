import { useState } from 'react';
import type { BMIResult } from '../types';

interface Props {
  onCalculate: (result: BMIResult) => void;
  lastBMI: BMIResult | null;
}

export default function BMICalculator({ onCalculate, lastBMI }: Props) {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(lastBMI);

  const handleCalc = () => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height) / 100;
    const weightNum = parseFloat(weight);

    if (!ageNum || !heightNum || !weightNum || ageNum < 2 || heightNum <= 0 || weightNum <= 0) {
      alert('请填写所有字段（有效数值）');
      return;
    }

    const bmi = weightNum / (heightNum * heightNum);
    let category: string;
    if (bmi < 18.5) category = '偏瘦';
    else if (bmi < 24) category = '正常';
    else if (bmi < 28) category = '偏胖';
    else category = '肥胖';

    const r: BMIResult = { bmi, category, gender, age: ageNum, height: heightNum * 100, weight: weightNum };
    setResult(r);
    onCalculate(r);
  };

  if (result) {
    const { bmi, category, gender: g, age: a, height: h, weight: w } = result;
    const heightM = h / 100;
    const idealLow = (18.5 * heightM * heightM).toFixed(1);
    const idealHigh = (24 * heightM * heightM).toFixed(1);
    const ponderal = (w / Math.pow(heightM, 3)).toFixed(1);
    const bmr = g === 'male'
      ? (10 * w + 6.25 * h - 5 * a + 5).toFixed(0)
      : (10 * w + 6.25 * h - 5 * a - 161).toFixed(0);

    const colorMap: Record<string, string> = {
      '偏瘦': 'var(--underweight)',
      '正常': 'var(--normal)',
      '偏胖': 'var(--overweight)',
      '肥胖': 'var(--obese)',
    };
    const emojiMap: Record<string, string> = { '偏瘦': '🟦', '正常': '🟢', '偏胖': '🟡', '肥胖': '🔴' };
    const color = colorMap[category];
    const emoji = emojiMap[category];

    return (
      <div className="card">
        <h2>BMI 计算结果</h2>
        <div className="bmi-result" style={{ background: color + '18', border: `1px solid ${color}44` }}>
          <div className="bmi-value" style={{ color }}>{emoji} {bmi.toFixed(1)}</div>
          <div className="bmi-label" style={{ color }}>{category}</div>
          <div className="bmi-scale">
            {[
              { cat: '偏瘦', color: 'var(--underweight)', range: '<18.5' },
              { cat: '正常', color: 'var(--normal)', range: '18.5-24' },
              { cat: '偏胖', color: 'var(--overweight)', range: '24-28' },
              { cat: '肥胖', color: 'var(--obese)', range: '≥28' },
            ].map(d => (
              <div key={d.cat} style={{ textAlign: 'center', flex: 1 }}>
                <div
                  className={`bmi-scale-dot${category === d.cat ? ' active' : ''}`}
                  style={{ background: d.color, color: d.color }}
                />
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 4 }}>{d.range}</div>
                <div style={{ fontSize: '0.7rem', color: category === d.cat ? d.color : 'var(--muted)', fontWeight: category === d.cat ? 600 : 400 }}>{d.cat}</div>
              </div>
            ))}
          </div>
          <div className="bmi-detail">
            <div>理想体重范围<br /><span>{idealLow} – {idealHigh} kg</span></div>
            <div>基础代谢 (BMR)<br /><span>{bmr} kcal/天</span></div>
            <div>Ponderal 指数<br /><span>{ponderal} kg/m³</span></div>
          </div>
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 16, width: '100%' }} onClick={() => setResult(null)}>
          重新计算
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>BMI 身体质量指数计算</h2>
      <div className="bmi-form">
        <div className="form-group">
          <label>性别</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
        <div className="form-group">
          <label>年龄</label>
          <input type="number" placeholder="25" min={2} max={120} value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div className="form-group">
          <label>身高 (cm)</label>
          <input type="number" placeholder="170" min={50} max={250} step="0.1" value={height} onChange={e => setHeight(e.target.value)} />
        </div>
        <div className="form-group">
          <label>体重 (kg)</label>
          <input type="number" placeholder="65" min={20} max={300} step="0.1" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleCalc}>计算 BMI</button>
      </div>
    </div>
  );
}
