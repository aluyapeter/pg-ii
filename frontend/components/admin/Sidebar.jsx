"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Analytics", href: "/admin/dashboard/analytics" },
  { name: "Manage Posts", href: "/admin/dashboard/posts" },
  { name: "Create Post", href: "/admin/dashboard/create" },
  { name: "Comments", href: "/admin/dashboard/comments" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      
      // Tell the FastAPI backend to delete the access_token cookie
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      
    } catch (err) {
      console.error("Backend logout failed, but clearing local state anyway.");
    } finally {
      // Destroy the frontend auth breadcrumb we created earlier
      localStorage.removeItem("admin_token");
      
      // Redirect back to the login page
      router.push("/admin");
    }
  };

  return (
    <>
      <div className={styles.mobileHeader}>
        <div className={styles.brand}>The Plog</div>
        <button 
          className={styles.hamburgerBtn} 
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
      </div>

      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`} 
        onClick={() => setIsOpen(false)} 
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.brand}>The Plog Admin</div>
        <nav>
          <ul className={styles.navList}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin/dashboard");
              
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                    onClick={() => setIsOpen(false)} // Closes the drawer immediately on click
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <button 
            className={styles.logoutBtn} 
            onClick={() => {
              setIsOpen(false); // Closes the mobile drawer as it logs out
              handleLogout();
            }}
          >
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}