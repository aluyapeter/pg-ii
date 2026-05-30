import styles from './Container.module.scss';

// We accept 'children' (the content inside) and 'className' (just in case we need to add a one-off margin to a specific container).
export default function Container({ children, className = '' }) {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
      {children}
    </div>
  );
}