import type { Route, ShapeEntry } from '@/types/transit';
import { BUS_ZONES, MINIBUS_ZONES } from '@/constants/zones';
import { formatHeadway, headwayBadgeColor } from '@/utils/formatters';
import styles from './RoutePopup.module.css';

interface RoutePopupProps {
  route: Route;
  shape: ShapeEntry;
  onClose: () => void;
}

export function RoutePopup({ route, shape }: RoutePopupProps) {
  const zoneLabel =
    route.mode === 'bus'
      ? BUS_ZONES[route.zone as keyof typeof BUS_ZONES]?.label
      : MINIBUS_ZONES[route.zone as keyof typeof MINIBUS_ZONES]?.label;

  const { bg, fg } = headwayBadgeColor(route.headwaySecs);
  const directions = route.shapes.map((s) => s.head).filter(Boolean);

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <span
          className={styles.badge}
          style={{ background: route.color, color: '#000' }}
        >
          {route.code}
        </span>
        <span className={styles.modeTag}>
          {route.mode === 'bus' ? '🚌 Bus' : '🚐 Minibus'}
        </span>
      </div>

      <p className={styles.name}>{route.name}</p>

      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.label}>Zone</td>
            <td>{zoneLabel ?? '—'}</td>
          </tr>
          <tr>
            <td className={styles.label}>Headway</td>
            <td>
              <span className={styles.hwBadge} style={{ background: bg, color: fg }}>
                {formatHeadway(route.headwaySecs)}
              </span>
            </td>
          </tr>
          <tr>
            <td className={styles.label}>Service</td>
            <td>05:00 – 22:00 daily</td>
          </tr>
          <tr>
            <td className={styles.label}>Direction</td>
            <td>{shape.head || '—'}</td>
          </tr>
          {shape.stops ? (
            <tr>
              <td className={styles.label}>Stops</td>
              <td>{shape.stops}</td>
            </tr>
          ) : null}
          <tr>
            <td className={styles.label}>Trips</td>
            <td>{route.shapes.length} (both directions)</td>
          </tr>
          {directions.length > 0 && (
            <tr>
              <td className={styles.label}>Terminals</td>
              <td className={styles.terminals}>{directions.join(' ↔ ')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
