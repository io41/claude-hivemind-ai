# Python Service Skill (FastAPI)

## When to Use
- REST API services in Python
- DigitalOcean App Platform / Jobs
- Services requiring Python libraries
- Quick prototyping with Python

## Technology Stack
- **FastAPI** - Modern async web framework
- **Pydantic** - Data validation
- **aiosql** - Async SQL (see [aiosql.md](aiosql.md))
- **httpx** - Async HTTP client
- **uvicorn** - ASGI server

## Setup

```bash
# Create project
mkdir my-service && cd my-service
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic httpx python-dotenv

# Create requirements.txt
pip freeze > requirements.txt
```

## Basic FastAPI App

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn

app = FastAPI(
    title="My API",
    version="1.0.0"
)

class User(BaseModel):
    id: int
    name: str
    email: EmailStr

class CreateUser(BaseModel):
    name: str
    email: EmailStr

@app.get("/")
async def root():
    return {"status": "ok"}

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    # Fetch from database
    return User(id=user_id, name="John", email="john@example.com")

@app.post("/users", response_model=User, status_code=201)
async def create_user(data: CreateUser):
    # Create in database
    return User(id=1, **data.model_dump())

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

## Request Handling

### Path Parameters
```python
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}

@app.get("/files/{file_path:path}")
async def get_file(file_path: str):
    return {"path": file_path}
```

### Query Parameters
```python
from typing import Optional, List

@app.get("/users")
async def list_users(
    skip: int = 0,
    limit: int = 20,
    sort: Optional[str] = None,
    tags: List[str] = []
):
    return {"skip": skip, "limit": limit, "sort": sort, "tags": tags}
```

### Request Body
```python
from pydantic import BaseModel, Field

class CreateItem(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    description: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"name": "Widget", "price": 9.99}
            ]
        }
    }

@app.post("/items")
async def create_item(item: CreateItem):
    return item
```

## Response Models

```python
from pydantic import BaseModel
from typing import List, Generic, TypeVar
from datetime import datetime

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    per_page: int

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {
        "from_attributes": True  # For ORM objects
    }

@app.get("/users", response_model=PaginatedResponse[UserResponse])
async def list_users(page: int = 1, per_page: int = 20):
    users = await fetch_users(page, per_page)
    total = await count_users()
    return {
        "items": users,
        "total": total,
        "page": page,
        "per_page": per_page
    }
```

## Error Handling

```python
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

# Raise HTTP errors
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await find_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

# Custom exception
class NotFoundError(Exception):
    def __init__(self, resource: str, id: int):
        self.resource = resource
        self.id = id

@app.exception_handler(NotFoundError)
async def not_found_handler(request, exc: NotFoundError):
    return JSONResponse(
        status_code=404,
        content={"error": f"{exc.resource} {exc.id} not found"}
    )

# Validation error handler
@app.exception_handler(RequestValidationError)
async def validation_handler(request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"errors": exc.errors()}
    )
```

## Dependencies

```python
from fastapi import Depends, Header
from typing import Annotated

# Simple dependency
async def get_db():
    db = Database()
    try:
        yield db
    finally:
        await db.close()

@app.get("/users")
async def list_users(db: Annotated[Database, Depends(get_db)]):
    return await db.fetch_users()

# Auth dependency
async def get_current_user(
    authorization: Annotated[str, Header()]
) -> User:
    token = authorization.replace("Bearer ", "")
    user = await verify_token(token)
    if not user:
        raise HTTPException(401, "Invalid token")
    return user

@app.get("/me")
async def me(user: Annotated[User, Depends(get_current_user)]):
    return user

# Reusable dependency
CurrentUser = Annotated[User, Depends(get_current_user)]

@app.get("/profile")
async def profile(user: CurrentUser):
    return user
```

## Middleware

```python
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import time

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware
@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    response.headers["X-Response-Time"] = f"{duration:.3f}s"
    return response
```

## Background Tasks

```python
from fastapi import BackgroundTasks

async def send_email(email: str, message: str):
    # Simulate sending email
    await asyncio.sleep(1)
    print(f"Sent to {email}: {message}")

@app.post("/users")
async def create_user(
    user: CreateUser,
    background_tasks: BackgroundTasks
):
    # Create user
    new_user = await save_user(user)

    # Queue background task
    background_tasks.add_task(
        send_email,
        user.email,
        "Welcome!"
    )

    return new_user
```

## File Uploads

```python
from fastapi import UploadFile, File
from typing import List

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(contents)
    }

@app.post("/upload-multiple")
async def upload_multiple(files: List[UploadFile] = File(...)):
    return [{"filename": f.filename} for f in files]
```

## Routers (Modular)

```python
# routers/users.py
from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/")
async def list_users():
    return []

@router.get("/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id}

# main.py
from routers import users

app.include_router(users.router)
```

## Environment Config

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    api_key: str
    debug: bool = False

    model_config = {
        "env_file": ".env"
    }

@lru_cache
def get_settings():
    return Settings()

# Usage
settings = get_settings()
```

## DigitalOcean App Platform

```yaml
# app.yaml
name: my-api
services:
  - name: api
    source:
      repo: github.com/user/repo
      branch: main
    run_command: uvicorn main:app --host 0.0.0.0 --port 8080
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
```

## DigitalOcean Jobs

```python
# job.py - For scheduled/one-off tasks
import asyncio
from config import get_settings

async def main():
    settings = get_settings()

    # Your job logic
    print("Running job...")
    await process_data()
    print("Job complete")

if __name__ == "__main__":
    asyncio.run(main())
```

```yaml
# app.yaml for job
jobs:
  - name: daily-processor
    source:
      repo: github.com/user/repo
      branch: main
    run_command: python job.py
    instance_size_slug: basic-xxs
    kind: PRE_DEPLOY  # or MANUAL, POST_DEPLOY
```

## Testing

```python
from fastapi.testclient import TestClient
import pytest

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_user():
    response = client.post("/users", json={
        "name": "John",
        "email": "john@example.com"
    })
    assert response.status_code == 201
    assert response.json()["name"] == "John"

# Async tests
@pytest.mark.anyio
async def test_async():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
```

## Related Skills
- `database/aiosql.md` - Async SQL queries
- `database` - Database patterns
- `python-analytics` - Data science/ML
