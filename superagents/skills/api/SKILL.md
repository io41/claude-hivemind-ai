# API Development Skill

## When to Use
- Creating REST endpoints or type-safe APIs
- API design and documentation
- Request/response handling
- Authentication middleware

## Technology Selection

| Use Case | Technology | Details |
|----------|------------|---------|
| Type-safe APIs (internal) | tRPC | See [trpc.md](trpc.md) |
| REST APIs (external/webhooks) | Hono | See [hono.md](hono.md) |
| High-performance services | Rust/Axum | See `rust-services` skill |
| Data/ML APIs | Python/FastAPI | See `python-analytics` skill |

**Default choice**: tRPC for internal APIs (frontend ↔ backend), Hono for REST scaffolding and external integrations.

## HTTP Status Codes

```
200 OK              - Successful GET/PUT
201 Created         - Successful POST
204 No Content      - Successful DELETE
400 Bad Request     - Invalid input
401 Unauthorized    - Not authenticated
403 Forbidden       - Not authorized
404 Not Found       - Resource not found
409 Conflict        - Duplicate resource
422 Unprocessable   - Validation failed
500 Server Error    - Internal error
```

## Response Formats

### Success
```json
{
  "data": { "id": 1, "name": "John" },
  "meta": { "total": 100, "page": 1 }
}
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [{ "field": "email", "message": "Invalid format" }]
  }
}
```

## Validation (Zod)

All APIs use Zod for runtime validation:

```typescript
import { z } from 'zod'

// Define schemas
const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional()
})

// Infer types
type CreateUser = z.infer<typeof CreateUserSchema>

// Common patterns
z.string().uuid()           // UUID validation
z.string().datetime()       // ISO datetime
z.enum(['admin', 'user'])   // Enum values
z.array(z.string())         // Arrays
z.record(z.number())        // Record/Map
z.union([z.string(), z.number()]) // Union types
```

## Authentication Patterns

### JWT-based (stateless)
```typescript
// Verify token, extract user
const payload = await verifyJWT(token)
const userId = payload.sub
```

### Session-based (stateful)
```typescript
// Look up session in database
const session = await db.sessions.findUnique({ where: { token } })
if (!session || session.expiresAt < new Date()) {
  throw new AuthError('Invalid session')
}
```

## Testing APIs

```typescript
describe('POST /users', () => {
  it('should create user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201)

    expect(response.body).toHaveProperty('id')
  })

  it('should return 400 for invalid data', async () => {
    await request(app)
      .post('/users')
      .send({ name: '' })
      .expect(400)
  })
})
```

## Related Skills
- [trpc.md](trpc.md) - Type-safe API layer
- [hono.md](hono.md) - REST framework
- `database` - Data layer patterns
- `rust-services` - High-performance APIs
- `python-analytics` - Data/ML APIs
