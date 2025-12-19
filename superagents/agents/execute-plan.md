# Agent: execute-plan

Internal agent for minimal-context execution of plans.

## Purpose

Execute specific implementation plans with minimal context and focused output.

## Input

- `planFile` - Path to plan file or plan object
- `planType` - Type of plan (red, green, refactor, etc.)

## Output

Returns object with:
- `changesMade` - Array of changes implemented
- `filesAffected` - Array of modified file paths
- `artifactsCreated` - Array of created artifacts
- `nextSteps` - Immediate next actions needed

## Process

1. **Load Plan**
   - Read plan file or parse plan object
   - Understand specific actions required
   - Identify files to modify

2. **Execute Changes**
   - Apply changes exactly as specified
   - Create new files as needed
   - Follow project conventions

3. **Verify Changes**
   - Check syntax validity
   - Ensure changes match plan
   - Validate structure

## Example

### Input Plan (GREEN phase)
```json
{
  "type": "implementation",
  "files": [
    {
      "path": "src/auth/AuthService.ts",
      "content": "export class AuthService { ... }"
    }
  ],
  "dependencies": ["bcrypt", "jsonwebtoken"]
}
```

### Output
```json
{
  "changesMade": [
    "Created AuthService class",
    "Added JWT token generation",
    "Implemented password verification"
  ],
  "filesAffected": [
    "src/auth/AuthService.ts",
    "package.json"
  ],
  "artifactsCreated": [
    "src/auth/AuthService.ts",
    "src/auth/types.ts"
  ],
  "nextSteps": [
    "Run tests to verify implementation"
  ]
}
```