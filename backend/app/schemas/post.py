import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class PostBase(BaseModel):
    title: str = Field(..., max_length=300)
    slug: str = Field(..., max_length=350)
    content: str
    cover_image: str | None = None
    summary: str | None = Field(None, max_length=500)
    category: str = Field(..., max_length=100)
    read_time: int = 1
    is_published: bool = False
    analytics_public: bool = False
    scheduled_at: datetime | None = None

class PostCreate(BaseModel):
    title: str = Field(..., max_length=300)
    slug: Optional[str] = None
    content: str
    cover_image: str | None = None
    summary: str | None = Field(None, max_length=500)
    category: str = Field(..., max_length=100)
    read_time: int = 1
    is_published: bool = False
    analytics_public: bool = False
    scheduled_at: datetime | None = None
    

class PostUpdate(BaseModel):
    title: str | None = Field(None, max_length=300)
    slug: str | None = Field(None, max_length=350)
    content: str | None = None
    cover_image: str | None = None
    summary: str | None = Field(None, max_length=500)
    category: str | None = Field(None, max_length=100)
    read_time: int | None = None
    is_published: bool | None = None
    analytics_public: bool | None = None
    scheduled_at: datetime | None = None

class PostResponse(PostBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=300)
    slug: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    summary: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    read_time: Optional[int] = None
    is_published: Optional[bool] = None
    analytics_public: Optional[bool] = None
    scheduled_at: Optional[datetime] = None