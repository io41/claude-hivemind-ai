# State Management Hierarchy

A structured approach to state management prioritizing URL state for shareability and predictability.

## The Hierarchy

### A. Location State (The "Where")
**Purpose**: Navigation and macro-feature identification
**Implementation**: Route path managed by TanStack Router
**Example**: `/tasks` for task tracker feature

```tsx
// routes/tasks.tsx
export const Route = createFileRoute('/tasks')({
  component: TasksPage
})

// Navigate programmatically
navigate({ to: '/tasks' })
```

**When to use**: Page/feature-level navigation. This is the coarsest grain of state.

---

### B. Resource State (The "What")
**Purpose**: Specific instance identification within a feature
**Implementation**: Route path parameters in TanStack Router
**Example**: `/tasks/123` for specific task ID 123

```tsx
// routes/tasks.$taskId.tsx
export const Route = createFileRoute('/tasks/$taskId')({
  component: TaskDetailPage
})

function TaskDetailPage() {
  const { taskId } = Route.useParams()
  // taskId is "123"
}
```

**When to use**: Identifying which specific resource/instance to display.

---

### C. Data State (The "Details")
**Purpose**: Instance-specific data and information
**Implementation**: Fetched over tRPC (internal) or REST (external), cached with TanStack Query
**Examples**: Task description, status, comments, metadata

```tsx
function TaskDetail({ taskId }: { taskId: string }) {
  const { data: task, isLoading } = trpc.task.byId.useQuery({ id: taskId })

  // TanStack Query handles:
  // - Caching
  // - Background refetching
  // - Stale-while-revalidate
  // - Deduplication
}
```

**When to use**: Any data that comes from the server. Never store server data in local state.

---

### D. View Options State (The "Options")
**Purpose**: Display preferences and filters within the same view
**Implementation**: Route query/search parameters via TanStack Router
**Examples**: `/tasks/123?tab=comments&sort=newest`

```tsx
// routes/tasks.$taskId.tsx
import { z } from 'zod'

const searchSchema = z.object({
  tab: z.enum(['details', 'comments', 'history']).default('details'),
  sort: z.enum(['newest', 'oldest']).default('newest'),
  showCompleted: z.boolean().default(true)
})

export const Route = createFileRoute('/tasks/$taskId')({
  validateSearch: searchSchema,
  component: TaskDetailPage
})

function TaskDetailPage() {
  const { tab, sort, showCompleted } = Route.useSearch()
  const navigate = Route.useNavigate()

  // Update search params (preserves others)
  const setTab = (newTab: string) => {
    navigate({ search: (prev) => ({ ...prev, tab: newTab }) })
  }
}
```

**When to use**: Filter/sort/view options that should be shareable via URL.

---

### E. Global Ephemeral State
**Purpose**: Application-wide temporary UI states
**Implementation**: Route query parameters defined globally at router level
**Examples**: `/any/path?modal=notifications` for global notifications modal

```tsx
// router.tsx
import { z } from 'zod'

const globalSearchSchema = z.object({
  modal: z.enum(['notifications', 'settings', 'help', 'command-palette']).optional(),
  toast: z.string().optional()
})

const router = createRouter({
  routeTree,
  context: {},
  search: {
    strict: true,
    schema: globalSearchSchema
  }
})

// Any component anywhere
function OpenSettingsButton() {
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate({ search: { modal: 'settings' } })}>
      Settings
    </Button>
  )
}

// Root layout handles the modal
function RootLayout() {
  const { modal } = useSearch({ from: '__root__' })
  const navigate = useNavigate()

  const closeModal = () => navigate({ search: { modal: undefined } })

  return (
    <>
      <Outlet />
      <Modal opened={modal === 'settings'} onClose={closeModal}>
        <SettingsPanel />
      </Modal>
    </>
  )
}
```

**When to use**: Global UI state (modals, command palette, toasts) that should work from any page.

---

### F. Global Cross-Cutting State
**Purpose**: State shared across multiple routes without navigation dependency
**Implementation**: @xstate/store (companion library, not full statechart)
**Examples**: User preferences, theme, application-wide events

```tsx
import { createStore } from '@xstate/store'
import { useSelector } from '@xstate/store/react'

// Define store
const preferencesStore = createStore({
  context: {
    theme: 'light' as 'light' | 'dark',
    sidebarCollapsed: false,
    notifications: true
  },
  on: {
    toggleTheme: (context) => ({
      ...context,
      theme: context.theme === 'light' ? 'dark' : 'light'
    }),
    toggleSidebar: (context) => ({
      ...context,
      sidebarCollapsed: !context.sidebarCollapsed
    }),
    setNotifications: (context, event: { enabled: boolean }) => ({
      ...context,
      notifications: event.enabled
    })
  }
})

// Use in components
function ThemeToggle() {
  const theme = useSelector(preferencesStore, (s) => s.context.theme)
  return (
    <Button onClick={() => preferencesStore.send({ type: 'toggleTheme' })}>
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  )
}
```

**When to use**: Rare. User preferences, feature flags, cross-cutting concerns that don't belong in URL.

---

### G. Local Component State
**Purpose**: Component-specific state with single data flow path
**Implementation**: React hooks (useState, useRef) with prop drilling
**Examples**: Form inputs, component toggles, animation state

```tsx
function TaskForm({ onSubmit }: { onSubmit: (task: NewTask) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit({ title, description })
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button type="submit" loading={isSubmitting}>Create</Button>
    </form>
  )
}
```

**When to use**: Form state, UI toggles, animation state—anything truly local to one component tree.

---

### H. Local Cross-Component State
**Purpose**: Local state shared between sibling components
**Implementation**: @xstate/store for component communication
**Usage**: Rare; component composition preferred

```tsx
// When two siblings need to communicate
const editorStore = createStore({
  context: {
    selectedBlockId: null as string | null,
    clipboardContent: null as Block | null
  },
  on: {
    selectBlock: (context, event: { id: string }) => ({
      ...context,
      selectedBlockId: event.id
    }),
    copyBlock: (context, event: { block: Block }) => ({
      ...context,
      clipboardContent: event.block
    })
  }
})

function EditorCanvas() {
  // Uses store to know which block is selected
}

function EditorSidebar() {
  // Uses store to show properties of selected block
}

function Editor() {
  return (
    <div>
      <EditorCanvas />
      <EditorSidebar />
    </div>
  )
}
```

**When to use**: Very rare. Prefer lifting state up or composition. Only use when siblings need frequent, synchronous communication.

---

## Decision Tree

```
Need to store some state?
│
├─ Is it server data?
│  └─ YES → C. Data State (TanStack Query + tRPC)
│
├─ Should users be able to share/bookmark this state?
│  └─ YES → URL State (A, B, D, or E)
│     ├─ Which page? → A. Location (route path)
│     ├─ Which resource? → B. Resource (route params)
│     ├─ View options? → D. View Options (search params)
│     └─ Global UI? → E. Global Ephemeral (global search params)
│
├─ Is it user preferences/settings?
│  └─ YES → F. Global Cross-Cutting (@xstate/store)
│
├─ Is it local to one component?
│  └─ YES → G. Local Component (useState/useRef)
│
└─ Is it shared between siblings?
   └─ YES → H. Local Cross-Component (@xstate/store)
          → But first: can you lift state up? Can you compose differently?
```

## Anti-Patterns

### Don't store server data in local state
```tsx
// BAD
const [user, setUser] = useState(null)
useEffect(() => {
  fetchUser().then(setUser)
}, [])

// GOOD
const { data: user } = trpc.user.me.useQuery()
```

### Don't duplicate URL state in local state
```tsx
// BAD
const [tab, setTab] = useState('details')
// This state gets out of sync with URL

// GOOD
const { tab } = Route.useSearch()
const navigate = Route.useNavigate()
```

### Don't use global state for local concerns
```tsx
// BAD - global store for form state
const formStore = createStore({
  context: { name: '', email: '' },
  // ...
})

// GOOD - local state
const [formState, setFormState] = useState({ name: '', email: '' })
```

### Don't use local state for shareable concerns
```tsx
// BAD - filter state lost on refresh
const [showArchived, setShowArchived] = useState(false)

// GOOD - preserved in URL
const { showArchived } = Route.useSearch()
```
