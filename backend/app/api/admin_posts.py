from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.schemas import PostUpdate

from app.core.database import get_db
from app.models.post import Post
from app.api.auth import get_current_admin 

router = APIRouter()

@router.get("")
async def get_all_admin_posts(
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    """Admin ONLY: Fetches all posts (drafts, scheduled, published)."""
    stmt = select(Post).order_by(Post.created_at.desc())
    result = await db.execute(stmt)
    
    return result.scalars().all()

@router.get("/{post_id}")
async def get_single_admin_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    stmt = select(Post).where(Post.id == post_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}")
async def update_admin_post(
    post_id: str,
    post_data: PostUpdate,
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    stmt = select(Post).where(Post.id == post_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    update_data = post_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(post, key, value)

    await db.commit()
    await db.refresh(post)
    return post