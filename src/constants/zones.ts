import type { BusZone, MinibusZone, ZoneDefinition } from '@/types/transit';

export const BUS_ZONES: Record<BusZone, ZoneDefinition> = {
  AB: { label: 'AB Lines', color: '#4fc3f7' },
  SH: { label: 'SH Lines', color: '#81c784' },
  A:  { label: 'A Lines',  color: '#ffb74d' },
  B:  { label: 'B Lines',  color: '#f06292' },
  C:  { label: 'C Lines',  color: '#ce93d8' },
  D:  { label: 'D Lines',  color: '#80deea' },
};

export const MINIBUS_ZONES: Record<MinibusZone, ZoneDefinition> = {
  Central: { label: 'Central', color: '#ffd54f' },
  East:    { label: 'East',    color: '#ff8a65' },
  South:   { label: 'South',   color: '#a5d6a7' },
  West:    { label: 'West',    color: '#ef9a9a' },
  North:   { label: 'North',   color: '#90caf9' },
  Other:   { label: 'Other',   color: '#b0bec5' },
};

export const MINIBUS_ZONE_KEYWORDS: Record<string, MinibusZone> = {
  Mexico: 'Central', 'Piassa Arada': 'Central', Kazanchis: 'Central',
  Stadium: 'Central', 'Tekle Haimanot': 'Central', 'Atena Tera': 'Central',
  Legehar: 'Central', 'Autobis Tera': 'Central', Kechenie: 'Central',
  Megenagna: 'East', Goro: 'East', 'Kara Kore': 'East', Ayat: 'East',
  'Gelan Condominium': 'East', Sefera: 'East', 'Tulu Dimtu': 'East',
  Summit: 'East', 'Merab Hotel': 'East', 'Koye Feche': 'East',
  Saris: 'South', 'Saris Abo': 'South', 'Kality Total': 'South',
  'Kality Menaheria': 'South', Torhayloch: 'South', Kera: 'South',
  'Ayer Tena': 'South', 'Akaki Gebeya': 'South', Mekanisa: 'South',
  Jemmo: 'South', 'Alem Bank': 'South', Lafto: 'South',
  Shiromeda: 'West', Asko: 'West', 'Yeshi Debele': 'West',
  'Raguel Church': 'West', 'Addisu Gebeya': 'West', Zenebewerk: 'West',
  'Shero Meda': 'West', Entoto: 'West',
  Bole: 'North', Airport: 'North',
};
