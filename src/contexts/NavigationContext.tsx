import { createContext, useContext, useState, ReactNode } from 'react';

type Route = 'INTRO' | 'HOME' | 'TIMEZONES' | 'MATCH_HUB' | 'PREDICTION_ORACLE';

interface NavigationContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('INTRO');

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate: setCurrentRoute }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
