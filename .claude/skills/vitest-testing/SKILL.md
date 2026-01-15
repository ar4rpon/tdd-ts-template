---
name: vitest-testing
description: Write comprehensive Vitest tests for TypeScript and React. Use when creating unit tests, component tests, improving test coverage, or when user asks about testing patterns, mocking, or test utilities.
allowed-tools: Read, Write, Bash, Grep, Glob
---

# Vitest Testing Guide

## Overview

This project uses Vitest for all testing. This skill provides patterns for unit tests, component tests, and integration tests.

## Test File Naming

| Type             | Location            | Pattern           |
| ---------------- | ------------------- | ----------------- |
| Unit Test        | `src/**/*.spec.ts`  | `service.spec.ts` |
| Component Test   | `src/**/*.test.tsx` | `Button.test.tsx` |
| Integration Test | `test/**/*.spec.ts` | `api.spec.ts`     |

## Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ModuleName', () => {
  // Setup
  beforeEach(() => {
    // Runs before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('methodName', () => {
    it('should do something when condition', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = doSomething(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Common Assertions

```typescript
// Equality
expect(value).toBe(expected); // Strict equality
expect(value).toEqual(expected); // Deep equality
expect(value).toStrictEqual(expected); // Deep + type equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThanOrEqual(10);
expect(value).toBeCloseTo(0.3, 5);

// Strings
expect(value).toMatch(/regex/);
expect(value).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ partial: 'match' });

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');

// Async
await expect(asyncFn()).resolves.toBe(value);
await expect(asyncFn()).rejects.toThrow();
```

## Mocking with vi

### Mock Functions

```typescript
// Create mock function
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
mockFn.mockImplementation((x) => x * 2);

// Assertions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);
```

### Mock Modules

```typescript
// Mock entire module
vi.mock('@/services/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }),
}));

// Mock with factory
vi.mock('@/utils/date', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getCurrentDate: vi.fn(() => new Date('2024-01-01')),
  };
});
```

### Spy on Methods

```typescript
const spy = vi.spyOn(object, 'method');
spy.mockReturnValue('mocked');

// After test
spy.mockRestore();
```

## React Component Testing

### Basic Rendering

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
```

### User Interactions

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should call onClick when clicked', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Async Operations

```typescript
import { render, screen, waitFor } from '@testing-library/react';

it('should load and display data', async () => {
  render(<UserList />);

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.getByText('User Name')).toBeInTheDocument();
  });
});
```

### Query Priority

Use queries in this order (most to least preferred):

1. `getByRole` - Accessible to everyone
2. `getByLabelText` - Form fields
3. `getByPlaceholderText` - Input placeholders
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

## NestJS Testing

### Service Testing

```typescript
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: vi.fn(),
              findUnique: vi.fn(),
              create: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  it('should find all users', async () => {
    const mockUsers = [{ id: '1', name: 'Test' }];
    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers);

    const result = await service.findAll();

    expect(result).toEqual(mockUsers);
  });
});
```

### Controller Testing

```typescript
import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: vi.fn(),
            findOne: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  it('should return all users', async () => {
    const mockUsers = [{ id: '1', name: 'Test' }];
    vi.mocked(service.findAll).mockResolvedValue(mockUsers);

    const result = await controller.findAll();

    expect(result).toEqual(mockUsers);
  });
});
```

## MSW for API Mocking

See [patterns.md](patterns.md) for detailed MSW patterns.

## Commands

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage

# Run specific package
pnpm --filter=frontend test
pnpm --filter=backend test

# Run matching pattern
pnpm test -- --grep "UserService"
```
