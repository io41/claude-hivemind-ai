# Architecture Index

Implementation documentation. Updated after each feature is complete.

## Files

README.md -- Architecture overview and conventions -- overview, conventions

## Adding Documentation

When adding architecture docs, use format:
```
{system-name}.md -- {System description} -- {tags}
```

## Documentation Format

Each system/component should be documented:

```markdown
# System Name

## Status
Implemented | Planned | Deprecated

## Files
- `src/path/file.ts` - Description

## Description
How this system works (1-2 paragraphs).

## Dependencies
- System A
- External library B

## API
Key interfaces, functions, or endpoints.

## Usage Example
```code
How to use this system
```
```

## Conventions

- Document AFTER implementation (not before)
- Update when implementation changes
- Remove documentation for deleted code
- Keep descriptions concise
