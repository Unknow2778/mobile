import {
  FlatList,
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
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
} from '@tabler/icons-react-native';
import Fuse from 'fuse.js';
import { useAppContext } from '../appStore/context';
const logo = require('../../assets/images/logo.png');

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

const Home = () => {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const [searchData, setSearchData] = useState<DataItem[]>(dataArray);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const scrollY = useRef(new Animated.Value(0)).current;
  const context = useAppContext();

  useEffect(() => {
    context.setScrollY(scrollY);
  }, [context.scrollY]);
  useEffect(() => {
    // Fetch data here
    const fetachData = async () => {
      setLoading(true); // Set loading to true before fetching data
      const data = await GET('/markets/productPriceInAllMarkets');
      setDataArray(data.productPrices);
      setSearchData(data.productPrices);
      setLoading(false); // Set loading to false after data is fetched
    };
    fetachData();
  }, []);

  useEffect(() => {
    const fuse = new Fuse(dataArray, {
      keys: ['product.name'],
      threshold: 0.3, // Adjust this value to control the fuzziness
    });

    if (searchQuery.trim() === '') {
      setSearchData(dataArray);
    } else {
      const result = fuse.search(searchQuery).map(({ item }) => item);
      setSearchData(result);
    }
  }, [searchQuery, dataArray]);

  const handleLike = (index: number) => {
    const updatedData = [...dataArray];
    updatedData[index].liked = !updatedData[index].liked;
    updatedData.sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0));
    setDataArray(updatedData);
    setSearchData(updatedData);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* <SafeAreaView style={styles.safeArea}> */}
      <LinearGradient
        colors={['#e6f1d1', '#CEF18C']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <View style={[styles.searchContainer]}>
          <TextInput
            placeholder='Search By Vegetables '
            style={[
              styles.searchInput,
              styles.shadowProp,
              styles.lightElevation,
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#000' />
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={searchData}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: context.scrollY } } }],
            { useNativeDriver: false }
          )}
          // ListHeaderComponent={
          //   <View style={[styles.searchContainer]}>
          //     <TextInput
          //       placeholder='Search By Vegetables '
          //       style={[
          //         styles.searchInput,
          //         styles.shadowProp,
          //         styles.lightElevation,
          //       ]}
          //       value={searchQuery}
          //       onChangeText={setSearchQuery}
          //     />
          //   </View>
          //   // <LinearGradient
          //   //   colors={['#e6f1d1', '#CEF18C']}
          //   //   start={{ x: 0, y: 1 }}
          //   //   end={{ x: 0, y: 0 }}
          //   // >
          //   //   {/* <View style={styles.logoContainer}>
          //   //     <Image style={styles.logo} source={logo} />
          //   //   </View> */}

          //   // </LinearGradient>
          // }
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.itemContainer,
                styles.shadowProp,
                styles.elevation,
              ]}
            >
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
                    onPress={() => handleLike(index)}
                  >
                    <IconHeartFilled color={item.liked ? 'green' : 'white'} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.marketPricesContainer}>
                {item.marketPrices.map((marketItem, index) => (
                  <View
                    key={index}
                    style={[styles.marketItem, styles.lightElevation]}
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
                      Old Price {currencyFormatter(marketItem?.previousPrice)}
                    </Text>
                    <Text style={styles.updatedAt}>
                      {dateFormatter(marketItem.updatedAt)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      {/* </SafeAreaView> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#CEF18C',
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
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  searchInput: {
    flexGrow: 1,
    padding: 8,
    borderRadius: 10,
    height: 48,
    backgroundColor: '#fff',
  },
  flatList: {
    backgroundColor: '#e6f1d1',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 5,
    width: 'auto',
    marginHorizontal: 8,
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
    // shadowColor: '#52006A',
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
    padding: 8,
    borderRadius: 6,
    width: '49%',
    marginBottom: 8,
    backgroundColor: '#F9FFE7',
  },
  lightElevation: {
    elevation: 5,
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
    paddingBottom: 40,
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
});

export default Home;
