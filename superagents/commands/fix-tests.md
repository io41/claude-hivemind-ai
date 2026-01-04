---
description: Systematically identify and repair failing tests
---

# /superagents:fix-tests Command

Systematically repair failing tests.

## Process

### 1. Identify Failing Tests
```bash
bun test 2>&1 | tee .agents/work/test-failures.txt
```

Parse output to identify:
- Which tests are failing
- Error messages
- Stack traces

### 2. Analyze Failures
For each failing test:
- Categorize failure type (assertion, error, timeout)
- Identify root cause
- Determine if test or implementation is wrong

### 3. Fix Strategy

**If test is wrong:**
- Update test to match correct behavior
- Ensure test still validates requirements

**If implementation is wrong:**
- Create mini RED-GREEN cycle
- Fix implementation
- Verify test passes

**If both need changes:**
- Fix test first (RED)
- Fix implementation (GREEN)
- Refactor if needed

### 4. Verify All Tests Pass
```bash
bun test
```

### 5. Commit Fix
```
fix(<scope>): repair <test-name> test

- <description of issue>
- <description of fix>
```

## Output

```
Analyzing test failures...
✓ Found 3 failing tests

Failure 1: AuthService.test.ts
  - Test: should reject invalid token
  - Error: Expected 401, got 500
  - Cause: Missing error handler
  - Fix: Add try-catch in verifyToken

Fixing...
✓ Updated AuthService.ts:45
✓ Test now passes

Failure 2: LoginForm.test.tsx
  - Test: should show error message
  - Error: Element not found
  - Cause: Test uses wrong selector
  - Fix: Update selector to match implementation

Fixing...
✓ Updated LoginForm.test.tsx:23
✓ Test now passes

Failure 3: api.test.ts
  - Test: should return user list
  - Error: Timeout exceeded
  - Cause: Missing mock for database
  - Fix: Add database mock

Fixing...
✓ Updated api.test.ts:10
✓ Test now passes

Running full test suite...
✓ All 47 tests passing

Committed: fix(auth,ui,api): repair 3 failing tests [abc123]
```

## When to Use

- After merging changes that break tests
- During CI/CD failures
- Before starting new work
- After dependency updates

## Best Practices

1. **Fix one test at a time** - Isolate changes
2. **Run full suite after each fix** - Check for regressions
3. **Document the root cause** - Helps future debugging
4. **Don't skip tests** - Fix them properly