# Deployment Guide

本プロジェクトのデプロイメント構成について説明します。

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                     (push to main branch)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  Cloudflare Pages   │         │   GitHub Actions    │
│  (自動検知・ビルド)   │         │   (テスト・ビルド)    │
└─────────────────────┘         └─────────────────────┘
          │                               │
          ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   Edge CDN 配信     │         │  Docker Image Push  │
│  (apps/frontend)    │         │  (GitHub Registry)  │
└─────────────────────┘         └─────────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │  Coolify Webhook    │
                                │  (Pull & Deploy)    │
                                └─────────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │  VPS (Docker)       │
                                │  Backend + PostgreSQL│
                                └─────────────────────┘
```

| コンポーネント | デプロイ先                            | 方式                  |
| -------------- | ------------------------------------- | --------------------- |
| Frontend       | Cloudflare Pages                      | Git連携で自動デプロイ |
| Backend        | VPS + Coolify                         | Docker + Webhook      |
| Database       | VPS (Coolify管理) または マネージドDB | Docker Compose        |

---

## Frontend: Cloudflare Pages

### Prerequisites

- Cloudflare アカウント
- GitHub リポジトリへのアクセス権限

### Setup Steps

#### 1. Cloudflare Pages プロジェクト作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. GitHub リポジトリを選択
4. ビルド設定を入力:

| 項目                   | 値                           |
| ---------------------- | ---------------------------- |
| Production branch      | `main`                       |
| Build command          | `pnpm install && pnpm build` |
| Build output directory | `apps/frontend/dist`         |
| Root directory         | `/` (空欄のまま)             |

5. **Environment variables** を設定:

| 変数名         | Production 値                | Preview 値                           |
| -------------- | ---------------------------- | ------------------------------------ |
| `VITE_API_URL` | `https://api.yourdomain.com` | `https://api-staging.yourdomain.com` |
| `NODE_VERSION` | `20`                         | `20`                                 |

6. **Save and Deploy** をクリック

#### 2. SPA ルーティング設定

`apps/frontend/public/_redirects` を作成済み:

```
/*    /index.html   200
```

これにより、React Router のクライアントサイドルーティングが正しく動作します。

#### 3. セキュリティヘッダー設定

`apps/frontend/public/_headers` を作成済み:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

#### 4. カスタムドメイン設定

1. Cloudflare Pages ダッシュボードで **Custom domains** を選択
2. ドメインを追加（例: `app.yourdomain.com`）
3. DNS 設定を確認（Cloudflare DNS を使用している場合は自動設定）

### Auto Deployment

- **Production**: `main` ブランチへのプッシュで自動デプロイ
- **Preview**: PR作成時に自動でプレビューURLを生成

---

## Backend: VPS + Coolify

### Prerequisites

- VPS（Ubuntu 22.04+ 推奨、最低 2GB RAM）
- ドメイン名（API用: `api.yourdomain.com`）
- SSH アクセス

### Coolify Setup

#### 1. Coolify インストール

```bash
# VPS に SSH 接続
ssh user@your-vps-ip

# Coolify をインストール
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

インストール完了後、`https://your-vps-ip:8000` でダッシュボードにアクセスし、管理者アカウントを作成します。

#### 2. GitHub 連携

1. Coolify ダッシュボードで **Sources** → **Add GitHub App**
2. GitHub App をインストール（リポジトリへのアクセス権限を付与）

#### 3. PostgreSQL サービス作成

1. **New Resource** → **Database** → **PostgreSQL**
2. 設定:
   - Version: `17`
   - Database name: `app`
   - Username: `app`
   - Password: 強力なパスワードを設定

3. **Deploy** をクリック
4. 接続情報をメモ（後で Backend 環境変数に使用）

#### 4. Backend サービス作成

1. **New Resource** → **Application** → **Docker Compose**
2. GitHub リポジトリを選択
3. 設定:
   - Docker Compose file: `docker/docker-compose.production.yml`
   - Build pack: `Docker Compose`

4. **Environment Variables** を設定:

| 変数名         | 値                                                    |
| -------------- | ----------------------------------------------------- |
| `NODE_ENV`     | `production`                                          |
| `PORT`         | `3001`                                                |
| `DATABASE_URL` | `postgresql://app:PASSWORD@postgres-service:5432/app` |
| `CORS_ORIGINS` | `https://yourdomain.com,https://www.yourdomain.com`   |

5. **Domains** を設定: `api.yourdomain.com`
6. **Deploy** をクリック

### Production Docker Compose

`docker/docker-compose.production.yml`:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    restart: unless-stopped
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_URL=${DATABASE_URL}
      - CORS_ORIGINS=${CORS_ORIGINS}
    healthcheck:
      test: ['CMD', 'wget', '-q', '--spider', 'http://localhost:3001/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Production Dockerfile

`docker/Dockerfile.backend` の本番用設定:

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN pnpm --filter=@repo/database db:generate
RUN pnpm --filter=backend build

# Runner
FROM base AS runner
RUN apk add --no-cache wget
ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/packages/database/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/packages/database/prisma ./prisma
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/main.js"]
```

### Entrypoint Script

`docker/entrypoint.sh`:

```bash
#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "Starting application..."
exec "$@"
```

---

## CI/CD: GitHub Actions

### Test Workflow

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9.0.0

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Generate Prisma Client
        run: pnpm db:generate

      - name: Run migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

      - name: Type check
        run: pnpm check-types

      - name: Lint
        run: pnpm lint

      - name: Test
        run: pnpm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
```

### Backend Deploy Workflow

`.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'apps/backend/**'
      - 'packages/database/**'
      - 'packages/shared/**'
      - 'docker/Dockerfile.backend'
      - 'docker/docker-compose.production.yml'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/backend

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=raw,value=latest

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile.backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
      - name: Trigger Coolify Webhook
        run: |
          curl -X POST "${{ secrets.COOLIFY_WEBHOOK_URL }}" \
            -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}"
```

### GitHub Secrets 設定

リポジトリの **Settings** → **Secrets and variables** → **Actions** で以下を設定:

| Secret 名             | 説明                           |
| --------------------- | ------------------------------ |
| `COOLIFY_WEBHOOK_URL` | Coolify のデプロイ Webhook URL |
| `COOLIFY_TOKEN`       | Coolify API トークン           |

---

## Environment Variables

### Production Template

`.env.production.example`:

```bash
# Backend
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://app:YOUR_STRONG_PASSWORD@postgres:5432/app
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend (Cloudflare Pages で設定)
# VITE_API_URL=https://api.yourdomain.com
```

### Backend CORS Configuration

`apps/backend/src/main.ts` で CORS を動的に設定:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 環境変数から CORS オリジンを取得
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // ヘルスチェックエンドポイント
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
```

---

## Deployment Flow Summary

| トリガー       | Frontend                | Backend                       |
| -------------- | ----------------------- | ----------------------------- |
| `main` へ push | CF Pages 自動デプロイ   | GH Actions → Docker → Coolify |
| PR 作成        | プレビューURL生成       | テストのみ実行                |
| 手動           | CF Pages ダッシュボード | Coolify ダッシュボード        |

---

## Troubleshooting

### Frontend

#### ビルドエラー: pnpm not found

- Cloudflare Pages の環境変数に `NODE_VERSION=20` を設定
- pnpm は Node.js 16.13+ で Corepack 経由で自動インストール

#### 404 エラー（SPA ルーティング）

- `apps/frontend/public/_redirects` が存在することを確認
- ビルド出力に `_redirects` が含まれていることを確認

### Backend

#### Database connection refused

- PostgreSQL サービスが起動していることを確認
- `DATABASE_URL` の接続文字列が正しいことを確認
- Coolify の内部ネットワーク名を使用しているか確認

#### Migration failed

- Prisma スキーマに構文エラーがないか確認
- データベースユーザーに十分な権限があるか確認

#### CORS error

- `CORS_ORIGINS` にフロントエンドのドメインが含まれていることを確認
- プロトコル（https://）を含めて正確に指定

### Coolify

#### Webhook が動作しない

- Webhook URL と Token が正しく設定されているか確認
- GitHub Secrets が正しく設定されているか確認
- Coolify ダッシュボードでデプロイログを確認

---

## Security Checklist

- [ ] 本番環境で強力なデータベースパスワードを使用
- [ ] CORS オリジンを本番ドメインのみに制限
- [ ] 環境変数にシークレットを直接記載しない
- [ ] HTTPS を強制（Coolify/Traefik が自動設定）
- [ ] データベースを公開ネットワークに露出させない
- [ ] GitHub Secrets で機密情報を管理
