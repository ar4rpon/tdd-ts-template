# TDD TypeScript Template

TDD（テスト駆動開発）に対応したフルスタックTypeScript モノレポテンプレートです。

## Tech Stack

- **Monorepo**: Turborepo + pnpm
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Testing**: Vitest + React Testing Library + MSW + Playwright
- **Code Quality**: ESLint + Prettier + Husky + lint-staged
- **Infrastructure**: Docker Compose

## Project Structure

```
tdd-ts-template/
├── apps/
│   ├── frontend/          # React + Vite アプリ
│   └── backend/           # NestJS API サーバー
├── packages/
│   ├── database/          # Prisma スキーマ・型定義・Zodスキーマ
│   ├── ui/                # 共有UIコンポーネント + Storybook
│   ├── shared/            # 共有型定義・ユーティリティ
│   ├── eslint-config/     # ESLint設定
│   └── typescript-config/ # TypeScript設定
├── e2e/                   # Playwright E2Eテスト
└── docker/                # Docker設定
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- Docker & Docker Compose

### Installation

```bash
# 依存関係をインストール
pnpm install

# 環境変数ファイルを作成
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env

# PostgreSQLを起動
docker compose up -d postgres

# Prisma クライアントを生成
pnpm db:generate

# データベースのマイグレーション
pnpm db:migrate
```

### Development

```bash
# 全アプリを起動
pnpm dev

# フロントエンドのみ
pnpm dev:frontend

# バックエンドのみ
pnpm dev:backend

# Storybookを起動
pnpm storybook
```

### Testing

```bash
# 全テストを実行
pnpm test

# ウォッチモードでテスト
pnpm test:watch

# カバレッジレポート
pnpm test:coverage

# E2Eテスト
pnpm test:e2e
```

### Code Quality

```bash
# リント
pnpm lint

# フォーマット
pnpm format

# 型チェック
pnpm check-types
```

### Build

```bash
# プロダクションビルド
pnpm build
```

## Apps & Packages

### Apps

| Name       | Port | Description                 |
| ---------- | ---- | --------------------------- |
| `frontend` | 3000 | React + Vite フロントエンド |
| `backend`  | 3001 | NestJS API サーバー         |

### Packages

| Name                      | Description                               |
| ------------------------- | ----------------------------------------- |
| `@repo/database`          | Prismaスキーマ・型定義・Zodスキーマ       |
| `@repo/ui`                | 共有UIコンポーネント（Storybook付き）     |
| `@repo/shared`            | 共有型定義・API定義・テストユーティリティ |
| `@repo/eslint-config`     | ESLint設定                                |
| `@repo/typescript-config` | TypeScript設定                            |

## Prisma型の共有

`@repo/database`パッケージでPrismaスキーマから生成される型を一元管理し、フロントエンドとバックエンドで共有します。

### 型の利用方法

```typescript
// バックエンド: Prismaクライアントと型を使用
import { prisma, User, PostWithAuthor } from '@repo/database';

const users = await prisma.user.findMany();

// フロントエンド: 型とZodスキーマを使用
import { UserDTO, CreateUserSchema, PostWithAuthorDTO } from '@repo/database/schemas';

// バリデーション
const validatedUser = CreateUserSchema.parse(formData);

// 共有型を使ったAPIレスポンス定義
import { UserSchema, PostSchema, ApiResponse } from '@repo/shared/types';
```

### 利用可能な型

| カテゴリ             | エクスポート                                               |
| -------------------- | ---------------------------------------------------------- |
| Prisma型             | `User`, `Post`, `Tag`, `Role`                              |
| リレーション型       | `UserWithPosts`, `PostWithAuthor`, `PostWithAuthorAndTags` |
| Zodスキーマ          | `UserSchema`, `CreateUserSchema`, `UpdateUserSchema`       |
| DTO型                | `UserDTO`, `CreateUserDTO`, `PostDTO`, `CreatePostDTO`     |
| テストユーティリティ | `createMockUser()`, `createMockPost()`                     |

## TDD Workflow

1. **Red**: テストを書く（失敗させる）
2. **Green**: 最小限のコードでテストを通す
3. **Refactor**: コードを改善する

### Testing Layers

| Layer          | Tool         | Location                          |
| -------------- | ------------ | --------------------------------- |
| Unit Test      | Vitest       | `apps/*/src/**/*.spec.ts`         |
| Component Test | Vitest + RTL | `apps/frontend/src/**/*.test.tsx` |
| API Mock       | MSW          | `apps/frontend/src/test/mocks/`   |
| E2E Test       | Playwright   | `e2e/tests/`                      |

## Docker

```bash
# 開発用 PostgreSQL を起動
docker compose up -d postgres

# テスト用 PostgreSQL を起動（tmpfs使用）
docker compose up -d postgres-test

# 停止
docker compose down

# ボリュームも削除
docker compose down -v
```

## Git Hooks

- **pre-commit**: lint-staged（ESLint + Prettier）
- **commit-msg**: commitlint（コミットメッセージ検証）

## Commit Convention

このプロジェクトでは[Conventional Commits](https://www.conventionalcommits.org/)に基づくコミットメッセージ規約を採用しています。

詳細は [.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md) を参照してください。

### フォーマット

```
<prefix>: <subject>

[body]

[footer]
```

### Prefix一覧

| Prefix     | 用途                               |
| ---------- | ---------------------------------- |
| `feat`     | 新機能の追加                       |
| `fix`      | バグ修正                           |
| `docs`     | ドキュメントのみの変更             |
| `style`    | コード動作に影響しないスタイル変更 |
| `refactor` | バグ修正・機能追加以外のコード変更 |
| `perf`     | パフォーマンス改善                 |
| `test`     | テストの追加・修正                 |
| `chore`    | ビルド・ツール・依存関係の変更     |
| `ci`       | CI/CD設定の変更                    |

### 例

```bash
# 良い例
feat: ユーザープロフィール編集機能を追加
fix: ログイン時のセッション切れを修正
refactor: 認証ロジックを共通化

# 悪い例
update
fix bug
修正した
```

## AI Tool Support

このプロジェクトはClaude CodeとGitHub Copilotを最大限活用するための設定を含んでいます。

### 設定ファイル

| ファイル                          | 用途                                     |
| --------------------------------- | ---------------------------------------- |
| `.github/COMMIT_CONVENTION.md`    | 共通ルール定義（Single Source of Truth） |
| `CLAUDE.md`                       | Claude Code用プロジェクト設定            |
| `.github/copilot-instructions.md` | GitHub Copilot用指示                     |
| `commitlint.config.js`            | commitlintによるバリデーション           |

### AI Agent Skills

プロジェクト固有のSkillsが`.claude/skills/`と`.github/skills/`に定義されています。

| Skill                        | 発動条件                    | 機能                               |
| ---------------------------- | --------------------------- | ---------------------------------- |
| `tdd-workflow`               | TDD、テストファーストと言及 | Red-Green-Refactorサイクルをガイド |
| `vitest-testing`             | テスト作成、カバレッジ改善  | Vitestテストパターンを提供         |
| `generating-commit-messages` | コミット作成時              | 規約に沿ったコミットメッセージ生成 |
| `pr-review`                  | PRレビュー依頼時            | コードレビューチェックリスト適用   |

#### 使用例

```bash
# TDDでの機能実装（tdd-workflow Skillが発動）
"ユーザー登録機能をTDDで実装して"

# テスト作成（vitest-testing Skillが発動）
"UserServiceのユニットテストを書いて"

# PRレビュー（pr-review Skillが発動）
"このブランチの変更をレビューして"

# コミット作成（generating-commit-messages Skillが発動）
"変更をコミットして"
```

### MCP Servers

MCPサーバーを使用することで、Claude Codeの機能を拡張できます。

#### セットアップ

```bash
# 推奨MCPサーバーを一括セットアップ
./scripts/setup-mcp.sh

# または個別にセットアップ
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

#### 推奨MCPサーバー

| サーバー            | 機能             | 使用例                                          |
| ------------------- | ---------------- | ----------------------------------------------- |
| Context7            | ドキュメント参照 | `"Prismaのトランザクション使い方 use context7"` |
| Sequential Thinking | 構造化思考       | `"この問題をステップバイステップで解決して"`    |
| GitHub              | リポジトリ操作   | `"PR #123のステータスを確認"`                   |
| Playwright          | ブラウザ自動化   | `"E2Eテストをデバッグして"`                     |

#### MCP使用例

```bash
# 最新ドキュメントを参照してコード生成
"NestJSのGuardを作成して。use context7"

# ライブラリの使い方を確認
"React Query v5でのmutationの書き方は？use context7"

# 複雑な問題の分析
"認証フローのバグを段階的に調査して"

# E2Eテストのデバッグ
"ログインテストが失敗している原因を調べて"
```

詳細は [docs/MCP_SETUP.md](docs/MCP_SETUP.md) を参照してください。

### ベストプラクティス

1. **TDD開発**: 新機能実装時は「TDDで」と指示するとSkillが発動
2. **ドキュメント参照**: ライブラリAPIを使う際は「use context7」を追加
3. **コードレビュー**: PR作成前に「レビューして」でセルフチェック
4. **コミット**: 変更後は「コミットして」で規約に沿ったメッセージ生成
