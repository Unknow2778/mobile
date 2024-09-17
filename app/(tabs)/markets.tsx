import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GET } from '../api/api';

const Markets = () => {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      const response = await GET('/markets/productPriceInAllMarkets');
      console.log(response.productPrices);
      setMarkets(response.productPrices);
    };
    fetchMarkets();
  }, []);

  return (
    <View>
      <Text>markets</Text>
    </View>
  );
};

export default Markets;
