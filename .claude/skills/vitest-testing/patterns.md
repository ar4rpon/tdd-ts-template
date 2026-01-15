# MSW Patterns for API Mocking

## Setup

MSW is configured in `apps/frontend/src/test/mocks/`.

### Handler Structure

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET request
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' },
    ]);
  }),

  // GET with params
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ id, name: `User ${id}` });
  }),

  // POST request
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 'new-id', ...body }, { status: 201 });
  }),

  // Error response
  http.get('/api/error', () => {
    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),
];
```

### Server Setup

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Test Setup

```typescript
// src/test/setup.ts
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
```

## Common Patterns

### Override Handler in Test

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';

it('should handle error state', async () => {
  // Override for this test only
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json(
        { message: 'Server error' },
        { status: 500 }
      );
    })
  );

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('Error loading users')).toBeInTheDocument();
  });
});
```

### Delay Response

```typescript
import { delay, http, HttpResponse } from 'msw';

http.get('/api/users', async () => {
  await delay(100); // Wait 100ms
  return HttpResponse.json([]);
});
```

### Network Error

```typescript
http.get('/api/users', () => {
  return HttpResponse.error();
});
```

### Capture Request Body

```typescript
it('should send correct data', async () => {
  let capturedBody: unknown;

  server.use(
    http.post('/api/users', async ({ request }) => {
      capturedBody = await request.json();
      return HttpResponse.json({ id: '1' });
    })
  );

  // Trigger the request
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(capturedBody).toEqual({ name: 'Test User' });
});
```

### Request Count

```typescript
it('should retry on failure', async () => {
  let requestCount = 0;

  server.use(
    http.get('/api/users', () => {
      requestCount++;
      if (requestCount < 3) {
        return HttpResponse.json({ error: 'fail' }, { status: 500 });
      }
      return HttpResponse.json([{ id: '1' }]);
    })
  );

  render(<UserListWithRetry />);

  await waitFor(() => {
    expect(requestCount).toBe(3);
  });
});
```

## Testing Shared Types

Use types from `@repo/database` and `@repo/shared`:

```typescript
import { createMockUser, createMockPost } from '@repo/shared/test-utils';
import type { UserDTO } from '@repo/database/schemas';

const mockUser: UserDTO = createMockUser({ name: 'Test' });

server.use(
  http.get('/api/users/:id', () => {
    return HttpResponse.json(mockUser);
  })
);
```
