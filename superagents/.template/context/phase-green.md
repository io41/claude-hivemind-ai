# GREEN Phase

Implement code to pass all tests. One test at a time.

## Artifacts

### Read Before Starting
- `.agents/work/{slug}/research.md` - Research findings
- `.agents/work/{slug}/red-plan.md` - Test plan (what tests expect)
- `.agents/work/{slug}/red-kickback.md` - Previous validation failures (if exists)

### Write Before Executing
- `.agents/work/{slug}/green-plan.md` - Implementation plan

## Gate: Entry

Before starting GREEN:
1. RED phase committed
2. All tests exist and fail correctly

## Gate: Exit

Before committing GREEN:
1. 100% test pass rate
2. Zero TypeScript errors
3. Code is integrated (reachable from application)

## Pre-Implementation: Test Validation

**CRITICAL: Validate tests BEFORE writing any implementation code.**

Tests being wrong is a RED phase failure, not a GREEN phase failure. GREEN's job is to identify invalid specifications before wasting effort implementing them.

### What to Validate

For each failing test, verify:
1. **Assertion correctness** - Does the expected value match requirements?
2. **Requirement interpretation** - Does the test correctly interpret the spec?
3. **API contract** - Does the test expect the right function signatures/returns?
4. **Edge cases** - Are edge case assertions reasonable?

### Validation Failure = Kickback

If tests are invalid, DO NOT try to implement. Instead:

1. Return structured validation error:
   ```json
   {
     "testsValid": false,
     "validationErrors": [
       {
         "testFile": "auth.test.ts",
         "testName": "should hash password with bcrypt",
         "issue": "Test expects bcrypt but spec says use argon2",
         "specReference": "spec/auth.md line 42",
         "correctBehavior": "Password should be hashed with argon2id"
       }
     ]
   }
   ```

2. The workflow will:
   - Write this to `red-kickback.md`
   - Revert the RED phase commit
   - Return to RED phase with the feedback

### Why Kickback Instead of Fixing?

- **Separation of concerns**: GREEN implements, RED specifies
- **No cheating**: GREEN editing tests to make them pass defeats TDD
- **Clear accountability**: Wrong tests = research/RED problem
- **Audit trail**: Kickback creates documentation of the iteration

## Single-Piece Flow

Implement **one test at a time**:

1. Pick the simplest failing test
2. Write minimal code to pass it
3. Run tests to verify
4. Move to next failing test
5. Repeat until all pass

**Do NOT implement everything at once.** This catches errors early.

## Integration (MANDATORY IMPLEMENTATION STEP)

**Integration is an implementation step, not just a verification check.**

After all tests pass, you MUST wire the code into the application. This is not optional.

### Integration Workflow

1. **Identify integration point** (from plan)
2. **Read the integration file** (go and see)
3. **Add import statement** for new code
4. **Add integration code** to wire feature in
5. **Verify feature is accessible** to user

### Integration by Project Type

| Type | Integration File | What to Add |
|------|------------------|-------------|
| **API** | Router file (routes/index.ts) | `router.route('/path', handler)` |
| **Frontend** | Routes or parent component | `<Route path="/x" component={X}/>` |
| **Game** | Scene file | `this.addChild(obj)` or call in `update()` |
| **CLI** | Entry point (cli.ts) | `commands.register('name', handler)` |
| **Library** | Package index (index.ts) | `export { Feature } from './feature'` |

### Dead Code = Failure

Code that exists but is not reachable from the application is **dead code**.

Dead code means GREEN phase is **incomplete**. The work item is NOT done until:
- Feature is wired into the application
- User can access/use the feature
- Integration is committed

## Go and See

Before implementing:
1. Read the failing tests (what they expect)
2. Read related source files
3. Understand existing patterns

## Implementation Guidelines

1. **Minimal code** - Only what makes tests pass
2. **Follow patterns** - Match existing code style
3. **No extra features** - If tests don't require it, don't add it
4. **Handle errors** - But only errors tests specify

## Verification

After implementing:
```bash
bun test  # Must be 100% passing
tsc --noEmit  # Must have zero errors
```

Check integration:
- Can the new code be reached from the application?
- Is it registered/exported/rendered?

## Commit

When all tests pass and code is integrated:
```
feat(scope): implement feature

- Implemented X
- Added Y
- All tests passing (N/N)
```
