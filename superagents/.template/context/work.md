# Work Orchestration

Execute `/superagents:work`. Follow exactly. Do not ask user.

## Critical Rules

1. **DO NOT STOP between phases** - Execute 1→2→3→4→5→6→7→8 continuously
2. **VERIFY artifacts exist** - After each agent, READ the file it claims to create. >200 chars required. Missing = STOP.
3. **Track only slug** - Everything else in files or agent returns

## Workflows

**Atomic (type: atomic):**
```
Get → Research → RED → GREEN-VALIDATE → GREEN → REFACTOR → Arch → Archive → Next
                   ↑                |
                   └── kickback ────┘ (max 3)
```

**Research (type: research):**
```
Get → Research (creates items) → Archive → Next
```

Stop only when: fatal error, queue empty, or 3 kickbacks.

---

## Steps

### 1. Get Next Item

```
Read: .agents/work/queued.md
Move first "Up Next" item to "In Progress"
Extract: {slug}
```

### 1.5. Check Type

Read `.agents/work/{slug}/definition.md`, extract `## Type`.
- **research** → Step 2R
- **atomic** → Step 2

---

### 2R. Research Workflow

```
Task(superagents:work-research, "{slug}")
  Returns: { type: "research", createdItems[], summary }
```

**VERIFY:** breakdown.md (>500 chars), report.md (>200 chars), createdItems has items, each item's definition.md exists.

```
Task(superagents:git-commit, "phase=research workItem={slug}")
```

**→ Skip to Step 7 (Archive)**

---

### 2. Research (Atomic)

```
Task(superagents:work-research, "{slug}")
  Returns: { type: "atomic", testCount, summary }
```

If testCount > 5: STOP (misclassified).

**→ Step 3**

### 3. RED Phase

```
Task(superagents:rpi-research, "{slug} phase=red")
VERIFY: red-research.md exists, >200 chars

Task(superagents:rpi-plan, "{slug} phase=red")
VERIFY: red-plan.md exists, >200 chars

Task(superagents:rpi-implement, "{slug} phase=red")
  Returns: { testsCreated, filesAffected }

Task(superagents:verify-results, "phase=red")
  Gate: testsFailing > 0, failures are assertions

Task(superagents:git-commit, "phase=red workItem={slug}")
```

**→ Step 4**

### 4. GREEN Phase

```
Task(superagents:rpi-research, "{slug} phase=green")
VERIFY: green-research.md exists, >200 chars

Task(superagents:rpi-plan, "{slug} phase=green")
VERIFY: green-plan.md exists, >200 chars, has "Integration" section
```

#### 4.1 Test Validation

```
Task(superagents:verify-results, "phase=green-validate workItem={slug}")
  Returns: { testsValid, validationErrors[] }
```

**If testsValid:** → Step 4.2

**If NOT testsValid (KICKBACK):**
1. Write errors to `.agents/work/{slug}/red-kickback.md`
2. `git revert HEAD --no-edit`
3. Increment redRetryCount
4. If redRetryCount >= 3: STOP (escalate)
5. Go to Step 3

#### 4.2 Implementation

```
Task(superagents:rpi-implement, "{slug} phase=green")
  MUST integrate into application
  Returns: { filesAffected, integrated }

Task(superagents:verify-results, "phase=green")
  Gate: passRate === 100, integrationVerified === true

Task(superagents:git-commit, "phase=green workItem={slug}")
```

**→ Step 5**

### 5. REFACTOR Phase

```
Task(superagents:rpi-research, "{slug} phase=refactor")
VERIFY: refactor-research.md exists, >200 chars

Task(superagents:rpi-plan, "{slug} phase=refactor")
VERIFY: refactor-plan.md exists, >200 chars

Task(superagents:rpi-implement, "{slug} phase=refactor")
  One change at a time, verify after each

Task(superagents:verify-results, "phase=refactor")
  Gate: passRate === 100

Task(superagents:git-commit, "phase=refactor workItem={slug}")
```

**→ Step 6**

### 6. Architecture (Optional)

**Check `.agents/CLAUDE.md` for "Architecture phase:" setting.**

If **on**:
```
Task(superagents:architecture, "{slug}")
Task(superagents:git-commit, "phase=docs workItem={slug}")
```

If **off**: Skip this step.

**→ Step 7**

### 7. Archive

```
Task(superagents:archive-work, "{slug}")
Remove from queued.md "In Progress"
Task(superagents:git-commit, "phase=chore workItem={slug}")
```

**→ Step 8**

### 8. Check Queue

```
Read: .agents/work/queued.md "Up Next"
If items: Go to Step 1
If empty: "Queue empty. All work complete."
```

---

## Error Handling

**Kickback (testsValid=false):** Not an error. Write red-kickback.md, revert, loop to RED. Stop after 3.

**Fatal (agent/gate fail):** Keep in "In Progress", STOP, report error.

## What You Track

- `{slug}` - current item
- `redRetryCount` - kickbacks for current item (reset each item)
- Agent return values (minimal)
