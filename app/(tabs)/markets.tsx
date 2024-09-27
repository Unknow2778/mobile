import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { GET } from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '../helperFun/dateFormatterSimple';
import { currencyFormatter } from '../helperFun/currencyFormatter';
import { LinearGradient } from 'expo-linear-gradient';
import { IconMapPin } from '@tabler/icons-react-native';
import { useAppContext } from '../appStore/context';
import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import fire from '../../assets/lottie/fire.json';

interface Product {
  _id: string;
  name: string;
  imageURL: string;
}

interface MarketProduct {
  product: Product;
  date: string;
  currentPrice: number;
}
interface Market {
  market: {
    place: string;
  };
  marketId: string;
  place: string;
  products: MarketProduct[];
}

const Markets = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { language, t } = useAppContext();
  const animation = useRef<LottieView | null>(null);

  const fetchMarkets = async () => {
    try {
      const response = await GET('/markets/allMarketProducts');
      setMarkets(response.marketProducts);
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, [language]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMarkets();
  }, []);

  const renderSkeleton = () => (
    <View style={styles.marketContainer}>
      <View style={styles.marketLocation}>
        <View style={[styles.skeleton, styles.marketPinSkeleton]} />
        <View style={[styles.skeleton, styles.marketNameSkeleton]} />
      </View>
      <View style={styles.headerRow}>
        <View style={[styles.skeleton, styles.headerProductSkeleton]} />
        <View style={[styles.skeleton, styles.headerDateSkeleton]} />
        <View style={[styles.skeleton, styles.headerPriceSkeleton]} />
      </View>
      {[...Array(10)].map((_, index) => (
        <View key={index} style={styles.productRow}>
          <View style={styles.productImageContainer}>
            <View style={[styles.skeleton, styles.productImageSkeleton]} />
            <View style={[styles.skeleton, styles.productNameSkeleton]} />
          </View>
          <View style={[styles.skeleton, styles.productDateSkeleton]} />
          <View style={[styles.skeleton, styles.productPriceSkeleton]} />
        </View>
      ))}
    </View>
  );

  const ShimmerPlaceholder = ({ style }: { style: any }) => (
    <LinearGradient
      colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[style, styles.shimmer]}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={loading ? [...Array(3)] : markets}
        contentContainerStyle={styles.flatListContent}
        renderItem={
          loading
            ? () => renderSkeleton()
            : ({ item }) => (
                <View style={styles.marketContainer}>
                  <View style={styles.marketLocation}>
                    <IconMapPin size={20} color='green' />
                    <Text style={styles.marketName}>{item.market.place}</Text>
                  </View>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerProduct}>{t('products')}</Text>
                    <Text style={styles.headerDate}>{t('date')}</Text>
                    <Text style={styles.headerPrice}>{t('price')}</Text>
                  </View>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={item.products}
                    renderItem={({ item }) => (
                      <View style={styles.productRow}>
                        <View style={styles.productImageContainer}>
                          <Image
                            source={{ uri: item.product.imageURL }}
                            style={styles.productImage}
                          />
                          <Text style={styles.productName}>
                            {item.product.name}
                          </Text>
                        </View>
                        <Text style={styles.productDate}>
                          {formatDate(item.date)}
                        </Text>
                        <View style={styles.productPrice}>
                          {item.product.isInDemand && (
                            <View style={styles.fireIconContainer}>
                              <LottieView
                                autoPlay
                                ref={animation}
                                style={{
                                  width: 20,
                                  height: 20,
                                }}
                                source={fire}
                              />
                            </View>
                          )}
                          <Text style={styles.productPriceText}>
                            {currencyFormatter(item.currentPrice)}
                          </Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={(product, index) =>
                      `${product.product._id}-${index}`
                    }
                    ItemSeparatorComponent={() => (
                      <View style={styles.productSeparator} />
                    )}
                    ListFooterComponentStyle={{ marginBottom: 10 }}
                  />
                </View>
              )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(market, index) =>
          loading ? `skeleton-${index}` : `${market.marketId}-${index}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  flatListContent: {
    paddingTop: 20,
    paddingBottom: 60,
  },
  marketContainer: {
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  marketLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  marketName: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginLeft: 5,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    justifyContent: 'space-between',
  },
  headerImg: {
    width: '15%',
    fontWeight: 'bold',
  },
  separator: {
    height: 10,
  },
  fireIconContainer: {
    marginBottom: 5,
  },
  productImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerProduct: {
    fontWeight: 'bold',
    flex: 1,
  },
  headerDate: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerPrice: {
    fontWeight: 'bold',
    width: 80,
    textAlign: 'right',
  },
  productImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  productName: {
    textTransform: 'capitalize',
    flex: 1,
  },
  productDate: {
    flex: 1,
    color: 'gray',
    textAlign: 'center',
  },
  productPrice: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  productPriceText: {
    fontWeight: 'bold',
    color: 'green',
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  marketPinSkeleton: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  marketNameSkeleton: {
    height: 24,
    width: '60%',
  },
  headerProductSkeleton: {
    height: 16,
    width: '30%',
  },
  headerDateSkeleton: {
    height: 16,
    width: '20%',
  },
  headerPriceSkeleton: {
    height: 16,
    width: '15%',
  },
  productImageSkeleton: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  productNameSkeleton: {
    height: 16,
    width: '40%',
  },
  productDateSkeleton: {
    height: 16,
    width: '20%',
  },
  productPriceSkeleton: {
    height: 16,
    width: '15%',
  },
  productSeparator: {
    height: 10,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Markets;
