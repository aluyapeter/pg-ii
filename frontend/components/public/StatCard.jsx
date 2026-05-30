import styles from './StatCard.module.scss';

export default function StatCard({ value, label }) {
  return (
    <div className={styles.card}>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}