import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from app.api.auth import get_current_admin

router = APIRouter()

@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(comment_in: CommentCreate, db: AsyncSession = Depends(get_db)):
    """Public: Submit a new comment. It defaults to unapproved (invisible)."""
    stmt = select(Post).where(Post.id == comment_in.post_id)
    result = await db.execute(stmt)
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_comment = Comment(**comment_in.model_dump())
    db.add(db_comment)
    await db.commit()
    
    # CRITICAL FIX: Re-fetch the comment with the attached Post before returning
    stmt_eager = select(Comment).where(Comment.id == db_comment.id).options(selectinload(Comment.post))
    res_eager = await db.execute(stmt_eager)
    
    return res_eager.scalars().first()


@router.get("/post/{post_id}", response_model=List[CommentResponse])
async def get_approved_comments(post_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Public: Fetch ONLY approved comments for a specific post."""
    stmt = (
        select(Comment)
        .where(
            Comment.post_id == post_id,
            Comment.is_approved == True
        )
        .options(selectinload(Comment.post)) 
        .order_by(Comment.created_at.asc()) # Oldest first
    )
    
    result = await db.execute(stmt)
    return result.scalars().all()


# --- PROTECTED ADMIN ROUTES (JWT Required) ---

@router.get("/admin/all", response_model=List[CommentResponse])
async def get_all_comments(
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin) 
):
    """Admin: Fetch all comments, showing unapproved (pending) ones first."""
    stmt = (
        select(Comment)
        .options(selectinload(Comment.post)) 
        .order_by(Comment.is_approved.asc(), Comment.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.put("/{comment_id}/approve", response_model=CommentResponse)
async def approve_comment(
    comment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    """Admin: Toggle a comment's approval status to True."""
    stmt = select(Comment).where(Comment.id == comment_id).options(selectinload(Comment.post))
    result = await db.execute(stmt)
    db_comment = result.scalars().first()
    
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
        
    db_comment.is_approved = True
    await db.commit()
    
    return db_comment

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    """Admin: Permanently delete a spam comment."""
    stmt = select(Comment).where(Comment.id == comment_id)
    result = await db.execute(stmt)
    db_comment = result.scalars().first()
    
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
        
    await db.delete(db_comment)
    await db.commit()
    return None