import type { LatLngExpression } from 'leaflet';

export const MAP_CENTER: LatLngExpression = [9.005, 38.757];
export const MAP_ZOOM = 12;
export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export const BUS_WEIGHT = 3;
export const BUS_WEIGHT_ACTIVE = 5.5;
export const MINIBUS_WEIGHT = 2;
export const MINIBUS_WEIGHT_ACTIVE = 4.5;
export const MINIBUS_DASH = '8 4';

export const OPACITY_ACTIVE = 1;
export const OPACITY_DEFAULT = 0.78;
export const OPACITY_DIMMED = 0.06;
export const OPACITY_HIDDEN = 0.04;
