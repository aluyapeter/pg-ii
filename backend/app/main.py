from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from contextlib import asynccontextmanager
from app.core.database import engine, Base

from app.core.scheduler import start_scheduler
from app.api.auth import router as auth_router
from app.api.posts import router as posts_router
from app.api.comments import router as comments_router
from app.api.views import router as views_router
from app.api.admin_analytics import router as admin_analytics_router
from app.api.admin_posts import router as admin_posts_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)
    start_scheduler()
    yield
app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://pg-6r3k6e62g-aluyapeter7gmailcoms-projects.vercel.app"
]

frontend_url = settings.FRONTEND_URL
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts_router, prefix="/api/posts", tags=["Posts"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(comments_router, prefix="/api/comments", tags=["Comments"])
app.include_router(views_router, prefix="/api", tags=["Analytics"])
app.include_router(admin_analytics_router, prefix="/api/admin/analytics", tags=["Admin Analytics"])
app.include_router(admin_posts_router, prefix="/api/admin/posts", tags=["Admin Posts"])

@app.get("/")
async def root():
    return {"message": "Productivity Gourmet API is running", "status": "healthy"}