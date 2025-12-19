# Testing Skill

## When to Use
- Writing tests (RED phase)
- Running test suites
- Debugging test failures
- Setting up test infrastructure

## Commands

### Run Tests
```bash
# All tests
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage

# Specific file
bun test <file>.test.ts

# Pattern matching
bun test --testNamePattern="<pattern>"
```

### Vitest (alternative)
```bash
vitest run
vitest watch
vitest --coverage
```

## Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  })

  afterEach(() => {
    // Cleanup
  })

  describe('methodName', () => {
    it('should do something when condition', async () => {
      // Arrange
      const input = createTestData()

      // Act
      const result = await component.method(input)

      // Assert
      expect(result).toEqual(expected)
    })
  })
})
```

## Common Patterns

### API Testing
```typescript
import request from 'supertest'

const response = await request(app)
  .post('/endpoint')
  .send({ data: 'value' })
  .expect(200)

expect(response.body).toHaveProperty('id')
```

### React Components
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

render(<Component prop="value" />)
await userEvent.click(screen.getByRole('button'))
expect(screen.getByText('Result')).toBeInTheDocument()
```

### Mocking
```typescript
// Module mock
jest.mock('../module')

// Spy
jest.spyOn(object, 'method').mockReturnValue(value)

// Clear between tests
beforeEach(() => jest.clearAllMocks())
```

## Assertions

```typescript
expect(value).toBe(exact)           // Strict equality
expect(value).toEqual(deep)         // Deep equality
expect(value).toBeTruthy()          // Truthy
expect(value).toBeNull()            // Null
expect(value).toBeDefined()         // Defined
expect(array).toContain(item)       // Contains
expect(object).toHaveProperty(key)  // Has property
expect(fn).toThrow(error)           // Throws
expect(promise).resolves.toBe(val)  // Async resolves
expect(promise).rejects.toThrow()   // Async rejects
```

## Coverage Targets
- Statements: 95%
- Branches: 90%
- Functions: 100%
- Lines: 95%