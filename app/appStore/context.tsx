import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Animated } from 'react-native';

type DataItem = {
  product: {
    name: string;
    imageURL: string;
    baseUnit: string;
  };
  marketPrices: Array<{
    marketName: string;
    updatedAt: string;
    price: number;
    previousPrice: number;
  }>;
};

type AppContextState = {
  language: string | null;
  setLanguage: (language: string | null) => void;
};

const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
