# Commit Convention

This document defines the commit message convention for this project.

## Core Principle

**Communicate "why" the code was changed.**

The diff shows "what/how" was changed. The commit message should explain "why" the change was necessary.

## Format

```
<prefix>: <subject>

[body]

[footer]
```

### Required

- **prefix**: Type of change (see below)
- **subject**: Summary of change (50 chars max recommended)

### Optional

- **body**: Detailed explanation (why this change was needed)
- **footer**: Related issues, ticket numbers, reference URLs

## Prefix List

| Prefix     | Usage                                   | Example                                 |
| ---------- | --------------------------------------- | --------------------------------------- |
| `feat`     | New feature                             | `feat: add user authentication`         |
| `fix`      | Bug fix                                 | `fix: resolve session timeout on login` |
| `docs`     | Documentation only                      | `docs: update API specification`        |
| `style`    | Style changes (no code behavior impact) | `style: fix indentation`                |
| `refactor` | Code changes (not bug fix or feature)   | `refactor: consolidate auth logic`      |
| `perf`     | Performance improvement                 | `perf: resolve N+1 query issue`         |
| `test`     | Add or modify tests                     | `test: add user service unit tests`     |
| `chore`    | Build, tools, dependencies              | `chore: update ESLint config`           |
| `ci`       | CI/CD configuration                     | `ci: add tests to GitHub Actions`       |
| `revert`   | Revert previous commit                  | `revert: feat: add user authentication` |

## Rules

### 1. Use present tense

```
❌ Fixed, Added, Changed
✅ Fix, Add, Change
```

### 2. One commit = One purpose

```
❌ fix: bug fix and refactoring
✅ fix: resolve login error
✅ refactor: consolidate auth logic (separate commit)
```

### 3. Be specific about scope

```
❌ fix: bug fix
❌ refactor: refactoring
✅ fix: resolve pagination not working on user list
✅ refactor: extract duplicate validation logic to utility
```

### 4. Avoid past tense

```
❌ Added user authentication
❌ Fixed the bug
✅ Add user authentication
✅ Fix login session timeout
```

## Good Examples

```
feat: add user profile editing feature

Allow users to edit their profile information (name, email).
Accessible from settings page.

Related: #123
```

```
fix: resolve token validation error on password reset

UTC and local time comparison was not performed correctly.

Fixes: #456
```

```
perf: resolve N+1 problem in user list API

Use Prisma include to fetch relations in single query.
Response time improved from 200ms to 50ms average.
```

```
refactor: migrate auth middleware to NestJS Guard

Migrate from Express middleware to NestJS standard Guard pattern
to leverage dependency injection.
```

## Bad Examples

```
❌ update
❌ fix bug
❌ WIP
❌ review fixes
❌ fixed it
❌ various changes
```

## Scope (Optional)

For changes limited to specific scope, add scope:

```
feat(auth): add social login
fix(api): resolve rate limit count error
test(user): improve user service test coverage
```

## Footer References

Add to footer as needed:

- Issue/PR: `Fixes: #123`, `Related: #456`
- Ticket: `Ticket: PROJ-789`
- Reference: `See: https://example.com/docs`
