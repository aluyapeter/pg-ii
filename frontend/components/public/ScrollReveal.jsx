'use client'; 

import { useEffect, useRef, useState } from 'react';
import styles from './ScrollReveal.module.scss';

export default function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0,        
  className = '' 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // MEMORY LEAK FIX: Snapshot the current DOM element
    const currentElement = elementRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          if (currentElement) {
            observer.unobserve(currentElement);
          }
        }
      },
      {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1, 
      }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      // Use the snapshot to reliably clean up the observer
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`${styles.reveal} ${styles[direction]} ${isVisible ? styles.isVisible : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}