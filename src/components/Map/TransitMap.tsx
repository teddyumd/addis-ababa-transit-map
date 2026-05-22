import { useCallback, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import type { Map as LeafletMap, LatLngExpression } from 'leaflet';
import type { Route } from '@/types/transit';
import { useAppContext } from '@/context/AppContext';
import { RoutePopup } from './RoutePopup';
import {
  MAP_CENTER, MAP_ZOOM, TILE_URL, TILE_ATTRIBUTION,
  BUS_WEIGHT, BUS_WEIGHT_ACTIVE, MINIBUS_WEIGHT, MINIBUS_WEIGHT_ACTIVE,
  MINIBUS_DASH,
  OPACITY_ACTIVE, OPACITY_DEFAULT, OPACITY_DIMMED, OPACITY_HIDDEN,
} from '@/constants/map';
import styles from './Map.module.css';

interface TransitMapProps {
  routes: Route[];
}

/** Handles click on empty map → clear selection */
function MapClickHandler() {
  const { state, clearSelection } = useAppContext();
  useMapEvents({
    click: () => { if (state.selectedRouteKey) clearSelection(); },
  });
  return null;
}

export function TransitMap({ routes }: TransitMapProps) {
  const { state, selectRoute, clearSelection } = useAppContext();
  const mapRef = useRef<LeafletMap | null>(null);

  const handleRouteClick = useCallback(
    (route: Route, e: { originalEvent: Event }) => {
      e.originalEvent.stopPropagation();
      selectRoute(route);

      // Fit map to the selected route
      const latlngs: LatLngExpression[] = route.shapes.flatMap((s) =>
        s.coords.map(([lng, lat]) => [lat, lng] as LatLngExpression)
      );
      if (mapRef.current && latlngs.length > 0) {
        const L = (window as unknown as { L: typeof import('leaflet') }).L;
        const bounds = L.latLngBounds(latlngs);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    },
    [selectRoute]
  );

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className={styles.map}
        preferCanvas
        ref={mapRef}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
        <MapClickHandler />

        {routes.map((route) => {
          const isSelected = route.key === state.selectedRouteKey;
          const hasSelection = state.selectedRouteKey !== null;
          const inMode =
            state.modeFilter === 'all' || route.mode === state.modeFilter;

          let opacity: number;
          if (hasSelection) {
            opacity = isSelected ? OPACITY_ACTIVE : (inMode ? OPACITY_DIMMED : OPACITY_HIDDEN);
          } else {
            opacity = inMode ? OPACITY_DEFAULT : OPACITY_HIDDEN;
          }

          const weight = route.mode === 'bus'
            ? (isSelected ? BUS_WEIGHT_ACTIVE : BUS_WEIGHT)
            : (isSelected ? MINIBUS_WEIGHT_ACTIVE : MINIBUS_WEIGHT);

          const dashArray = route.mode === 'minibus' ? MINIBUS_DASH : undefined;

          return route.shapes.map((shape) => {
            const positions: LatLngExpression[] = shape.coords.map(
              ([lng, lat]) => [lat, lng]
            );

            return (
              <Polyline
                key={`${shape.id}`}
                positions={positions}
                pathOptions={{
                  color: route.color,
                  weight,
                  opacity,
                  dashArray,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
                eventHandlers={{
                  click: (e) => handleRouteClick(route, e),
                }}
              >
                <Popup>
                  <RoutePopup route={route} shape={shape} onClose={clearSelection} />
                </Popup>
              </Polyline>
            );
          });
        })}
      </MapContainer>
    </div>
  );
}
