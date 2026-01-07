# Project Roadmap

Generated from specifications by `/superagents:update-roadmap` command.

## Overview

This roadmap is automatically generated from `spec/*.md` files. It organizes requirements into work chunks with dependencies.

**Formula**: `{current architecture} ∪ {roadmap chunks} = {spec}`

## How to Use

1. Write requirements in `spec/*.md`
2. Run `/superagents:update-roadmap` to generate this roadmap
3. Run `/superagents:work` to implement the next work item

## Phases

_Phases are generated based on spec analysis._

### Phase 1: Foundation
**Priority**: Critical | **Status**: Not Started

Work items that have no dependencies and enable other work.

_Generated work items will appear here._

### Phase 2: Core Features
**Priority**: High | **Status**: Blocked (depends on Phase 1)

Main feature implementations.

_Generated work items will appear here._

### Phase 3: Polish
**Priority**: Medium | **Status**: Blocked (depends on Phase 2)

Refinements, optimizations, and quality improvements.

_Generated work items will appear here._

## Work Item Format

```markdown
- [ ] **work-item-slug** - Short description
  - Requirements: REQ-001, REQ-002
  - Dependencies: other-item-slug
  - Tests: ~3 (estimated)
```

## Regenerating

Run `/superagents:update-roadmap` after:
- Adding new specs
- Modifying existing specs
- Removing specs

The command will:
1. Analyze all spec files
2. Extract requirements
3. Group into work chunks
4. Identify dependencies
5. Update this roadmap
6. Generate todo items

## Notes

- Work items are ordered by dependencies
- Each work item should have comprehensive test coverage (avoid superfluous tests)
- Dependencies must be completed before dependent items
