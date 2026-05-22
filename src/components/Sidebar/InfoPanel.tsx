import { useAppContext } from '@/context/AppContext';
import { BUS_ZONES, MINIBUS_ZONES } from '@/constants/zones';
import { formatHeadway, headwayBadgeColor } from '@/utils/formatters';
import styles from './InfoPanel.module.css';

export function InfoPanel() {
  const { state } = useAppContext();
  const route = state.selectedRoute;

  if (!route) {
    return (
      <div className={styles.panel}>
        <p className={styles.hint}>Click any route to see details</p>
      </div>
    );
  }

  const zoneLabel =
    route.mode === 'bus'
      ? BUS_ZONES[route.zone as keyof typeof BUS_ZONES]?.label
      : MINIBUS_ZONES[route.zone as keyof typeof MINIBUS_ZONES]?.label;

  const { bg, fg } = headwayBadgeColor(route.headwaySecs);
  const directions = route.shapes.map((s) => s.head).filter(Boolean);

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <span className={styles.badge} style={{ background: route.color }}>
          {route.code}
        </span>
        <span className={styles.mode}>
          {route.mode === 'bus' ? '🚌' : '🚐'} {route.mode === 'bus' ? 'Bus' : 'Minibus'}
        </span>
      </div>
      <p className={styles.routeName}>{route.name}</p>

      <div className={styles.rows}>
        <Row label="Zone"     value={zoneLabel ?? '—'} />
        <Row label="Headway"  value={
          <span className={styles.hwBadge} style={{ background: bg, color: fg }}>
            {formatHeadway(route.headwaySecs)}
          </span>
        } />
        <Row label="Service"  value="05:00 – 22:00 daily" />
        {directions.length > 0 && (
          <Row label="Terminals" value={directions.join(' ↔ ')} small />
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  small,
}: {
  label: string;
  value: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={`${styles.rowValue} ${small ? styles.small : ''}`}>{value}</span>
    </div>
  );
}
