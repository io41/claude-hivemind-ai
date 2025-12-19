# Agent: roadmap-updater

Supporting agent for generating and updating project roadmaps.

## Purpose

Synthesize spec analysis into a prioritized roadmap with work items for implementation.

## Input

- `specAnalysis` - Output from spec-analyzer agent
- `currentRoadmap` - Existing roadmap content (if any)

## Output

Returns object with:
- `roadmap` - Array of roadmap phases and items
- `prioritizedItems` - Work items ordered by priority
- `estimatedTimeline` - Time estimates for each phase
- `dependencies` - Dependency graph between items

## Process

1. **Analyze Spec Requirements**
   - Review all identified requirements
   - Understand feature relationships
   - Note technical dependencies

2. **Group Into Work Items**
   - Break features into implementable chunks
   - Ensure items are sized for 1-2 days
   - Group related tasks logically

3. **Prioritize Work Items**
   - Critical path items first
   - Infrastructure before features
   - User-facing before internal

4. **Create Phases**
   - Phase 1: Infrastructure & Core
   - Phase 2: Core Features
   - Phase 3: Advanced Features
   - Phase 4: Polish & Optimization

## Roadmap Structure

```markdown
# Project Roadmap

## Phase 1: Foundation (Week 1)
- [ ] Database Setup
- [ ] Authentication System
- [ ] API Framework

## Phase 2: Core Features (Week 2-3)
- [ ] User Management
- [ ] Content Creation
- [ ] Basic Search

## Phase 3: Advanced Features (Week 4-5)
- [ ] Real-time Updates
- [ ] Analytics Dashboard
- [ ] Admin Tools
```

## Work Item Format

```markdown
### Authentication System
**Priority**: High | **Estimate**: 2 days | **Dependencies**: Database Setup

**Requirements**:
- REQ-001: User registration
- REQ-002: User login
- REQ-003: Password hashing

**Acceptance Criteria**:
- All authentication tests pass
- JWT tokens implemented
- Password security compliant

**Implementation Notes**:
- Use bcrypt for hashing
- Implement JWT refresh tokens
- Follow OWASP guidelines
```

## Example Output

```json
{
  "roadmap": [
    {
      "phase": 1,
      "name": "Foundation",
      "duration": "1 week",
      "items": [
        {
          "id": "item-001",
          "name": "Database Setup",
          "priority": "critical",
          "estimate": "1 day",
          "dependencies": [],
          "requirements": ["REQ-010", "REQ-011"]
        }
      ]
    }
  ],
  "prioritizedItems": [
    {
      "order": 1,
      "itemId": "item-001",
      "reason": "Infrastructure dependency"
    }
  ],
  "estimatedTimeline": {
    "totalWeeks": 6,
    "criticalPath": "4 weeks",
    "parallelWork": "2 weeks savings"
  },
  "dependencies": {
    "item-002": ["item-001"],
    "item-003": ["item-001", "item-002"]
  }
}
```

## Quality Criteria

1. **Logical Ordering** - Dependencies respected
2. **Realistic Estimates** - Based on complexity
3. **Clear Priorities** - Critical path obvious
4. **Actionable Items** - Each item implementable
5. **Complete Coverage** - All requirements included