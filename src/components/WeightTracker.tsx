import { useState, useEffect, useRef } from 'react';
import type { WeightRecord } from '../types';

interface Props {
  records: WeightRecord[];
  onRecordsChange: (records: WeightRecord[]) => void;
}

export default function WeightTracker({ records, onRecordsChange }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { drawChart(); }, [records]);
  useEffect(() => {
    const onResize = () => drawChart();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [records]);

  const addRecord = () => {
    const w = parseFloat(weight);
    if (!date || !w || w <= 0) { alert('请输入有效日期和体重'); return; }

    const copy = [...records];
    const idx = copy.findIndex(r => r.date === date);
    if (idx >= 0) copy[idx].weight = w;
    else copy.push({ date, weight: w });
    copy.sort((a, b) => a.date.localeCompare(b.date));
    onRecordsChange(copy);
    setWeight('');
  };

  const deleteRecord = (idx: number) => {
    const copy = [...records];
    copy.splice(idx, 1);
    onRecordsChange(copy);
  };

  const clearRecords = () => {
    if (confirm('确定清空所有记录？')) onRecordsChange([]);
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement!.getBoundingClientRect();
    const w = rect.width;
    const h = 220;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    if (records.length < 2) {
      ctx.fillStyle = '#8888a0';
      ctx.font = '14px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('至少需要两条记录才能绘制趋势图', w / 2, h / 2);
      return;
    }

    const pad = { top: 20, right: 20, bottom: 30, left: 50 };
    const pw = w - pad.left - pad.right;
    const ph = h - pad.top - pad.bottom;
    const weights = records.map(r => r.weight);
    const minW = Math.floor(Math.min(...weights) - 2);
    const maxW = Math.ceil(Math.max(...weights) + 2);
    const range = maxW - minW || 1;

    const xScale = (i: number) => pad.left + (i / (records.length - 1)) * pw;
    const yScale = (v: number) => pad.top + ph - ((v - minW) / range) * ph;

    // Grid
    ctx.strokeStyle = '#2a2a3a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ph / 4) * i;
      const val = maxW - (range / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = '#8888a0';
      ctx.font = '11px "Segoe UI", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), pad.left - 8, y + 4);
    }

    // X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8888a0';
    const step = Math.max(1, Math.floor(records.length / 6));
    for (let i = 0; i < records.length; i += step) {
      ctx.fillText(records[i].date.slice(5), xScale(i), h - pad.bottom + 16);
    }
    if ((records.length - 1) % step !== 0) {
      ctx.fillText(records[records.length - 1].date.slice(5), xScale(records.length - 1), h - pad.bottom + 16);
    }

    // Line
    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    records.forEach((r, i) => {
      const x = xScale(i), y = yScale(r.weight);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    ctx.lineTo(xScale(records.length - 1), pad.top + ph);
    ctx.lineTo(xScale(0), pad.top + ph);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ph);
    grad.addColorStop(0, 'rgba(108,92,231,0.25)');
    grad.addColorStop(1, 'rgba(108,92,231,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Dots
    records.forEach((r, i) => {
      const x = xScale(i), y = yScale(r.weight);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6c5ce7';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Trend line
    if (records.length >= 3) {
      const n = records.length;
      const xs = records.map((_, i) => i);
      const ys = records.map(r => r.weight);
      const meanX = xs.reduce((a, b) => a + b, 0) / n;
      const meanY = ys.reduce((a, b) => a + b, 0) / n;
      const num = xs.reduce((s, x, i) => s + (x - meanX) * (ys[i] - meanY), 0);
      const den = xs.reduce((s, x) => s + (x - meanX) ** 2, 0);
      const slope = den ? num / den : 0;
      const intercept = meanY - slope * meanX;

      if (Math.abs(slope) > 0.001) {
        ctx.strokeStyle = '#00cec9';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(xScale(0), yScale(intercept));
        ctx.lineTo(xScale(n - 1), yScale(slope * (n - 1) + intercept));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#00cec9';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.textAlign = 'left';
        const arrow = slope > 0.01 ? '↑' : slope < -0.01 ? '↓' : '→';
        ctx.fillText(`${arrow} ${Math.abs(slope * 7).toFixed(2)} kg/周`, w - pad.right - 110, pad.top + 12);
      }
    }
  };

  const reversed = [...records].reverse();

  return (
    <div className="card">
      <div className="tracker-header">
        <h2>体重记录</h2>
        <div className="tracker-form">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input type="number" placeholder="体重 kg" step="0.1" min={20} max={300} value={weight} onChange={e => setWeight(e.target.value)} />
          <button className="btn-sm" onClick={addRecord}>添加记录</button>
          <button className="btn-sm danger" onClick={clearRecords}>清空</button>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={canvasRef} />
      </div>
      <div className="weight-list">
        {reversed.length === 0 ? (
          <div className="empty-state">暂无记录，添加你的第一条体重记录吧</div>
        ) : (
          reversed.map((r) => {
            const origIdx = records.indexOf(r);
            return (
              <div key={r.date} className="weight-item">
                <span className="date">{r.date}</span>
                <span><strong>{r.weight} kg</strong></span>
                <span className="actions">
                  <button onClick={() => deleteRecord(origIdx)}>删除</button>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
