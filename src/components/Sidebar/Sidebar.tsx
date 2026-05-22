import type { Route } from '@/types/transit';
import { ModeTabs } from './ModeTabs';
import { SearchBar } from './SearchBar';
import { Legend } from './Legend';
import { RouteList } from './RouteList';
import { InfoPanel } from './InfoPanel';
import { ClearButton } from './ClearButton';
import styles from './Sidebar.module.css';

interface SidebarProps {
  routes: Route[];
}

export function Sidebar({ routes }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <ModeTabs />
      <SearchBar />
      <Legend />
      <RouteList routes={routes} />
      <ClearButton />
      <InfoPanel />
    </aside>
  );
}
