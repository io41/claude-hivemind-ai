# Specifications Index

Requirement documents. Source of truth for what to build.

## Files

README.md -- How to write specifications -- guide, howto

## Adding Specifications

When adding spec files, use format:
```
{feature-name}.md -- {Feature description} -- {tags}
```

## Common Spec Files

- `requirements.md` - Functional requirements
- `api.md` - API specifications
- `database.md` - Data model requirements
- `ui.md` - UI/UX requirements

## Spec Format

```markdown
# Feature Name

## Overview
Brief description.

## Requirements

### REQ-001: Requirement Name
- **Priority**: High | Medium | Low
- **Description**: What it should do
- **Acceptance Criteria**:
  - [ ] Criterion 1
  - [ ] Criterion 2

### REQ-002: Another Requirement
...
```

## Workflow

1. Write specs in this directory
2. Run `/superagents:update-roadmap` to generate work items
3. Run `/superagents:work` to implement
