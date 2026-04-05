// タスク1件を表す型
export interface Todo {
  id: string;       // ユニークID（timestamp + ランダム文字列）
  title: string;    // タスク名
  completed: boolean; // 完了フラグ
  category: string; // カテゴリ名
  createdAt: string; // 作成日時（ISO 8601形式）
}

// フィルターのステータス選択肢
export type FilterStatus = 'all' | 'active' | 'completed';

// フィルターの状態（ステータス + カテゴリの組み合わせ）
export interface FilterState {
  status: FilterStatus;
  category: string; // '' = すべてのカテゴリ
}
