# Drizzle ORM

Type-safe SQL query builder for TypeScript.

## Setup

```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

## Schema Definition

```typescript
// db/schema.ts
import {
  pgTable, serial, text, timestamp, integer, boolean, uuid,
  varchar, json, jsonb, index, uniqueIndex, primaryKey
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'user', 'guest'] }).default('user'),
  active: boolean('active').default(true),
  metadata: jsonb('metadata').$type<{ preferences: Record<string, any> }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
  activeIdx: index('active_idx').on(table.active)
}))

// Posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' }),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow()
})

// Tags table (many-to-many example)
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique()
})

export const postTags = pgTable('post_tags', {
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').references(() => tags.id, { onDelete: 'cascade' })
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] })
}))
```

## Relations

```typescript
// db/relations.ts
import { relations } from 'drizzle-orm'
import { users, posts, tags, postTags } from './schema'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  }),
  postTags: many(postTags)
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags)
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id]
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id]
  })
}))
```

## Client Setup

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import * as relations from './relations'

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client, {
  schema: { ...schema, ...relations }
})

export type Database = typeof db
```

## Queries

### Select
```typescript
import { eq, and, or, like, gt, lt, between, isNull, inArray, desc, asc, sql } from 'drizzle-orm'

// Select all
const allUsers = await db.select().from(users)

// Select with filter
const user = await db.select()
  .from(users)
  .where(eq(users.id, 1))

// First result
const firstUser = await db.select()
  .from(users)
  .limit(1)
  .then(rows => rows[0])

// Select specific columns
const names = await db.select({
  id: users.id,
  name: users.name
}).from(users)

// Complex where
const results = await db.select()
  .from(users)
  .where(and(
    eq(users.active, true),
    or(
      like(users.email, '%@gmail.com'),
      like(users.email, '%@example.com')
    )
  ))

// Comparison operators
const recent = await db.select()
  .from(posts)
  .where(gt(posts.createdAt, new Date('2024-01-01')))

// Between
const ranged = await db.select()
  .from(posts)
  .where(between(posts.id, 10, 20))

// In array
const specific = await db.select()
  .from(users)
  .where(inArray(users.id, [1, 2, 3]))

// Is null
const noAuthor = await db.select()
  .from(posts)
  .where(isNull(posts.authorId))

// Order and limit
const topPosts = await db.select()
  .from(posts)
  .orderBy(desc(posts.createdAt))
  .limit(10)
  .offset(0)
```

### Joins
```typescript
// Inner join
const postsWithAuthors = await db.select({
  post: posts,
  author: users
})
.from(posts)
.innerJoin(users, eq(posts.authorId, users.id))

// Left join
const allPostsWithAuthors = await db.select({
  postTitle: posts.title,
  authorName: users.name
})
.from(posts)
.leftJoin(users, eq(posts.authorId, users.id))

// Multiple joins
const fullData = await db.select()
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .leftJoin(postTags, eq(posts.id, postTags.postId))
  .leftJoin(tags, eq(postTags.tagId, tags.id))
```

### Query with Relations
```typescript
// Using query builder (requires relations setup)
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true
  }
})

const singleUser = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: [desc(posts.createdAt)],
      limit: 5
    }
  }
})

// Nested relations
const postsWithAll = await db.query.posts.findMany({
  with: {
    author: true,
    postTags: {
      with: {
        tag: true
      }
    }
  }
})
```

### Aggregations
```typescript
import { count, sum, avg, min, max } from 'drizzle-orm'

// Count
const userCount = await db.select({ count: count() }).from(users)

// Count with condition
const activeCount = await db.select({ count: count() })
  .from(users)
  .where(eq(users.active, true))

// Group by
const postsByAuthor = await db.select({
  authorId: posts.authorId,
  postCount: count()
})
.from(posts)
.groupBy(posts.authorId)

// Having
const prolificAuthors = await db.select({
  authorId: posts.authorId,
  postCount: count()
})
.from(posts)
.groupBy(posts.authorId)
.having(gt(count(), 5))
```

## Mutations

### Insert
```typescript
// Insert single
const [newUser] = await db.insert(users)
  .values({
    name: 'John',
    email: 'john@example.com'
  })
  .returning()

// Insert multiple
await db.insert(users)
  .values([
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' }
  ])

// Upsert (on conflict)
await db.insert(users)
  .values({ name: 'John', email: 'john@example.com' })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: 'John Updated' }
  })

// On conflict do nothing
await db.insert(users)
  .values({ name: 'John', email: 'john@example.com' })
  .onConflictDoNothing()
```

### Update
```typescript
// Update with returning
const [updated] = await db.update(users)
  .set({ name: 'Updated Name' })
  .where(eq(users.id, 1))
  .returning()

// Update multiple columns
await db.update(users)
  .set({
    name: 'New Name',
    active: false,
    updatedAt: new Date()
  })
  .where(eq(users.id, 1))

// Increment
await db.update(posts)
  .set({ views: sql`${posts.views} + 1` })
  .where(eq(posts.id, 1))
```

### Delete
```typescript
// Delete
await db.delete(users)
  .where(eq(users.id, 1))

// Delete with returning
const [deleted] = await db.delete(users)
  .where(eq(users.id, 1))
  .returning()

// Delete all (careful!)
await db.delete(users)
```

## Transactions

```typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users)
    .values({ name: 'John', email: 'john@example.com' })
    .returning()

  await tx.insert(posts)
    .values({ title: 'First Post', authorId: user.id })

  // Automatic rollback on error
})

// Nested transactions (savepoints)
await db.transaction(async (tx) => {
  await tx.insert(users).values({ name: 'User 1', email: 'u1@example.com' })

  try {
    await tx.transaction(async (tx2) => {
      await tx2.insert(users).values({ name: 'User 2', email: 'u2@example.com' })
      throw new Error('Rollback inner')
    })
  } catch {
    // Inner transaction rolled back, outer continues
  }

  await tx.insert(users).values({ name: 'User 3', email: 'u3@example.com' })
})
```

## Raw SQL

```typescript
import { sql } from 'drizzle-orm'

// Raw query
const result = await db.execute(sql`
  SELECT * FROM users WHERE email ILIKE ${`%${searchTerm}%`}
`)

// Raw in select
const withCustom = await db.select({
  id: users.id,
  fullInfo: sql<string>`${users.name} || ' <' || ${users.email} || '>'`
}).from(users)

// Subquery
const subquery = db.select({ authorId: posts.authorId })
  .from(posts)
  .groupBy(posts.authorId)
  .having(gt(count(), 5))
  .as('prolific')

const prolificUsers = await db.select()
  .from(users)
  .innerJoin(subquery, eq(users.id, subquery.authorId))
```

## Migrations

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  }
} satisfies Config
```

```bash
# Generate migration
bun drizzle-kit generate:pg

# Push schema directly (dev)
bun drizzle-kit push:pg

# Run migrations
bun drizzle-kit migrate

# Studio (GUI)
bun drizzle-kit studio
```

## Type Inference

```typescript
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

// Infer types from schema
type User = InferSelectModel<typeof users>
type NewUser = InferInsertModel<typeof users>

// Use in functions
async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning()
  return user
}
```
