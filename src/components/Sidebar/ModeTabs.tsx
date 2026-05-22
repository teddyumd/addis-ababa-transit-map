import { useAppContext } from '@/context/AppContext';
import type { ModeFilter } from '@/types/transit';
import styles from './ModeTabs.module.css';

const TABS: { mode: ModeFilter; label: string }[] = [
  { mode: 'all',     label: 'All' },
  { mode: 'bus',     label: '🚌 Bus' },
  { mode: 'minibus', label: '🚐 Minibus' },
];

export function ModeTabs() {
  const { state, setModeFilter } = useAppContext();

  return (
    <div className={styles.tabs}>
      {TABS.map(({ mode, label }) => (
        <button
          key={mode}
          className={`${styles.tab} ${state.modeFilter === mode ? styles.active : ''} ${styles[mode]}`}
          onClick={() => setModeFilter(mode)}
          aria-pressed={state.modeFilter === mode}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
