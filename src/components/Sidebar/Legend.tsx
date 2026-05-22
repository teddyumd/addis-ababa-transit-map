import { useAppContext } from '@/context/AppContext';
import { BUS_ZONES, MINIBUS_ZONES } from '@/constants/zones';
import styles from './Legend.module.css';

export function Legend() {
  const { state } = useAppContext();
  const showBus  = state.modeFilter !== 'minibus';
  const showMini = state.modeFilter !== 'bus';

  return (
    <div className={styles.legend}>
      {showBus && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>🚌 Bus — by line family</h3>
          <div className={styles.items}>
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
          <h3 className={styles.sectionTitle}>🚐 Minibus — by area</h3>
          <div className={styles.items}>
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
