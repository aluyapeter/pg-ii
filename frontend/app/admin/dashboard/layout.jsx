import Sidebar from "@/components/admin/Sidebar";
import { Inter } from 'next/font/google';
import styles from "./layout.module.scss";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-admin-inter',
});

// Because there is no "use client" here, Next.js can safely read this on the server
export const metadata = {
  title: "Admin Dashboard | Productivity Gourmet",
};

export default function DashboardLayout({ children }) {
  return (
    <AdminAuthGuard>
      <div className={`${styles.dashboardWrapper} ${inter.variable}`}>
        <Sidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}