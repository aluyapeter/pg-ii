import { Playwrite_GB_S, Syne, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "../styles/globals.scss";

// Handwriting font for headings
// Note: We map this to --font-serif so it automatically applies to all h1-h6 tags
const fontHeading = Playwrite_GB_S({
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

// modern sans-serif for body text
const fontSans = Syne({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Mono for code snippets
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable}`}
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}