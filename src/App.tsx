import { useState } from 'react';
import type { WeightRecord, ExerciseEntry, BMIResult, TabType } from './types';
import BMICalculator from './components/BMICalculator';
import ExercisePlanner from './components/ExercisePlanner';
import Recommendations from './components/Recommendations';
import './App.css';

const WEIGHT_KEY = 'body_records';
const EXERCISE_KEY = 'exercise_plan';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveJSON(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('bmi');
  const [, setRecords] = useState<WeightRecord[]>(() => loadJSON(WEIGHT_KEY, []));
  const [exercises, setExercises] = useState<ExerciseEntry[]>(() => loadJSON(EXERCISE_KEY, []));
  const [lastBMI, setLastBMI] = useState<BMIResult | null>(null);

  const handleExercisesChange = (next: ExerciseEntry[]) => {
    setExercises(next);
    saveJSON(EXERCISE_KEY, next);
  };

  const handleBMICalculate = (result: BMIResult) => {
    setLastBMI(result);
    const today = new Date().toISOString().split('T')[0];
    setRecords(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(r => r.date === today);
      if (idx >= 0) copy[idx].weight = result.weight;
      else copy.push({ date: today, weight: result.weight });
      copy.sort((a, b) => a.date.localeCompare(b.date));
      saveJSON(WEIGHT_KEY, copy);
      return copy;
    });
  };

  return (
    <>
      <header>
        <h1>身材管理</h1>
        <p>追踪体重 · 计算 BMI · 科学塑形</p>
      </header>

      <div className="tabs">
        <button className={`tab${activeTab === 'bmi' ? ' active' : ''}`} onClick={() => setActiveTab('bmi')}>
          BMI 计算器
        </button>
        <button className={`tab${activeTab === 'tracker' ? ' active' : ''}`} onClick={() => setActiveTab('tracker')}>
          运动计划
        </button>
        <button className={`tab${activeTab === 'recommendations' ? ' active' : ''}`} onClick={() => setActiveTab('recommendations')}>
          健康建议
        </button>
      </div>

      {activeTab === 'bmi' && (
        <BMICalculator onCalculate={handleBMICalculate} lastBMI={lastBMI} />
      )}
      {activeTab === 'tracker' && (
        <ExercisePlanner entries={exercises} onEntriesChange={handleExercisesChange} />
      )}
      {activeTab === 'recommendations' && (
        <Recommendations bmiResult={lastBMI} />
      )}
    </>
  );
}
