import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Animated } from 'react-native';

interface AppContextState {
  // Add your state properties here
  // For example:
  // user: User | null;
  // theme: 'light' | 'dark';
  scrollY: Animated.Value;
  setScrollY: (value: Animated.Value) => void;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

// Create a provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // Add your state management logic here
  // For example, using useState or useReducer
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  const value: AppContextState = {
    // Initialize your state here
    scrollY,
    setScrollY,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Create a custom hook to use the contexts
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
