# Hono Framework

Lightweight, fast web framework for REST APIs and HTTP scaffolding.

## When to Use Hono
- REST APIs for external consumers
- Webhook endpoints
- Serving tRPC over HTTP
- Simple CRUD APIs
- Middleware composition

## Setup

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

export default app
```

## Route Definition

```typescript
// GET
app.get('/users', async (c) => {
  const users = await db.users.findMany()
  return c.json(users)
})

// GET with params
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = await db.users.findUnique({ where: { id } })
  if (!user) return c.notFound()
  return c.json(user)
})

// POST
app.post('/users', async (c) => {
  const body = await c.req.json()
  const user = await db.users.create({ data: body })
  return c.json(user, 201)
})

// PUT
app.put('/users/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const user = await db.users.update({ where: { id }, data: body })
  return c.json(user)
})

// DELETE
app.delete('/users/:id', async (c) => {
  const id = c.req.param('id')
  await db.users.delete({ where: { id } })
  return c.body(null, 204)
})
```

## Request Validation

```typescript
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

app.post('/users',
  zValidator('json', CreateUserSchema),
  async (c) => {
    const data = c.req.valid('json')
    // data is typed and validated
  }
)

// Validate query params
app.get('/search',
  zValidator('query', z.object({ q: z.string(), limit: z.coerce.number().optional() })),
  async (c) => {
    const { q, limit } = c.req.valid('query')
  }
)

// Validate path params
app.get('/users/:id',
  zValidator('param', z.object({ id: z.string().uuid() })),
  async (c) => {
    const { id } = c.req.valid('param')
  }
)
```

## Error Handling

```typescript
import { HTTPException } from 'hono/http-exception'

// Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  console.error(err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// Throw errors
throw new HTTPException(404, { message: 'User not found' })
throw new HTTPException(401, { message: 'Unauthorized' })
throw new HTTPException(400, { message: 'Invalid input' })
```

## Authentication Middleware

```typescript
import { jwt } from 'hono/jwt'
import { bearerAuth } from 'hono/bearer-auth'

// JWT authentication
app.use('/api/*', jwt({ secret: process.env.JWT_SECRET! }))

app.get('/api/me', async (c) => {
  const payload = c.get('jwtPayload')
  return c.json({ userId: payload.sub })
})

// Simple bearer token
app.use('/webhook/*', bearerAuth({ token: process.env.WEBHOOK_SECRET! }))
```

## Custom Middleware

```typescript
import { createMiddleware } from 'hono/factory'

// Type-safe middleware
const authMiddleware = createMiddleware<{
  Variables: { userId: string }
}>(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) throw new HTTPException(401)

  const payload = await verifyToken(token)
  c.set('userId', payload.sub)
  await next()
})

app.use('/api/*', authMiddleware)

app.get('/api/profile', async (c) => {
  const userId = c.get('userId') // typed!
})
```

## Route Groups

```typescript
const api = new Hono()

api.get('/users', listUsers)
api.post('/users', createUser)
api.get('/users/:id', getUser)

const admin = new Hono()
admin.use('*', adminAuthMiddleware)
admin.get('/stats', getStats)
admin.delete('/users/:id', deleteUser)

app.route('/api', api)
app.route('/admin', admin)
```

## Serving tRPC

```typescript
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './trpc/router'

app.use('/trpc/*', trpcServer({
  router: appRouter,
  createContext: (c) => ({
    user: c.get('user'),
    db
  })
}))
```

## File Uploads

```typescript
app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file'] as File

  if (!file) {
    throw new HTTPException(400, { message: 'No file provided' })
  }

  const buffer = await file.arrayBuffer()
  // Process file...

  return c.json({ filename: file.name, size: file.size })
})
```

## Streaming Responses

```typescript
import { stream, streamText, streamSSE } from 'hono/streaming'

// Server-Sent Events
app.get('/events', async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const data = await getLatestData()
      await stream.writeSSE({ data: JSON.stringify(data) })
      await stream.sleep(1000)
    }
  })
})
```

## Testing

```typescript
import { testClient } from 'hono/testing'

describe('API', () => {
  const client = testClient(app)

  it('should create user', async () => {
    const res = await client.users.$post({
      json: { name: 'John', email: 'john@example.com' }
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('id')
  })
})
```
