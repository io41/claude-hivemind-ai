# RESEARCH Phase

Gather context and analyze requirements before implementation.

## Artifacts

### Read Before Starting
- `.agents/todos/todo.md` - Current work items
- `spec/*.md` - Relevant spec sections
- `architecture/index.md` - Current architecture state

### Write After Completing
- `.agents/research/{slug}.md` - Research findings

## Process

1. **Load Work Item**
   - Read todo file
   - Identify the next incomplete item
   - Extract acceptance criteria

2. **Analyze Spec**
   - Find relevant spec sections
   - Extract requirements for this work item
   - Note dependencies and constraints

3. **Review Architecture**
   - Understand current state
   - Identify files to modify
   - Check existing patterns

4. **Check Patterns & Mistakes**
   - Read `.agents/patterns/index.md`
   - Read `.agents/mistakes/index.md`
   - Load relevant pattern/mistake files

5. **Right-Size Check**
   - Estimate test count (should be 1-5)
   - If > 5 tests needed, suggest splitting work item

6. **Write Research Artifact**
   - Save to `.agents/research/{work-item-slug}.md`
   - Include: scope, requirements, approach, risks

## Research File Format

```markdown
# Research: {work-item-name}

## Scope
- Estimated tests: N
- Files to modify: [list]
- Dependencies: [list]

## Requirements
From spec section X:
- REQ-001: Description
- REQ-002: Description

## Current State
What exists now:
- File A: Does X
- File B: Does Y

## Approach
Brief recommended approach (1-2 paragraphs).

## Relevant Patterns
- Pattern A (from patterns/): Why relevant

## Risks
- Risk 1: Description (mitigation)
- Risk 2: Description (mitigation)
```

## Key Rules

1. **Just-in-time loading** - Load only what's needed for this work item
2. **Right-size work** - Flag items needing > 5 tests
3. **Focused output** - Summary, not exhaustive analysis
4. **Point to sources** - Reference files, don't duplicate content
