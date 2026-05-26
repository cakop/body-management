import { useState, useMemo } from 'react';
import type { FoodItem } from '../types';

const CATEGORIES = ['全部', '蛋白质', '蔬菜', '水果', '主食', '乳制品', '坚果'];

const FOODS: FoodItem[] = [
  { id: 'egg', name: '鸡蛋（煮）', category: '蛋白质', calories: 155, protein: 13.1, carbs: 1.1, fat: 10.9, fiber: 0, nutrients: ['维生素A', '维生素D', '维生素B12', '卵磷脂', '胆碱'] },
  { id: 'egg-white', name: '鸡蛋白', category: '蛋白质', calories: 48, protein: 10.9, carbs: 0.7, fat: 0.2, fiber: 0, nutrients: ['优质蛋白', '钾'] },
  { id: 'chicken-breast', name: '鸡胸肉', category: '蛋白质', calories: 133, protein: 22.5, carbs: 2.5, fat: 4.2, fiber: 0, nutrients: ['维生素B6', '烟酸', '磷', '硒'] },
  { id: 'salmon', name: '三文鱼', category: '蛋白质', calories: 208, protein: 20.4, carbs: 0, fat: 13.6, fiber: 0, nutrients: ['Omega-3', '维生素D', '维生素B12', '硒'] },
  { id: 'shrimp', name: '虾仁', category: '蛋白质', calories: 99, protein: 20.3, carbs: 0.2, fat: 1.7, fiber: 0, nutrients: ['锌', '硒', '维生素B12', '虾青素'] },
  { id: 'tofu', name: '豆腐', category: '蛋白质', calories: 76, protein: 8.1, carbs: 1.9, fat: 4.2, fiber: 0.3, nutrients: ['钙', '铁', '大豆异黄酮', '镁'] },
  { id: 'beef-lean', name: '瘦牛肉', category: '蛋白质', calories: 150, protein: 21.3, carbs: 0.5, fat: 6.8, fiber: 0, nutrients: ['铁', '锌', '维生素B12', '肌酸'] },
  { id: 'broccoli', name: '西兰花', category: '蔬菜', calories: 34, protein: 2.8, carbs: 7.2, fat: 0.4, fiber: 2.6, nutrients: ['维生素C', '维生素K', '叶酸', '萝卜硫素'] },
  { id: 'spinach', name: '菠菜', category: '蔬菜', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, nutrients: ['铁', '叶酸', '维生素K', '叶黄素'] },
  { id: 'tomato', name: '番茄', category: '蔬菜', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, nutrients: ['番茄红素', '维生素C', '钾'] },
  { id: 'carrot', name: '胡萝卜', category: '蔬菜', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, nutrients: ['β-胡萝卜素', '维生素A', '维生素K'] },
  { id: 'cucumber', name: '黄瓜', category: '蔬菜', calories: 15, protein: 0.7, carbs: 2.9, fat: 0.1, fiber: 0.5, nutrients: ['维生素K', '钾', '水分'] },
  { id: 'sweet-potato', name: '红薯', category: '主食', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, fiber: 3.0, nutrients: ['β-胡萝卜素', '维生素C', '钾', '膳食纤维'] },
  { id: 'oats', name: '燕麦', category: '主食', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, nutrients: ['β-葡聚糖', '锰', '磷', '镁'] },
  { id: 'brown-rice', name: '糙米饭', category: '主食', calories: 123, protein: 2.7, carbs: 25.6, fat: 1.0, fiber: 1.6, nutrients: ['镁', '磷', '维生素B1', 'γ-谷维素'] },
  { id: 'quinoa', name: '藜麦', category: '主食', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, nutrients: ['完全蛋白', '铁', '镁', '锰'] },
  { id: 'corn', name: '玉米', category: '主食', calories: 112, protein: 4.0, carbs: 22.8, fat: 1.2, fiber: 2.9, nutrients: ['叶黄素', '玉米黄质', '维生素B1'] },
  { id: 'apple', name: '苹果', category: '水果', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, nutrients: ['果胶', '维生素C', '多酚', '槲皮素'] },
  { id: 'banana', name: '香蕉', category: '水果', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, nutrients: ['钾', '维生素B6', '镁', '色氨酸'] },
  { id: 'blueberry', name: '蓝莓', category: '水果', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, nutrients: ['花青素', '维生素C', '维生素K', '锰'] },
  { id: 'avocado', name: '牛油果', category: '水果', calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, fiber: 6.7, nutrients: ['单不饱和脂肪', '维生素E', '钾', '叶酸'] },
  { id: 'kiwi', name: '猕猴桃', category: '水果', calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5, fiber: 3.0, nutrients: ['维生素C', '维生素K', '猕猴桃酶', '叶酸'] },
  { id: 'milk', name: '纯牛奶（全脂）', category: '乳制品', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, nutrients: ['钙', '维生素D', '维生素B2', '磷'] },
  { id: 'yogurt-plain', name: '无糖酸奶', category: '乳制品', calories: 63, protein: 5.3, carbs: 6.0, fat: 2.5, fiber: 0, nutrients: ['钙', '益生菌', '维生素B12', '磷'] },
  { id: 'cottage-cheese', name: '茅屋奶酪', category: '乳制品', calories: 98, protein: 11.1, carbs: 3.4, fat: 4.3, fiber: 0, nutrients: ['酪蛋白', '钙', '硒', '维生素B2'] },
  { id: 'almond', name: '杏仁', category: '坚果', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, nutrients: ['维生素E', '镁', '单不饱和脂肪', '抗氧化剂'] },
  { id: 'walnut', name: '核桃', category: '坚果', calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7, nutrients: ['Omega-3', '维生素E', '褪黑素', '多酚'] },
  { id: 'chia-seed', name: '奇亚籽', category: '坚果', calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, nutrients: ['Omega-3', '膳食纤维', '钙', '抗氧化剂'] },
  { id: 'duck-breast', name: '鸭胸肉', category: '蛋白质', calories: 140, protein: 19.0, carbs: 0.5, fat: 6.0, fiber: 0, nutrients: ['铁', '锌', '维生素B3', '硒'] },
  { id: 'cod', name: '鳕鱼', category: '蛋白质', calories: 82, protein: 17.8, carbs: 0, fat: 0.7, fiber: 0, nutrients: ['硒', '维生素B12', '碘', '磷'] },
  { id: 'sardine', name: '沙丁鱼', category: '蛋白质', calories: 208, protein: 24.6, carbs: 0, fat: 11.5, fiber: 0, nutrients: ['Omega-3', '钙', '维生素D', '维生素B12'] },
  { id: 'lamb-lean', name: '瘦羊肉', category: '蛋白质', calories: 160, protein: 20.2, carbs: 0, fat: 8.5, fiber: 0, nutrients: ['铁', '锌', '维生素B12', '共轭亚油酸'] },
  { id: 'edamame', name: '毛豆', category: '蛋白质', calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2, nutrients: ['大豆蛋白', '叶酸', '维生素K', '异黄酮'] },
  { id: 'chickpea', name: '鹰嘴豆', category: '蛋白质', calories: 139, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, nutrients: ['叶酸', '铁', '锰', '低GI碳水'] },
  { id: 'asparagus', name: '芦笋', category: '蔬菜', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, nutrients: ['维生素K', '叶酸', '谷胱甘肽', '芦丁'] },
  { id: 'bell-pepper', name: '彩椒', category: '蔬菜', calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1, nutrients: ['维生素C', 'β-胡萝卜素', '维生素B6', '辣椒红素'] },
  { id: 'celery', name: '芹菜', category: '蔬菜', calories: 14, protein: 0.7, carbs: 3.0, fat: 0.2, fiber: 1.6, nutrients: ['芹菜素', '维生素K', '钾', '苯酞类化合物'] },
  { id: 'mushroom', name: '香菇', category: '蔬菜', calories: 34, protein: 2.5, carbs: 6.8, fat: 0.3, fiber: 2.5, nutrients: ['维生素D', '香菇多糖', '硒', '铜'] },
  { id: 'kale', name: '羽衣甘蓝', category: '蔬菜', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, fiber: 3.6, nutrients: ['维生素K', '维生素C', '叶黄素', '萝卜硫素'] },
  { id: 'cabbage', name: '圆白菜', category: '蔬菜', calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, fiber: 2.5, nutrients: ['维生素C', '维生素U', '萝卜硫素', '吲哚-3-甲醇'] },
  { id: 'lettuce', name: '生菜', category: '蔬菜', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, nutrients: ['维生素A', '维生素K', '叶酸', '莴苣素'] },
  { id: 'okra', name: '秋葵', category: '蔬菜', calories: 33, protein: 1.8, carbs: 7.5, fat: 0.2, fiber: 3.2, nutrients: ['黏蛋白', '维生素K', '叶酸', '镁'] },
  { id: 'orange', name: '橙子', category: '水果', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, nutrients: ['维生素C', '橙皮苷', '叶酸', '柠檬苦素'] },
  { id: 'strawberry', name: '草莓', category: '水果', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2.0, nutrients: ['维生素C', '鞣花酸', '花青素', '锰'] },
  { id: 'watermelon', name: '西瓜', category: '水果', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, nutrients: ['番茄红素', '瓜氨酸', '维生素A', '钾'] },
  { id: 'grapefruit', name: '西柚', category: '水果', calories: 42, protein: 0.8, carbs: 10.7, fat: 0.1, fiber: 1.6, nutrients: ['维生素C', '柚皮苷', '番茄红素', '果胶'] },
  { id: 'pineapple', name: '菠萝', category: '水果', calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1, fiber: 1.4, nutrients: ['菠萝蛋白酶', '维生素C', '锰', '维生素B1'] },
  { id: 'grape', name: '葡萄', category: '水果', calories: 67, protein: 0.7, carbs: 17.2, fat: 0.4, fiber: 0.9, nutrients: ['白藜芦醇', '花青素', '维生素K', '铜'] },
  { id: 'mango', name: '芒果', category: '水果', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, nutrients: ['维生素A', '维生素C', '芒果苷', 'β-胡萝卜素'] },
  { id: 'cherry', name: '樱桃', category: '水果', calories: 63, protein: 1.1, carbs: 16, fat: 0.2, fiber: 2.1, nutrients: ['花青素', '褪黑素', '维生素C', '钾'] },
  { id: 'whole-wheat-bread', name: '全麦面包', category: '主食', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, nutrients: ['膳食纤维', '维生素B1', '锰', '硒'] },
  { id: 'buckwheat', name: '荞麦', category: '主食', calories: 343, protein: 13.3, carbs: 71.5, fat: 3.4, fiber: 10, nutrients: ['芦丁', '镁', '铜', '膳食纤维'] },
  { id: 'millet', name: '小米', category: '主食', calories: 378, protein: 11, carbs: 73, fat: 4.2, fiber: 8.5, nutrients: ['铁', '维生素B1', '镁', '硒'] },
  { id: 'kefir', name: '开菲尔酸奶', category: '乳制品', calories: 55, protein: 3.5, carbs: 4.5, fat: 2.5, fiber: 0, nutrients: ['益生菌群', '钙', '维生素K2', '色氨酸'] },
  { id: 'mozzarella', name: '马苏里拉奶酪', category: '乳制品', calories: 280, protein: 22, carbs: 2.2, fat: 20, fiber: 0, nutrients: ['钙', '共轭亚油酸', '维生素B12', '磷'] },
  { id: 'parmesan', name: '帕玛森奶酪', category: '乳制品', calories: 392, protein: 28.4, carbs: 4.1, fat: 28, fiber: 0, nutrients: ['钙', '蛋白质', '维生素A', '磷'] },
  { id: 'cashew', name: '腰果', category: '坚果', calories: 553, protein: 18.2, carbs: 30.2, fat: 43.9, fiber: 3.3, nutrients: ['铜', '镁', '锌', '色氨酸'] },
  { id: 'pistachio', name: '开心果', category: '坚果', calories: 560, protein: 20.2, carbs: 27.2, fat: 45.3, fiber: 10.6, nutrients: ['维生素B6', '叶黄素', '钾', '植物甾醇'] },
  { id: 'sunflower-seed', name: '葵花籽', category: '坚果', calories: 584, protein: 20.8, carbs: 20, fat: 51.5, fiber: 8.6, nutrients: ['维生素E', '镁', '硒', '亚油酸'] },
  { id: 'flaxseed', name: '亚麻籽', category: '坚果', calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2, fiber: 27.3, nutrients: ['Omega-3', '木酚素', '膳食纤维', '镁'] },
  { id: 'pumpkin-seed', name: '南瓜籽', category: '坚果', calories: 446, protein: 19.4, carbs: 14.7, fat: 36, fiber: 18.4, nutrients: ['锌', '镁', '植物甾醇', '色氨酸'] },
];

const CAT_COLORS: Record<string, string> = {
  '蛋白质': '#e8988a',
  '蔬菜': '#7eb8a0',
  '水果': '#e8c98b',
  '主食': '#d4a76a',
  '乳制品': '#a8c8e8',
  '坚果': '#c8a080',
};

export default function FoodDatabase() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('全部');

  const filtered = useMemo(() => {
    return FOODS.filter(f => {
      const matchCat = catFilter === '全部' || f.category === catFilter;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || f.name.toLowerCase().includes(q) || f.nutrients.some(n => n.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, catFilter]);

  return (
    <div className="card">
      <h2>健康食材库</h2>
      <p className="rec-subtitle">每 100g 营养成分参考值</p>

      <div className="food-search-bar">
        <input
          type="text"
          placeholder="搜索食材或营养成分..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="food-search-input"
        />
      </div>

      <div className="food-cat-filters">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`food-cat-chip ${catFilter === c ? 'active' : ''}`}
            onClick={() => setCatFilter(c)}
            style={catFilter === c && c !== '全部' ? { background: (CAT_COLORS[c] || '#e8988a') + '22', borderColor: CAT_COLORS[c], color: CAT_COLORS[c] } : {}}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="food-grid">
        {filtered.map(f => (
          <div key={f.id} className="food-card">
            <div className="food-card-header">
              <span className="food-name">{f.name}</span>
              <span className="food-cat-tag" style={{ background: (CAT_COLORS[f.category] || '#e8988a') + '18', color: CAT_COLORS[f.category] }}>
                {f.category}
              </span>
            </div>

            <div className="food-macros">
              <div className="macro-item">
                <span className="macro-val">{f.calories}</span>
                <span className="macro-label">热量 kcal</span>
              </div>
              <div className="macro-item">
                <span className="macro-val">{f.protein}g</span>
                <span className="macro-label">蛋白质</span>
              </div>
              <div className="macro-item">
                <span className="macro-val">{f.carbs}g</span>
                <span className="macro-label">碳水</span>
              </div>
              <div className="macro-item">
                <span className="macro-val">{f.fat}g</span>
                <span className="macro-label">脂肪</span>
              </div>
              {f.fiber > 0 && (
                <div className="macro-item">
                  <span className="macro-val">{f.fiber}g</span>
                  <span className="macro-label">纤维</span>
                </div>
              )}
            </div>

            <div className="food-nutrients">
              {f.nutrients.map(n => (
                <span key={n} className="nutrient-tag">{n}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">没有匹配的食材</div>
      )}
    </div>
  );
}
