import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { BUS_ZONES, MINIBUS_ZONES } from '@/constants/zones';
import styles from './Legend.module.css';

type LegendSection = 'bus' | 'minibus';

export function Legend() {
  const { state } = useAppContext();
  const showBus = state.modeFilter !== 'minibus';
  const showMini = state.modeFilter !== 'bus';
  const [openSections, setOpenSections] = useState({
    bus: true,
    minibus: true,
  });

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const syncLegendState = () => {
      const isMobile = query.matches;
      setOpenSections({ bus: !isMobile, minibus: !isMobile });
    };

    syncLegendState();
    query.addEventListener('change', syncLegendState);
    return () => query.removeEventListener('change', syncLegendState);
  }, []);

  const toggleSection = (section: LegendSection) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <div className={styles.legend}>
      {showBus && (
        <section className={styles.section}>
          <button
            className={styles.sectionTitle}
            type="button"
            aria-expanded={openSections.bus}
            onClick={() => toggleSection('bus')}
          >
            <span>Bus - by line family</span>
            <span className={`${styles.chevron} ${openSections.bus ? styles.chevronOpen : ''}`} />
          </button>
          <div className={`${styles.items} ${openSections.bus ? styles.itemsOpen : ''}`}>
            {Object.entries(BUS_ZONES).map(([key, { label, color }]) => (
              <div key={key} className={styles.item}>
                <span className={styles.solidLine} style={{ background: color }} />
                <span className={styles.itemLabel}>{label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {showMini && (
        <section className={styles.section}>
          <button
            className={styles.sectionTitle}
            type="button"
            aria-expanded={openSections.minibus}
            onClick={() => toggleSection('minibus')}
          >
            <span>Minibus - by area</span>
            <span className={`${styles.chevron} ${openSections.minibus ? styles.chevronOpen : ''}`} />
          </button>
          <div className={`${styles.items} ${openSections.minibus ? styles.itemsOpen : ''}`}>
            {Object.entries(MINIBUS_ZONES).map(([key, { label, color }]) => (
              <div key={key} className={styles.item}>
                <span className={styles.dashedLine} style={{ borderTopColor: color }} />
                <span className={styles.itemLabel}>{label}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
