import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  // createdAtをja-JP形式（例: 2026年4月5日）に変換
  const createdAt = new Date(todo.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    // 完了済みの場合は .completed クラスを付与してスタイルを切り替える
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
      />
      <div className="todo-content">
        <span className="todo-title">{todo.title}</span>
        <div className="todo-meta">
          <span className="todo-category">{todo.category}</span>
          <span className="todo-date">{createdAt}</span>
        </div>
      </div>
      <div className="todo-actions">
        {/* 完了済みタスクは編集不可 */}
        <button
          className="btn btn-edit"
          onClick={() => onEdit(todo)}
          disabled={todo.completed}
          title="編集"
        >
          編集
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(todo.id)}
          title="削除"
        >
          削除
        </button>
      </div>
    </div>
  );
}
