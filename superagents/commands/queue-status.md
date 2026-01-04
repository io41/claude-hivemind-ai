---
description: Show current work queue and processing status
---

# /superagents:queue-status Command

Display the current state of the work queue.

## Process

### 1. Read Queue Files

- `.agents/work/queued.md` - Current queue
- `.agents/work/backlog.md` - Waiting items
- `.agents/work/completed.md` - Recently finished
- `.agents/workflow.json` - Current phase

### 2. Parse Sections

**queued.md:**
- "## In Progress" section → current item
- "## Up Next" section → queued items

**backlog.md:**
- "## High Priority" → count
- "## Medium Priority" → count
- "## Low Priority" → count

### 3. Get Current Phase

From `workflow.json`:
- `currentPhase`: RESEARCH, RED, GREEN, REFACTOR, or null
- `workItemStartedAt`: when work started

## Output

```
╔══════════════════════════════════════════════════════════════╗
║                      QUEUE STATUS                            ║
╚══════════════════════════════════════════════════════════════╝

🔄 In Progress
   {slug} (phase: {phase})
   └─ Started: {relative time}

📋 Up Next ({count} items)
   1. first-queued-item
   2. second-queued-item
   3. third-queued-item

📦 Backlog ({total} items)
   High:   {count}
   Medium: {count}
   Low:    {count}

✅ Recently Completed ({count})
   - completed-item-1
   - completed-item-2

─────────────────────────────────────────────────────────────
Run /superagents:work to process the next item in queue.
Run /superagents:queue-add to add items from backlog.
```

### When Queue is Empty

```
╔══════════════════════════════════════════════════════════════╗
║                      QUEUE STATUS                            ║
╚══════════════════════════════════════════════════════════════╝

✨ Queue is empty!

📦 Backlog ({count} items available)
   High:   {count}
   Medium: {count}
   Low:    {count}

Run /superagents:queue-add to move items from backlog to queue.
Run /superagents:backlog to add new work items.
```

## Notes

- Simple read-only operation
- No model specified (uses default)
- Quick status check before starting work
