"use client";

import { useState, useEffect } from "react";
import styles from "./CommentSection.module.scss";

// Receive postId instead of slug
export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [form, setForm] = useState({
    author_name: "",
    author_email: "",
    content: "",
    website: "", // The honeypot
  });

  useEffect(() => {
    async function fetchComments() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/comments/post/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    // Honeypot check: If a bot filled out the hidden website field, fake a success
    if (form.website !== "") {
        setStatus({ type: "success", message: "Your comment has been submitted and is awaiting moderation." });
        setSubmitting(false);
        return;
    }

    try {
      const payload = {
          author_name: form.author_name || "Anonymous",
          author_email: form.author_email || null,
          content: form.content,
          post_id: postId
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/api/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit comment.");

      setStatus({ 
        type: "success", 
        message: "Your comment has been submitted and is awaiting moderation." 
      });
      
      setForm({ author_name: "", author_email: "", content: "", website: "" });

    } catch (err) {
      setStatus({ 
        type: "error", 
        message: "Something went wrong. Please try again later." 
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.wrapper} aria-labelledby="comments-heading">
      <h2 id="comments-heading" className={styles.heading}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {!loading && comments.length > 0 && (
        <ul className={styles.list}>
          {comments.map((comment, index) => (
            <li key={index} className={styles.comment}>
              <div className={styles.meta}>
                <span className={styles.author}>{comment.author_name}</span>
                <time className={styles.date} dateTime={comment.created_at}>
                  {new Date(comment.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </time>
              </div>
              <p className={styles.body}>{comment.content}</p>
            </li>
          ))}
        </ul>
      )}

      {!loading && comments.length === 0 && (
        <p style={{ color: "var(--color-muted)", marginBottom: "3rem" }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      )}

      <div className={styles.formCard}>
        <h3 className={styles.formHeading}>Leave a Comment</h3>
        
        {status.message && (
          <div 
            role="status" 
            aria-live="polite" 
            className={status.type === "success" ? styles.success : styles.error}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="author_name">Name</label>
            <input
              id="author_name"
              type="text"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="author_email">Email (will not be published)</label>
            <input
              id="author_email"
              type="email"
              value={form.author_email}
              onChange={(e) => setForm({ ...form, author_email: e.target.value })}
            />
          </div>

          <div style={{ display: "none" }} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex="-1"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="content">Your Comment</label>
            <textarea
              id="content"
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className={styles.btn} 
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </section>
  );
}