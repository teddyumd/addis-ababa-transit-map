import styles from './Header.module.css';

interface HeaderProps {
  busCount: number;
  minibusCount: number;
  tripCount: number;
}

export function Header({ busCount, minibusCount, tripCount }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🚌</span>
          <span className={styles.icon}>🚐</span>
          Addis Ababa Transit Network
        </h1>
        <p className={styles.subtitle}>
          Bus &amp; Minibus · GTFS Data · AddisMap + DT4A
        </p>
      </div>

      <div className={styles.stats}>
        <Stat value={busCount}     label="Bus Routes"     color="var(--bus-accent)" />
        <Stat value={minibusCount} label="Minibus Routes" color="var(--mini-accent)" />
        <Stat value={tripCount}    label="Total Trips"    color="var(--text-muted)" />
      </div>
    </header>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue} style={{ color }}>
        {value.toLocaleString()}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
