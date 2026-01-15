# GitHub Copilot Instructions

This file provides instructions for GitHub Copilot to understand the project.

## Project Overview

A full-stack TypeScript monorepo with TDD support (Turborepo + pnpm)

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: React + Vite + Tailwind CSS
- Testing: Vitest + React Testing Library + MSW + Playwright

## Commit Message Convention

**Important**: Strictly follow these rules when generating commit messages.

### Format

```
<prefix>: <subject>

[body]

[footer]
```

### Prefix (Required)

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Style changes (no code behavior impact)
- `refactor`: Code changes (not bug fix or feature)
- `perf`: Performance improvement
- `test`: Add or modify tests
- `chore`: Build, tools, dependencies
- `ci`: CI/CD configuration

### Rules

1. **Communicate "why"**: Describe the reason (Why). The change (What) is visible in the code
2. **Use present tense**: "Fix" not "Fixed", "Add" not "Added"
3. **One commit = One purpose**: Don't include multiple purposes
4. **Be specific**: Describe the scope of impact clearly

### Good Examples

```
feat: add user profile editing feature

Allow users to edit their profile information.

Related: #123
```

```
fix: resolve token validation error on password reset

UTC and local time comparison was not performed correctly.
```

```
perf: resolve N+1 problem in user list API

Use Prisma include to fetch relations in single query.
```

```
refactor: migrate auth middleware to NestJS Guard
```

### Bad Examples (Never use these)

- `update`
- `fix bug`
- `WIP`
- `review fixes`
- `fixed it`
- `various changes`

## Coding Standards

### TypeScript

- Use strict type definitions (avoid `any`)
- Use Zod for runtime validation
- Import Prisma types from `@repo/database`

### Testing

- TDD: Red → Green → Refactor
- Unit tests: Vitest
- Component tests: React Testing Library
- API mocks: MSW
- E2E: Playwright

### Directory Structure

```
apps/
  frontend/    # React + Vite
  backend/     # NestJS
packages/
  database/    # Prisma + type definitions
  shared/      # Shared utilities
  ui/          # UI components
e2e/           # Playwright
```

## Type Sharing Pattern

```typescript
// Backend
import { prisma, User } from '@repo/database';

// Frontend
import { UserDTO, CreateUserSchema } from '@repo/database/schemas';

// Shared
import { ApiResponse } from '@repo/shared/types';
import { createMockUser } from '@repo/shared/test-utils';
```
