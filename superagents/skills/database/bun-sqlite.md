# Bun SQLite

Bun's built-in SQLite driver - fast, synchronous, zero dependencies.

## Setup

```typescript
import { Database } from 'bun:sqlite'

// File-based
const db = new Database('app.db')

// In-memory (for tests)
const db = new Database(':memory:')

// Read-only
const db = new Database('app.db', { readonly: true })

// Create if not exists (default)
const db = new Database('app.db', { create: true })
```

## Schema Setup

```typescript
// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

// Create indexes
db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`)
db.run(`CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id)`)
```

## Prepared Statements

```typescript
// Prepare once, use many times (recommended)
const findUser = db.prepare('SELECT * FROM users WHERE id = ?')
const findByEmail = db.prepare('SELECT * FROM users WHERE email = ?')
const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')

// Use
const user = findUser.get(1)
const userByEmail = findByEmail.get('john@example.com')
insertUser.run('John', 'john@example.com')
```

## Query Methods

### get() - Single row
```typescript
const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
const user = stmt.get(1)
// Returns object or undefined

// With named parameters
const stmt2 = db.prepare('SELECT * FROM users WHERE id = $id')
const user2 = stmt2.get({ $id: 1 })
```

### all() - Multiple rows
```typescript
const stmt = db.prepare('SELECT * FROM users WHERE active = ?')
const users = stmt.all(1)
// Returns array

const allUsers = db.prepare('SELECT * FROM users').all()
```

### run() - Execute (INSERT/UPDATE/DELETE)
```typescript
const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
const result = stmt.run('John', 'john@example.com')

// result = { changes: 1, lastInsertRowid: 5 }
console.log(`Inserted with ID: ${result.lastInsertRowid}`)
console.log(`Rows affected: ${result.changes}`)
```

### values() - Array of arrays
```typescript
const stmt = db.prepare('SELECT id, name FROM users')
const rows = stmt.values()
// [[1, 'John'], [2, 'Jane'], ...]
```

## Typed Results

```typescript
interface User {
  id: number
  name: string
  email: string
  active: number
  created_at: string
}

// Type the prepared statement
const findUser = db.prepare<User, [number]>('SELECT * FROM users WHERE id = ?')
const user = findUser.get(1)
// user is User | undefined

// For all()
const findActive = db.prepare<User, [number]>('SELECT * FROM users WHERE active = ?')
const users = findActive.all(1)
// users is User[]

// Named parameters
const findByEmail = db.prepare<User, { $email: string }>(
  'SELECT * FROM users WHERE email = $email'
)
const user2 = findByEmail.get({ $email: 'john@example.com' })
```

## Query Builder Pattern

```typescript
// Simple wrapper for common operations
class UserRepository {
  private db: Database

  private findById = this.db.prepare<User, [number]>(
    'SELECT * FROM users WHERE id = ?'
  )

  private findAll = this.db.prepare<User, []>('SELECT * FROM users')

  private insert = this.db.prepare<void, [string, string]>(
    'INSERT INTO users (name, email) VALUES (?, ?)'
  )

  private update = this.db.prepare<void, [string, string, number]>(
    'UPDATE users SET name = ?, email = ? WHERE id = ?'
  )

  private delete = this.db.prepare<void, [number]>(
    'DELETE FROM users WHERE id = ?'
  )

  constructor(db: Database) {
    this.db = db
  }

  getById(id: number): User | undefined {
    return this.findById.get(id)
  }

  getAll(): User[] {
    return this.findAll.all()
  }

  create(name: string, email: string): number {
    const result = this.insert.run(name, email)
    return Number(result.lastInsertRowid)
  }

  updateUser(id: number, name: string, email: string): boolean {
    const result = this.update.run(name, email, id)
    return result.changes > 0
  }

  deleteUser(id: number): boolean {
    const result = this.delete.run(id)
    return result.changes > 0
  }
}
```

## Transactions

```typescript
// Using transaction()
const transfer = db.transaction((fromId: number, toId: number, amount: number) => {
  db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(amount, fromId)
  db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(amount, toId)
})

// Call it
transfer(1, 2, 100)

// Transactions are atomic - all or nothing
// Returns whatever the function returns

// With error handling
try {
  const result = db.transaction(() => {
    // Multiple operations
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', ['A', 'a@example.com'])
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', ['B', 'b@example.com'])

    // This would cause rollback if it fails
    if (someCondition) {
      throw new Error('Rollback!')
    }

    return 'success'
  })()

  console.log(result) // 'success'
} catch (e) {
  console.log('Transaction rolled back')
}
```

### Transaction Modes

```typescript
// Immediate (default) - acquire write lock immediately
const tx = db.transaction(() => { /* ... */ })

// Deferred - acquire lock when needed
const tx = db.transaction(() => { /* ... */ }).deferred()

// Exclusive - exclusive lock
const tx = db.transaction(() => { /* ... */ }).exclusive()
```

## Bulk Operations

```typescript
// Bulk insert with transaction (fast)
const insertMany = db.transaction((users: Array<{ name: string, email: string }>) => {
  const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
  for (const user of users) {
    insert.run(user.name, user.email)
  }
})

insertMany([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@example.com' }
])
```

## WAL Mode (Recommended)

```typescript
// Enable WAL mode for better concurrent read/write
db.run('PRAGMA journal_mode = WAL')

// Other useful pragmas
db.run('PRAGMA synchronous = NORMAL')  // Balance safety/speed
db.run('PRAGMA cache_size = -64000')   // 64MB cache
db.run('PRAGMA temp_store = MEMORY')   // Temp tables in memory
```

## JSON Support

```typescript
// SQLite has built-in JSON functions
db.run(`
  CREATE TABLE IF NOT EXISTS configs (
    id INTEGER PRIMARY KEY,
    name TEXT,
    settings TEXT  -- JSON stored as text
  )
`)

// Insert JSON
const settings = JSON.stringify({ theme: 'dark', notifications: true })
db.prepare('INSERT INTO configs (name, settings) VALUES (?, ?)').run('user1', settings)

// Query JSON
const result = db.prepare(`
  SELECT json_extract(settings, '$.theme') as theme
  FROM configs WHERE name = ?
`).get('user1')

// Update JSON field
db.prepare(`
  UPDATE configs
  SET settings = json_set(settings, '$.theme', ?)
  WHERE name = ?
`).run('light', 'user1')
```

## Full-Text Search

```typescript
// Create FTS table
db.run(`
  CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts
  USING fts5(title, content, content=posts, content_rowid=id)
`)

// Populate FTS
db.run(`
  INSERT INTO posts_fts(posts_fts) VALUES('rebuild')
`)

// Keep in sync with triggers
db.run(`
  CREATE TRIGGER posts_ai AFTER INSERT ON posts BEGIN
    INSERT INTO posts_fts(rowid, title, content)
    VALUES (new.id, new.title, new.content);
  END
`)

// Search
const results = db.prepare(`
  SELECT p.* FROM posts p
  JOIN posts_fts f ON p.id = f.rowid
  WHERE posts_fts MATCH ?
  ORDER BY rank
`).all('search query')
```

## Closing

```typescript
// Close when done
db.close()

// Or use try/finally
try {
  // Use db
} finally {
  db.close()
}
```

## Testing

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { Database } from 'bun:sqlite'

describe('UserRepository', () => {
  let db: Database
  let repo: UserRepository

  beforeEach(() => {
    db = new Database(':memory:')
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      )
    `)
    repo = new UserRepository(db)
  })

  afterEach(() => {
    db.close()
  })

  test('create user', () => {
    const id = repo.create('John', 'john@example.com')
    expect(id).toBe(1)

    const user = repo.getById(id)
    expect(user?.name).toBe('John')
  })

  test('duplicate email fails', () => {
    repo.create('John', 'john@example.com')

    expect(() => {
      repo.create('Jane', 'john@example.com')
    }).toThrow()
  })
})
```
