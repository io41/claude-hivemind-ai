# Frontend React Skill

## When to Use
- React 19 component development
- State management decisions
- Hooks and composition patterns
- Component architecture

## Technology Stack
- **React 19** - UI framework
- **Mantine v8** - Component library (see `frontend-design` skill)
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **@xstate/store** - Cross-cutting state (rare)

## State Management Hierarchy

**Critical**: Choose the right state type. See [state-hierarchy.md](state-hierarchy.md) for details.

| Priority | State Type | Implementation | Use Case |
|----------|-----------|----------------|----------|
| A | Location | Router path | Which page/feature |
| B | Resource | Route params | Which instance |
| C | Data | tRPC + TanStack Query | Server data |
| D | View Options | Query params | Filters, sort, view mode |
| E | Global Ephemeral | Global query params | Modals, toasts |
| F | Global Cross-Cutting | @xstate/store | User prefs (rare) |
| G | Local Component | useState/useRef | Form inputs, toggles |
| H | Local Cross-Component | @xstate/store | Sibling communication (rare) |

**Rule**: Prefer higher-priority state types. URL state (A-E) is shareable, bookmarkable, and survives refresh.

## React 19 Patterns

### Server Components (RSC)
```tsx
// Default: Server Component (no 'use client')
async function UserProfile({ id }: { id: string }) {
  const user = await db.users.findUnique({ where: { id } })
  return <div>{user.name}</div>
}
```

### Client Components
```tsx
'use client'

import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### use() Hook (React 19)
```tsx
'use client'

import { use } from 'react'

function UserName({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise) // Suspends until resolved
  return <span>{user.name}</span>
}
```

### Actions (React 19)
```tsx
'use client'

import { useActionState } from 'react'

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      const result = await login(formData)
      if (result.error) return { error: result.error }
      redirect('/dashboard')
    },
    { error: null }
  )

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
      {state.error && <p>{state.error}</p>}
    </form>
  )
}
```

## Component Patterns

### Composition over Props
```tsx
// Bad - prop drilling
<Card
  title="User"
  subtitle="Details"
  icon={<UserIcon />}
  actions={<Button>Edit</Button>}
/>

// Good - composition
<Card>
  <Card.Header>
    <UserIcon />
    <Card.Title>User</Card.Title>
    <Card.Subtitle>Details</Card.Subtitle>
  </Card.Header>
  <Card.Actions>
    <Button>Edit</Button>
  </Card.Actions>
</Card>
```

### Render Props / Children Functions
```tsx
function DataFetcher<T>({
  query,
  children
}: {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
}) {
  if (query.isLoading) return <Skeleton />
  if (query.error) return <Error error={query.error} />
  return children(query.data!)
}

// Usage
<DataFetcher query={userQuery}>
  {(user) => <UserCard user={user} />}
</DataFetcher>
```

### Custom Hooks
```tsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  return { value, toggle, setTrue, setFalse }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

## TanStack Router Integration

### Route Definition
```tsx
// routes/tasks.$taskId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  tab: z.enum(['details', 'comments', 'history']).default('details'),
  showArchived: z.boolean().default(false)
})

export const Route = createFileRoute('/tasks/$taskId')({
  validateSearch: searchSchema,
  component: TaskPage
})

function TaskPage() {
  const { taskId } = Route.useParams()
  const { tab, showArchived } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <Tabs
      value={tab}
      onChange={(value) => navigate({ search: { tab: value } })}
    >
      {/* ... */}
    </Tabs>
  )
}
```

### Global Search Params
```tsx
// router.tsx - define global params
const routerContext = {
  search: z.object({
    modal: z.enum(['notifications', 'settings', 'help']).optional()
  })
}

// Any component can read/write
function GlobalModal() {
  const { modal } = useSearch({ from: '__root__' })
  const navigate = useNavigate()

  return (
    <Modal
      opened={!!modal}
      onClose={() => navigate({ search: { modal: undefined } })}
    >
      {modal === 'notifications' && <Notifications />}
      {modal === 'settings' && <Settings />}
    </Modal>
  )
}
```

## TanStack Query with tRPC

```tsx
function TaskList() {
  // Queries
  const tasks = trpc.task.list.useQuery()

  // Mutations with cache invalidation
  const utils = trpc.useUtils()
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => utils.task.list.invalidate()
  })

  // Prefetching
  const prefetchTask = (id: string) => {
    utils.task.byId.prefetch({ id })
  }

  return (
    <ul>
      {tasks.data?.map(task => (
        <li
          key={task.id}
          onMouseEnter={() => prefetchTask(task.id)}
        >
          {task.title}
        </li>
      ))}
    </ul>
  )
}
```

## Error Boundaries

```tsx
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Alert color="red">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Alert>
  )
}

// Usage
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => queryClient.clear()}
>
  <App />
</ErrorBoundary>
```

## Performance Patterns

### Memoization
```tsx
// Memo for expensive renders
const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />)
})

// useMemo for expensive computations
const sortedItems = useMemo(
  () => items.toSorted((a, b) => a.name.localeCompare(b.name)),
  [items]
)

// useCallback for stable references
const handleClick = useCallback((id: string) => {
  setSelected(id)
}, [])
```

### Virtualization
```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  })

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Related Skills
- [state-hierarchy.md](state-hierarchy.md) - Detailed state management guide
- `frontend-design` - Mantine components and visual design
- `api/trpc.md` - tRPC integration patterns
