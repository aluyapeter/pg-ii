import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, Text, ForeignKey, func
from app.core.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    post_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"), 
        nullable=False, 
        index=True
    )
    author_name: Mapped[str] = mapped_column(String(100), nullable=False)
    author_email: Mapped[str | None] = mapped_column(String(255), nullable=True) 
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    post: Mapped["Post"] = relationship("Post", back_populates="comments")