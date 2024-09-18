import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GET } from '../api/api';
import { BarChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';

interface PriceHistory {
  _id: string;
  date: string;
  price: number;
  marketId: string;
  productId: string;
}

interface ProductData {
  product: {
    imageURL: string;
    name: string;
  };
  prices: PriceHistory[];
}

const Skeleton = ({ width, height, style }: any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          opacity,
          height,
          width,
          backgroundColor: '#E1E9EE',
          borderRadius: 4,
        },
        style,
      ]}
    />
  );
};

const ProductDataByMarket = ({
  market,
  productId,
  marketId,
}: {
  market: string;
  productId: string;
  marketId: string;
}) => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await GET(
          `/markets/priceHistory/${marketId}?productId=${productId}`
        );
        if (response && response.product && response.prices) {
          setProductData(response);
        } else {
          setError('Invalid data received from server');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [market, productId, marketId]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getColor = (value: number, min: number, max: number) => {
    const range = max - min || 1;
    const normalizedValue = (value - min) / range;

    const minColor = { r: 123, g: 239, b: 135 }; // #7BEF87
    const maxColor = { r: 34, g: 60, b: 51 }; // #223C33

    const r = Math.round(
      minColor.r + normalizedValue * (maxColor.r - minColor.r)
    );
    const g = Math.round(
      minColor.g + normalizedValue * (maxColor.g - minColor.g)
    );
    const b = Math.round(
      minColor.b + normalizedValue * (maxColor.b - minColor.b)
    );

    return `rgb(${r}, ${g}, ${b})`;
  };

  const {
    chartData,
    minPrice,
    maxPrice,
    timeData,
    latestPrice,
    predictedPrice,
  } = useMemo(() => {
    if (
      !productData ||
      !productData.prices ||
      productData.prices.length === 0
    ) {
      return {
        chartData: [],
        minPrice: 0,
        maxPrice: 0,
        timeData: [],
        latestPrice: 0,
        predictedPrice: 0,
      };
    }

    const sortedPrices = productData.prices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    const latestPrice = sortedPrices[0].price;

    // Calculate predicted price based on the latest 3 prices
    const latestThreePrices = sortedPrices
      .slice(0, 3)
      .map((price) => price.price);
    const averageChange =
      latestThreePrices.reduce((acc, price, index, arr) => {
        if (index === 0) return acc;
        return acc + (price - arr[index - 1]);
      }, 0) /
      (latestThreePrices.length - 1);

    const predictedPrice = Math.round(latestPrice + averageChange);

    const priceValues = sortedPrices.map((price) => price.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const chartData = sortedPrices.map((price, index) => {
      const date = new Date(price.date);
      let dayLabel;
      if (date.toDateString() === today.toDateString()) {
        dayLabel = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dayLabel = 'Yesterday';
      } else {
        dayLabel = date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
      }

      return {
        value: price.price,
        label: dayLabel,
        frontColor: getColor(price.price, minPrice, maxPrice),
        topLabelComponent: () => (
          <Animated.Text style={[styles.topLabel, { opacity: fadeAnim }]}>
            ₹{price.price}
          </Animated.Text>
        ),
        onPress: () => setSelectedBarIndex(index),
      };
    });

    const timeData = sortedPrices.map((price) => {
      const date = new Date(price.date);
      return {
        fullDate: date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    });

    return {
      chartData,
      minPrice,
      maxPrice,
      timeData,
      latestPrice,
      predictedPrice,
    };
  }, [productData, fadeAnim]);

  const handleBarPress = (item: any, index: number) => {
    setSelectedBarIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          style={[styles.imageContainer, styles.shadow]}
          colors={['#fff', '#fff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Skeleton width={100} height={100} style={styles.image} />
          <View style={styles.textContainer}>
            <Skeleton width={150} height={24} style={{ marginBottom: 10 }} />
            <Skeleton width={120} height={20} style={{ marginBottom: 5 }} />
            <Skeleton width={140} height={20} />
          </View>
        </LinearGradient>

        <LinearGradient
          style={[styles.dataContainer, styles.shadow]}
          colors={['#fff', '#fff']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <Skeleton width={150} height={24} style={{ marginBottom: 20 }} />
          <Skeleton width={Dimensions.get('window').width - 100} height={120} />
          <Skeleton width={200} height={20} style={{ marginTop: 20 }} />
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {productData && productData.product && (
        <LinearGradient
          style={[styles.imageContainer, styles.shadow]}
          colors={['#fff', '#fff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Image
            style={styles.image}
            source={{ uri: productData.product.imageURL }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{productData.product.name}</Text>
            <View>
              <Text style={styles.priceText}>
                Current Price: ₹{latestPrice}
              </Text>
              <View style={styles.predictionContainer}>
                <Text style={styles.predictionText}>Predicted Price: </Text>
                <Text style={styles.predictionTextNumber}>
                  ₹{predictedPrice}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      )}

      <LinearGradient
        style={[styles.dataContainer, styles.shadow]}
        colors={['#fff', '#ECFEFF']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <Text style={styles.text}>Price History</Text>
        {chartData.length > 0 ? (
          <>
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 80}
              height={120}
              barBorderTopLeftRadius={2}
              barBorderTopRightRadius={2}
              roundedBottom={false}
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: 'transparent' }}
              xAxisLabelTextStyle={styles.xAxisLabel}
              noOfSections={5}
              maxValue={maxPrice + 10}
              barWidth={25}
              spacing={50}
              initialSpacing={20}
              animationDuration={300}
              isAnimated={true}
              focusBarOnPress={true}
              focusedBarConfig={{
                color: 'lightblue',
              }}
              showValuesAsTopLabel={false}
              onPress={handleBarPress}
              hideYAxisText={true}
            />
            <View style={styles.timeContainer}>
              {selectedBarIndex !== null ? (
                <View style={styles.selectedDateContainer}>
                  <Text style={styles.selectedDateText}>
                    {timeData[selectedBarIndex].fullDate}
                  </Text>
                  <Text style={styles.selectedTimeText}>
                    {timeData[selectedBarIndex].time}
                  </Text>
                </View>
              ) : (
                <Text style={styles.instructionText}>
                  Tap a bar to see the date and time
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text>No price history available</Text>
        )}
      </LinearGradient>
    </View>
  );
};

export default ProductDataByMarket;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#F0FDF4',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 20,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: 'black',
  },
  dataContainer: {
    paddingVertical: 20,
    margin: 10,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedDateContainer: {
    flexDirection: 'row', // Keep it in row
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    width: '100%', // Take full width of parent
  },
  topLabel: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dataPointText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  xAxisLabel: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  selectedDateText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right', // Align text to right
    marginRight: 5, // Add some space between date and time
  },
  selectedTimeText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left', // Align text to left
    marginLeft: 5, // Add some space between date and time
  },
  instructionText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textContainer: {
    marginLeft: 10,
  },
  priceText: {
    fontSize: 16,
    marginTop: 5,
  },
  predictionText: {
    fontSize: 16,
    marginTop: 5,
  },
  predictionTextNumber: {
    fontSize: 16,
    marginTop: 5,
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 1,
  },
});
