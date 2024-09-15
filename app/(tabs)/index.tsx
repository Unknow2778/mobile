import {
  FlatList,
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { currencyFormatter } from '../helperFun/currencyFormatter';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GET } from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import { dateFormatter } from '../helperFun/dateFormatter';
import { Animated } from 'react-native';
import {
  IconTrendingDown,
  IconTrendingUp,
  IconWaveSquare,
  IconHeartFilled,
  IconBell,
  IconSearch,
} from '@tabler/icons-react-native';
import Fuse from 'fuse.js';
import { useAppContext } from '../appStore/context';
import { useRouter } from 'expo-router';
const logo = require('../../assets/images/logo.png');

type DataItem = {
  product: {
    _id: string;
    name: string;
    imageURL: string;
    baseUnit: string;
  };
  marketPrices: Array<{
    _id: string;
    marketName: string;
    updatedAt: string;
    price: number;
    previousPrice: number;
  }>;
  liked?: boolean;
};

const getAveragePrice = (marketPrices: Array<{ price: number }>): number => {
  const total = marketPrices.reduce((sum, item) => sum + item.price, 0);
  const average = total / marketPrices.length;
  return average;
};

const calculatePercentageChange = (
  previousPrice: number,
  currentPrice: number
): number => {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
};

const HEADER_MAX_HEIGHT = 115;
const HEADER_MIN_HEIGHT = 30;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const DynamicHeader = ({
  value,
  searchQuery,
  setSearchQuery,
}: {
  value: Animated.Value;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const headerTranslateY = value.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -SCROLL_DISTANCE / 2],
    extrapolate: 'clamp',
  });

  const headerOpacity = value.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      <LinearGradient
        colors={['#ECFCCB', '#ECFCCB', '#fff', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Animated.View
          style={{
            opacity: headerOpacity,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          <Image source={logo} style={styles.logo} />
          <IconBell size={24} color='#104515' />
        </Animated.View>
        <View
          style={[styles.searchContainer, styles.elevation, styles.shadowProp]}
        >
          <IconSearch size={24} color='#104515' />

          <TextInput
            onChangeText={handleSearch}
            placeholder='Search By Vegetables'
            style={[styles.searchInput]}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Home = () => {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const [searchData, setSearchData] = useState<DataItem[]>(dataArray);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { addLikedItem, removeLikedItem, isItemLiked } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // Fetch data here
    const fetachData = async () => {
      setLoading(true);
      const data = await GET('/markets/productPriceInAllMarkets');
      // console.log(data);
      setDataArray(data.productPrices);
      setSearchData(data.productPrices);
      setLoading(false);
    };
    fetachData();
  }, []);

  useEffect(() => {
    const fuse = new Fuse(dataArray, {
      keys: ['product.name'],
      threshold: 0.3,
    });

    if (searchQuery.trim() === '') {
      setSearchData(dataArray);
    } else {
      const result = fuse.search(searchQuery).map(({ item }) => item);
      setSearchData(result);
    }
  }, [searchQuery, dataArray]);

  const handleLike = (item: DataItem) => {
    if (isItemLiked(item)) {
      removeLikedItem(item);
    } else {
      addLikedItem(item);
    }
    // Trigger a re-render
    setDataArray([...dataArray]);
    setSearchData([...searchData]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <DynamicHeader
          value={scrollY}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#000' />
          </View>
        ) : (
          <Animated.FlatList
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            data={searchData}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={[styles.itemContainer]}>
                <View style={[styles.itemHeader]}>
                  <View style={[styles.imageContainer]}>
                    <Image
                      style={styles.productImage}
                      source={{ uri: item?.product?.imageURL }}
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
                      <Text style={styles.productName}>
                        {item?.product?.name}
                      </Text>
                      <Text style={styles.averagePrice}>
                        Average Price{' '}
                        <Text
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          {currencyFormatter(
                            parseFloat(
                              getAveragePrice(item.marketPrices).toFixed(2)
                            )
                          )}
                        </Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ position: 'absolute', right: 5, top: 5 }}
                      onPress={() => handleLike(item)}
                    >
                      <IconHeartFilled
                        color={isItemLiked(item) ? 'green' : 'white'}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                <View style={[styles.marketPricesContainer]}>
                  {item.marketPrices.map((marketItem, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: '/[market]',
                          params: {
                            market: marketItem.marketName,
                            productId: item.product._id,
                            marketId: marketItem._id,
                          },
                        });
                      }}
                      key={index}
                      style={[styles.marketItem, styles.lightElevation]}
                    >
                      <LinearGradient
                        style={styles.gradientContainer}
                        colors={['#E8FFD6', '#F1FFD6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.marketName}>
                          {marketItem?.marketName}
                        </Text>

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
                          Old Price{' '}
                          {currencyFormatter(marketItem?.previousPrice)}
                        </Text>
                        <Text style={styles.updatedAt}>
                          {dateFormatter(marketItem.updatedAt)}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#ECFCCB',
    minHeight: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  logo: {
    height: 50,
    width: 80,
    resizeMode: 'contain',
    borderRadius: 10,
    flexShrink: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1000,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  searchInput: {
    flexGrow: 1,
    padding: 8,
    borderRadius: 10,
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flatList: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: HEADER_MAX_HEIGHT,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 5,
    width: 'auto',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemHeader: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elevation: {
    elevation: 20,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    height: '100%',
    padding: 10,
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
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
    borderWidth: 1,
    borderColor: '#ECFCCB',
  },
  lightElevation: {
    elevation: 1,
  },
  updatedAt: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  marketName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 190,
  },
  separator: {
    height: 8,
  },

  averagePrice: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000',
  },
  percentageChange: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#000',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oldPrice: {
    fontSize: 12,
    color: '#666',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default Home;
