---
name: tdd-workflow
description: Guide TDD Red-Green-Refactor cycle for TypeScript development. Use when implementing new features, fixing bugs, or when user mentions TDD, test-first, test-driven, or asks to write tests before code.
allowed-tools: Read, Write, Bash, Grep, Glob
---

# TDD Workflow Guide

## Overview

This skill guides the Test-Driven Development cycle: Red → Green → Refactor.

## TDD Cycle

### 1. Red Phase (Write Failing Test)

Before writing any implementation:

1. **Understand the requirement** - What behavior needs to be implemented?
2. **Write the test first** - Create a test that describes the expected behavior
3. **Run the test** - Confirm it fails for the right reason

```typescript
// Example: Testing a new function
describe('calculateTotal', () => {
  it('should return sum of item prices', () => {
    const items = [{ price: 100 }, { price: 200 }];
    expect(calculateTotal(items)).toBe(300);
  });
});
```

**Run test to confirm failure:**

```bash
pnpm test
```

### 2. Green Phase (Make It Pass)

Write the **minimum code** to make the test pass:

1. **Implement only what's needed** - No extra features
2. **Keep it simple** - Don't optimize yet
3. **Run the test** - Confirm it passes

```typescript
// Minimal implementation
function calculateTotal(items: { price: number }[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 3. Refactor Phase (Improve Code)

With passing tests as safety net:

1. **Remove duplication**
2. **Improve naming**
3. **Extract functions/modules if needed**
4. **Run tests after each change** - Ensure nothing breaks

## Project-Specific Patterns

### Backend (NestJS + Vitest)

```typescript
// apps/backend/src/*.spec.ts
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AppService],
    }).compile();
    service = module.get(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Frontend (React + Vitest + RTL)

```typescript
// apps/frontend/src/*.test.tsx
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### With MSW (API Mocking)

```typescript
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should fetch and display data', async () => {
  server.use(http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'Test' }])));
  // Test implementation
});
```

## Commands

```bash
# Run all tests
pnpm test

# Watch mode (recommended during TDD)
pnpm test:watch

# Run specific test file
pnpm test -- path/to/file.spec.ts

# Coverage report
pnpm test:coverage
```

## Checklist

Copy and track progress:

```
- [ ] Understand the requirement
- [ ] Write failing test (Red)
- [ ] Confirm test fails for right reason
- [ ] Write minimal implementation (Green)
- [ ] Confirm test passes
- [ ] Refactor if needed
- [ ] Confirm tests still pass
- [ ] Repeat for next requirement
```

## Anti-Patterns to Avoid

1. **Writing implementation before test** - Always test first
2. **Writing too many tests at once** - One test at a time
3. **Making test pass with hardcoded values** - Implement real logic
4. **Skipping refactor phase** - Technical debt accumulates
5. **Testing implementation details** - Test behavior, not internals
