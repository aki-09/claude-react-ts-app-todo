import { useState } from 'react';

interface CategoryManagerProps {
  categories: string[];
  onAdd: (category: string) => void;
  onDelete: (category: string) => void;
}

export default function CategoryManager({
  categories,
  onAdd,
  onDelete,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    // 空白のみ、または重複するカテゴリ名は追加しない
    if (!trimmed || categories.includes(trimmed)) return;
    onAdd(trimmed);
    setNewCategory('');
  };

  return (
    <div className="category-manager">
      <button
        className="btn btn-secondary toggle-category-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? 'カテゴリー管理を閉じる' : 'カテゴリーを管理'}
      </button>

      {isOpen && (
        <div className="category-panel">
          <h3>カテゴリー管理</h3>
          <form className="category-form" onSubmit={handleAdd}>
            <input
              type="text"
              className="form-input"
              placeholder="新しいカテゴリー名..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              追加
            </button>
          </form>
          <ul className="category-list">
            {categories.map((cat) => (
              <li key={cat} className="category-item">
                <span>{cat}</span>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => onDelete(cat)}
                  title={`${cat}を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
