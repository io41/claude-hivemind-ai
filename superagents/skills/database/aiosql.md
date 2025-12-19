# aiosql - SQL in Python

Simple SQL file management for Python with async support.

## Setup

```bash
pip install aiosql asyncpg  # PostgreSQL
pip install aiosql aiosqlite  # SQLite
```

## SQL File Organization

```
queries/
├── users.sql
├── posts.sql
└── analytics.sql
```

## Writing Queries

```sql
-- queries/users.sql

-- name: get_user_by_id^
-- Get a single user by ID
SELECT id, name, email, created_at
FROM users
WHERE id = :user_id;

-- name: list_users
-- Get all users with pagination
SELECT id, name, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset;

-- name: create_user<!
-- Create a new user and return the ID
INSERT INTO users (name, email)
VALUES (:name, :email)
RETURNING id;

-- name: update_user!
-- Update user details
UPDATE users
SET name = :name, email = :email, updated_at = NOW()
WHERE id = :user_id;

-- name: delete_user!
-- Delete a user
DELETE FROM users WHERE id = :user_id;

-- name: count_users$
-- Count total users
SELECT COUNT(*) FROM users;

-- name: search_users
-- Search users by name
SELECT id, name, email
FROM users
WHERE name ILIKE '%' || :query || '%';
```

## Query Markers

| Marker | Description | Returns |
|--------|-------------|---------|
| (none) | Select many | List of rows |
| `^` | Select one | Single row or None |
| `$` | Select scalar | Single value |
| `!` | Execute (no return) | Row count |
| `<!` | Execute returning | Inserted row(s) |
| `*!` | Execute many | None |
| `#` | Script (multiple statements) | None |

## Loading Queries

```python
import aiosql
import asyncpg

# Load queries
queries = aiosql.from_path("queries", "asyncpg")

# List available queries
print(queries.available_queries)
# ['get_user_by_id', 'list_users', 'create_user', ...]
```

## Using with asyncpg (PostgreSQL)

```python
import asyncpg
import aiosql

queries = aiosql.from_path("queries", "asyncpg")

async def main():
    pool = await asyncpg.create_pool(
        "postgresql://user:pass@localhost/db"
    )

    async with pool.acquire() as conn:
        # Single row (^)
        user = await queries.get_user_by_id(conn, user_id=1)
        print(user)  # Record(id=1, name='John', ...)

        # Multiple rows
        users = await queries.list_users(conn, limit=10, offset=0)
        for user in users:
            print(user['name'])

        # Insert returning (<!)
        new_id = await queries.create_user(
            conn,
            name="Jane",
            email="jane@example.com"
        )
        print(f"Created user {new_id}")

        # Execute (!)
        await queries.update_user(
            conn,
            user_id=1,
            name="John Updated",
            email="john.updated@example.com"
        )

        # Scalar ($)
        total = await queries.count_users(conn)
        print(f"Total users: {total}")
```

## Using with aiosqlite (SQLite)

```python
import aiosqlite
import aiosql

queries = aiosql.from_path("queries", "aiosqlite")

async def main():
    async with aiosqlite.connect("app.db") as db:
        db.row_factory = aiosqlite.Row

        user = await queries.get_user_by_id(db, user_id=1)
        users = await queries.list_users(db, limit=10, offset=0)

        await queries.create_user(db, name="Jane", email="jane@example.com")
        await db.commit()
```

## With FastAPI

```python
from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
import asyncpg
import aiosql

queries = aiosql.from_path("queries", "asyncpg")
pool: asyncpg.Pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL)
    yield
    await pool.close()

app = FastAPI(lifespan=lifespan)

async def get_conn():
    async with pool.acquire() as conn:
        yield conn

@app.get("/users/{user_id}")
async def get_user(user_id: int, conn = Depends(get_conn)):
    user = await queries.get_user_by_id(conn, user_id=user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return dict(user)

@app.get("/users")
async def list_users(
    limit: int = 20,
    offset: int = 0,
    conn = Depends(get_conn)
):
    users = await queries.list_users(conn, limit=limit, offset=offset)
    return [dict(u) for u in users]

@app.post("/users")
async def create_user(data: CreateUser, conn = Depends(get_conn)):
    user_id = await queries.create_user(
        conn,
        name=data.name,
        email=data.email
    )
    return {"id": user_id}
```

## Transactions

```python
async def transfer_funds(from_id: int, to_id: int, amount: float):
    async with pool.acquire() as conn:
        async with conn.transaction():
            await queries.debit_account(conn, user_id=from_id, amount=amount)
            await queries.credit_account(conn, user_id=to_id, amount=amount)
            # Commits automatically, rolls back on exception
```

## Bulk Operations

```sql
-- name: bulk_create_users*!
-- Insert multiple users
INSERT INTO users (name, email)
VALUES (:name, :email);
```

```python
users_data = [
    {"name": "Alice", "email": "alice@example.com"},
    {"name": "Bob", "email": "bob@example.com"},
    {"name": "Charlie", "email": "charlie@example.com"},
]

await queries.bulk_create_users(conn, users_data)
```

## Complex Queries

```sql
-- name: get_user_with_posts^
-- Get user with their recent posts
SELECT
    u.id,
    u.name,
    u.email,
    COALESCE(
        json_agg(
            json_build_object(
                'id', p.id,
                'title', p.title,
                'created_at', p.created_at
            )
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
    ) as posts
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
WHERE u.id = :user_id
GROUP BY u.id;

-- name: get_analytics
-- Get user activity analytics
WITH daily_activity AS (
    SELECT
        DATE(created_at) as date,
        COUNT(*) as actions
    FROM user_actions
    WHERE user_id = :user_id
        AND created_at >= :start_date
        AND created_at < :end_date
    GROUP BY DATE(created_at)
)
SELECT
    date,
    actions,
    SUM(actions) OVER (ORDER BY date) as cumulative
FROM daily_activity
ORDER BY date;
```

## Schema Management

```sql
-- queries/schema.sql

-- name: create_tables#
-- Create all tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
```

```python
# Run schema setup
await queries.create_tables(conn)
```

## Record to Dict/Pydantic

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

# asyncpg Record to dict
user_record = await queries.get_user_by_id(conn, user_id=1)
user_dict = dict(user_record)
user = User(**user_dict)

# Or use model_validate
user = User.model_validate(dict(user_record))
```

## Testing

```python
import pytest
import aiosqlite

@pytest.fixture
async def db():
    async with aiosqlite.connect(":memory:") as db:
        db.row_factory = aiosqlite.Row
        await queries.create_tables(db)
        yield db

@pytest.mark.anyio
async def test_create_user(db):
    user_id = await queries.create_user(
        db,
        name="Test",
        email="test@example.com"
    )
    await db.commit()

    user = await queries.get_user_by_id(db, user_id=user_id)
    assert user["name"] == "Test"
```
