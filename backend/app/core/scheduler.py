from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy import select
from datetime import datetime, UTC
import logging

from app.core.database import AsyncSessionLocal
from app.models.post import Post

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def publish_scheduled_posts():
    """
    Runs every 60 seconds. Queries the database for posts that are NOT published, 
    have a scheduled_at date, and that date is in the past.
    """
    async with AsyncSessionLocal() as db:
        try:
            now = datetime.now(UTC)
            
            # Find all posts due for publication
            stmt = select(Post).where(
                Post.is_published == False,
                Post.scheduled_at != None,
                Post.scheduled_at <= now
            )
            result = await db.execute(stmt)
            due_posts = result.scalars().all()

            for post in due_posts:
                post.is_published = True
                logger.info(f"Auto-published scheduled post: {post.slug}")

            if due_posts:
                await db.commit()
                
        except Exception as e:
            logger.error(f"Scheduler error: {e}")
            await db.rollback()

def start_scheduler():
    """Initializes and starts the background clock."""
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        publish_scheduled_posts,
        trigger=IntervalTrigger(minutes=1),
        id="publish_scheduled_posts",
        replace_existing=True
    )
    scheduler.start()
    logger.info("Async Scheduler started — checking for scheduled posts every 60 seconds")