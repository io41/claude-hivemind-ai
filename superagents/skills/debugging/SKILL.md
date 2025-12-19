# Debugging Skill

## When to Use
- Test failures
- Runtime errors
- Performance issues
- Unexpected behavior

## Debugging Strategies

### 1. Read the Error
```typescript
// Error messages contain:
// - Error type (TypeError, ReferenceError, etc.)
// - Message describing the issue
// - Stack trace showing call path

// Example:
TypeError: Cannot read property 'id' of undefined
    at getUser (/src/services/user.ts:15:22)
    at handleRequest (/src/routes/users.ts:8:18)
```

### 2. Reproduce the Issue
```bash
# Run specific failing test
bun test --testNamePattern="should return user"

# Run with verbose output
bun test --verbose

# Run in watch mode
bun test --watch
```

### 3. Isolate the Problem
```typescript
// Add strategic console.logs
console.log('Input:', input)
console.log('User:', user)
console.log('Result:', result)

// Check types at runtime
console.log('Type:', typeof value)
console.log('Is array:', Array.isArray(value))
```

## Common Error Types

### TypeError
```typescript
// Cannot read property of undefined/null
const user = undefined
user.id  // TypeError!

// Fix: Add null checks
const user = await findUser(id)
if (!user) throw new Error('User not found')
```

### ReferenceError
```typescript
// Variable not defined
console.log(undeclaredVar)  // ReferenceError!

// Fix: Declare variable or check import
import { missingExport } from './module'
```

### Network/API Errors
```typescript
// Check response status
const response = await fetch(url)
if (!response.ok) {
  console.error('Status:', response.status)
  console.error('Body:', await response.text())
}
```

### Async Errors
```typescript
// Missing await
const user = getUser(id)  // Returns Promise, not user!
console.log(user.name)    // undefined

// Fix: Add await
const user = await getUser(id)
```

## Test Debugging

### Why Tests Fail

1. **Setup issues**
```typescript
// Check beforeEach runs
beforeEach(() => {
  console.log('Setup running')
  // Reset mocks, seed data, etc.
})
```

2. **Async timing**
```typescript
// Use waitFor for async assertions
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

3. **Mock issues**
```typescript
// Verify mock is being used
console.log('Mock called:', mockFn.mock.calls)

// Check mock return value
mockFn.mockImplementation((arg) => {
  console.log('Mock called with:', arg)
  return expectedValue
})
```

### Debugging React Components

```typescript
import { screen, debug } from '@testing-library/react'

// Print current DOM state
debug()

// Print specific element
debug(screen.getByRole('button'))

// Check what's available
screen.logTestingPlaygroundURL()
```

## Performance Debugging

### Profiling
```typescript
// Measure execution time
console.time('operation')
await expensiveOperation()
console.timeEnd('operation')

// With more detail
const start = performance.now()
await operation()
console.log(`Took ${performance.now() - start}ms`)
```

### Memory Issues
```typescript
// Check memory usage
console.log(process.memoryUsage())

// Force garbage collection (with --expose-gc flag)
global.gc()
```

## Tools

### Bun Debugger
```bash
# Start with debugger
bun --inspect src/index.ts

# Break on first line
bun --inspect-brk src/index.ts
```

### VS Code
```json
// launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/.bin/vitest",
  "args": ["run", "--reporter", "verbose"],
  "console": "integratedTerminal"
}
```

## Debugging Checklist

1. [ ] Read the full error message
2. [ ] Check the stack trace
3. [ ] Reproduce consistently
4. [ ] Add logging at key points
5. [ ] Check inputs and outputs
6. [ ] Verify mocks are correct
7. [ ] Check async/await usage
8. [ ] Verify imports
9. [ ] Clean and rebuild
10. [ ] Check for typos

## Quick Fixes

```bash
# Clear caches
rm -rf node_modules/.cache
rm -rf .next
bun install

# Reset test state
bun test --clearCache

# TypeScript issues
bun tsc --noEmit
```

## Asking for Help

Include:
1. Error message (full)
2. Stack trace
3. Code that triggers error
4. What you've tried
5. Expected vs actual behavior