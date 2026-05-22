export type TransitMode = 'bus' | 'minibus';
export type ModeFilter = 'all' | TransitMode;

export type BusZone = 'AB' | 'SH' | 'A' | 'B' | 'C' | 'D';
export type MinibusZone = 'Central' | 'East' | 'South' | 'West' | 'North' | 'Other';
export type RouteZone = BusZone | MinibusZone;

/** One directional trip shape as stored in the JSON data files */
export interface ShapeEntry {
  id: number;
  code: string;
  name: string;
  head: string;
  hw: number;          // headway in seconds
  stops?: number;
  mode: TransitMode;
  zone: RouteZone;
  color: string;
  coords: [number, number][]; // [lng, lat]
}

/** A route groups two directional ShapeEntries (outbound + inbound) */
export interface Route {
  key: string;           // "{mode}::{code}"
  code: string;
  name: string;
  mode: TransitMode;
  zone: RouteZone;
  color: string;
  headwaySecs: number;
  shapes: ShapeEntry[];
}

export interface ZoneDefinition {
  label: string;
  color: string;
}

export interface TransitData {
  bus: ShapeEntry[];
  minibus: ShapeEntry[];
}
