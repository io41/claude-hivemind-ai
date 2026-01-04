# Work Index

Work item management and active work tracking.

## Queue Files

| File | Purpose |
|------|---------|
| `backlog.md` | Priority-ordered work items waiting to be queued |
| `queued.md` | Work items ready for processing |
| `completed.md` | Finished work items (before archival) |

## Structure

Each work item has its own directory containing all artifacts:

```
work/
├── backlog.md           # Priority-ordered backlog
├── queued.md            # Processing queue
├── completed.md         # Finished items
└── {work-item-slug}/    # Per-item directory
    ├── definition.md    # Work item description
    ├── research.md      # Master research from spec/architecture
    ├── red-research.md  # RED phase research
    ├── red-plan.md      # RED phase plan
    ├── green-research.md
    ├── green-plan.md
    ├── refactor-research.md
    ├── refactor-plan.md
    └── report.md        # Combined R-G-R results
```

## Workflow

1. Items start in `backlog.md` (from `/superagents:update-roadmap` or `/superagents:backlog`)
2. `/superagents:queue-add` moves items to `queued.md`
3. `/superagents:work` processes the next item in queue
4. Completed items move to `completed.md`
5. Archive agent moves to `.agents/archive/{slug}/`

## Queue Status

Use `/superagents:queue-status` to view current queue state.
