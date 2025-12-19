# Testing Guidelines

Conventions and patterns for tests in this project.

## Test Co-Location

Tests live next to the code they test:

```
src/
  auth/
    AuthService.ts
    AuthService.test.ts    ← Next to source
    types.ts
  components/
    Button.tsx
    Button.test.tsx        ← Next to source
```

**Why**: Easy to find, modify together, clear ownership.

## File Naming

- `*.test.ts` for TypeScript tests
- `*.test.tsx` for React component tests
- `__tests__/` directory only for integration tests

## Test Structure

```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    describe('when condition', () => {
      it('should expected behavior', () => {
        // Arrange
        const input = createTestData()

        // Act
        const result = functionName(input)

        // Assert
        expect(result).toBe(expected)
      })
    })
  })
})
```

## Naming Conventions

Test names should read like documentation:

```typescript
// Good
it('returns null when user not found')
it('throws AuthError for invalid credentials')
it('emits event after successful login')

// Bad
it('test1')
it('works')
it('should work correctly')
```

## One Assertion Per Test

When possible, each test verifies one thing:

```typescript
// Good
it('returns user ID', () => {
  expect(user.id).toBe('123')
})

it('returns user email', () => {
  expect(user.email).toBe('test@example.com')
})

// Acceptable for related properties
it('returns user profile', () => {
  expect(user).toEqual({
    id: '123',
    email: 'test@example.com'
  })
})
```

## Test Data Builders

For complex test data, use builders:

```typescript
function createUser(overrides?: Partial<User>): User {
  return {
    id: 'default-id',
    email: 'default@example.com',
    name: 'Default User',
    ...overrides
  }
}

// Usage
const user = createUser({ name: 'Custom Name' })
```

## Mocking

Mock external dependencies, not internal modules:

```typescript
// Good - mock external service
vi.mock('./externalApi')

// Avoid - mock internal module (test the real thing)
vi.mock('./utils')
```

## Async Tests

Use async/await consistently:

```typescript
it('fetches user data', async () => {
  const user = await service.getUser('123')
  expect(user.id).toBe('123')
})
```

## Test Isolation

Each test should:
- Set up its own data
- Clean up after itself
- Not depend on other tests
- Not share mutable state

## Coverage Targets

- Aim for 80%+ code coverage
- Focus on behavior, not lines
- Don't test implementation details
