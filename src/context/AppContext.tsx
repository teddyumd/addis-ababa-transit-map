import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { ModeFilter, Route } from '@/types/transit';

// ── State ──────────────────────────────────────────────────────────────────────

interface AppState {
  modeFilter: ModeFilter;
  searchQuery: string;
  selectedRouteKey: string | null;
  selectedRoute: Route | null;
}

const initialState: AppState = {
  modeFilter: 'all',
  searchQuery: '',
  selectedRouteKey: null,
  selectedRoute: null,
};

// ── Actions ────────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_MODE_FILTER'; payload: ModeFilter }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SELECT_ROUTE'; payload: Route }
  | { type: 'CLEAR_SELECTION' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE_FILTER':
      return { ...state, modeFilter: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SELECT_ROUTE':
      return {
        ...state,
        selectedRouteKey: action.payload.key,
        selectedRoute: action.payload,
      };
    case 'CLEAR_SELECTION':
      return { ...state, selectedRouteKey: null, selectedRoute: null };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  setModeFilter: (mode: ModeFilter) => void;
  setSearchQuery: (q: string) => void;
  selectRoute: (route: Route) => void;
  clearSelection: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: AppContextValue = {
    state,
    setModeFilter: (mode) => dispatch({ type: 'SET_MODE_FILTER', payload: mode }),
    setSearchQuery: (q)    => dispatch({ type: 'SET_SEARCH_QUERY', payload: q }),
    selectRoute: (route)   => dispatch({ type: 'SELECT_ROUTE', payload: route }),
    clearSelection: ()     => dispatch({ type: 'CLEAR_SELECTION' }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
