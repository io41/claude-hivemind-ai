# GREEN Phase

Implement code to pass tests. One test at a time. Then integrate.

## Artifacts

**Read:** `research.md`, `red-plan.md`, `red-kickback.md` (if exists)
**Write:** `green-plan.md` (MUST include Integration section)

## Gates

**Entry:** RED committed, all tests fail correctly
**Exit:** 100% pass, zero type errors, code integrated into application

## Pre-Implementation: Validate Tests

**CRITICAL: Validate tests BEFORE implementing.**

For each test, verify:
- Assertion matches spec requirements
- API contract is correct
- Edge cases are reasonable

**If tests are invalid:** Return validation error, don't implement.
```json
{
  "testsValid": false,
  "validationErrors": [{
    "testFile": "auth.test.ts",
    "testName": "should hash with bcrypt",
    "issue": "Spec says argon2, not bcrypt",
    "specReference": "spec/auth.md line 42",
    "correctBehavior": "Use argon2id"
  }]
}
```

Workflow writes `red-kickback.md`, reverts, returns to RED. This is iterative improvement, not failure.

## Single-Piece Flow

1. Pick simplest failing test
2. Write minimal code to pass it
3. Run tests to verify
4. Next failing test
5. Repeat until all pass

**Do NOT implement everything at once.**

## Integration (MANDATORY)

After tests pass, wire code into application. This is implementation, not verification.

1. Identify integration point (from plan)
2. Read integration file
3. Add import
4. Add integration code
5. Verify feature is accessible

| Type | Integration File | Add |
|------|------------------|-----|
| API | routes/index.ts | `router.route('/path', handler)` |
| Frontend | Routes/parent component | `<Route path="/x" component={X}/>` |
| CLI | cli.ts | `commands.register('name', handler)` |
| Library | index.ts | `export { Feature }` |

**Dead code = incomplete.** Feature must be reachable by user.

## Verification

```bash
bun test      # 100% passing
tsc --noEmit  # Zero errors
```

- [ ] All tests pass
- [ ] Zero type errors
- [ ] Code is integrated and accessible

## Commit

```
feat(scope): implement feature

- What was implemented
- All tests passing (N/N)
```
