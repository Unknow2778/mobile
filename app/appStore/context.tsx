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
  likedItems: DataItem[];
  addLikedItem: (item: DataItem) => void;
  removeLikedItem: (item: DataItem) => void;
  isItemLiked: (item: DataItem) => boolean;
};

const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [likedItems, setLikedItems] = useState<DataItem[]>([]);

  const addLikedItem = (item: DataItem) => {
    setLikedItems((prevItems) => [...prevItems, item]);
  };

  const removeLikedItem = (item: DataItem) => {
    setLikedItems((prevItems) =>
      prevItems.filter(
        (likedItem) => likedItem.product.name !== item.product.name
      )
    );
  };

  const isItemLiked = (item: DataItem) => {
    return likedItems.some(
      (likedItem) => likedItem.product.name === item.product.name
    );
  };

  return (
    <AppContext.Provider
      value={{
        likedItems,
        addLikedItem,
        removeLikedItem,
        isItemLiked,
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
