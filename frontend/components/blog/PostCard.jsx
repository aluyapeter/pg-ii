import Link from "next/link";
import Image from "next/image"; 
import styles from "./PostCard.module.scss";

export default function PostCard({ post, priority }) {
  return (
    <article className={styles.card} aria-labelledby={`post-title-${post.id}`}>
      {post.cover_image && (
        <div className={styles.cover} aria-hidden="true">
          <Image
            src={post.cover_image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.coverImg}
            priority={priority}
          />
        </div>
      )}
      
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category} aria-label={`Category: ${post.category}`}>
            {post.category}
          </span>
          <span aria-hidden="true" className={styles.dot}>·</span>
          <time dateTime={post.created_at} className={styles.date}>
            {new Date(post.created_at).toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </time>
        </div>
        
        <h2 id={`post-title-${post.id}`} className={styles.title}>{post.title}</h2>
        <p className={styles.summary}>{post.summary}</p>
        
        <div className={styles.footer}>
          <span aria-label={`${post.read_time} minute read`} className={styles.readTime}>
            🕐 {post.read_time} min read
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className={styles.readBtn}
            aria-label={`Read post: ${post.title}`}
          >
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}