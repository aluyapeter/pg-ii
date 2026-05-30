"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.scss";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    console.log("React is alive and intercepting!");
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", form.username);
    formData.append("password", form.password);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
        credentials: "include", 
      });

      if (!res.ok) {
        setError("Invalid username or password");
        return;
      }

      localStorage.setItem("admin_token", "true");
      router.push("/admin/dashboard");
      
    } catch (err) {
      setError("Something went wrong connecting to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Admin Login</h1>
        
        {/* Accessible error announcement */}
        {error && <div role="alert" className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="admin-username">Username</label>
            <input 
              id="admin-username" 
              type="text" 
              autoComplete="username"
              value={form.username} 
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))} 
              required 
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="admin-password">Password</label>
            <input 
              id="admin-password" 
              type="password" 
              autoComplete="current-password"
              value={form.password} 
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
              required 
            />
          </div>
          <button 
            type="submit"
            disabled={loading} 
            aria-busy={loading} 
            className={styles.btn}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}