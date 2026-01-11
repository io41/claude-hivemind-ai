---
description: Add a new work item to the backlog interactively
---

# /superagents:backlog Command

Add work items to the backlog. Automatically classifies tasks as atomic or research.

## Arguments

If called with arguments (e.g., `/superagents:backlog Implement user auth`), use as description. Only ask for priority.

## Process

### 1. Gather Information

Use AskUserQuestion for:
- **Description** (if no arguments): "What work needs to be done?"
- **Priority**: "What priority?" (high/medium/low)

### 2. Classify Task

| Classification | Criteria | Creates |
|----------------|----------|---------|
| **ATOMIC** | Single focused change, 1-5 tests, clear scope | `{slug}` |
| **RESEARCH** | Multi-part feature, vague scope, 6+ tests, "implement/refactor/improve" | `research-{slug}` |

When in doubt, choose RESEARCH.

### 3. Create Work Item

1. Generate slug (lowercase, hyphens, max 50 chars)
2. Create `.agents/work/{slug}/definition.md` (see artifacts.md for format)
3. Add to `.agents/work/backlog.md` in priority section:
   - Atomic: `- **{slug}** -- {description}`
   - Research: `- **research-{slug}** -- [RESEARCH] {description}`

### 4. Confirm

**Atomic:**
```
✓ Created: {slug} (atomic)
  Run /superagents:queue-add {slug} to queue.
```

**Research:**
```
✓ Created: research-{slug} (research)
  Will break down into atomic items when processed.
  Run /superagents:queue-add research-{slug} to queue.
```

## Examples

| Request | Type | Slug |
|---------|------|------|
| "Fix typo in header" | atomic | `fix-header-typo` |
| "Add loading spinner" | atomic | `add-loading-spinner` |
| "Implement user auth" | research | `research-user-auth` |
| "Add dark mode" | research | `research-dark-mode` |
| "Refactor payments" | research | `research-refactor-payments` |

## Notes

- Validate slug doesn't exist (append number if it does)
- See `.agents/context/artifacts.md` for definition formats
