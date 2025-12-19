# Refactoring Skill

## When to Use
- REFACTOR phase of TDD
- Code quality improvements
- Performance optimization
- Technical debt reduction

## Core Refactorings

### Extract Method
```typescript
// Before
function process(data: Data) {
  // validate
  if (!data.id) throw new Error('Missing id')
  if (!data.name) throw new Error('Missing name')

  // transform
  const result = { ...data, processed: true }

  return result
}

// After
function process(data: Data) {
  validate(data)
  return transform(data)
}

function validate(data: Data) {
  if (!data.id) throw new Error('Missing id')
  if (!data.name) throw new Error('Missing name')
}

function transform(data: Data) {
  return { ...data, processed: true }
}
```

### Extract Constant
```typescript
// Before
if (retries > 3) { /* ... */ }

// After
const MAX_RETRIES = 3
if (retries > MAX_RETRIES) { /* ... */ }
```

### Extract Type
```typescript
// Before
function update(user: { id: number; name: string; email: string }) { }

// After
interface User {
  id: number
  name: string
  email: string
}
function update(user: User) { }
```

### Rename Symbol
```typescript
// Before
const d = new Date()
const x = calcX(d)

// After
const currentDate = new Date()
const ageInDays = calculateAgeInDays(currentDate)
```

### Replace Conditional with Polymorphism
```typescript
// Before
function getPrice(type: string) {
  switch (type) {
    case 'regular': return 10
    case 'premium': return 20
    default: return 5
  }
}

// After
interface PriceStrategy {
  getPrice(): number
}

class RegularPrice implements PriceStrategy {
  getPrice() { return 10 }
}

class PremiumPrice implements PriceStrategy {
  getPrice() { return 20 }
}
```

## Quality Metrics

### Complexity
- Cyclomatic complexity < 10
- Nesting depth < 4
- Function length < 50 lines

### Duplication
- No copy-pasted code
- Extract shared utilities
- Use composition over repetition

## Checklist

Before refactoring:
- [ ] All tests pass
- [ ] Code is committed

After each change:
- [ ] Run tests
- [ ] Verify behavior unchanged

Final:
- [ ] All tests still pass
- [ ] Code is more readable
- [ ] Complexity reduced

## Tools

```bash
# TypeScript strict mode
bun tsc --noEmit

# Linting
bun lint

# Code complexity
npx jscpd src/  # Detect duplicates
```

## Common Pitfalls

1. **Changing behavior** - Refactoring preserves external behavior
2. **Over-engineering** - Keep it simple
3. **Big bang changes** - Small, incremental improvements
4. **Skipping tests** - Run tests after every change