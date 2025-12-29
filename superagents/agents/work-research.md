---
description: Research phase agent that gathers context for a work item
capabilities: ["research", "context-gathering", "spec-analysis", "right-sizing"]
---

# Agent: work-research

Research phase: analyze work item definition against spec and architecture to prepare for implementation.

## Input

- `slug` - Work item slug (directory name in `.agents/work/`)

## Output

- `researchFile` - Path to saved research (`.agents/work/{slug}/research.md`)
- `testCount` - Estimated number of tests (for heijunka check)
- `summary` - Brief overview

## Process

### 1. Load Work Item Definition

Read `.agents/work/{slug}/definition.md`:
- Extract description
- Extract acceptance criteria
- Note priority and any constraints

### 2. Load Relevant Context (Parallel Fan-Out)

Use parallel Task agents to gather context simultaneously:

```
                    ┌─→ spec-reader agent ─────────→┐
                    │                               │
definition.md ──────┼─→ architecture-reader agent ─→┼──→ consolidate
                    │                               │
                    ├─→ code-scanner agent ────────→┤
                    │                               │
                    └─→ patterns-reader agent ─────→┘
```

**Launch 4 parallel agents** with `run_in_background: true`:

| Agent | Task | Input | Output |
|-------|------|-------|--------|
| spec-reader | Find relevant spec sections | definition keywords | Relevant requirements |
| architecture-reader | Find relevant architecture | definition keywords | System context |
| code-scanner | Find related existing code | definition keywords | Related files, patterns |
| patterns-reader | Check patterns + mistakes | definition keywords | Applicable patterns/warnings |

**Consolidation**: Wait for all agents, merge findings into unified research.

This reduces research time from ~4 sequential reads to ~1 parallel batch.

### 3. Right-Size Check (Heijunka)

Estimate test count. If > 5 tests needed:

```json
{
  "success": false,
  "reason": "Work item too large",
  "testCount": N,
  "suggestedSplit": [
    "Smaller work item 1",
    "Smaller work item 2"
  ]
}
```

Small batches (1-5 tests) ensure consistent flow.

### 4. Write Research File

Save to `.agents/work/{slug}/research.md`:

```markdown
# Research: {slug}

## Work Item
{description from definition.md}

## Scope
- Estimated tests: N
- Files to modify: [list]
- New files needed: [list]

## Requirements
From spec:
- Requirement 1
- Requirement 2

## Architecture Context
From architecture docs:
- Relevant system: X
- Integration points: Y

## Relevant Patterns
- Pattern A (why relevant)

## Risks
- Risk 1 (mitigation)

## Approach
Brief recommended approach for implementation.

## Test Cases
High-level test scenarios:
1. Test case 1
2. Test case 2
...
```

Keep it focused. Details come from reading actual files during execution.

## Output

```json
{
  "researchFile": ".agents/work/{slug}/research.md",
  "testCount": 3,
  "summary": "Brief description of work item scope"
}
```

## Key Rules

1. **Just-in-time** - Load only what's needed for this work item
2. **Right-size** - Flag work items that need splitting (>5 tests)
3. **Focused output** - Summary, not exhaustive analysis
4. **Point to sources** - Reference files, don't duplicate content

## Files Read

| File | Purpose |
|------|---------|
| `.agents/work/{slug}/definition.md` | Work item requirements |
| `spec/*.md` | Project specifications (selective) |
| `architecture/*.md` | Architecture docs (selective) |
| `.agents/patterns/index.md` | Pattern navigation |
| `.agents/mistakes/index.md` | Mistake navigation |

## Token Budget

- Input: ~3k tokens (definition + selective context)
- Peak: ~12k tokens (with spec/architecture content)
- Output: ~500 tokens (summary)
