import { useAppContext } from '@/context/AppContext';
import styles from './ClearButton.module.css';

export function ClearButton() {
  const { state, clearSelection } = useAppContext();

  if (!state.selectedRouteKey) return null;

  return (
    <button className={styles.btn} onClick={clearSelection}>
      ✕ Clear selection
    </button>
  );
}
