import { useState } from 'react';
import type { ExerciseEntry } from '../types';

interface Props {
  entries: ExerciseEntry[];
  onEntriesChange: (entries: ExerciseEntry[]) => void;
}

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const DEFAULT_PLAN: Omit<ExerciseEntry, 'id'>[] = [
  { day: '周一', name: '哑铃卧推', type: '力量', duration: '20 分钟', notes: '4 组 × 10 次，控制离心 3 秒', completed: false },
  { day: '周一', name: '上斜哑铃飞鸟', type: '力量', duration: '15 分钟', notes: '3 组 × 12 次，感受胸肌拉伸', completed: false },
  { day: '周一', name: '凳上臂屈伸', type: '力量', duration: '10 分钟', notes: '3 组至力竭，训练三头肌', completed: false },
  { day: '周一', name: '平板支撑 + 侧支撑', type: '力量', duration: '10 分钟', notes: '核心稳定，每个方向 3 组至力竭', completed: false },
  { day: '周二', name: '慢跑 / 跳绳', type: '有氧', duration: '35 分钟', notes: '心率 130-150，跑后拉伸小腿', completed: false },
  { day: '周二', name: '开合跳 + 高抬腿', type: '有氧', duration: '10 分钟', notes: '间歇 30s 运动 / 15s 休息 × 8 组', completed: false },
  { day: '周二', name: '泡沫轴放松', type: '柔韧', duration: '15 分钟', notes: '重点放松大腿前后侧和背部', completed: false },
  { day: '周三', name: '杠铃深蹲', type: '力量', duration: '20 分钟', notes: '5 组 × 8 次，注意膝盖方向与脚尖一致', completed: false },
  { day: '周三', name: '罗马尼亚硬拉', type: '力量', duration: '15 分钟', notes: '4 组 × 10 次，感受腘绳肌拉伸', completed: false },
  { day: '周三', name: '保加利亚分腿蹲', type: '力量', duration: '12 分钟', notes: '每侧 3 组 × 10 次，核心收紧', completed: false },
  { day: '周三', name: '弹力带臀桥 + 髋外展', type: '力量', duration: '10 分钟', notes: '激活臀中肌，改善髋部稳定性', completed: false },
  { day: '周四', name: '流瑜伽 / 哈他瑜伽', type: '柔韧', duration: '40 分钟', notes: '关注呼吸与体式配合，提升柔韧性', completed: false },
  { day: '周四', name: '猫牛式 + 婴儿式', type: '柔韧', duration: '10 分钟', notes: '脊柱灵活性训练，缓解久坐不适', completed: false },
  { day: '周四', name: '快走', type: '有氧', duration: '30 分钟', notes: '轻松快走，保持步频 120+ 步/分', completed: false },
  { day: '周五', name: '引体向上 / 高位下拉', type: '力量', duration: '15 分钟', notes: '4 组力竭，可用弹力带辅助', completed: false },
  { day: '周五', name: '杠铃划船', type: '力量', duration: '15 分钟', notes: '4 组 × 10 次，腰背挺直', completed: false },
  { day: '周五', name: '哑铃弯举 + 锤式弯举', type: '力量', duration: '12 分钟', notes: '各 3 组 × 12 次，肱二头肌训练', completed: false },
  { day: '周五', name: '农夫行走', type: '力量', duration: '8 分钟', notes: '双手持哑铃行走，强化握力和核心', completed: false },
  { day: '周六', name: '游泳（自由泳/蛙泳）', type: '有氧', duration: '40 分钟', notes: '全身有氧，对关节零冲击', completed: false },
  { day: '周六', name: '户外骑行', type: '有氧', duration: '45 分钟', notes: '变速骑行，间歇冲刺 30s × 5 组', completed: false },
  { day: '周六', name: '登山机 / 爬楼', type: '有氧', duration: '20 分钟', notes: '中等强度，心率控制在 140-160', completed: false },
  { day: '周日', name: '晨间散步', type: '柔韧', duration: '25 分钟', notes: '轻松散步，晒太阳补充维生素D', completed: false },
  { day: '周日', name: '全身静态拉伸', type: '柔韧', duration: '20 分钟', notes: '每个部位保持 30s，不要弹震', completed: false },
  { day: '周日', name: '冥想 / 呼吸训练', type: '柔韧', duration: '10 分钟', notes: '腹式呼吸 5 分钟 + 身体扫描 5 分钟', completed: false },
];

function makeId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export default function ExercisePlanner({ entries, onEntriesChange }: Props) {
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: '力量', duration: '', notes: '' });

  const initDefaults = () => {
    if (entries.length === 0) {
      onEntriesChange(DEFAULT_PLAN.map(e => ({ ...e, id: makeId() })));
    }
  };

  const addEntry = (day: string) => {
    if (!form.name || !form.duration) return;
    onEntriesChange([...entries, { ...form, id: makeId(), day, completed: false }]);
    setForm({ name: '', type: '力量', duration: '', notes: '' });
    setShowAdd(null);
  };

  const toggleComplete = (id: string) => {
    onEntriesChange(entries.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const deleteEntry = (id: string) => {
    onEntriesChange(entries.filter(e => e.id !== id));
  };

  const resetPlan = () => {
    if (confirm('确定重置为默认运动计划？当前计划将被覆盖。')) {
      onEntriesChange(DEFAULT_PLAN.map(e => ({ ...e, id: makeId() })));
    }
  };

  const typeTagColor = (type: string) => {
    if (type === '有氧') return 'tag-cardio';
    if (type === '力量') return 'tag-strength';
    return 'tag-flex';
  };

  if (entries.length === 0) {
    return (
      <div className="card">
        <h2>每周运动计划</h2>
        <div className="empty-state" style={{ marginBottom: 16 }}>还没有运动计划</div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={initDefaults}>
          加载默认运动计划
        </button>
      </div>
    );
  }

  const completedCount = entries.filter(e => e.completed).length;
  const progress = entries.length > 0 ? Math.round((completedCount / entries.length) * 100) : 0;

  return (
    <div className="card">
      <div className="tracker-header">
        <h2>每周运动计划</h2>
        <div className="tracker-form">
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            已完成 {completedCount}/{entries.length} 项（{progress}%）
          </span>
          <button className="btn-sm" onClick={resetPlan}>重置</button>
        </div>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="week-grid">
        {DAYS.map(day => {
          const dayEntries = entries.filter(e => e.day === day);
          return (
            <div key={day} className="day-card">
              <div className="day-header">
                <h3>{day}</h3>
                <button className="btn-sm" onClick={() => { setShowAdd(showAdd === day ? null : day); setForm({ name: '', type: '力量', duration: '', notes: '' }); }}>
                  + 添加
                </button>
              </div>

              {showAdd === day && (
                <div className="add-exercise-form">
                  <input placeholder="运动名称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="力量">力量</option>
                    <option value="有氧">有氧</option>
                    <option value="柔韧">柔韧</option>
                  </select>
                  <input placeholder="时长（如 30 分钟）" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                  <input placeholder="备注（可选）" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-sm" onClick={() => addEntry(day)}>确认</button>
                    <button className="btn-sm" onClick={() => setShowAdd(null)}>取消</button>
                  </div>
                </div>
              )}

              {dayEntries.length === 0 ? (
                <div className="day-empty">暂无安排</div>
              ) : (
                <div className="day-exercises">
                  {dayEntries.map(e => (
                    <div key={e.id} className={`exercise-item ${e.completed ? 'completed' : ''}`}>
                      <label className="exercise-check">
                        <input type="checkbox" checked={e.completed} onChange={() => toggleComplete(e.id)} />
                        <span className="exercise-name">{e.name}</span>
                      </label>
                      <div className="exercise-meta">
                        <span className={`ai-tag ${typeTagColor(e.type)}`}>{e.type}</span>
                        <span>{e.duration}</span>
                      </div>
                      {e.notes && <p className="exercise-notes">{e.notes}</p>}
                      <button className="exercise-del" onClick={() => deleteEntry(e.id)} title="删除">x</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
