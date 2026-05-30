"use client";

import { useEffect, useState } from "react";
import styles from "./Analytics.module.scss";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/admin/analytics`, {
          credentials: "include", 
        });

        if (!res.ok) throw new Error("Failed to load analytics");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) return <div className={styles.status}>Loading metrics...</div>;
  if (error) return <div className={styles.status}>Error: {error}</div>;

  // Calculate the highest traffic day so we can scale the CSS bars proportionally
  const maxViews = Math.max(...data.daily_traffic.map(d => d.views), 1);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Analytics Overview</h1>
      </header>

      <section className={styles.chartSection}>
        <h2>Daily Traffic (30 Days)</h2>
        <div className={styles.chartContainer}>
          {data.daily_traffic.length === 0 ? (
            <p>No traffic recorded.</p>
          ) : (
            <div className={styles.bars}>
              {data.daily_traffic.map((day) => {
                const heightPercent = `${(day.views / maxViews) * 100}%`;
                return (
                  <div key={day.date} className={styles.barWrapper} title={`${day.views} views on ${day.date}`}>
                    <div 
                      className={styles.bar} 
                      style={{ height: heightPercent }}
                    ></div>
                    <span className={styles.label}>{day.date.split("-")[2]}</span> {/* Just show the day number */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>Top Referrers</h2>
          <table className={styles.table}>
            <thead>
              <tr><th>Source</th><th>Visits</th></tr>
            </thead>
            <tbody>
              {data.top_referrers.map((ref, i) => (
                <tr key={i}>
                  <td className={styles.truncate}>{ref.referrer}</td>
                  <td>{ref.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.card}>
          <h2>Post Performance</h2>
          <table className={styles.table}>
            <thead>
              <tr><th>Post Title</th><th>Views</th></tr>
            </thead>
            <tbody>
              {data.post_views.map((post, i) => (
                <tr key={i}>
                  <td className={styles.truncate}>{post.title}</td>
                  <td>{post.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}