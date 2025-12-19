# tRPC - Type-Safe APIs

End-to-end typesafe APIs without code generation.

## When to Use tRPC
- Internal APIs (frontend ↔ backend)
- When you control both client and server
- Type safety across the network boundary
- Real-time subscriptions

**Don't use for**: External APIs, webhooks, third-party consumers (use Hono REST instead).

## Setup

### Server (Node.js/Bun)

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import superjson from 'superjson'

// Context type
interface Context {
  db: Database
  user?: { id: string; role: string }
}

const t = initTRPC.context<Context>().create({
  transformer: superjson, // Dates, Maps, Sets work automatically
})

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware
```

### Protected Procedures

```typescript
const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { user: ctx.user } })
})

const isAdmin = middleware(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next()
})

export const protectedProcedure = publicProcedure.use(isAuthed)
export const adminProcedure = protectedProcedure.use(isAdmin)
```

## Router Definition

```typescript
// server/routers/user.ts
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'

export const userRouter = router({
  // Query - GET data
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.users.findMany()
  }),

  // Query with input
  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.users.findUnique({ where: { id: input.id } })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
      return user
    }),

  // Mutation - modify data
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.users.create({ data: input })
    }),

  // Update
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.db.users.update({ where: { id }, data })
    }),

  // Delete
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.users.delete({ where: { id: input.id } })
      return { success: true }
    })
})
```

### Root Router

```typescript
// server/routers/index.ts
import { router } from '../trpc'
import { userRouter } from './user'
import { postRouter } from './post'

export const appRouter = router({
  user: userRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
```

## Client Setup (React)

```typescript
// client/trpc.ts
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../server/routers'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc',
      transformer: superjson,
      headers: () => ({
        Authorization: `Bearer ${getToken()}`
      })
    })
  ]
})
```

### Provider Setup

```tsx
// client/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, trpcClient } from './trpc'

const queryClient = new QueryClient()

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
```

## Using in Components

### Queries

```tsx
function UserList() {
  // Basic query
  const { data, isLoading, error } = trpc.user.list.useQuery()

  // Query with input
  const { data: user } = trpc.user.byId.useQuery({ id: '123' })

  // Conditional query
  const { data } = trpc.user.byId.useQuery(
    { id: userId },
    { enabled: !!userId }
  )

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### Mutations

```tsx
function CreateUser() {
  const utils = trpc.useUtils()

  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.user.list.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (data: FormData) => {
    createUser.mutate({
      name: data.get('name') as string,
      email: data.get('email') as string
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

### Optimistic Updates

```tsx
const updateUser = trpc.user.update.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await utils.user.byId.cancel({ id: newData.id })

    // Snapshot current value
    const previousUser = utils.user.byId.getData({ id: newData.id })

    // Optimistically update
    utils.user.byId.setData({ id: newData.id }, (old) => ({
      ...old!,
      ...newData
    }))

    return { previousUser }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.user.byId.setData(
      { id: newData.id },
      context?.previousUser
    )
  },
  onSettled: (data, err, variables) => {
    // Refetch after mutation
    utils.user.byId.invalidate({ id: variables.id })
  }
})
```

## Error Handling

```typescript
// Server - throw TRPCError
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid email format',
  cause: originalError // optional
})

// Available codes:
// PARSE_ERROR, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN,
// NOT_FOUND, TIMEOUT, CONFLICT, PRECONDITION_FAILED,
// PAYLOAD_TOO_LARGE, METHOD_NOT_SUPPORTED,
// UNPROCESSABLE_CONTENT, TOO_MANY_REQUESTS,
// CLIENT_CLOSED_REQUEST, INTERNAL_SERVER_ERROR
```

```tsx
// Client - handle errors
const { error } = trpc.user.byId.useQuery({ id })

if (error) {
  if (error.data?.code === 'NOT_FOUND') {
    return <NotFound />
  }
  return <Error message={error.message} />
}
```

## Subscriptions (WebSocket)

```typescript
// Server
export const chatRouter = router({
  onMessage: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .subscription(({ input }) => {
      return observable<Message>((emit) => {
        const handler = (msg: Message) => {
          if (msg.roomId === input.roomId) {
            emit.next(msg)
          }
        }

        eventEmitter.on('message', handler)
        return () => eventEmitter.off('message', handler)
      })
    })
})
```

```tsx
// Client
function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])

  trpc.chat.onMessage.useSubscription({ roomId }, {
    onData: (message) => {
      setMessages(prev => [...prev, message])
    }
  })

  return <MessageList messages={messages} />
}
```

## Testing

```typescript
import { createCaller } from '@trpc/server'
import { appRouter } from './routers'

describe('userRouter', () => {
  const caller = createCaller(appRouter)

  it('should create user', async () => {
    const ctx = { db: mockDb, user: { id: '1', role: 'admin' } }
    const user = await caller(ctx).user.create({
      name: 'John',
      email: 'john@example.com'
    })

    expect(user).toHaveProperty('id')
    expect(user.name).toBe('John')
  })

  it('should throw on unauthorized', async () => {
    const ctx = { db: mockDb } // no user
    await expect(
      caller(ctx).user.create({ name: 'John', email: 'john@example.com' })
    ).rejects.toThrow('UNAUTHORIZED')
  })
})
```
