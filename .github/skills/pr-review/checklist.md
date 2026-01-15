# PR Review Quick Checklist

## Pre-Review

- [ ] PR description explains the change
- [ ] Linked issue/ticket (if applicable)
- [ ] Branch is up to date with main

## Code Review

### General

- [ ] Code is readable and maintainable
- [ ] No unnecessary complexity
- [ ] No code duplication
- [ ] Error handling is appropriate
- [ ] Logging is sufficient but not excessive

### TypeScript Specific

- [ ] No `any` types (or justified)
- [ ] Proper null/undefined handling
- [ ] Types imported from `@repo/database` where applicable
- [ ] No type assertions without reason

### React Specific (Frontend)

- [ ] Components are appropriately sized
- [ ] Hooks follow rules of hooks
- [ ] Keys are stable and unique
- [ ] No inline function definitions in render
- [ ] Proper cleanup in useEffect

### NestJS Specific (Backend)

- [ ] Services are properly injected
- [ ] DTOs validate input
- [ ] Proper HTTP status codes
- [ ] Error responses are consistent

### Database (Prisma)

- [ ] Migrations are correct
- [ ] No N+1 queries
- [ ] Indexes added for frequently queried fields
- [ ] Cascade deletes are intentional

## Testing

- [ ] New code has tests
- [ ] Tests cover happy path
- [ ] Tests cover error cases
- [ ] Tests cover edge cases
- [ ] Test descriptions are clear
- [ ] No flaky tests
- [ ] MSW handlers updated (if API changed)

## Security

- [ ] No hardcoded secrets
- [ ] No sensitive data in logs
- [ ] Input is validated
- [ ] Output is sanitized (React escapes by default)
- [ ] Authentication checked on protected routes
- [ ] Authorization verified for resources

## Performance

- [ ] No obvious performance issues
- [ ] Large lists are virtualized/paginated
- [ ] Images are optimized
- [ ] No unnecessary re-renders
- [ ] Database queries are efficient

## Documentation

- [ ] Complex logic is commented
- [ ] Public APIs are documented
- [ ] README updated (if needed)
- [ ] Breaking changes noted

## Final Checks

- [ ] Build passes
- [ ] Tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] No console.log statements
- [ ] No TODO/FIXME without ticket
