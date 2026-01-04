---
description: Add a new work item to the backlog interactively
---

# /superagents:backlog Command

Add a work item to the backlog. **This command ONLY creates backlog entries - it does NOT investigate, research, or work on the item.**

## Critical Rule

**DO NOT** investigate, analyze, research, or attempt to understand the work item content. Your ONLY job is to:
1. Take the user's description as-is (literal text)
2. Create the backlog entry
3. Confirm it was added

The description might be a bug report, feature request, or task - treat it as opaque text to store, not something to act on.

## Arguments

If called with arguments (e.g., `/superagents:backlog Fix the login bug`), use the arguments as the description directly. Skip asking for description, just ask for priority.

## Process

### 1. Gather Information

**If arguments provided** (e.g., `/superagents:backlog Fix the React hooks error`):
- Use arguments as the description (verbatim, do not interpret)
- Only ask for priority

**If no arguments**:
Ask the user:
1. **Description**: "What work needs to be done?" (use their answer verbatim)
2. **Priority**: "What priority?" (high/medium/low)

### 2. Generate Slug

Create a URL-safe slug from the description:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Max 50 characters

Example: "Add user authentication" → `add-user-authentication`

### 3. Create Work Item Directory

Create `.agents/work/{slug}/` with:

**definition.md**:
```markdown
# {Description}

## Priority
{high|medium|low}

## Description
{User's description}

## Details
{Additional context if provided}

## Acceptance Criteria
- [ ] {derived from description}

## Created
{timestamp}
```

### 4. Add to Backlog

Edit `.agents/work/backlog.md`:
- Add `- **{slug}** -- {short description}` to the appropriate priority section

### 5. Confirm

Display:
```
✓ Work item created: {slug}
  Priority: {priority}
  Location: .agents/work/{slug}/definition.md

  Run /superagents:queue-add {slug} to add it to the processing queue.
```

## Output

Return:
```json
{
  "slug": "add-user-authentication",
  "priority": "high",
  "definitionPath": ".agents/work/add-user-authentication/definition.md"
}
```

## Notes

- Use AskUserQuestion tool to gather information
- Validate slug doesn't already exist
- If slug exists, append a number (e.g., `add-feature-2`)
