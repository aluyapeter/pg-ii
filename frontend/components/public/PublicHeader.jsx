"use client"; // We need client-side state for the menu

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from './Container';
import ThemeToggle from '../ThemeToggle'; 
import styles from './PublicHeader.module.scss';

export default function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // stop the background from scrolling when the menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={styles.header}>
      <Container>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            Productivity Gourmet
          </Link>

          {/* Desktop nav */}
          <div className={styles.desktopNav}>
            <div className={styles.links}>
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/blog">The Plog</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <ThemeToggle />
          </div>

          {/* Hamburger button*/}
          <button 
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`.trim()} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </nav>
      </Container>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`${styles.mobileMenu} ${styles.links} ${isMobileMenuOpen ? styles.open : ''}`.trim()}>
        <Link href="/" className={styles.mobileLink} onClick={closeMenu}>Home</Link>
        <Link href="/services" className={styles.mobileLink} onClick={closeMenu}>Services</Link>
        <Link href="/blog" className={styles.mobileLink} onClick={closeMenu}>The Plog</Link>
        <Link href="/about" className={styles.mobileLink} onClick={closeMenu}>About</Link>
        <Link href="/contact" className={styles.mobileLink} onClick={closeMenu}>Contact</Link>
        
        <div className={styles.mobileLink}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}