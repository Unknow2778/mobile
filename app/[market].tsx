import { View } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import ProductDataByMarket from './components/ProductDataByMarket';

const MarketScreen = () => {
  const { market, productId, marketId } = useLocalSearchParams<{
    market: string;
    productId: string;
    marketId: string;
  }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: market || 'Market Screen',
          headerShown: true,
          headerTitleStyle: {
            color: 'black',
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
        }}
      />
      <View>
        <ProductDataByMarket
          market={market}
          productId={productId}
          marketId={marketId}
        />
      </View>
    </>
  );
};

export default MarketScreen;
