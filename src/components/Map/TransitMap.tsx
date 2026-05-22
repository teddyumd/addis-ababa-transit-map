import { useCallback, useEffect, useRef } from 'react';
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Polyline,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import type { Map as LeafletMap, LatLngExpression, Polyline as LeafletPolyline } from 'leaflet';
import type { Route } from '@/types/transit';
import { useAppContext } from '@/context/AppContext';
import { RoutePopup } from './RoutePopup';
import {
  BASEMAPS, MAP_CENTER, MAP_ZOOM,
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
  const polylineRefs = useRef(new Map<number, LeafletPolyline>());
  const preferredPopupShapeId = useRef<number | null>(null);

  const handleRouteClick = useCallback(
    (route: Route, shapeId: number, e: { originalEvent: Event }) => {
      e.originalEvent.stopPropagation();
      preferredPopupShapeId.current = shapeId;
      selectRoute(route);
    },
    [selectRoute]
  );

  useEffect(() => {
    const route = state.selectedRoute;
    if (!route) {
      preferredPopupShapeId.current = null;
      return;
    }

    const latlngs: LatLngExpression[] = route.shapes.flatMap((shape) =>
      shape.coords.map(([lng, lat]) => [lat, lng] as LatLngExpression)
    );

    if (mapRef.current && latlngs.length > 0) {
      const L = (window as unknown as { L: typeof import('leaflet') }).L;
      const bounds = L.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    const popupShapeId = preferredPopupShapeId.current ?? route.shapes[0]?.id;
    if (!popupShapeId) return;

    window.setTimeout(() => {
      polylineRefs.current.get(popupShapeId)?.openPopup();
      preferredPopupShapeId.current = null;
    }, 180);
  }, [state.selectedRoute]);

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className={styles.map}
        preferCanvas
        ref={mapRef}
      >
        <LayersControl position="topright" collapsed>
          {BASEMAPS.map((basemap, index) => (
            <LayersControl.BaseLayer
              key={basemap.id}
              name={basemap.label}
              checked={index === 0}
            >
              <TileLayer
                url={basemap.url}
                attribution={basemap.attribution}
                maxZoom={basemap.maxZoom}
              />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
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
                  click: (e) => handleRouteClick(route, shape.id, e),
                }}
                ref={(layer) => {
                  if (layer) {
                    polylineRefs.current.set(shape.id, layer);
                  } else {
                    polylineRefs.current.delete(shape.id);
                  }
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
