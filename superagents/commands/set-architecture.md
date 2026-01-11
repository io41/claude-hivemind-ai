---
description: Toggle architecture phase on/off
model: haiku
---

# /superagents:set-architecture Command

Toggle whether the architecture documentation phase runs after each work item.

## Arguments

Optional: `on` or `off`

If not provided, show current setting and ask.

## Process

### 1. Get Current Setting

Read `.agents/CLAUDE.md` and find the options block:
```
<!-- superagents:options -->
- **Architecture phase:** on
<!-- /superagents:options -->
```

### 2. Determine New Value

**If argument provided:** Use `on` or `off` directly.

**If no argument:** Use AskUserQuestion:
- "Toggle architecture phase?"
- Options: "Turn ON", "Turn OFF"

### 3. Update CLAUDE.md

Edit `.agents/CLAUDE.md`:
- Find line `- **Architecture phase:** ...`
- Replace with `- **Architecture phase:** {on|off}`

### 4. Confirm

```
✓ Architecture phase: {on|off}

When ON: Updates architecture/ docs after each work item.
When OFF: Skips architecture phase (faster workflow).
```

## Notes

- Fast operation using haiku model
- Changes take effect on next `/superagents:work` run
