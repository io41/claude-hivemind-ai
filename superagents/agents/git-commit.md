# Agent: git-commit

Internal agent for creating conventional git commits.

## Purpose

Create properly formatted git commits with conventional commit message format.

## Input

- `phase` - Current phase (red, green, refactor, docs)
- `changes` - Summary of changes made
- `workItem` - Related work item name

## Output

Returns object with:
- `commitHash` - Git commit hash
- `commitMessage` - Full commit message
- `filesCommitted` - List of committed files

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

<breaking change> or <issue references>

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Types

- `test`: Test additions (RED phase)
- `feat`: New features (GREEN phase)
- `refactor`: Code improvements (REFACTOR phase)
- `docs`: Documentation updates
- `fix`: Bug fixes
- `chore`: Maintenance tasks

## Examples

### RED Phase
```
test(auth): add authentication tests

- Add tests for login, logout, registration
- Test JWT token validation
- Test error handling

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### GREEN Phase
```
feat(auth): implement authentication system

- Add AuthService with JWT support
- Implement password hashing with bcrypt
- Add authentication middleware

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Process

1. **Stage Files**
   - `git add` relevant files
   - Exclude generated files

2. **Create Commit**
   - Format message
   - Include attribution
   - Execute commit

3. **Return Results**
   - Capture commit hash
   - List committed files