---
description: Move work item from backlog to processing queue (haiku model)
model: haiku
---

# /superagents:queue-add Command

Move a work item from backlog to the processing queue.

## Arguments

Optional: `[slug or description]`

If provided, fuzzy match against backlog items. If not provided, show interactive selection.

## Process

### 1. Read Backlog

Parse `.agents/work/backlog.md` to get all items.

### 2. Select Item

**If argument provided:**
- Fuzzy match against slug and descriptions
- If single match: use it
- If multiple matches: show selection
- If no match: show error

**If no argument:**
Use `AskUserQuestion` to prompt:

**Question**: "Which item do you want to add to the queue?"
**Options**:
1. **Next highest priority** - Add `{slug}` ({description}) - shows the actual next item
2. **Choose specific item** - Enter name, slug, or number

If user selects "Next highest priority": add that item directly.
If user selects "Choose specific item": list all backlog items numbered, then prompt for input.

### 3. Move Item

1. Remove the item line from `backlog.md` (from whichever priority section it's in)
2. Add to `queued.md` under "## Up Next" section:
   ```markdown
   - **{slug}** -- {description}
   ```

### 4. Display Status

Show updated queue:
```
✓ Added to queue: {slug}

## Current Queue Status

In Progress: (none)

Up Next (3 items):
  1. {slug} ← just added
  2. existing-item-1
  3. existing-item-2

Backlog remaining: X items
```

## Output

```json
{
  "slug": "add-user-authentication",
  "addedToQueue": true,
  "queuePosition": 1,
  "queueLength": 3
}
```

## Notes

- This is a fast operation using haiku model
- Validates the work item directory exists before moving
- If item is already in queue, show error message
