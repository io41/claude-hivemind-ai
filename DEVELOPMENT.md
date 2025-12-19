# Plugin Development Guide

How to create plugins for the Hivemind AI marketplace.

## Plugin Structure

Every plugin follows this structure:

```
plugin-name/
├── README.md           # Plugin documentation
├── agents/             # Subagent definitions (.md files)
├── skills/             # Domain knowledge modules
├── hooks/              # Runtime hooks (TypeScript)
├── commands/           # User commands (.md files)
└── .template/          # Setup templates
```

## Creating a New Plugin

### 1. Create Directory Structure

```bash
mkdir -p my-plugin/{agents,skills,hooks,commands,.template}
```

### 2. Write README.md

Document your plugin:

```markdown
# My Plugin

Brief description.

## Features
- Feature 1
- Feature 2

## Installation
Steps to install.

## Commands
Available commands.

## Configuration
How to configure.
```

### 3. Create Agents

Agents are markdown files that define specialized AI behaviors.

**File**: `agents/my-agent.md`

```markdown
# Agent: my-agent

Description of what this agent does.

## Input
- `param1` - Description
- `param2` - Description

## Output
- `result` - Description

## Process
1. Step 1
2. Step 2
3. Step 3

## Example
```json
{
  "input": {...},
  "output": {...}
}
```
```

### 4. Create Skills

Skills provide domain knowledge that agents can reference.

**Structure**:
```
skills/
└── skill-name/
    ├── SKILL.md        # Core patterns (required)
    └── reference.md    # Detailed docs (optional)
```

**SKILL.md Format**:
```markdown
# Skill Name

## When to Use
- Scenario 1
- Scenario 2

## Patterns

### Pattern 1
**Problem**: What it solves
**Solution**: How to solve it
```code
Example code
```

### Pattern 2
...

## Anti-Patterns
What NOT to do.

## References
Links to external docs.
```

### 5. Create Hooks

Hooks enforce rules and add context at runtime.

**File**: `hooks/hooks.ts`

```typescript
import { runHook, type UserPromptSubmitPayload } from './lib'

const userPromptSubmit = async (payload: UserPromptSubmitPayload) => {
  // Add context, validate, modify prompts
  return {
    decision: 'approve',
    contextFiles: ['path/to/context.md'],
  }
}

runHook({ userPromptSubmit })
```

**File**: `hooks/lib.ts`
Copy from an existing plugin or implement the hook runner.

### 6. Create Commands

Commands are user-facing entry points.

**File**: `commands/my-command.md`

```markdown
# /my-command Command

Description of what this command does.

## Process

1. Step 1 - What to do
2. Step 2 - What to do
3. Step 3 - What to do

## Output

What the command outputs to the user.

## Error Handling

How to handle errors.
```

### 7. Create Templates

Templates are copied during setup. Place them in `.template/`:

```
.template/
├── CLAUDE.md           # Rules to append
├── settings.json       # Hook configuration
└── context/            # Context files
    └── *.md
```

## Best Practices

### Agents

1. **Single Responsibility**: One agent, one job
2. **Clear I/O**: Document inputs and outputs
3. **Token Budget**: Stay under 50k input, 3k output
4. **Compression**: Essential findings only

### Skills

1. **Focused**: One domain per skill
2. **Actionable**: Include code examples
3. **Lazy-loaded**: Split into SKILL.md + reference files
4. **Evolvable**: Update with learnings

### Hooks

1. **Fast**: < 5 second timeout
2. **Simple**: Minimal logic
3. **Safe**: Handle errors gracefully
4. **Non-blocking**: Don't break user workflow

### Commands

1. **Documented**: Clear process steps
2. **Atomic**: Single workflow per command
3. **Error Handling**: Guide users on failures
4. **Output**: Clear progress and results

## Testing Your Plugin

1. Create a test project
2. Install your plugin manually
3. Run through all commands
4. Verify hooks fire correctly
5. Check agents produce expected outputs

## Publishing

1. Ensure README is complete
2. Add to marketplace registry
3. Test installation process
4. Submit PR to hivemind-ai repo

## Example Plugins

See existing plugins for reference:
- `superagents/` - Full RPI workflow with TDD
