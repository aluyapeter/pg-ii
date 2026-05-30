import Link from 'next/link';
import styles from './Button.module.scss';

export default function Button({ 
  children, 
  href, 
  variant = 'primary', // defaults to solid teal
  className = '', 
  onClick, 
  type = 'button' 
}) {
  
  // Construct the CSS classes (e.g., "btn primary my-custom-class")
  const buttonClass = `${styles.btn} ${styles[variant]} ${className}`.trim();

  // If we passed an 'href', it's a navigation link. We use Next.js <Link>.
  if (href) {
    return (
      <Link href={href} className={buttonClass} onClick={onClick}>
        {children}
      </Link>
    );
  }

  // Otherwise, it's a standard button (for forms, triggers, etc.)
  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}