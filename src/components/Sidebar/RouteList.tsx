import { forwardRef, useEffect, useRef } from 'react';
import type { Route } from '@/types/transit';
import { useAppContext } from '@/context/AppContext';
import { useFilteredRoutes } from '@/hooks/useFilteredRoutes';
import { BUS_ZONES, MINIBUS_ZONES } from '@/constants/zones';
import { formatHeadway } from '@/utils/formatters';
import styles from './RouteList.module.css';

interface RouteListProps {
  routes: Route[];
  onRouteSelect?: () => void;
}

export function RouteList({ routes, onRouteSelect }: RouteListProps) {
  const { state, selectRoute } = useAppContext();
  const filtered = useFilteredRoutes(routes);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Scroll active item into view when selection changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [state.selectedRouteKey]);

  if (filtered.length === 0) {
    return (
      <div className={styles.empty}>
        No routes match your search
      </div>
    );
  }

  return (
    <div className={styles.list} role="list">
      {filtered.map((route) => (
        <RouteItem
          key={route.key}
          route={route}
          isActive={route.key === state.selectedRouteKey}
          onClick={() => {
            selectRoute(route);
            onRouteSelect?.();
          }}
          ref={route.key === state.selectedRouteKey ? activeRef : null}
        />
      ))}
    </div>
  );
}

interface RouteItemProps {
  route: Route;
  isActive: boolean;
  onClick: () => void;
}

const RouteItem = forwardRef<HTMLButtonElement, RouteItemProps>(function RouteItem(
  { route, isActive, onClick },
  ref
) {
  const zoneLabel =
    route.mode === 'bus'
      ? BUS_ZONES[route.zone as keyof typeof BUS_ZONES]?.label
      : MINIBUS_ZONES[route.zone as keyof typeof MINIBUS_ZONES]?.label;

  return (
    <button
      ref={ref}
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      style={{ borderLeftColor: isActive ? route.color : 'transparent' }}
      onClick={onClick}
      role="listitem"
      aria-pressed={isActive}
    >
      <div className={styles.dot} style={{ background: route.color }} />
      <span
        className={styles.badge}
        style={{ background: route.color }}
      >
        {route.code}
      </span>
      <div className={styles.info}>
        <span className={styles.name}>{route.name}</span>
        <span className={styles.meta}>
          {route.mode === 'bus' ? '🚌' : '🚐'}{' '}
          {zoneLabel} · {formatHeadway(route.headwaySecs)} headway
        </span>
      </div>
    </button>
  );
});
