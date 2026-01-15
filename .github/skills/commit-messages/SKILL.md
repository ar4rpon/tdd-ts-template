---
name: generating-commit-messages
description: Generate clear, conventional commit messages following project rules. Use when creating commits, writing commit messages, or reviewing staged changes.
allowed-tools: Bash, Read, Grep
---

# Generating Commit Messages

## Overview

This project follows Conventional Commits. See `.github/COMMIT_CONVENTION.md` for the full specification.

## Format

```
<prefix>: <subject>

[body]

[footer]
```

## Prefix Types

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

## Workflow

1. **Check staged changes:**

   ```bash
   git diff --staged
   ```

2. **Analyze the changes:**
   - What type of change is this? (feat, fix, refactor, etc.)
   - What is the scope? (optional: auth, api, ui, etc.)
   - What is the main purpose?

3. **Write commit message:**
   - Subject: 50 chars max, present tense, imperative
   - Body: Explain "why", not "what" (code shows what)
   - Footer: Reference issues if applicable

4. **Create commit:**

   ```bash
   git commit -m "$(cat <<'EOF'
   prefix: subject line here

   Body explaining why this change was necessary.

   Related: #123
   EOF
   )"
   ```

## Rules

### 1. Use Present Tense

```
Bad:  Fixed the bug
Good: Fix the bug

Bad:  Added feature
Good: Add feature
```

### 2. One Commit = One Purpose

```
Bad:  fix: bug fix and refactoring
Good: fix: resolve login error
      (separate commit for refactoring)
```

### 3. Be Specific

```
Bad:  fix: bug fix
Good: fix: resolve pagination not working on user list

Bad:  refactor: refactoring
Good: refactor: extract duplicate validation logic to utility
```

### 4. Communicate "Why"

The diff shows what changed. The commit message should explain why.

```
Good example:
fix: resolve token validation error on password reset

UTC and local time comparison was not performed correctly.
This caused tokens to appear expired for users in certain timezones.

Fixes: #456
```

## Scope (Optional)

Add scope for specific areas:

```
feat(auth): add social login
fix(api): resolve rate limit count error
test(user): improve user service test coverage
```

## Bad Examples (Never Use)

```
update
fix bug
WIP
review fixes
fixed it
various changes
```

## Footer References

```
Fixes: #123       # Closes issue
Related: #456     # References issue
Ticket: PROJ-789  # External ticket
See: https://...  # Documentation reference
```
