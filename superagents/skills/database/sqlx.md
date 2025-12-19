# SQLx for Rust

Async SQL toolkit with compile-time checked queries.

## Setup

```toml
# Cargo.toml
[dependencies]
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres", "uuid", "chrono"] }
```

```bash
# Install CLI
cargo install sqlx-cli

# Create database
sqlx database create

# Run migrations
sqlx migrate run
```

## Connection Pool

```rust
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&std::env::var("DATABASE_URL").unwrap())
        .await?;

    Ok(())
}
```

## Compile-Time Checked Queries

```rust
// Requires DATABASE_URL at compile time
// Run: cargo sqlx prepare --workspace

// Single row
let user = sqlx::query_as!(
    User,
    "SELECT id, name, email FROM users WHERE id = $1",
    user_id
)
.fetch_one(&pool)
.await?;

// Optional row
let user = sqlx::query_as!(
    User,
    "SELECT id, name, email FROM users WHERE id = $1",
    user_id
)
.fetch_optional(&pool)
.await?;

// Multiple rows
let users = sqlx::query_as!(
    User,
    "SELECT id, name, email FROM users WHERE active = $1",
    true
)
.fetch_all(&pool)
.await?;

// Streaming
let mut stream = sqlx::query_as!(
    User,
    "SELECT * FROM users"
)
.fetch(&pool);

while let Some(user) = stream.try_next().await? {
    println!("{:?}", user);
}
```

## Dynamic Queries

```rust
use sqlx::{query, query_as, FromRow};

#[derive(FromRow)]
struct User {
    id: i64,
    name: String,
    email: String,
}

// Without compile-time checking
let users: Vec<User> = query_as("SELECT * FROM users WHERE name = $1")
    .bind(name)
    .fetch_all(&pool)
    .await?;

// Scalar value
let count: (i64,) = query_as("SELECT COUNT(*) FROM users")
    .fetch_one(&pool)
    .await?;
```

## Insert/Update/Delete

```rust
// Insert returning
let user = sqlx::query_as!(
    User,
    r#"
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING id, name, email
    "#,
    name,
    email
)
.fetch_one(&pool)
.await?;

// Update
let result = sqlx::query!(
    "UPDATE users SET name = $1 WHERE id = $2",
    new_name,
    user_id
)
.execute(&pool)
.await?;

println!("Rows affected: {}", result.rows_affected());

// Delete
sqlx::query!("DELETE FROM users WHERE id = $1", user_id)
    .execute(&pool)
    .await?;
```

## Transactions

```rust
let mut tx = pool.begin().await?;

let user = sqlx::query_as!(
    User,
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    name,
    email
)
.fetch_one(&mut *tx)
.await?;

sqlx::query!(
    "INSERT INTO user_settings (user_id, theme) VALUES ($1, $2)",
    user.id,
    "dark"
)
.execute(&mut *tx)
.await?;

tx.commit().await?;

// Rollback happens automatically if tx is dropped without commit
```

## Migrations

```bash
# Create migration
sqlx migrate add create_users_table

# Generated: migrations/20231215000000_create_users_table.sql
```

```sql
-- migrations/20231215000000_create_users_table.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

```bash
# Run migrations
sqlx migrate run

# Revert last migration
sqlx migrate revert
```

## Offline Mode

```bash
# Generate query metadata for offline compilation
cargo sqlx prepare --workspace

# This creates .sqlx/ directory with query data
# Commit this to version control
```

```rust
// Queries work without DATABASE_URL at compile time
// when .sqlx/ metadata is present
```

## Type Mapping

| PostgreSQL | Rust |
|------------|------|
| BIGINT/BIGSERIAL | i64 |
| INT/SERIAL | i32 |
| SMALLINT | i16 |
| BOOLEAN | bool |
| VARCHAR/TEXT | String |
| BYTEA | Vec<u8> |
| UUID | uuid::Uuid |
| TIMESTAMPTZ | chrono::DateTime<Utc> |
| TIMESTAMP | chrono::NaiveDateTime |
| DATE | chrono::NaiveDate |
| JSONB | serde_json::Value |
| ARRAY | Vec<T> |

## Custom Types

```rust
use sqlx::Type;

#[derive(Type, Debug)]
#[sqlx(type_name = "user_role", rename_all = "lowercase")]
enum UserRole {
    Admin,
    User,
    Guest,
}

// In queries
let user = sqlx::query_as!(
    User,
    r#"SELECT id, name, role as "role: UserRole" FROM users WHERE id = $1"#,
    user_id
)
.fetch_one(&pool)
.await?;
```

## JSON Fields

```rust
use serde::{Deserialize, Serialize};
use sqlx::types::Json;

#[derive(Serialize, Deserialize)]
struct Metadata {
    theme: String,
    notifications: bool,
}

#[derive(FromRow)]
struct User {
    id: i64,
    name: String,
    metadata: Json<Metadata>,
}

// Insert JSON
sqlx::query!(
    "INSERT INTO users (name, metadata) VALUES ($1, $2)",
    name,
    Json(Metadata { theme: "dark".into(), notifications: true }) as _
)
.execute(&pool)
.await?;
```

## Error Handling

```rust
use sqlx::Error;

match result {
    Ok(user) => println!("User: {:?}", user),
    Err(Error::RowNotFound) => println!("User not found"),
    Err(Error::Database(e)) if e.is_unique_violation() => {
        println!("Duplicate entry")
    }
    Err(e) => return Err(e.into()),
}
```

## Testing

```rust
#[sqlx::test]
async fn test_create_user(pool: PgPool) -> sqlx::Result<()> {
    let user = sqlx::query_as!(
        User,
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        "Test",
        "test@example.com"
    )
    .fetch_one(&pool)
    .await?;

    assert_eq!(user.name, "Test");
    Ok(())
}

// Test with fixtures
#[sqlx::test(fixtures("users"))]
async fn test_with_fixtures(pool: PgPool) -> sqlx::Result<()> {
    // fixtures/users.sql is loaded before test
    let users = sqlx::query_as!(User, "SELECT * FROM users")
        .fetch_all(&pool)
        .await?;

    assert!(!users.is_empty());
    Ok(())
}
```

## With Axum

```rust
use axum::{extract::State, Json};
use sqlx::PgPool;

async fn list_users(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<User>>, AppError> {
    let users = sqlx::query_as!(User, "SELECT * FROM users")
        .fetch_all(&pool)
        .await?;

    Ok(Json(users))
}

// Setup
let pool = PgPoolOptions::new()
    .max_connections(5)
    .connect(&database_url)
    .await?;

let app = Router::new()
    .route("/users", get(list_users))
    .with_state(pool);
```
