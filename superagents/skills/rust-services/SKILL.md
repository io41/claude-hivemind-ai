# Rust Services Skill

## When to Use
- High-performance backend services
- CPU-intensive processing
- Low-latency APIs
- WebSocket servers
- Systems programming

## Technology Stack
- **Axum** - Web framework
- **Tokio** - Async runtime
- **SQLx** - Database (see [sqlx.md](sqlx.md))
- **Serde** - Serialization
- **Tower** - Middleware

## Setup

```bash
cargo new my-service
cd my-service
```

```toml
# Cargo.toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "trace"] }
tracing = "0.1"
tracing-subscriber = "0.3"
```

## Basic Axum Server

```rust
use axum::{
    routing::{get, post},
    Router, Json,
    extract::{Path, Query, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Clone)]
struct AppState {
    // Shared state
}

#[tokio::main]
async fn main() {
    tracing_subscriber::init();

    let state = Arc::new(AppState {});

    let app = Router::new()
        .route("/", get(root))
        .route("/users", get(list_users).post(create_user))
        .route("/users/:id", get(get_user).delete(delete_user))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    tracing::info!("Server running on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Hello, World!"
}
```

## Route Handlers

```rust
// Path parameters
async fn get_user(Path(id): Path<u64>) -> Json<User> {
    Json(User { id, name: "John".into() })
}

// Query parameters
#[derive(Deserialize)]
struct Pagination {
    page: Option<u32>,
    limit: Option<u32>,
}

async fn list_users(Query(params): Query<Pagination>) -> Json<Vec<User>> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(20);
    // ...
    Json(vec![])
}

// JSON body
#[derive(Deserialize)]
struct CreateUser {
    name: String,
    email: String,
}

async fn create_user(Json(payload): Json<CreateUser>) -> (StatusCode, Json<User>) {
    let user = User {
        id: 1,
        name: payload.name,
    };
    (StatusCode::CREATED, Json(user))
}
```

## Response Types

```rust
use axum::response::{IntoResponse, Response};

// Simple status
async fn health() -> StatusCode {
    StatusCode::OK
}

// JSON response
async fn json_response() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok" }))
}

// Custom response
async fn custom_response() -> Response {
    (
        StatusCode::OK,
        [("x-custom-header", "value")],
        "Body content"
    ).into_response()
}

// Result-based
async fn fallible() -> Result<Json<User>, AppError> {
    let user = get_user_from_db().await?;
    Ok(Json(user))
}
```

## Error Handling

```rust
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

#[derive(Debug)]
struct AppError(anyhow::Error);

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({
                "error": self.0.to_string()
            }))
        ).into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}

// Usage
async fn handler() -> Result<Json<Data>, AppError> {
    let data = fetch_data().await?; // ? works with AppError
    Ok(Json(data))
}
```

## Middleware

```rust
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use axum::middleware::{self, Next};
use axum::extract::Request;

// Using tower-http
let app = Router::new()
    .route("/", get(root))
    .layer(CorsLayer::permissive())
    .layer(TraceLayer::new_for_http());

// Custom middleware
async fn auth_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = request
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok());

    match auth_header {
        Some(token) if token.starts_with("Bearer ") => {
            Ok(next.run(request).await)
        }
        _ => Err(StatusCode::UNAUTHORIZED),
    }
}

let app = Router::new()
    .route("/protected", get(protected_route))
    .layer(middleware::from_fn(auth_middleware));
```

## State Management

```rust
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone)]
struct AppState {
    db: sqlx::PgPool,
    cache: Arc<RwLock<HashMap<String, String>>>,
}

async fn handler(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Data>, AppError> {
    // Use state.db for database queries
    let users = sqlx::query_as!(User, "SELECT * FROM users")
        .fetch_all(&state.db)
        .await?;

    // Use cache
    let cache = state.cache.read().await;
    if let Some(cached) = cache.get("key") {
        return Ok(Json(cached.clone()));
    }

    Ok(Json(data))
}
```

## WebSockets

```rust
use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::Response,
};
use futures::{sink::SinkExt, stream::StreamExt};

async fn ws_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        match msg {
            Ok(Message::Text(text)) => {
                // Echo back
                if socket.send(Message::Text(text)).await.is_err() {
                    break;
                }
            }
            Ok(Message::Binary(data)) => {
                // Handle binary
            }
            Ok(Message::Ping(data)) => {
                let _ = socket.send(Message::Pong(data)).await;
            }
            Ok(Message::Close(_)) | Err(_) => break,
            _ => {}
        }
    }
}

// Route
let app = Router::new()
    .route("/ws", get(ws_handler));
```

## Broadcast WebSocket

```rust
use tokio::sync::broadcast;

#[derive(Clone)]
struct AppState {
    tx: broadcast::Sender<String>,
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> Response {
    let rx = state.tx.subscribe();
    ws.on_upgrade(move |socket| handle_socket(socket, state.tx.clone(), rx))
}

async fn handle_socket(
    socket: WebSocket,
    tx: broadcast::Sender<String>,
    mut rx: broadcast::Receiver<String>,
) {
    let (mut sender, mut receiver) = socket.split();

    // Receive from broadcast and send to client
    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    // Receive from client and broadcast
    let tx_clone = tx.clone();
    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(text))) = receiver.next().await {
            let _ = tx_clone.send(text);
        }
    });

    // Wait for either task to finish
    tokio::select! {
        _ = &mut send_task => recv_task.abort(),
        _ = &mut recv_task => send_task.abort(),
    }
}
```

## Validation

```rust
use axum::extract::rejection::JsonRejection;
use validator::Validate;

#[derive(Deserialize, Validate)]
struct CreateUser {
    #[validate(length(min = 1, max = 100))]
    name: String,
    #[validate(email)]
    email: String,
    #[validate(range(min = 0, max = 150))]
    age: u8,
}

async fn create_user(
    Json(payload): Json<CreateUser>,
) -> Result<Json<User>, AppError> {
    payload.validate()?;
    // ...
}
```

## File Upload

```rust
use axum::extract::Multipart;

async fn upload(mut multipart: Multipart) -> Result<Json<UploadResult>, AppError> {
    while let Some(field) = multipart.next_field().await? {
        let name = field.name().unwrap_or("unknown").to_string();
        let file_name = field.file_name().unwrap_or("unknown").to_string();
        let content_type = field.content_type().unwrap_or("application/octet-stream");
        let data = field.bytes().await?;

        // Save file
        tokio::fs::write(format!("uploads/{}", file_name), &data).await?;
    }

    Ok(Json(UploadResult { success: true }))
}
```

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_root() {
        let app = create_app();

        let response = app
            .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_create_user() {
        let app = create_app();

        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/users")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"name":"John","email":"john@example.com"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::CREATED);
    }
}
```

## Related Skills
- `database/sqlx.md` - Database with SQLx
- `database` - General database patterns
- `api` - API design principles
