# Workflow Artifacts

Each work item has a dedicated directory. Files pass context between phases.

## Work Item Types

| Type | Slug | Workflow | Output |
|------|------|----------|--------|
| **Atomic** | `{slug}` | Full RPI (Research→RED→GREEN→REFACTOR) | Implemented feature |
| **Research** | `research-{slug}` | Breakdown only (skip RPI) | Multiple atomic items in backlog |

## Directory Structure

**Atomic:** `.agents/work/{slug}/`
```
definition.md → research.md → red-plan.md → green-plan.md → refactor-plan.md → report.md
```

**Research:** `.agents/work/research-{slug}/`
```
definition.md → breakdown.md → report.md
```

## Formats

### Definition (Atomic)

```markdown
# {Description}

## Priority
{high|medium|low}

## Type
atomic

## Description
{what needs to be done}

## Acceptance Criteria
- [ ] Criterion 1

## Created
{timestamp}
```

### Definition (Research)

```markdown
# Research: {Description}

## Priority
{high|medium|low}

## Type
research

## Description
{User's description}

## Research Goal
Break down into atomic work items.

## Original Request
{verbatim user request}

## Created
{timestamp}
```

### Breakdown (Research items only)

```markdown
# Breakdown: {slug}

## Original Request
{from definition}

## Analysis Summary
{architecture, patterns, integration points discovered}

## Atomic Work Items

### 1. {title}
- **Slug**: {slug}
- **Description**: {what it does}
- **Acceptance Criteria**: [ ] ...
- **Estimated Tests**: N (1-5)
- **Files**: {list}
- **Dependencies**: {slugs or "none"}

## Recommended Order
1. {slug} - {reason}

## Notes
{context for implementation}
```

### Research (Atomic items only)

```markdown
# Research: {slug}

## Work Item
{from definition}

## Scope
- Estimated tests: N
- Files to modify: [list]
- New files: [list]

## Requirements
{from spec}

## Architecture Context
{integration points}

## Existing Patterns
{found in codebase}

## Risks
{with mitigations}

## Approach
{recommended implementation}

## Test Cases
1. {scenario}
```

### Phase Plans

```markdown
# {Phase} Plan: {slug}

## Overview
{phase-specific summary}

## Steps
### Step 1: {Description}
- File: {path}
- Action: {create|modify}
- Details: {what to do}

## Verification
- [ ] {criterion}
```

### Report

```markdown
# Report: {slug}

## {Phase} Phase
**Completed**: {timestamp}
**Status**: success

### Summary
{what was done}

### Files
- {path}
```

## Token Budgets

| Artifact | Target |
|----------|--------|
| definition.md | ~500 tokens |
| research.md | ~3-5k tokens |
| *-plan.md | ~2-3k tokens |
| report.md | ~1k per phase |

## Key Rules

1. **One directory per work item**
2. **Files over memory** - write to disk, reference by path
3. **Small outputs** - summaries, not exhaustive content
4. **Archive on complete** - move to `.agents/archive/`
