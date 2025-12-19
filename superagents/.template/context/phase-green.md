# GREEN Phase

Implement code to pass all tests. One test at a time.

## Artifacts

### Read Before Starting
- `.agents/research/{slug}.md` - Research findings
- `.agents/plans/{slug}-red.md` - Test plan (what tests expect)

### Write Before Executing
- `.agents/plans/{slug}-green.md` - Implementation plan

## Gate: Entry

Before starting GREEN:
1. RED phase committed
2. All tests exist and fail correctly

## Gate: Exit

Before committing GREEN:
1. 100% test pass rate
2. Zero TypeScript errors
3. Code is integrated (reachable from application)

## Single-Piece Flow

Implement **one test at a time**:

1. Pick the simplest failing test
2. Write minimal code to pass it
3. Run tests to verify
4. Move to next failing test
5. Repeat until all pass

**Do NOT implement everything at once.** This catches errors early.

## Integration Check

New code MUST be wired into the application:

- **API**: Endpoint registered in router
- **Frontend**: Component rendered in route or parent
- **Game**: Object added to scene, update() called
- **CLI**: Command registered in entry point
- **Library**: Exported from package index

Dead code is a GREEN phase failure.

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
