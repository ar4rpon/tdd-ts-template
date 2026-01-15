---
name: pr-review
description: Review pull requests using team standards. Check code quality, test coverage, security, and architecture. Use when reviewing PRs, examining branch changes, or when user asks for code review.
allowed-tools: Read, Grep, Glob, Bash
---

# Pull Request Review

## Overview

This skill guides comprehensive PR reviews covering code quality, testing, security, and architecture.

## Review Workflow

1. **Understand the PR context:**

   ```bash
   git log --oneline main..HEAD
   git diff main...HEAD --stat
   ```

2. **Review changes by category:**
   - Check the checklist below
   - Note issues with severity levels

3. **Provide feedback:**
   - Be specific and actionable
   - Suggest solutions, not just problems
   - Acknowledge good practices

## Review Checklist

### Code Quality

- [ ] **Readability**: Is code clear and self-documenting?
- [ ] **Naming**: Are variables, functions, and files named descriptively?
- [ ] **Duplication**: Is there unnecessary code repetition?
- [ ] **Complexity**: Are functions/components too complex? (>20 lines is a smell)
- [ ] **Comments**: Are complex sections explained? (Avoid obvious comments)
- [ ] **Error handling**: Are errors handled appropriately?

### Testing

- [ ] **Coverage**: Are new functions/components tested?
- [ ] **Edge cases**: Are boundary conditions tested?
- [ ] **Test quality**: Do tests verify behavior, not implementation?
- [ ] **Test naming**: Are test descriptions clear?
- [ ] **Mocking**: Is mocking used appropriately (not over-mocked)?

### TypeScript

- [ ] **Type safety**: No `any` or `unknown` without justification?
- [ ] **Null handling**: Proper null/undefined checks?
- [ ] **Type definitions**: Are types from `@repo/database` used correctly?
- [ ] **Inference**: Is type inference used where appropriate?

### Security

- [ ] **No hardcoded secrets**: API keys, passwords, tokens?
- [ ] **Input validation**: User input validated with Zod?
- [ ] **SQL injection**: Using Prisma parameterized queries?
- [ ] **XSS**: Proper output encoding in React?
- [ ] **Authentication**: Protected routes checked?

### Architecture

- [ ] **File organization**: Follows project structure?
- [ ] **Dependency direction**: No circular dependencies?
- [ ] **Separation of concerns**: Logic in appropriate layers?
- [ ] **Shared code**: Uses `@repo/shared` or `@repo/database` appropriately?

### Performance

- [ ] **React rendering**: Unnecessary re-renders avoided?
- [ ] **Database queries**: N+1 queries avoided?
- [ ] **Bundle size**: Large dependencies justified?
- [ ] **Memoization**: Used where beneficial?

## Severity Levels

| Level          | Description                                          | Action                  |
| -------------- | ---------------------------------------------------- | ----------------------- |
| **Critical**   | Security issue, data loss risk, breaks functionality | Must fix before merge   |
| **Major**      | Bug, significant code smell, missing tests           | Should fix before merge |
| **Minor**      | Style issue, minor improvement                       | Consider fixing         |
| **Suggestion** | Alternative approach, enhancement idea               | Optional                |

## Feedback Templates

### Critical Issue

```markdown
**Critical**: [Security] Hardcoded API key detected

**File**: `src/services/api.ts:15`
**Issue**: API key is hardcoded in source code
**Impact**: Credentials exposed in version control
**Fix**: Move to environment variable

\`\`\`typescript
// Before
const API_KEY = 'sk-xxxx';

// After
const API_KEY = process.env.API_KEY;
\`\`\`
```

### Major Issue

```markdown
**Major**: [Testing] Missing test for error handling

**File**: `src/components/UserForm.tsx`
**Issue**: No test for form submission error state
**Suggestion**: Add test case for API error handling

\`\`\`typescript
it('should display error message when submission fails', async () => {
server.use(http.post('/api/users', () => HttpResponse.error()));
// ...
});
\`\`\`
```

### Minor Issue

```markdown
**Minor**: [Style] Consider extracting magic number

**File**: `src/utils/pagination.ts:8`
**Suggestion**: Extract `20` to a named constant

\`\`\`typescript
const DEFAULT_PAGE_SIZE = 20;
\`\`\`
```

## Commands

```bash
# View PR diff
git diff main...HEAD

# View changed files
git diff main...HEAD --name-only

# View specific file changes
git diff main...HEAD -- path/to/file.ts

# Check for console.log
git diff main...HEAD | grep -n "console.log"

# Check for TODO/FIXME
git diff main...HEAD | grep -n "TODO\|FIXME"
```

## Review Summary Template

```markdown
## PR Review Summary

### Overview

[Brief description of what the PR does]

### Reviewed Files

- `file1.ts` - [status]
- `file2.tsx` - [status]

### Findings

#### Critical (X)

- [List if any]

#### Major (X)

- [List if any]

#### Minor (X)

- [List if any]

### Positive Notes

- [What was done well]

### Recommendation

[ ] Approved
[ ] Approved with minor changes
[ ] Request changes
```
