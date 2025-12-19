# Specifications

This directory contains the source of truth for project requirements.

## How to Write Specs

Create markdown files describing your requirements. Use clear, testable language.

### Recommended Files

| File | Purpose |
|------|---------|
| `requirements.md` | Functional requirements |
| `api.md` | API endpoints and contracts |
| `database.md` | Data models and relationships |
| `ui.md` | UI/UX requirements |

### Spec Format

```markdown
# Feature Name

## Overview
Brief description of the feature (1-2 sentences).

## Requirements

### REQ-001: Requirement Name
- **Priority**: High | Medium | Low
- **Description**: Detailed description of what this requirement means
- **Acceptance Criteria**:
  - [ ] User can do X
  - [ ] System responds with Y
  - [ ] Error Z is handled

### REQ-002: Another Requirement
- **Priority**: Medium
- **Description**: ...
- **Acceptance Criteria**:
  - [ ] ...
```

## Writing Good Requirements

### Do
- Use specific, measurable language
- Include acceptance criteria
- Define error cases
- Reference related requirements

### Don't
- Use vague terms ("fast", "user-friendly")
- Skip acceptance criteria
- Assume implementation details
- Write requirements that can't be tested

## Example

```markdown
# User Authentication

## Overview
Allow users to register, login, and logout securely.

## Requirements

### REQ-AUTH-001: User Registration
- **Priority**: High
- **Description**: Users can create an account with email and password
- **Acceptance Criteria**:
  - [ ] Email must be valid format
  - [ ] Password must be at least 8 characters
  - [ ] Duplicate emails are rejected with clear error
  - [ ] Successful registration returns user profile

### REQ-AUTH-002: User Login
- **Priority**: High
- **Description**: Registered users can login with credentials
- **Acceptance Criteria**:
  - [ ] Valid credentials return JWT token
  - [ ] Invalid credentials return 401 error
  - [ ] Token expires after 24 hours
```

## After Writing Specs

1. Update `index.md` with new spec files
2. Run `/update-roadmap` to generate work items
3. Run `/work` to start implementing
