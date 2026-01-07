# RED Phase

Write failing tests that define expected behavior.

## Artifacts

### Read Before Starting
- `.agents/work/{slug}/research.md` - Research findings
- `.agents/work/{slug}/red-kickback.md` - **If exists**: Previous validation failures

### Write Before Executing
- `.agents/work/{slug}/red-plan.md` - Test plan

## Handling Kickbacks from GREEN

If `red-kickback.md` exists, previous tests were **rejected** because they didn't match the spec.

**READ THIS FILE CAREFULLY.** It contains:
- Which tests were wrong
- Why they were wrong (incorrect assertions, misunderstood requirements)
- References to spec docs that were misinterpreted
- What the correct behavior should be

This is your chance to fix the test design. Don't make the same mistakes.

## Gate: Entry

Before starting RED:
1. Research artifact exists at `.agents/work/{slug}/research.md`
2. Work item is appropriately scoped

## Gate: Exit

Before committing RED:
1. Tests exist and run
2. All tests fail (with assertion failures, not errors)
3. Tests cover the work item requirements

## Right-Size Work Items

Work items should have **comprehensive test coverage**. This means:
- Tests cover all important scenarios (happy path, edge cases, errors)
- Tests are focused on behavior, not implementation details
- Tests are meaningful and avoid redundancy
- Better to be over-tested than under-tested

**Split work items if they become too large to implement in a reasonable timeframe.**

## Test One Behavior at a Time

Each test should verify ONE behavior:

```typescript
// Good - one behavior per test
it('returns user for valid ID', async () => {
  const user = await service.findById('123')
  expect(user.id).toBe('123')
})

it('returns null for unknown ID', async () => {
  const user = await service.findById('unknown')
  expect(user).toBeNull()
})

// Bad - multiple behaviors
it('handles user lookup', async () => {
  const user1 = await service.findById('123')
  expect(user1.id).toBe('123')
  const user2 = await service.findById('unknown')
  expect(user2).toBeNull()
})
```

## Go and See

Before writing tests:
1. Read the actual spec section (not just research summary)
2. Read any existing related tests
3. Read the source file structure

## Test Structure

```typescript
describe('FeatureName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Arrange - set up test data
      // Act - call the code
      // Assert - verify result
    })
  })
})
```

## Verification

After writing tests, run them:
```bash
bun test
```

Verify:
- [ ] Tests run without syntax errors
- [ ] Tests fail with assertion failures (not import/runtime errors)
- [ ] Each test failure message is clear
- [ ] Tests match the work item requirements

## Commit

When tests are complete and failing correctly:
```
test(scope): add feature tests

- Test 1 description
- Test 2 description
- All tests fail as expected (0/N passing)
```
