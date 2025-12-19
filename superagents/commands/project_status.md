---
description: Show current workflow state, progress, and test status
---

# /project-status Command

Show current workflow state and progress.

## Process

### 1. Check Workflow State
Read `.agents/workflow.json`:
- Current phase (RESEARCH, RED, GREEN, REFACTOR)
- Current work item
- Phase history

### 2. Check Git Status
```bash
git status --porcelain
git log --oneline -5
```

### 3. Check Test Status
```bash
bun test --silent 2>&1 | tail -5
```

### 4. Check Todo Progress
Read `.agents/ROADMAP.md` and `.agents/todos/`:
- Total work items
- Completed items
- Current item
- Remaining items

## Output

```
╔══════════════════════════════════════════════════════════════╗
║                     PROJECT STATUS                            ║
╚══════════════════════════════════════════════════════════════╝

📋 Current Work Item: user-authentication
   Phase: GREEN (implementing)
   Started: 2024-01-15 10:30

📊 Progress
   ████████████░░░░░░░░ 60% (12/20 items)

   Completed:
   ✓ database-setup
   ✓ api-framework
   ✓ user-model

   Current:
   → user-authentication (in progress)

   Remaining:
   ○ password-reset
   ○ session-management
   ○ ...

🧪 Tests
   Total: 47 | Passing: 47 | Failing: 0
   Coverage: 94%

📁 Git Status
   Branch: feature/user-auth
   Last Commit: feat(auth): implement login [abc123]
   Working Directory: Clean

📄 Recent Activity
   - 10:45 RED phase complete (12 tests)
   - 10:30 Research complete
   - 10:15 Started work item

Next: Continue GREEN phase or run /work to proceed
```

## Indicators

### Phase Status
- 🔴 RED - Writing tests
- 🟢 GREEN - Implementing
- 🔵 REFACTOR - Improving
- ⚪ IDLE - No active work

### Progress
- ✓ Completed
- → In Progress
- ○ Pending

## When to Use

- Start of session to see context
- After breaks to remember state
- When unsure of next steps
- To track overall progress