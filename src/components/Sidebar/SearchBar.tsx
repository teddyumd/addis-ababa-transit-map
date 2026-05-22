import { useAppContext } from '@/context/AppContext';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const { state, setSearchQuery } = useAppContext();

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>⌕</span>
      <input
        className={styles.input}
        type="text"
        placeholder="Search route or place…"
        value={state.searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search routes"
      />
      {state.searchQuery && (
        <button className={styles.clear} onClick={() => setSearchQuery('')} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
}
