import uuid
import cloudinary
import cloudinary.uploader
from typing import List
from slugify import slugify

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.config import settings
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.api.auth import get_current_admin

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

router = APIRouter()

@router.post("/upload-image", dependencies=[Depends(get_current_admin)])
async def upload_image(file: UploadFile = File(...)):
    """Uploads an image to Cloudinary and returns the secure URL. (Admin only)"""
    try:
        file_content = await file.read()
        
        result = cloudinary.uploader.upload(
            file_content, 
            folder="productivity-gourmet"
        )
        
        return {"url": result["secure_url"]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
    
@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_in: PostCreate, 
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    """Create a new blog post. (Admin only)"""
    target_slug = post_in.slug if post_in.slug else slugify(post_in.title)
    
    stmt = select(Post).where(Post.slug == target_slug)
    result = await db.execute(stmt)
    
    if result.scalars().first():
        short_uuid = str(uuid.uuid4())[:8]
        target_slug = f"{target_slug}-{short_uuid}"
    
    post_data = post_in.model_dump(exclude={"slug"})
    
    db_post = Post(**post_data, slug=target_slug)
    
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    
    return db_post

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: uuid.UUID,
    post_in: PostUpdate,
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    """Update an existing post safely using exclude_unset. (Admin only)"""
    stmt = select(Post).where(Post.id == post_id)
    result = await db.execute(stmt)
    db_post = result.scalars().first()
    
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_data = post_in.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_post, key, value)
        
    await db.commit()
    await db.refresh(db_post)
    return db_post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    """Delete a post. (Admin only)"""
    stmt = select(Post).where(Post.id == post_id)
    result = await db.execute(stmt)
    db_post = result.scalars().first()
    
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    await db.delete(db_post)
    await db.commit()
    return None

@router.get("/", response_model=List[PostResponse])
async def get_posts(db: AsyncSession = Depends(get_db)):
    """Fetch all published blog posts."""
    stmt = select(Post).where(Post.is_published == True).order_by(Post.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{slug}", response_model=PostResponse)
async def get_post_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Fetch a single blog post by its slug."""
    stmt = select(Post).where(Post.slug == slug)
    result = await db.execute(stmt)
    post = result.scalars().first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    return post