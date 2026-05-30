import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class PostBrief(BaseModel):
    title: str
    slug: str
    model_config = ConfigDict(from_attributes=True)
    
class CommentBase(BaseModel):
    author_name: str = Field(default="Anonymous", max_length=100)
    author_email: EmailStr | None = None 
    content: str = Field(..., min_length=1, max_length=2000) 

class CommentCreate(CommentBase):
    post_id: uuid.UUID

class CommentUpdate(BaseModel):
    is_approved: bool

class CommentResponse(CommentBase):
    id: uuid.UUID
    post_id: uuid.UUID
    is_approved: bool
    created_at: datetime

    post: PostBrief | None = None 

    model_config = ConfigDict(from_attributes=True)