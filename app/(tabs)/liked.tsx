import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useAppContext } from '../appStore/context';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currencyFormatter } from '../helperFun/currencyFormatter';
import { dateFormatter } from '../helperFun/dateFormatter';
import {
  IconHeartFilled,
  IconTrendingDown,
  IconTrendingUp,
  IconWaveSquare,
} from '@tabler/icons-react-native';
import LottieView from 'lottie-react-native';

const LikedScreen = () => {
  const { likedItems, removeLikedItem } = useAppContext();

  const getAveragePrice = (marketPrices: Array<{ price: number }>): number => {
    const total = marketPrices.reduce((sum, item) => sum + item.price, 0);
    return total / marketPrices.length;
  };

  const calculatePercentageChange = (
    previousPrice: number,
    currentPrice: number
  ): number => {
    if (previousPrice === 0) return 0;
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.itemContainer, styles.shadowProp, styles.elevation]}>
      <View style={styles.itemHeader}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.productImage}
            source={{ uri: item.product.imageURL }}
            onError={(e) =>
              console.log('Image loading error:', e.nativeEvent.error)
            }
          />
        </View>
        <LinearGradient
          style={styles.gradientContainer}
          colors={['#fff', '#FCF0C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.averagePrice}>
              Average Price{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {currencyFormatter(
                  parseFloat(getAveragePrice(item.marketPrices).toFixed(2))
                )}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={{ position: 'absolute', right: 5, top: 5 }}
            onPress={() => removeLikedItem(item)}
          >
            <IconHeartFilled color='green' />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <View style={styles.marketPricesContainer}>
        {item.marketPrices.map((marketItem: any, index: number) => (
          <View key={index} style={[styles.marketItem, styles.lightElevation]}>
            <LinearGradient
              style={styles.gradientContainer}
              colors={['#E8FFD6', '#F1FFD6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.marketName}>{marketItem?.marketName}</Text>
              <View style={styles.marketNameContainer}>
                <View style={styles.priceContainer}>
                  <Text>Per {item?.product?.baseUnit}</Text>
                  <Text style={styles.price}>
                    {currencyFormatter(marketItem?.price)}
                  </Text>
                </View>
                {index >= 0 && (
                  <>
                    {calculatePercentageChange(
                      marketItem.previousPrice,
                      marketItem.price
                    ) > 0 ? (
                      <IconTrendingUp size={16} color='green' />
                    ) : calculatePercentageChange(
                        marketItem.previousPrice,
                        marketItem.price
                      ) === 0 ? (
                      <IconWaveSquare size={16} color='gray' />
                    ) : (
                      <IconTrendingDown size={16} color='red' />
                    )}
                    <Text
                      style={[
                        styles.percentageChange,
                        {
                          color:
                            calculatePercentageChange(
                              marketItem.previousPrice,
                              marketItem.price
                            ) > 0
                              ? 'green'
                              : calculatePercentageChange(
                                  marketItem.previousPrice,
                                  marketItem.price
                                ) === 0
                              ? 'gray'
                              : 'red',
                        },
                      ]}
                    >
                      {calculatePercentageChange(
                        marketItem.previousPrice,
                        marketItem.price
                      ).toFixed(2)}
                      %
                    </Text>
                  </>
                )}
              </View>
              <Text style={styles.oldPrice}>
                Old Price {currencyFormatter(marketItem?.previousPrice)}
              </Text>
              <Text style={styles.updatedAt}>
                {dateFormatter(marketItem.updatedAt)}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {likedItems.length > 0 ? (
        <FlatList
          data={likedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.product.name}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <LottieView
            source={{
              uri: 'https://lottie.host/171404d8-2ab7-4438-b4a2-8e78398fccc4/W606pEl5vy.json',
            }}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.emptyText}>No liked items yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f1d1',
  },
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    padding: 8,
  },
  productImage: {
    height: 50,
    width: 80,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  gradientContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  averagePrice: {
    fontSize: 16,
    color: '#000',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    fontWeight: 'bold',
    color: 'gray',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 5,
  },
  marketPricesContainer: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  marketItem: {
    borderRadius: 6,
    width: '49%',
    marginBottom: 8,
    backgroundColor: '#F9FFE7',
  },
  lightElevation: {
    elevation: 5,
  },
  marketName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  marketNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  percentageChange: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  oldPrice: {
    fontSize: 12,
    color: '#666',
  },
  updatedAt: {
    fontSize: 10,
    fontWeight: 'normal',
  },
});

export default LikedScreen;
