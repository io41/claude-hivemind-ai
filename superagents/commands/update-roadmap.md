---
description: Regenerate roadmap and backlog from specification files in spec/
---

# /superagents:update-roadmap Command

Regenerate roadmap and populate backlog from specification files.

## Process

### 1. Analyze Specifications

Use `spec-analyzer` agent (in parallel if multiple files):
- Read all files in `spec/` directory
- Extract requirements (functional, non-functional)
- Identify features and their relationships
- Note constraints and dependencies

### 2. Generate Roadmap

Use `roadmap-updater` agent to:
- Break features into **vertical slices** (backend + integration + UI per feature)
- Prioritize for **early user visibility** (not all backend first, then all frontend)
- Size work items appropriately (comprehensive but focused)
- Create phased roadmap where each phase = user-visible progress

**Ordering principle**: `backend_a → frontend_a → backend_b → frontend_b` so users see incremental progress, not `backend_a → backend_b → frontend_a → frontend_b`.

### 3. Update Files

#### Save to `.agents/ROADMAP.md`:
```markdown
# Project Roadmap

## Phase 1: Foundation
- [ ] database-setup
- [ ] api-framework
- [ ] authentication

## Phase 2: Core Features
- [ ] user-management
- [ ] content-creation
...
```

#### Create work item directories (Parallel):

**If 5+ work items**: Use parallel Task agents with `run_in_background: true` to create directories simultaneously. Each agent creates one `definition.md` file, then consolidate.

**If <5 work items**: Create sequentially.

For each work item, create `.agents/work/{slug}/definition.md`:
```markdown
# {Work Item Name}

## Priority
{high|medium|low}

## Description
{Brief description of the work item}

## Requirements
- REQ-001: {requirement}
- REQ-002: {requirement}

## Acceptance Criteria
- [ ] {criterion 1}
- [ ] {criterion 2}

## Dependencies
- {dependency if any}

## Created
{timestamp}
```

#### Populate `.agents/work/backlog.md`:
```markdown
# Backlog

Work items waiting to be queued, in priority order.

## High Priority

- **database-setup** -- Set up database with migrations
- **api-framework** -- Initialize API framework

## Medium Priority

- **user-management** -- User CRUD operations
- **content-creation** -- Content management features

## Low Priority

- **analytics-dashboard** -- Usage metrics visualization
```

## Output

```
Analyzing specifications...
✓ Found 5 spec files
✓ Extracted 23 requirements

Generating roadmap...
✓ Identified 8 features
✓ Created 15 work items

Creating work item definitions...
✓ Created 15 work item directories
✓ Created definition.md for each

Files updated:
- .agents/ROADMAP.md (roadmap overview)
- .agents/work/backlog.md (prioritized backlog)
- .agents/work/{slug}/definition.md (15 items)

Next steps:
1. Run /superagents:queue-add to move items from backlog to queue
2. Run /superagents:work to start implementation
```

## When to Use

- At project start
- After spec changes
- When priorities shift
- After completing major features

## Integration

- Roadmap provides project overview
- Backlog feeds into `/superagents:queue-add` command
- Work item definitions drive the RPI workflow

## Note

Existing work in progress is preserved. Only new items are added to the backlog. Items already in the queue or completed are not affected.
