import { useState, useCallback } from 'react';
import type { WeightRecord, BMIResult, TabType } from './types';
import BMICalculator from './components/BMICalculator';
import WeightTracker from './components/WeightTracker';
import Recommendations from './components/Recommendations';
import './App.css';

const STORAGE_KEY = 'body_records';

function loadRecords(): WeightRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecords(records: WeightRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('bmi');
  const [records, setRecords] = useState<WeightRecord[]>(loadRecords);
  const [lastBMI, setLastBMI] = useState<BMIResult | null>(null);

  const handleRecordsChange = useCallback((next: WeightRecord[]) => {
    setRecords(next);
    saveRecords(next);
  }, []);

  const handleBMICalculate = useCallback((result: BMIResult) => {
    setLastBMI(result);
    // Auto-save today's weight
    const today = new Date().toISOString().split('T')[0];
    setRecords(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(r => r.date === today);
      if (idx >= 0) copy[idx].weight = result.weight;
      else copy.push({ date: today, weight: result.weight });
      copy.sort((a, b) => a.date.localeCompare(b.date));
      saveRecords(copy);
      return copy;
    });
  }, []);

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
          体重追踪
        </button>
        <button className={`tab${activeTab === 'recommendations' ? ' active' : ''}`} onClick={() => setActiveTab('recommendations')}>
          健康建议
        </button>
      </div>

      {activeTab === 'bmi' && (
        <BMICalculator onCalculate={handleBMICalculate} lastBMI={lastBMI} />
      )}
      {activeTab === 'tracker' && (
        <WeightTracker records={records} onRecordsChange={handleRecordsChange} />
      )}
      {activeTab === 'recommendations' && (
        <Recommendations bmiResult={lastBMI} />
      )}
    </>
  );
}
