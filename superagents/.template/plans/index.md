# Plans Index

Execution plans for each workflow phase. Created before executing each phase.

## Files

_No plans yet. Created automatically during /superagents:work._

## File Format

Plan files are named: `{work-item-slug}-{phase}.md`

- `{slug}-red.md` - RED phase test plan
- `{slug}-green.md` - GREEN phase implementation plan
- `{slug}-refactor.md` - REFACTOR phase improvement plan

## Adding to Index

Add to this file in format:
```
{slug}-{phase}.md -- {work item name} {phase} plan -- {phase}, plan, {tags}
```

## Cleanup

Plan files can be deleted after work item is complete. Archive important approaches to `.agents/patterns/`.
