---
description: Regenerate roadmap and todos from specification files in spec/
---

# /update-roadmap Command

Regenerate roadmap and todos from specification files.

## Process

### 1. Analyze Specifications
Use `spec-analyzer` agent (in parallel if multiple files):
- Read all files in `spec/` directory
- Extract requirements (functional, non-functional)
- Identify features and their relationships
- Note constraints and dependencies

### 2. Generate Roadmap
Use `roadmap-updater` agent to:
- Group requirements into features
- Break features into work items (1-2 day chunks)
- Prioritize by dependencies and value
- Create phased roadmap

### 3. Update Files

Save to `.agents/ROADMAP.md`:
```markdown
# Project Roadmap

## Phase 1: Foundation
- [ ] Database setup
- [ ] API framework
- [ ] Authentication

## Phase 2: Core Features
- [ ] User management
- [ ] Content creation
...
```

Generate todos in `.agents/todos/todo.md`:
```markdown
# Todo

## Current Work Item
**Name**: database-setup
**Priority**: Critical
**Dependencies**: None
**Requirements**: REQ-001, REQ-002

### Description
Set up PostgreSQL database with Drizzle ORM...

### Acceptance Criteria
- [ ] Database connection established
- [ ] Schema migrations working
- [ ] Basic CRUD operations tested
```

## Output

```
Analyzing specifications...
✓ Found 5 spec files
✓ Extracted 23 requirements

Generating roadmap...
✓ Identified 8 features
✓ Created 15 work items

Files updated:
- .agents/ROADMAP.md (roadmap overview)
- .agents/todos/todo.md (next work item)

Next: Run /work to start implementation
```

## When to Use

- At project start
- After spec changes
- When priorities shift
- After completing major features

## Integration

- Roadmap feeds into `/work` command
- Todos drive the RPI workflow
- Architecture docs reference roadmap items