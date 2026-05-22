import { useEffect, useState } from 'react';
import type { ShapeEntry, Route } from '@/types/transit';

interface UseTransitDataResult {
  routes: Route[];
  loading: boolean;
  error: string | null;
}

function shapesToRoutes(shapes: ShapeEntry[]): Route[] {
  const map = new Map<string, Route>();

  for (const shape of shapes) {
    const key = `${shape.mode}::${shape.code}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        code: shape.code,
        name: shape.name,
        mode: shape.mode,
        zone: shape.zone,
        color: shape.color,
        headwaySecs: shape.hw,
        shapes: [],
      });
    }
    map.get(key)!.shapes.push(shape);
  }

  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
}

export function useTransitData(): UseTransitDataResult {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [busRes, miniRes] = await Promise.all([
          fetch('./data/bus.json'),
          fetch('./data/minibus.json'),
        ]);

        if (!busRes.ok || !miniRes.ok) {
          throw new Error('Failed to load transit data');
        }

        const [busShapes, miniShapes]: [ShapeEntry[], ShapeEntry[]] =
          await Promise.all([busRes.json(), miniRes.json()]);

        if (!cancelled) {
          const busRoutes  = shapesToRoutes(busShapes);
          const miniRoutes = shapesToRoutes(miniShapes);
          setRoutes([...busRoutes, ...miniRoutes]);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { routes, loading, error };
}
