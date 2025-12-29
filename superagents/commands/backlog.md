---
description: Add a new work item to the backlog interactively
---

# /backlog Command

Interactive work item creation. Asks questions to define a new work item and adds it to the backlog.

## Process

### 1. Gather Information

Ask the user a series of questions:

1. **Description**: "What work needs to be done?" (brief description)
2. **Details**: "Any additional context or requirements?" (optional details)
3. **Priority**: "What priority?" (high/medium/low)

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

  Run /queue-add {slug} to add it to the processing queue.
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
