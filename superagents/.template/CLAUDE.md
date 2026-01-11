# RPI Workflow

<!-- superagents:1.2.0 -->

Research-Plan-Implement with TDD.

## Core Principles

1. **Stop for Quality** - All tests MUST pass before commit
2. **Single-Piece Flow** - One test/refactoring at a time
3. **Go and See** - Read actual files before editing
4. **Eliminate Waste** - Write only what tests demand
5. **Trust but Verify** - Verify artifacts exist after agents claim to create them

## Workflow

```
/superagents:work → research → RED → GREEN → REFACTOR → archive
```

| Phase | Do | Gate |
|-------|-----|------|
| RESEARCH | Read spec, code, architecture | Artifact written |
| RED | Write tests | Tests fail correctly (assertions) |
| GREEN | Pass tests, **integrate** | 100% pass, integrated |
| REFACTOR | Improve quality | 100% pass |

**Integration is mandatory.** GREEN incomplete until code is wired into app.

## Artifact Verification

After each agent: READ the file it claims to create. >200 chars. Missing = STOP.

## Queue

```
backlog.md → queued.md → completed.md
```

- `/superagents:queue-add` moves backlog → queue
- `/superagents:work` processes queue (continues until empty)
- Completed → `.agents/archive/`

## Work Item Types

| Type | Slug | Workflow |
|------|------|----------|
| **Atomic** | `{slug}` | Full RPI |
| **Research** | `research-{slug}` | Breakdown only → creates atomic items |

## Key Files

| Purpose | Path |
|---------|------|
| Backlog | `.agents/work/backlog.md` |
| Queue | `.agents/work/queued.md` |
| Work items | `.agents/work/{slug}/` |
| Archive | `.agents/archive/` |
| Phase guidance | `.agents/context/phase-*.md` |
| Formats | `.agents/context/artifacts.md` |
| Spec | `spec/` |
| Architecture | `architecture/` |

## Options

<!-- superagents:options -->
- **Architecture phase:** on
<!-- /superagents:options -->

## Git

<!-- superagents:git-config -->
- **Mode:** direct
- **Branch prefix:** feature
<!-- /superagents:git-config -->

| Mode | Behavior |
|------|----------|
| `direct` | Commit to current branch |
| `feature-squash` | Create branch, squash merge |
| `feature-pr` | Create branch, open PR |

## Commands

- `/superagents:work` - Execute RPI (continues until empty)
- `/superagents:backlog` - Add work items
- `/superagents:queue-add` - Move to queue
- `/superagents:queue-status` - Show queue
- `/superagents:update-roadmap` - Generate from spec
- `/superagents:fix-tests` - Repair failing tests
- `/superagents:update-architecture` - Update docs
- `/superagents:create-spec` - Create/amend spec
- `/superagents:janitor` - Clean up stale files
- `/superagents:set-architecture` - Toggle architecture phase on/off
