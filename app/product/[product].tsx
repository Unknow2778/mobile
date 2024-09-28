import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { GET } from '../api/api';
import { currencyFormatter } from '../helperFun/currencyFormatter';
import {
  IconTrendingDown,
  IconTrendingUp,
  IconBrandWhatsapp,
} from '@tabler/icons-react-native';
import { dateFormatter } from '../helperFun/dateFormatter';
import { useAppContext } from '../appStore/context';
import { debounce } from 'lodash';
import ShimmeringText from '../components/ShimmerComponent';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton';
import { getAppStoreLink } from '../helperFun/getAppStoreLink';
import analytics from '@react-native-firebase/analytics';

const ProductScreen = () => {
  const { product, productId } = useLocalSearchParams<{
    product: string;
    productId: string;
  }>();
  const [productData, setProductData] = useState<any>(null);
  const [marketPrices, setMarketPrices] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [averagePrice, setAveragePrice] = useState(0);
  const [highestPrice, setHighestPrice] = useState(0);
  const [lowestPrice, setLowestPrice] = useState(Infinity);
  const { t, language } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const contentRef = React.useRef(null);

  useEffect(() => {
    const fetchProductData = async () => {
      analytics().logEvent('product_press', {
        productId: productId,
        productName: productData?.name,
      });
      setIsLoading(true);
      try {
        const response = await GET(
          `/markets/productPriceInAllMarkets/${productId}`
        );
        setProductData(response?.product);
        setMarketPrices(response?.prices);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const getPriceChangePercentage = (
    currentPrice: number,
    previousPrice: number
  ) => {
    const change = currentPrice - previousPrice;
    return (change / previousPrice) * 100;
  };

  useEffect(() => {
    const getAveragePrice = (prices: any) => {
      const totalPrice = prices?.reduce((acc: any, curr: any) => {
        return acc + curr?.price;
      }, 0);
      setAveragePrice(totalPrice / prices?.length);
    };
    getAveragePrice(marketPrices);
  }, [marketPrices]);

  useEffect(() => {
    if (marketPrices) {
      const prices = marketPrices.map((item: any) => item.price);
      setHighestPrice(Math.max(...prices));
      setLowestPrice(Math.min(...prices));
    }
  }, [marketPrices]);

  const fetchProductData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GET(
        `/markets/productPriceInAllMarkets/${productId}`
      );
      setProductData(response?.product);
      setMarketPrices(response?.prices);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProductData();
    setRefreshing(false);
  }, [fetchProductData]);

  const renderSkeletonLoader = () => (
    <>
      <View style={styles.skeletonProductInfo}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonProductDetails}>
          <View style={styles.skeletonText} />
          <View style={[styles.skeletonText, { width: '60%' }]} />
        </View>
      </View>
      <View style={styles.skeletonSectionTitle} />
      <View style={styles.skeletonMarketList}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.skeletonMarketItem}>
            <View style={styles.skeletonText} />
            <View style={[styles.skeletonText, { width: '40%' }]} />
            <View style={[styles.skeletonText, { width: '60%' }]} />
          </View>
        ))}
      </View>
    </>
  );

  const debouncedRouterPush = debounce((params) => {
    router.push(params);
  }, 200);

  const shareScreenshot = async () => {
    try {
      // Capture the screenshot
      const uri = await captureRef(contentRef, {
        format: 'png',
        quality: 0.8,
      });

      const whatsappLink = 'https://chat.whatsapp.com/Cj9dzXxokVr25exbpO3Ae0';

      const appStoreLink = await getAppStoreLink();
      const message = `${t('sharemessage')} ${product}\n\n${t(
        'shareapp'
      )} ${appStoreLink} \n\n ${t('sharemessage2')} ${whatsappLink}`;

      // Share both image and text
      const shareOptions = {
        title: 'Share Product Details',
        message: message,
        url: uri,
        type: 'image/png',
      };

      const ShareResponse = await Share.open(shareOptions);

      if (ShareResponse.success) {
        console.log('Shared successfully');
        analytics().logEvent('product_share', {
          productId: productId,
          productName: productData?.name,
        });
      } else {
        console.log('Share cancelled');
      }
    } catch (error) {
      if ((error as any).message.includes('User did not share')) {
        console.log('User cancelled sharing');
      } else {
        console.error('Error sharing screenshot:', error);
        Alert.alert(
          'Error',
          'There was an error sharing the screenshot. Please try again.'
        );
      }
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: product
            ? product.charAt(0).toUpperCase() + product.slice(1)
            : 'Product Details',
          headerShown: true,
          headerTitleStyle: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#16A349',
          },
          headerShadowVisible: true,
        }}
      />
      <View style={styles.container} ref={contentRef}>
        {isLoading ? (
          renderSkeletonLoader()
        ) : (
          <>
            <View style={styles.productInfoContainer}>
              <View style={styles.productImageContainer}>
                {productData?.isInDemand && (
                  <ShimmeringText
                    text='demand'
                    borderTopRightRadius={8}
                    borderBottomLeftRadius={8}
                    t={t}
                  />
                )}
                <Image
                  source={{ uri: productData?.imageURL }}
                  style={styles?.productImage}
                />
              </View>
              <View style={styles?.productDetails}>
                <Text style={styles?.productName}>{productData?.name}</Text>
                <Text style={styles?.productUnit}>
                  {t('averagePrice')} {currencyFormatter(averagePrice)}
                  {'/'}
                  {productData?.baseUnit}
                </Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Market Prices</Text>
            <FlatList
              data={marketPrices}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.marketItem}
                  key={`market-${item.market.id}-${index}`}
                  onPress={() => {
                    debouncedRouterPush({
                      pathname: '/market/[market]',
                      params: {
                        productId: productId,
                        market: item.market.place,
                        marketId: item.market._id,
                      },
                    });
                  }}
                >
                  <View style={styles.marketInfo}>
                    <Text style={styles.marketName}>{item.market.place}</Text>
                    <View
                      style={[
                        styles.bageContainer,
                        {
                          backgroundColor:
                            item.price === highestPrice
                              ? '#DC2626'
                              : item.price === lowestPrice
                              ? '#16A349'
                              : '#EAB308',
                        },
                      ]}
                    >
                      <Text style={styles.bageText}>
                        {item.price === highestPrice
                          ? t('highest')
                          : item.price === lowestPrice
                          ? t('lowest')
                          : t('normal')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>
                      {currencyFormatter(item.price)}
                    </Text>
                    <Text style={styles.priceTitle}>
                      /{productData?.baseUnit}
                    </Text>
                    <View style={styles.marketInfo}>
                      {getPriceChangePercentage(
                        item.price,
                        item.previousPrice
                      ) === 0 ? null : getPriceChangePercentage(
                          item.price,
                          item.previousPrice
                        ) > 0 ? (
                        <IconTrendingUp size={24} color={'#22C55E'} />
                      ) : (
                        <IconTrendingDown size={24} color={'#F43F5E'} />
                      )}
                      <Text
                        style={[
                          styles.priceChange,
                          {
                            color:
                              getPriceChangePercentage(
                                item.price,
                                item.previousPrice
                              ) === 0
                                ? '#888'
                                : getPriceChangePercentage(
                                    item.price,
                                    item.previousPrice
                                  ) > 0
                                ? '#22C55E'
                                : '#F43F5E',
                          },
                        ]}
                      >
                        {getPriceChangePercentage(
                          item.price,
                          item.previousPrice
                        ) === 0
                          ? t('noChange')
                          : `${getPriceChangePercentage(
                              item.price,
                              item.previousPrice
                            ).toFixed(2)}%`}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.marketInfo}>
                    {dateFormatter(item.updatedAt)}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) =>
                `market-${item.market.id}-${index}`
              }
              contentContainerStyle={styles.marketList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </>
        )}
      </View>
      <FloatingWhatsAppButton onPress={shareScreenshot} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    padding: 10,
    paddingBottom: 80,
  },
  productContainer: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  row: {
    gap: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 5,
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  productUnit: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  marketList: {
    gap: 5,
  },
  marketItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    gap: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  marketName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceTitle: {
    fontSize: 16,
    color: '#888',
  },
  marketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#888',
    gap: 5,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  skeletonProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 5,
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  skeletonProductDetails: {
    flex: 1,
    marginLeft: 16,
  },
  skeletonText: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSectionTitle: {
    height: 24,
    width: '40%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonMarketList: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
    height: '80%',
  },
  skeletonMarketItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  bageContainer: {
    padding: 5,
    borderRadius: 5,
  },
  bageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProductScreen;
