# Testing Guidelines

## Co-Location

Tests live next to source: `AuthService.ts` → `AuthService.test.ts`

## Naming

- `*.test.ts` for TypeScript
- `*.test.tsx` for React
- `__tests__/` only for integration tests

## Structure

```typescript
describe('Module', () => {
  describe('function', () => {
    describe('when condition', () => {
      it('should behavior', () => {
        // Arrange
        const input = createTestData()
        // Act
        const result = fn(input)
        // Assert
        expect(result).toBe(expected)
      })
    })
  })
})
```

## Naming Tests

```typescript
// Good
it('returns null when user not found')
it('throws AuthError for invalid credentials')

// Bad
it('test1')
it('works')
```

## One Behavior Per Test

```typescript
// Good - separate tests
it('returns user ID', () => expect(user.id).toBe('123'))
it('returns user email', () => expect(user.email).toBe('test@example.com'))

// OK for related properties
it('returns user profile', () => expect(user).toEqual({ id: '123', email: 'test@example.com' }))
```

## Test Data Builders

```typescript
function createUser(overrides?: Partial<User>): User {
  return { id: 'default-id', email: 'default@example.com', ...overrides }
}
```

## Mocking

Mock external dependencies, not internal modules:
```typescript
vi.mock('./externalApi')  // Good
// vi.mock('./utils')     // Avoid - test real thing
```

## Isolation

Each test:
- Sets up own data
- Cleans up after
- Doesn't depend on other tests
- No shared mutable state

## Coverage

- Aim 80%+
- Focus on behavior, not lines
- Don't test implementation details
