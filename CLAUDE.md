# CLAUDE.md

This file is a guide for Claude Code to understand the project.

## Language Settings

- **Think in English** for logical reasoning and problem-solving
- **Respond in Japanese** when communicating with the user

## Project Overview

A full-stack TypeScript monorepo template with TDD (Test-Driven Development) support.

### Tech Stack

- **Monorepo**: Turborepo + pnpm
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS
- **Testing**: Vitest + React Testing Library + MSW + Playwright
- **Code Quality**: ESLint + Prettier + Husky + commitlint

### Main Directories

- `apps/frontend/` - React + Vite frontend
- `apps/backend/` - NestJS API server
- `packages/database/` - Prisma schema and shared type definitions
- `packages/shared/` - Shared utilities and API definitions
- `packages/ui/` - Shared UI components
- `e2e/` - Playwright E2E tests

## Commit Message Convention

**Important**: Always follow the rules in `.github/COMMIT_CONVENTION.md` when creating commits.

### Required Format

```
<prefix>: <subject>
```

### Prefix List

| Prefix     | Usage                                   |
| ---------- | --------------------------------------- |
| `feat`     | New feature                             |
| `fix`      | Bug fix                                 |
| `docs`     | Documentation only                      |
| `style`    | Style changes (no code behavior impact) |
| `refactor` | Code changes (not bug fix or feature)   |
| `perf`     | Performance improvement                 |
| `test`     | Add or modify tests                     |
| `chore`    | Build, tools, dependencies              |
| `ci`       | CI/CD configuration                     |

### Commit Message Principles

1. **Communicate "why"**: Describe the reason (Why), the change (What) is visible in the code
2. **Use present tense**: "Fix" not "Fixed"
3. **One commit = One purpose**: Don't include multiple purposes
4. **Be specific**: "fix: resolve session timeout on login" not "fix: bug fix"

### Good Examples

```
feat: add user profile editing feature

Allow users to edit their profile information.

Related: #123
```

```
fix: resolve token validation error on password reset

UTC and local time comparison was not performed correctly.

Fixes: #456
```

### Bad Examples

```
❌ update
❌ fix bug
❌ review fixes
❌ fixed it
```

## Commands

```bash
# Development
pnpm dev              # Start all apps
pnpm dev:frontend     # Frontend only
pnpm dev:backend      # Backend only

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm test:e2e         # E2E tests

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Lint
pnpm format           # Format
pnpm check-types      # Type check
```

## Type Sharing

Types generated from Prisma schema are centrally managed in `@repo/database`.

```typescript
// Backend
import { prisma, User } from '@repo/database';

// Frontend
import { UserDTO, CreateUserSchema } from '@repo/database/schemas';

// Shared types
import { ApiResponse } from '@repo/shared/types';
```

## Coding Rules

### Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- To understand how to use a library, **always use the Context7 MCP** to retrieve the latest information.
- After implementation, be sure to create or review test code.
- Make sure there are no errors in the items defined by the lint-staged tests.

### Programming Rules

- Avoid hard-coding values unless absolutely necessary.
- Do not use `any` or `unknown` types in TypeScript.
- You must not use a TypeScript `class` unless it is absolutely necessary (e.g., extending the `Error` class for custom error handling that requires `instanceof` checks).
- Always write code that adheres to the established coding conventions and styles of the project.
- When writing commit messages, always follow the rules defined in `.github/COMMIT_CONVENTION.md`.
