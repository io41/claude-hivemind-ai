# Todos Index

Work items to be completed. Generated from roadmap by /update-roadmap.

## Files

todo.md -- Master todo list, current work queue -- work, queue, todos

## File Format

Individual todo files (if needed): `{work-item-slug}.md`

## Master Todo (todo.md)

The main `todo.md` contains all work items in priority order:

```markdown
# Todo

## In Progress
- [ ] **work-item-slug** - Description
  - Requirements: REQ-001, REQ-002
  - Dependencies: other-item-slug

## Up Next
- [ ] **next-item-slug** - Description

## Completed
- [x] **done-item-slug** - Description
```

## Adding to Index

When creating individual todo files, add to this file:
```
{slug}.md -- {work item name} -- {tags}
```
