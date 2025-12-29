---
description: Execute the RPI workflow (Research-Plan-Implement with TDD) for the next queued item
---

# /work Command

Execute the RPI workflow for the next item in the processing queue.

## Process

### 0. Get Next Queued Item

Read `.agents/work/queued.md`:
- Check "## In Progress" section first (resume if exists)
- If empty, take first item from "## Up Next" section
- If queue empty, report "No items in queue" and suggest `/queue-add`

Move the item to "## In Progress" section.

### 1. RESEARCH Phase
**Context**: `.agents/context/phase-research.md`, `.agents/context/artifacts.md`

Use the `work-research` agent to:
- Read the work item definition from `.agents/work/{slug}/definition.md`
- Analyze spec requirements in `spec/`
- Review current architecture in `architecture/`
- Check patterns in `.agents/patterns/`
- Save detailed findings to `.agents/work/{slug}/research.md`

### 2. RED Phase
**Context**: `.agents/context/phase-red.md`, `.agents/context/testing.md`

Use the `rpi` agent with `phase: "red"`:
- Calls `rpi-research` → writes `.agents/work/{slug}/red-research.md`
- Calls `rpi-plan` → writes `.agents/work/{slug}/red-plan.md`
- Calls `rpi-implement` → writes failing tests, updates `report.md`
- Calls `verify-results` → gate: all tests must fail correctly
- Calls `git-commit` → `test(<scope>): add <feature> tests`

### 3. GREEN Phase
**Context**: `.agents/context/phase-green.md`

Use the `rpi` agent with `phase: "green"`:
- Calls `rpi-research` → writes `.agents/work/{slug}/green-research.md`
- Calls `rpi-plan` → writes `.agents/work/{slug}/green-plan.md`
- Calls `rpi-implement` → writes implementation, updates `report.md`
- Calls `verify-results` → gate: 100% pass, zero type errors, integrated
- Calls `git-commit` → `feat(<scope>): implement <feature>`

### 4. REFACTOR Phase
**Context**: `.agents/context/phase-refactor.md`

Use the `rpi` agent with `phase: "refactor"`:
- Calls `rpi-research` → writes `.agents/work/{slug}/refactor-research.md`
- Calls `rpi-plan` → writes `.agents/work/{slug}/refactor-plan.md`
- Calls `rpi-implement` → applies refactorings, updates `report.md`
- Calls `verify-results` → gate: 100% pass, zero type errors
- Calls `git-commit` → `refactor(<scope>): improve <feature>`

### 5. ARCHITECTURE Update

Use the `architecture` agent to:
- Read `.agents/work/{slug}/definition.md` and `report.md`
- Update architecture documentation
- Generate/update diagrams
- Commit: `docs(<scope>): update architecture`

### 6. ARCHIVE Phase

Use the `archive-work` agent to:
- Move `.agents/work/{slug}/` directory to `.agents/archive/{slug}/`
- Update `.agents/archive/index.md`

Then update queue:
- Remove item from "## In Progress" in `queued.md`
- Add item to `completed.md`
- Clear workflow.json state

**Goal**: Keep active work directory lean for next item.

## Output

Display progress for each phase:

```
Starting work on: <slug>

Research phase...
✓ Definition loaded
✓ Spec analyzed
✓ Research saved to .agents/work/<slug>/research.md

RED phase: Writing tests...
✓ Research complete
✓ Plan created
✓ <N> tests created
✓ All tests fail correctly
✓ Committed: test(<scope>): <message> [<hash>]

GREEN phase: Implementing...
✓ Research complete
✓ Plan created
✓ <N> files modified
✓ All tests passing (100%)
✓ Committed: feat(<scope>): <message> [<hash>]

REFACTOR phase: Improving...
✓ Research complete
✓ Plan created
✓ <N> refactorings applied
✓ Tests still passing
✓ Committed: refactor(<scope>): <message> [<hash>]

Architecture updated
✓ Committed: docs(<scope>): <message> [<hash>]

Archiving completed work...
✓ Moved to .agents/archive/<slug>/
✓ Updated completed.md

✓ Work complete!

Queue status:
  In Progress: (none)
  Up Next: <N> items remaining

Run /work to continue processing.
```

## Queue Empty

When queue is empty:

```
No items in work queue.

Run /queue-add to move items from backlog.
Run /backlog to create new work items.
Run /queue-status to see full status.
```

## Error Handling

If any phase fails:
1. Stop execution
2. Report the error
3. Keep item in "In Progress" for retry
4. Provide guidance on resolution
5. Do NOT proceed to next phase

## Context Management

- Each phase agent runs with fresh context
- Research is passed via file path, not content
- Returns are minimal summaries (~1k tokens)
- Master context stays under 60k tokens
- All artifacts consolidated in `.agents/work/{slug}/`
