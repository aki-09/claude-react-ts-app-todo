import { useState, useEffect } from 'react';
import type { Todo } from '../types';

interface TodoFormProps {
  categories: string[];
  editingTodo: Todo | null;
  onAdd: (title: string, category: string) => void;
  onUpdate: (id: string, title: string, category: string) => void;
  onCancelEdit: () => void;
}

export default function TodoForm({
  categories,
  editingTodo,
  onAdd,
  onUpdate,
  onCancelEdit,
}: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0] ?? '');

  // editingTodoが切り替わったらフォームの値を同期する
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setCategory(editingTodo.category);
    } else {
      // 編集キャンセル・完了時はフォームをリセット
      setTitle('');
      setCategory(categories[0] ?? '');
    }
  }, [editingTodo, categories]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return; // 空白のみの入力は無視

    if (editingTodo) {
      onUpdate(editingTodo.id, trimmed, category);
    } else {
      onAdd(trimmed, category);
    }
    // 送信後にフォームをリセット
    setTitle('');
    setCategory(categories[0] ?? '');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>{editingTodo ? 'タスクを編集' : '新しいタスクを追加'}</h2>
      <div className="form-row">
        <input
          type="text"
          className="form-input"
          placeholder="タスクを入力..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          {editingTodo ? '更新' : '追加'}
        </button>
        {editingTodo && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
