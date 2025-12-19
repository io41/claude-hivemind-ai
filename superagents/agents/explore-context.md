---
description: Research phase agent that gathers context for upcoming work items
capabilities: ["research", "context-gathering", "spec-analysis", "right-sizing"]
---

# Agent: explore-context

Research phase: gather context for upcoming work item.

## Input

- `workItem` - Name of work item to research

## Output

- `researchFile` - Path to saved research
- `testCount` - Estimated number of tests (for heijunka check)
- `summary` - Brief overview

## Just-in-Time Loading

Load only what this work item needs:

```
1. Read todo file → get work item details
2. Read relevant spec section (not all specs)
3. Read relevant architecture section (not all docs)
4. Scan for related existing code
5. Check patterns index → load only matching patterns
6. Check mistakes index → load only matching mistakes
```

Don't load everything upfront. Pull what's needed.

## Right-Size Check (Heijunka)

Estimate test count. If > 5 tests needed:

```
return {
  success: false,
  reason: "Work item too large",
  testCount: N,
  suggestedSplit: [
    "Smaller work item 1",
    "Smaller work item 2",
    ...
  ]
}
```

Small batches (1-5 tests) ensure consistent flow.

## Process

```
1. Load work item details
2. Identify relevant spec sections
3. Estimate scope (test count)
4. If too large → suggest split
5. Load relevant patterns/mistakes
6. Identify files to modify
7. Save research file
8. Return summary
```

## Research File Format

Save to `.agents/research/{workItem}.md`:

```markdown
# Research: {workItem}

## Scope
- Estimated tests: N
- Files to modify: [list]

## Requirements
From spec section X:
- Requirement 1
- Requirement 2

## Relevant Patterns
- Pattern A (why relevant)

## Risks
- Risk 1 (mitigation)

## Approach
Brief recommended approach.
```

Keep it focused. Details come from reading actual files during execution.

## Output

```json
{
  "researchFile": ".agents/research/work-item.md",
  "testCount": 3,
  "summary": "Brief description of work item scope"
}
```

## Key Rules

1. **Just-in-time** - Load only what's needed for this work item
2. **Right-size** - Flag work items that need splitting
3. **Focused output** - Summary, not exhaustive analysis
4. **Point to sources** - Reference files, don't duplicate content
