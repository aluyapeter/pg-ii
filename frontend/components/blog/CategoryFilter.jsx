"use client";

import { useState, useId } from "react";
import PostCard from "./PostCard";
import styles from "./CategoryFilter.module.scss";

export default function CategoryFilter({ categories, allPosts }) {
  const [active, setActive] = useState("All");
  const statusId = useId();

  // Filter the posts based on the currently active category state
  const filtered = active === "All" 
    ? allPosts 
    : allPosts.filter(p => p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter posts by category" className={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={`${styles.pill} ${active === cat ? styles.pillActive : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ACCESSIBILITY: This hidden div announces filter changes to screen readers */}
      <div id={statusId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {`Showing ${filtered.length} ${active === "All" ? "" : active} post${filtered.length !== 1 ? "s" : ""}`}
      </div>

      <ul className={styles.grid} aria-label={`${active} posts`}>
        {filtered.map((post, index) => (
          <li key={post.id}><PostCard post={post} priority={index === 0} /></li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className={styles.empty}>No posts in this category yet.</p>
      )}
    </div>
  );
}