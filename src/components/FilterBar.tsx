import type { FilterState, FilterStatus } from '../types';

interface FilterBarProps {
  filter: FilterState;
  categories: string[];
  onChange: (filter: FilterState) => void;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
];

export default function FilterBar({ filter, categories, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">ステータス：</span>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            className={`filter-btn ${filter.status === value ? 'active' : ''}`}
            onClick={() => onChange({ ...filter, status: value })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="filter-group">
        <span className="filter-label">カテゴリー：</span>
        <button
          className={`filter-btn ${filter.category === '' ? 'active' : ''}`}
          onClick={() => onChange({ ...filter, category: '' })}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter.category === cat ? 'active' : ''}`}
            onClick={() => onChange({ ...filter, category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
