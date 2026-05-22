import 'leaflet/dist/leaflet.css';
import { useMemo, useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { useTransitData } from '@/hooks/useTransitData';
import { Header } from '@/components/Header/Header';
import { TransitMap } from '@/components/Map/TransitMap';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import styles from './App.module.css';

function AppContent() {
  const { routes, loading, error } = useTransitData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const busCount     = useMemo(() => new Set(routes.filter(r => r.mode === 'bus').map(r => r.code)).size, [routes]);
  const minibusCount = useMemo(() => new Set(routes.filter(r => r.mode === 'minibus').map(r => r.code)).size, [routes]);
  const tripCount    = useMemo(() => routes.reduce((acc, r) => acc + r.shapes.length, 0), [routes]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading transit data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorScreen}>
        <p className={styles.errorText}>Failed to load data: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header
        busCount={busCount}
        minibusCount={minibusCount}
        tripCount={tripCount}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen((open) => !open)}
      />
      <div className={styles.body}>
        <TransitMap routes={routes} />
        <button
          className={`${styles.backdrop} ${isMenuOpen ? styles.backdropOpen : ''}`}
          type="button"
          aria-label="Close route menu"
          onClick={() => setIsMenuOpen(false)}
        />
        <Sidebar
          routes={routes}
          isOpen={isMenuOpen}
          onRequestClose={() => setIsMenuOpen(false)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
