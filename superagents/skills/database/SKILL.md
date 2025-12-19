# Database Skill

## When to Use
- Schema design and migrations
- Query optimization
- Database operations
- ORM/query builder selection

## Technology Selection

| Language | Technology | Details |
|----------|------------|---------|
| TypeScript | Drizzle ORM | See [drizzle.md](drizzle.md) |
| TypeScript | Bun SQLite | See [bun-sqlite.md](bun-sqlite.md) |
| Python | aiosql | See [aiosql.md](aiosql.md) |
| Rust | SQLx | See [sqlx.md](sqlx.md) |

**Default choice**: Drizzle for TypeScript projects (type-safe, lightweight, good DX).

## Schema Design Principles

### Naming Conventions
```sql
-- Tables: plural, snake_case
users, user_profiles, order_items

-- Columns: snake_case
first_name, created_at, is_active

-- Primary keys: id (serial/uuid)
-- Foreign keys: {table_singular}_id
user_id, order_id
```

### Essential Columns
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,           -- or UUID
    -- ... domain columns
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add trigger for updated_at (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### Indexes
```sql
-- Primary key (automatic)
-- Foreign keys
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- Frequently filtered columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_status ON orders(status);

-- Composite index (order matters)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Unique constraint
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Full-text search (PostgreSQL)
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', title || ' ' || content));
```

## Common Patterns

### Soft Deletes
```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

-- Query active only
SELECT * FROM users WHERE deleted_at IS NULL;

-- "Delete"
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- Restore
UPDATE users SET deleted_at = NULL WHERE id = 1;
```

### Pagination

#### Offset-based (simple, but slow for large offsets)
```sql
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;  -- Page 3
```

#### Cursor-based (efficient, consistent)
```sql
-- First page
SELECT * FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Next page (using last item's values as cursor)
SELECT * FROM posts
WHERE (created_at, id) < ('2024-01-15 10:00:00', 1234)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

### Optimistic Locking
```sql
ALTER TABLE posts ADD COLUMN version INTEGER DEFAULT 1;

-- Update with version check
UPDATE posts
SET title = 'New Title', version = version + 1
WHERE id = 1 AND version = 5;

-- If rows_affected = 0, someone else updated
```

### Audit Trail
```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    action TEXT NOT NULL,  -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by INTEGER,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Query Optimization

### Avoid N+1 Queries
```sql
-- BAD: N+1
SELECT * FROM users;
-- Then for each user:
SELECT * FROM posts WHERE author_id = ?;

-- GOOD: Join
SELECT u.*, p.*
FROM users u
LEFT JOIN posts p ON p.author_id = u.id;

-- GOOD: Subquery with JSON aggregation
SELECT u.*,
    (SELECT json_agg(p.*) FROM posts p WHERE p.author_id = u.id) as posts
FROM users u;
```

### Use EXPLAIN ANALYZE
```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';

-- Look for:
-- - Seq Scan (bad for large tables) vs Index Scan (good)
-- - Estimated vs actual rows
-- - Sort operations (add index if frequent)
```

### Common Optimizations
```sql
-- Use EXISTS instead of COUNT for existence check
-- BAD
SELECT COUNT(*) FROM orders WHERE user_id = 1;
-- GOOD
SELECT EXISTS(SELECT 1 FROM orders WHERE user_id = 1);

-- Use IN with small lists, JOIN with large
-- For small lists
SELECT * FROM users WHERE id IN (1, 2, 3);
-- For large lists
SELECT u.* FROM users u
JOIN unnest(ARRAY[1,2,3,...]) AS t(id) ON u.id = t.id;

-- Limit columns in SELECT
-- BAD
SELECT * FROM users;
-- GOOD
SELECT id, name, email FROM users;
```

## Transactions

### ACID Properties
- **Atomicity**: All or nothing
- **Consistency**: Valid state to valid state
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed = persisted

### Isolation Levels
```sql
-- Read Uncommitted: See uncommitted changes (dirty reads)
-- Read Committed: See only committed changes (default PostgreSQL)
-- Repeatable Read: Same reads within transaction
-- Serializable: Full isolation (slowest)

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
-- queries
COMMIT;
```

## Testing

### In-Memory Database
```typescript
// SQLite in-memory for tests
const db = new Database(':memory:')
```

### Test Fixtures
```sql
-- fixtures/users.sql
INSERT INTO users (id, name, email) VALUES
(1, 'Test User', 'test@example.com'),
(2, 'Admin', 'admin@example.com');
```

### Clean Between Tests
```typescript
beforeEach(async () => {
    // Order matters due to foreign keys
    await db.delete(posts)
    await db.delete(users)
})

// Or use transactions
beforeEach(async () => {
    await db.execute('BEGIN')
})
afterEach(async () => {
    await db.execute('ROLLBACK')
})
```

## Related Files
- [drizzle.md](drizzle.md) - Drizzle ORM for TypeScript
- [bun-sqlite.md](bun-sqlite.md) - Bun's built-in SQLite
- [sqlx.md](sqlx.md) - SQLx for Rust
- [aiosql.md](aiosql.md) - aiosql for Python
