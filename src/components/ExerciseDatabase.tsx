import { useState, useMemo } from 'react';
import type { ExerciseInfo } from '../types';

const CATEGORIES = ['全部', '有氧', '力量', '柔韧'];
const DIFFICULTIES = ['全部', '入门', '进阶', '高阶'];

const EXERCISES: ExerciseInfo[] = [
  // 有氧
  { id: 'running', name: '跑步（8km/h）', type: '有氧', calories: 300, difficulty: '入门', target: '全身 / 心肺', method: '保持上身挺直，核心微收，中前掌落地，步频保持 170-180 步/分', tips: '初学者可从跑走结合开始，每周增加不超过 10% 跑量' },
  { id: 'jump-rope', name: '跳绳', type: '有氧', calories: 350, difficulty: '入门', target: '全身 / 协调性', method: '手腕发力摇绳，膝盖微屈缓冲落地，双脚并拢或交替跳', tips: '选合适长度的绳（踩住绳中间，手柄到腋下），跳前充分热身脚踝' },
  { id: 'swimming', name: '游泳（自由泳）', type: '有氧', calories: 280, difficulty: '进阶', target: '全身 / 心肺', method: '身体呈流线型，侧头换气（不要抬头），手臂高肘抱水推到底', tips: '练习侧向打腿和转体配合，每次练习至少 30 分钟' },
  { id: 'cycling', name: '骑行（中速）', type: '有氧', calories: 250, difficulty: '入门', target: '下肢 / 心肺', method: '座椅高度调至腿伸直时脚跟刚好踩踏板，踩踏时膝盖方向与脚尖一致', tips: '保持踏频 80-100 rpm，佩戴头盔' },
  { id: 'brisk-walk', name: '快走', type: '有氧', calories: 180, difficulty: '入门', target: '下肢 / 心肺', method: '大步走，手臂自然摆动，步频 120+ 步/分，脚后跟先着地过渡到前掌', tips: '大体重或关节不适者首选，每天 30-45 分钟即可' },
  { id: 'rowing', name: '划船机', type: '有氧', calories: 320, difficulty: '进阶', target: '全身 / 背腿', method: '发力顺序：腿蹬 → 身体后仰 → 手臂拉至胸下；回位：手臂 → 身体 → 腿', tips: '注意发力比例是腿 60%/核心 20%/手臂 20%，不要只用手臂拉' },
  { id: 'elliptical', name: '椭圆机', type: '有氧', calories: 260, difficulty: '入门', target: '全身 / 臀腿', method: '上机后核心收紧，后跟踩实踏板，不要踮脚，手脚协调同步', tips: '对膝盖零冲击，适合康复训练，可倒踩激活不同肌群' },
  { id: 'stair-climb', name: '爬楼梯', type: '有氧', calories: 380, difficulty: '入门', target: '臀腿 / 心肺', method: '全脚掌踩实台阶，身体微前倾，核心收紧，手扶栏杆辅助（不要拉）', tips: '下楼梯伤膝盖，建议坐电梯下楼，只做上楼梯部分' },
  { id: 'hiit', name: 'HIIT 间歇训练', type: '有氧', calories: 400, difficulty: '高阶', target: '全身 / 燃脂', method: '全力运动 20-30s，休息 10-15s，重复 8-12 组。常见动作：波比跳、登山跑、深蹲跳', tips: '每周 2-3 次即可，避免过度训练，有心血管疾病者慎用' },
  { id: 'dance', name: '有氧舞蹈 / Zumba', type: '有氧', calories: 290, difficulty: '入门', target: '全身 / 协调性', method: '跟随音乐节奏，动作幅度逐渐加大，享受舞蹈乐趣即可', tips: '不必纠结动作精确，保持心率在 120-150 即可' },

  // 力量 - 上肢
  { id: 'pushup', name: '俯卧撑', type: '力量', calories: 200, difficulty: '入门', target: '胸 / 三头 / 肩', method: '双手略宽于肩，身体呈一条直线，慢下快上，肘与身体夹角约 45°', tips: '做不了标准俯卧撑可从跪姿开始，逐步过渡' },
  { id: 'bench-press', name: '杠铃卧推', type: '力量', calories: 180, difficulty: '进阶', target: '胸 / 三头 / 前肩', method: '肩胛骨收紧贴凳，杠铃下降至胸下部，推起时手臂伸直但不锁死', tips: '新手从空杆开始，有人保护时再上重量，5 组 × 8-10 次' },
  { id: 'dumbbell-fly', name: '哑铃飞鸟', type: '力量', calories: 150, difficulty: '进阶', target: '胸肌', method: '仰卧凳上，手臂微屈张开至胸肌有拉伸感，收缩夹胸回到起始位', tips: '重量不宜过大，感受胸肌收缩比重量更重要' },
  { id: 'pull-up', name: '引体向上', type: '力量', calories: 220, difficulty: '高阶', target: '背 / 二头', method: '正握略宽于肩，身体不晃动，拉至下巴过杠，缓慢下放', tips: '做不了可用弹力带辅助，或从悬垂和离心下放开始练习' },
  { id: 'barbell-row', name: '杠铃划船', type: '力量', calories: 190, difficulty: '进阶', target: '背 / 后肩', method: '腰背挺直，身体前倾 45-60°，杠铃沿大腿拉至下腹，挤压背部', tips: '核心收紧保护腰椎，避免用腰部借力，4 组 × 10 次' },
  { id: 'lateral-raise', name: '哑铃侧平举', type: '力量', calories: 130, difficulty: '入门', target: '中三角肌', method: '微屈肘，从体侧举至肩高（不要高于肩），像"倒水"的轨迹', tips: '轻重量即可，慢速控制，3 组 × 15 次，打造肩宽' },
  { id: 'bicep-curl', name: '哑铃弯举', type: '力量', calories: 130, difficulty: '入门', target: '肱二头肌', method: '大臂固定贴身体，弯举至顶峰收缩 1 秒，缓慢下放', tips: '不要借力摆动身体，控制离心阶段 3 秒以上' },
  { id: 'tricep-dip', name: '凳上臂屈伸', type: '力量', calories: 150, difficulty: '入门', target: '肱三头肌', method: '双手撑凳边，身体下降至上臂与地面平行，三头肌发力推起', tips: '下降不要太深避免肩部不适，脚越远越难' },

  // 力量 - 下肢
  { id: 'squat', name: '杠铃深蹲', type: '力量', calories: 250, difficulty: '进阶', target: '股四 / 臀', method: '双脚略宽于肩，脚尖微外八，下蹲时大腿低于平行线，膝盖方向与脚尖一致', tips: '核心收紧保护腰椎，先自重练好动作再上杠铃，5 组 × 8 次' },
  { id: 'lunge', name: '哑铃弓步蹲', type: '力量', calories: 200, difficulty: '入门', target: '股四 / 臀', method: '前后腿各跨一大步，下蹲至后膝几乎触地，前膝不超脚尖，起身回位', tips: '上身保持直立，每侧 3 组 × 12 次，可原地或行走' },
  { id: 'deadlift', name: '传统硬拉', type: '力量', calories: 260, difficulty: '高阶', target: '后链 / 背 / 臀', method: '肩胛骨在杠铃正上方，腰背挺直，腿蹬地发力同时拉起杠铃贴近身体', tips: '动作不正确易伤腰，建议先学罗马尼亚硬拉入门' },
  { id: 'romanian-dl', name: '罗马尼亚硬拉', type: '力量', calories: 200, difficulty: '进阶', target: '腘绳肌 / 臀', method: '膝盖微屈，臀部后推，杠铃沿腿下放至小腿中部，感受大腿后侧拉伸', tips: '全程保持腰背挺直，4 组 × 10 次，比传统硬拉更安全' },
  { id: 'hip-thrust', name: '杠铃臀推', type: '力量', calories: 210, difficulty: '进阶', target: '臀大肌', method: '肩胛骨靠凳边，杠铃放髋部，臀部发力顶起至身体呈一条线，顶峰收缩', tips: '核心收紧避免腰椎过伸，4 组 × 12 次，练臀王牌动作' },
  { id: 'leg-press', name: '腿举', type: '力量', calories: 200, difficulty: '入门', target: '股四 / 臀', method: '脚放踏板上方，下放至膝盖接近胸口，蹬起时膝盖不完全锁死', tips: '比深蹲更安全，适合初学者建立腿部力量基础' },
  { id: 'calf-raise', name: '站姿提踵', type: '力量', calories: 100, difficulty: '入门', target: '小腿三头肌', method: '脚尖站台阶边缘，慢下快上，顶峰收缩 1 秒', tips: '每天可做，3 组至力竭，小腿耐力肌群需要高次数刺激' },

  // 力量 - 核心
  { id: 'plank', name: '平板支撑', type: '力量', calories: 120, difficulty: '入门', target: '核心 / 腹横肌', method: '肘撑地，身体呈一条直线，收紧臀部和腹部，正常呼吸不憋气', tips: '质量比时长重要，每组力竭 × 3 组，可加侧平板' },
  { id: 'crunch', name: '卷腹', type: '力量', calories: 140, difficulty: '入门', target: '腹直肌', method: '仰卧屈膝，腰部贴地，肩胛骨抬离地面，腹部发力卷起', tips: '不要抱头拉脖子，幅度小反而更刺激腹肌' },
  { id: 'russian-twist', name: '俄罗斯转体', type: '力量', calories: 160, difficulty: '入门', target: '腹斜肌', method: '坐姿后仰 45°，双脚离地，双手合十左右旋转，可持重物', tips: '控制节奏不要快，每侧 15 次 × 3 组' },
  { id: 'leg-raise', name: '悬垂举腿', type: '力量', calories: 180, difficulty: '高阶', target: '下腹 / 髋屈肌', method: '悬挂于单杠，直腿或屈膝上举至腿与地面平行或更高', tips: '不要摆动借力，慢速下放效果更好，是下腹王牌动作' },
  { id: 'dead-bug', name: '死虫式', type: '力量', calories: 90, difficulty: '入门', target: '核心稳定性', method: '仰卧，四肢朝天，对侧手脚同时慢放至接近地面，回位换另一侧', tips: '腰部始终贴地，是腰突患者安全练核心的最佳选择' },

  // 柔韧
  { id: 'yoga', name: '哈他瑜伽', type: '柔韧', calories: 130, difficulty: '入门', target: '全身柔韧性', method: '结合体式与呼吸，每个体式保持 30s-1min。基础序列：拜日式 → 站立体式 → 坐姿 → 仰卧放松', tips: '不要强迫身体，呼吸比深度重要，每天 20 分钟即可见效' },
  { id: 'pilates', name: '普拉提', type: '柔韧', calories: 150, difficulty: '进阶', target: '核心 / 体态', method: '强调核心控制与脊柱逐节运动，经典动作：百次拍击、卷动、游泳式', tips: '专注动作质量而非数量，配合呼吸，改善圆肩驼背效果显著' },
  { id: 'foam-rolling', name: '泡沫轴放松', type: '柔韧', calories: 80, difficulty: '入门', target: '筋膜放松', method: '将泡沫轴放在目标肌群下，利用体重缓慢滚动，找到痛点停留 30s', tips: '不要直接滚关节和腰椎，每个部位 1-2 分钟' },
  { id: 'stretching', name: '全身静态拉伸', type: '柔韧', calories: 70, difficulty: '入门', target: '全身柔韧性', method: '每块肌群拉伸保持 20-30s，不要弹震。重点：腘绳肌、髋屈肌、胸肌、斜方肌', tips: '运动后进行效果最佳，可以边看视频边做' },
  { id: 'tai-chi', name: '太极拳', type: '柔韧', calories: 160, difficulty: '入门', target: '全身 / 平衡', method: '动作缓慢流畅，重心转移自然，以腰为轴带动四肢。推荐简化 24 式入门', tips: '适合中老年人，改善平衡能力，降低跌倒风险' },
];

const TYPE_COLORS: Record<string, string> = {
  '有氧': '#e8988a',
  '力量': '#d4887a',
  '柔韧': '#7eb8a0',
};

export default function ExerciseDatabase() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('全部');
  const [diffFilter, setDiffFilter] = useState('全部');

  const filtered = useMemo(() => {
    return EXERCISES.filter(e => {
      const matchType = typeFilter === '全部' || e.type === typeFilter;
      const matchDiff = diffFilter === '全部' || e.difficulty === diffFilter;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.target.toLowerCase().includes(q) || e.method.toLowerCase().includes(q);
      return matchType && matchDiff && matchSearch;
    });
  }, [search, typeFilter, diffFilter]);

  return (
    <div className="card">
      <h2>运动库</h2>
      <p className="rec-subtitle">常见运动方法及每 30 分钟消耗热量（以 70kg 体重估算）</p>

      <div className="food-search-bar">
        <input
          type="text"
          placeholder="搜索运动名称、目标肌群..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="food-search-input"
        />
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <div className="food-cat-filters" style={{ marginBottom: 0 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`food-cat-chip ${typeFilter === c ? 'active' : ''}`}
              onClick={() => setTypeFilter(c)}
              style={typeFilter === c && c !== '全部' ? { background: (TYPE_COLORS[c] || '#e8988a') + '22', borderColor: TYPE_COLORS[c], color: TYPE_COLORS[c] } : {}}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="food-cat-filters" style={{ marginBottom: 0 }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`food-cat-chip ${diffFilter === d ? 'active' : ''}`}
              onClick={() => setDiffFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="food-grid">
        {filtered.map(e => (
          <div key={e.id} className="food-card">
            <div className="food-card-header">
              <span className="food-name">{e.name}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="food-cat-tag" style={{ background: (TYPE_COLORS[e.type] || '#e8988a') + '18', color: TYPE_COLORS[e.type] }}>{e.type}</span>
                <span className="food-cat-tag" style={{ background: 'rgba(180,160,140,0.15)', color: '#b0a090' }}>{e.difficulty}</span>
              </div>
            </div>

            <div className="food-macros">
              <div className="macro-item">
                <span className="macro-val" style={{ color: 'var(--accent)' }}>{e.calories}</span>
                <span className="macro-label">消耗 kcal</span>
              </div>
              <div className="macro-item" style={{ flex: 1 }}>
                <span className="macro-val" style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{e.target}</span>
                <span className="macro-label">目标肌群</span>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 6 }}>
              <strong style={{ color: 'var(--accent2)' }}>方法：</strong>{e.method}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.4, padding: '6px 8px', background: 'rgba(232,201,139,0.1)', borderRadius: 6 }}>
              <strong style={{ color: '#b8943e' }}>Tips：</strong>{e.tips}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">没有匹配的运动项目</div>
      )}
    </div>
  );
}
