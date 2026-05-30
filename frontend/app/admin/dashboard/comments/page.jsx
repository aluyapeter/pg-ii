"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./Comments.module.scss";
import Link from "next/link";

export default function CommentsModeration() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCommentsData = useCallback(async () => {
    const res = await fetch(`${baseUrl}/api/comments/admin/all`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to authenticate or fetch comments");
    return res.json();
  }, [baseUrl]); 

  useEffect(() => {
    let isMounted = true; 

    const initFetch = async () => {
      try {
        const data = await fetchCommentsData();
        if (isMounted) setComments(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initFetch();

    return () => {
      isMounted = false; 
    };
  }, [fetchCommentsData]); 

  const revertState = async () => {
    try {
      const data = await fetchCommentsData();
      setComments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  async function handleApprove(id) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_approved: true } : c))
    );

    try {
      const res = await fetch(`${baseUrl}/api/comments/${id}/approve`, {
        method: "PUT",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to approve");
    } catch (err) {
      alert("Error approving comment. Reverting state.");
      revertState(); 
    }
  }

  async function confirmDelete() {
    if (!commentToDelete) return;
    setIsDeleting(true);

    setComments((prev) => prev.filter((c) => c.id !== commentToDelete));

    try {
      const res = await fetch(`${baseUrl}/api/comments/${commentToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      alert("Error deleting comment. Reverting state.");
      revertState(); 
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  }

  if (loading) return <div style={{ padding: "2rem" }}>Loading comments...</div>;
  if (error) return <div style={{ padding: "2rem", color: "var(--color-error)" }}>{error}</div>;

  return (
    <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <div className={styles.header}>
        <h1>Comments Moderation</h1>
        <span style={{ color: "var(--color-muted)" }}>
          {comments.filter((c) => !c.is_approved).length} Pending Review
        </span>
      </div>

      {comments.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>All caught up!</h2>
          <p>There are no comments awaiting moderation.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {comments.map((comment) => (
            <article
              key={comment.id}
              className={`${styles.card} ${!comment.is_approved ? styles.unapproved : ""}`}
            >
              <div className={styles.meta}>
                <div className={styles.authorInfo}>
                  <strong>{comment.author_name}</strong>
                  {comment.author_email && <span>{comment.author_email}</span>}
                  <span>
                    {new Date(comment.created_at).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric", 
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>

                <span className={`${styles.badge} ${comment.is_approved ? styles.approved : styles.pending}`}>
                  {comment.is_approved ? "Approved" : "Pending Review"}
                </span>
              </div>
              
              {comment.post && (
                <Link href={`/blog/${comment.post.slug}`} target="_blank" className={styles.postContext}>
                  📄 On post: {comment.post.title}
                </Link>
              )}

              <p className={styles.content}>{comment.content}</p>

              <div className={styles.actions}>
                <button
                  onClick={() => setCommentToDelete(comment.id)}
                  className={`${styles.btn} ${styles.deleteBtn}`}
                  aria-label={`Delete comment by ${comment.author_name}`}
                >
                  Delete
                </button>

                {!comment.is_approved && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className={`${styles.btn} ${styles.approveBtn}`}
                    aria-label={`Approve comment by ${comment.author_name}`}
                  >
                    Approve & Publish
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {commentToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalSmall}>
            <h2>Are you sure?</h2>
            <p>This action cannot be undone. The comment will be permanently deleted.</p>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setCommentToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmDeleteBtn} 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, delete it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}