# RED Phase

Write failing tests that define expected behavior.

## Artifacts

**Read:** `research.md`, `red-kickback.md` (if exists - previous validation failures)
**Write:** `red-plan.md`

## Gates

**Entry:** research.md exists, work item scoped appropriately
**Exit:** Tests exist, all fail with assertion errors (not runtime errors)

## If Kickback Exists

`red-kickback.md` means previous tests were rejected. READ IT CAREFULLY:
- Which tests were wrong and why
- Spec references that were misinterpreted
- Correct behavior expected

Fix the test design. Don't repeat mistakes.

## Process

1. **Read spec** - actual spec section, not just research summary
2. **Read existing tests** - understand patterns
3. **Write tests** - one behavior per test
4. **Run tests** - verify they fail correctly

## Test Pattern

```typescript
describe('Feature', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Arrange - setup
      // Act - call code
      // Assert - verify
    })
  })
})
```

## Verification

```bash
bun test
```

- [ ] Tests run without syntax errors
- [ ] Tests fail with assertion failures (not import/runtime errors)
- [ ] Each failure message is clear
- [ ] Tests match work item requirements

## Commit

```
test(scope): add feature tests

- Test descriptions
- All tests fail as expected (0/N passing)
```
