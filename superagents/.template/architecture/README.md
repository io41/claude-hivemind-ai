# Architecture

Implementation documentation for this project.

## Overview

This directory documents the implemented architecture. Docs are updated AFTER implementation, reflecting what actually exists.

## Structure

- `index.md` - Index of all architecture files
- `*.md` - Individual system/component documentation

## Conventions

### When to Update

- After completing a feature (GREEN + REFACTOR phases)
- When modifying existing systems
- When deprecating or removing features

### Documentation Format

```markdown
# System Name

## Status
Implemented | Planned | Deprecated

## Files
- `src/path/file.ts` - What this file does

## Description
How this system works.

## Dependencies
- Other systems or libraries

## API
Key interfaces and functions.
```

## Current Systems

_No systems documented yet. Architecture docs are created automatically after implementing features via `/superagents:work`._

## Adding Documentation

1. Create `{system-name}.md` with the format above
2. Add entry to `index.md`: `{system-name}.md -- {description} -- {tags}`
