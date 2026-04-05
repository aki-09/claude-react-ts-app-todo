# 開発ドキュメント — Todo アプリ

## 概要

個人向けTodoアプリをReact + TypeScript + Viteで構築。外部UIライブラリを使わず、LocalStorageによるデータ永続化とカテゴリ管理機能を実装した。

---

## 技術スタック

| 項目 | 採用技術 |
|---|---|
| フレームワーク | React 19 |
| 言語 | TypeScript 5.9 |
| ビルドツール | Vite 8 |
| スタイリング | 素のCSS（外部UIライブラリなし） |
| データ永続化 | LocalStorage |

---

## 機能一覧

- タスクの追加・編集・削除
- 完了 / 未完了の切り替え（チェックボックス）
- ステータスフィルター（すべて / 未完了 / 完了済み）
- カテゴリフィルター
- カテゴリの追加・削除（削除時は影響タスクを「未分類」へ再分類）
- 全データのLocalStorage永続化

---

## ディレクトリ構成

```
src/
├── main.tsx                  # エントリポイント
├── App.tsx                   # メイン状態管理・LocalStorage連携
├── App.css                   # アプリ全体のスタイル
├── index.css                 # ベーススタイル（リセット・フォント）
├── types.ts                  # 型定義
└── components/
    ├── TodoForm.tsx           # タスク追加・編集フォーム
    ├── TodoList.tsx           # タスク一覧
    ├── TodoItem.tsx           # タスク1件
    ├── FilterBar.tsx          # ステータス・カテゴリフィルター
    └── CategoryManager.tsx   # カテゴリ追加・削除
```

---

## 型定義（types.ts）

```ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: string; // ISO 8601
}

type FilterStatus = 'all' | 'active' | 'completed';

interface FilterState {
  status: FilterStatus;
  category: string; // '' = すべてのカテゴリ
}
```

---

## 状態管理

`App.tsx` が唯一の状態保持コンポーネント。外部状態管理ライブラリは使用しない。

| state | 型 | 説明 |
|---|---|---|
| `todos` | `Todo[]` | タスク一覧 |
| `categories` | `string[]` | カテゴリ一覧 |
| `filter` | `FilterState` | 現在のフィルター条件 |
| `editingTodo` | `Todo \| null` | 編集中のタスク |

---

## LocalStorage

| キー | 内容 |
|---|---|
| `todos` | タスク一覧（JSON） |
| `categories` | カテゴリ一覧（JSON） |

`useEffect` で各stateの変化を監視し、変更のたびに自動保存。

デフォルトカテゴリ: `仕事` / `プライベート` / `買い物`

---

## コンポーネント詳細

### App.tsx
- LocalStorageからの初期ロード（`useState` の初期化関数で実行）
- タスク・カテゴリのCRUD操作を定義し、子コンポーネントへprops経由で渡す
- フィルタリングロジック（`filteredTodos`）を保持

### TodoForm.tsx
- 追加・編集を1コンポーネントで兼任
- `editingTodo` が非nullのとき編集モードに切り替わる
- 編集開始時はページ上部へスクロール

### TodoItem.tsx
- 完了済みタスクは打ち消し線＋ミュートカラーで表示
- 完了済みタスクの編集ボタンはdisabled

### CategoryManager.tsx
- トグルで開閉するパネル形式
- カテゴリ削除時、そのカテゴリを使用するタスクが存在すれば確認ダイアログを表示し、「未分類」へ再分類

### FilterBar.tsx
- ステータス・カテゴリをそれぞれボタングループで切り替え
- アクティブなフィルターはインディゴ背景で強調表示

---

## スタイリング方針

- 外部ライブラリなしの素のCSS
- ベースカラー: グレー背景 (`#f3f4f6`) + ホワイトカード
- アクセントカラー: インディゴ (`#6366f1`)
- カテゴリバッジ: 紫系 (`#ede9fe` / `#6d28d9`)
- モバイル対応（540px以下でフォームを縦並びに変更）
- 日本語フォントスタック指定 (`Hiragino Sans`, `Yu Gothic`)

---

## 開発経緯

1. Vite + React + TypeScript でプロジェクト作成（`npm create vite@latest`）
2. コンポーネント・型・状態管理を実装
3. ビルド検証（`npm run build`）
4. App.css / index.css がViteデフォルトのままだったため、アプリ用CSSに全面書き直し

---

## 開発・ビルドコマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```
