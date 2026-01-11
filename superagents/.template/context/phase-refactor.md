# REFACTOR Phase

Improve code quality. One change at a time. Preserve behavior.

## Artifacts

**Read:** `research.md`, `red-plan.md`, `green-plan.md`
**Write:** `refactor-plan.md`

## Gates

**Entry:** GREEN committed, 100% tests pass, zero type errors
**Exit:** 100% tests still pass, zero type errors, quality improved

## Single-Piece Flow

1. Identify improvement
2. Apply ONE refactoring
3. Run tests
4. If fail: UNDO, try different approach
5. Next improvement

**Never batch refactorings.** Isolates problems.

## Safe Refactorings (Prefer)

**Very Low Risk:** Rename variable/function, extract constant, remove unused code, add types
**Low Risk:** Extract function, inline function, move function, simplify conditional
**Medium Risk:** Extract class/module, change signature, replace algorithm
**High Risk (Avoid):** Restructure module, change data structures, modify shared deps

## Common Refactorings

**Extract Function:** Code does multiple things → split
**Rename:** `d` → `currentDate`
**Remove Duplication:** Same code in multiple places → extract shared function

## Skip Refactoring If

- Code works and is readable
- Change is high risk
- Benefit unclear
- Tests don't cover the area

## Verification

```bash
bun test      # Still 100%
tsc --noEmit  # Still zero errors
```

## Commit

```
refactor(scope): improve code quality

- What was refactored
- All tests still passing (N/N)
```
