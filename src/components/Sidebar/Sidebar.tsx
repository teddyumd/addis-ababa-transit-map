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
  isOpen: boolean;
  onRequestClose: () => void;
}

export function Sidebar({ routes, isOpen, onRequestClose }: SidebarProps) {
  return (
    <aside id="route-menu" className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <ModeTabs />
      <SearchBar />
      <Legend />
      <RouteList routes={routes} onRouteSelect={onRequestClose} />
      <ClearButton />
      <InfoPanel />
    </aside>
  );
}
