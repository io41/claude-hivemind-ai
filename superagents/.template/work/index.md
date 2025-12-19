# Work Index

Active work-in-progress files. Created during /work execution.

## Files

_No active work. Files created during /work execution._

## Structure

During work, a directory is created for each work item:

```
work/
└── {work-item-slug}/
    ├── state.json       # Current phase, progress
    └── notes.md         # Working notes (optional)
```

## state.json Format

```json
{
  "workItem": "work-item-slug",
  "phase": "red|green|refactor|complete",
  "startedAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "redCommit": "hash (if complete)",
  "greenCommit": "hash (if complete)",
  "refactorCommit": "hash (if complete)"
}
```

## Cleanup

Work directories can be deleted after work item is complete and commits are made.
