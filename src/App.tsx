import { useState, useEffect } from 'react';
import type { Todo, FilterState } from './types';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import CategoryManager from './components/CategoryManager';
import './App.css';

// 初回起動時に使うデフォルトカテゴリ
const DEFAULT_CATEGORIES = ['仕事', 'プライベート', '買い物'];
// カテゴリ削除時に既存タスクを移す先
const UNCATEGORIZED = '未分類';
// LocalStorageのキー
const LS_TODOS = 'todos';
const LS_CATEGORIES = 'categories';

// LocalStorageから値を読み込む。パースに失敗した場合はfallbackを返す
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// LocalStorageへ値を保存する
function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// タスクのユニークIDを生成する（timestamp + ランダム文字列）
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  // 初期値はLocalStorageから復元する（初回はデフォルト値）
  const [todos, setTodos] = useState<Todo[]>(() =>
    loadFromStorage<Todo[]>(LS_TODOS, [])
  );
  const [categories, setCategories] = useState<string[]>(() =>
    loadFromStorage<string[]>(LS_CATEGORIES, DEFAULT_CATEGORIES)
  );
  const [filter, setFilter] = useState<FilterState>({ status: 'all', category: '' });
  // 編集中のタスク。nullのとき追加モード、非nullのとき編集モード
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // todosが変わるたびにLocalStorageへ保存
  useEffect(() => {
    saveToStorage(LS_TODOS, todos);
  }, [todos]);

  // categoriesが変わるたびにLocalStorageへ保存
  useEffect(() => {
    saveToStorage(LS_CATEGORIES, categories);
  }, [categories]);

  // --- タスク操作 ---

  // 新規タスクをリスト先頭に追加する
  const handleAddTodo = (title: string, category: string) => {
    const newTodo: Todo = {
      id: generateId(),
      title,
      completed: false,
      category,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // 既存タスクのtitleとcategoryを更新し、編集モードを解除する
  const handleUpdateTodo = (id: string, title: string, category: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, category } : t))
    );
    setEditingTodo(null);
  };

  // 完了フラグをトグルする
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // 確認ダイアログの後にタスクを削除する。編集中だった場合は編集モードも解除
  const handleDeleteTodo = (id: string) => {
    if (!window.confirm('このタスクを削除しますか？')) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingTodo?.id === id) setEditingTodo(null);
  };

  // 編集モードへ移行し、フォームが見えるようページ上部へスクロール
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- カテゴリ操作 ---

  const handleAddCategory = (category: string) => {
    setCategories((prev) => [...prev, category]);
  };

  // カテゴリを削除する。使用中のタスクがある場合は「未分類」へ再分類する
  const handleDeleteCategory = (category: string) => {
    const affected = todos.filter((t) => t.category === category);
    if (affected.length > 0) {
      const msg = `「${category}」を使用しているタスクが ${affected.length} 件あります。削除すると「${UNCATEGORIZED}」に再分類されます。続けますか？`;
      if (!window.confirm(msg)) return;
      // 該当タスクを「未分類」へ付け替える
      setTodos((prev) =>
        prev.map((t) =>
          t.category === category ? { ...t, category: UNCATEGORIZED } : t
        )
      );
      // 「未分類」カテゴリがまだなければ自動追加する
      setCategories((prev) => {
        const withoutDeleted = prev.filter((c) => c !== category);
        if (!withoutDeleted.includes(UNCATEGORIZED)) {
          return [...withoutDeleted, UNCATEGORIZED];
        }
        return withoutDeleted;
      });
    } else {
      if (!window.confirm(`「${category}」を削除しますか？`)) return;
      setCategories((prev) => prev.filter((c) => c !== category));
    }
    // 削除したカテゴリでフィルター中だった場合はフィルターをリセット
    if (filter.category === category) {
      setFilter((prev) => ({ ...prev, category: '' }));
    }
  };

  // --- フィルタリング ---

  // ステータスとカテゴリの両条件でタスクを絞り込む
  const filteredTodos = todos.filter((todo) => {
    const statusMatch =
      filter.status === 'all' ||
      (filter.status === 'active' && !todo.completed) ||
      (filter.status === 'completed' && todo.completed);
    const categoryMatch = filter.category === '' || todo.category === filter.category;
    return statusMatch && categoryMatch;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Todoリスト</h1>
        <p className="app-subtitle">
          未完了: {activeCount} 件 / 完了済み: {completedCount} 件
        </p>
      </header>

      <main className="app-main">
        <TodoForm
          categories={categories}
          editingTodo={editingTodo}
          onAdd={handleAddTodo}
          onUpdate={handleUpdateTodo}
          onCancelEdit={() => setEditingTodo(null)}
        />

        <CategoryManager
          categories={categories}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
        />

        <FilterBar
          filter={filter}
          categories={categories}
          onChange={setFilter}
        />

        <section className="todo-section">
          <p className="result-count">
            {filteredTodos.length} 件のタスクを表示中
          </p>
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
        </section>
      </main>
    </div>
  );
}
