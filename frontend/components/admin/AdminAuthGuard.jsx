"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const [isAuthorised, setIsAuthorised] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // Pushes execution out of the synchronous render thread
      await Promise.resolve();

      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        router.replace("/admin");
      } else if (isMounted) {
        setIsAuthorised(true);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Prevent a flash of the dashboard before the redirect happens
  if (!isAuthorised) return null;

  // If authorised, render whatever is wrapped inside this component
  return <>{children}</>;
}