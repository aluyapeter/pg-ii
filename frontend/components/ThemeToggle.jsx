"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from './ThemeToggle.module.scss'; // Import our new styles

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Return a structural placeholder of the exact same size to prevent layout shift before React hydrates
  if (!mounted) {
    return <div className={styles.switch} aria-hidden="true" />; 
  }

  const isDark = theme === "dark";

  return (
    <button
      className={`${styles.switch} ${isDark ? styles.dark : ''}`.trim()}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      role="switch"
      aria-checked={isDark}
    >
      {/* The sliding circle */}
      <div className={styles.knob}>
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}

// "use client";

// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";

// export default function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   // wait until the component mounts on the client before rendering the button.
//   // This prevents hydration mismatch errors between the server and client.
//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setMounted(true);
//   }, []);

//   if (!mounted) return <button style={{ width: "50px", height: "30px" }} />; // Placeholder

//   return (
//     <button
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       aria-label="Toggle Dark Mode"
//       style={{
//         background: "transparent",
//         border: "1px solid var(--color-border)",
//         color: "var(--color-body)",
//         padding: "0.5rem",
//         borderRadius: "6px",
//         cursor: "pointer",
//         fontWeight: "bold"
//       }}
//     >
//       {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
//     </button>
//   );
// }