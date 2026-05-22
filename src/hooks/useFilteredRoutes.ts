import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Route } from '@/types/transit';

export function useFilteredRoutes(routes: Route[]): Route[] {
  const { state } = useAppContext();
  const { modeFilter, searchQuery } = state;

  return useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return routes.filter((r) => {
      if (modeFilter !== 'all' && r.mode !== modeFilter) return false;
      if (q) {
        return (
          r.code.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [routes, modeFilter, searchQuery]);
}
