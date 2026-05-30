from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.models.post import Post
from app.models.post_view import PostView
from app.api.auth import get_current_admin

router = APIRouter()

@router.get("")
async def get_analytics_dashboard(
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    """Admin ONLY: Fetch aggregated traffic data."""
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)

    views_stmt = (
        select(Post.title, func.count(PostView.id).label("total_views"))
        .outerjoin(PostView, Post.id == PostView.post_id)
        .group_by(Post.id)
        .order_by(func.count(PostView.id).desc())
    )
    views_result = await db.execute(views_stmt)
    post_views = [{"title": row.title, "views": row.total_views} for row in views_result.all()]

    ref_stmt = (
        select(PostView.referrer, func.count(PostView.id).label("ref_count"))
        .where(PostView.created_at >= thirty_days_ago)
        .group_by(PostView.referrer)
        .order_by(func.count(PostView.id).desc())
        .limit(10)
    )
    ref_result = await db.execute(ref_stmt)
    referrers = [{"referrer": row.referrer, "count": row.ref_count} for row in ref_result.all()]

    date_stmt = (
        select(
            cast(PostView.created_at, Date).label("view_date"), 
            func.count(PostView.id).label("daily_views")
        )
        .where(PostView.created_at >= thirty_days_ago)
        .group_by(cast(PostView.created_at, Date))
        .order_by(cast(PostView.created_at, Date).asc()) # Ensure chronological order
    )
    date_result = await db.execute(date_stmt)
    
    daily_traffic = [{"date": str(row.view_date), "views": row.daily_views} for row in date_result.all()]

    return {
        "post_views": post_views,
        "top_referrers": referrers,
        "daily_traffic": daily_traffic
    }