import {
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GET } from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { IconBell, IconSearch } from '@tabler/icons-react-native';
import Fuse from 'fuse.js';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../appStore/context';
import { debounce } from 'lodash'; // Add this import at the top of the file
import ShimmeringText from '../components/ShimmerComponent';

const logo = require('../../assets/images/logo.png');

type DataItem = {
  _id: string; // Add this line to include id in the DataItem type
  name: string;
  imageURL: string;
  priority: number; // Add this line to include priority in the DataItem type
  isInDemand?: boolean; // Add this line
};

const HEADER_MAX_HEIGHT = 130;
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
  const { t, language } = useAppContext();

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
      <View style={{ backgroundColor: '#16A349' }}>
        <Animated.View
          style={{
            opacity: headerOpacity,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoImageContainer}>
              <Image source={logo} style={styles.logo} />
            </View>
            <Text style={styles.logoText}>{t('appName')}</Text>
          </View>
          <IconBell size={24} color='#fff' />
        </Animated.View>
      </View>
      <LinearGradient
        colors={['#F0FDF4', '#F0FDF4', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={[styles.searchContainer]}>
          <IconSearch style={{ marginLeft: 10 }} size={24} color='#104515' />
          <TextInput
            onChangeText={handleSearch}
            placeholder={t('searchByVegetables')}
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
  const router = useRouter();
  const { language, setLanguage, t } = useAppContext();

  const fetchLanguage = useCallback(async () => {
    try {
      const lang = await AsyncStorage.getItem('lang');
      setLanguage(lang);
    } catch (error) {
      console.error('Error fetching language:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await GET('/markets/products');
      setDataArray(data.products);

      const prioritySortedProducts = data.products.sort(
        (a: DataItem, b: DataItem) => b.priority - a.priority
      );
      setSearchData(prioritySortedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguage();
  }, [fetchLanguage]);

  useEffect(() => {
    fetchData();
  }, [language, fetchData]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // When there's no search query, use the priority-sorted data
      setSearchData(dataArray.sort((a, b) => b.priority - a.priority));
    } else {
      const fuse = new Fuse(dataArray, {
        keys: ['name'],
        threshold: 0.3,
      });
      const result = fuse.search(searchQuery);
      // Sort the search results by priority
      setSearchData(
        result.map((item) => item.item).sort((a, b) => b.priority - a.priority)
      );
    }
  }, [searchQuery, dataArray]);

  const handleProductPress = useCallback(
    debounce(
      (product: DataItem) => {
        router.push({
          pathname: '/product/[product]',
          params: {
            productId: product._id,
            product: product.name,
          },
        });
      },
      300,
      { leading: true, trailing: false }
    ),
    [router]
  );

  const renderSkeletonItem = () => (
    <View style={styles.skeletonItem}>
      <LinearGradient
        colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.skeletonImage}
      />
      <LinearGradient
        colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.skeletonText}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <DynamicHeader
          value={scrollY}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {loading ? (
          <Animated.FlatList
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            data={Array(15).fill(null)}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            renderItem={renderSkeletonItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal={false}
            numColumns={3}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
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
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleProductPress(item)}
              >
                {item.isInDemand && (
                  <ShimmeringText
                    text='demand'
                    borderTopRightRadius={8}
                    borderBottomLeftRadius={8}
                    t={t}
                  />
                )}
                <Image
                  source={{ uri: item.imageURL }}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            numColumns={3}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#16A34A',
    minHeight: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
  },
  logo: {
    height: 20,
    width: 20,
    objectFit: 'contain',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1000,
  },
  searchInput: {
    flexGrow: 1,
    padding: 8,
    borderRadius: 10,
    height: 48,
  },
  flatList: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    paddingTop: HEADER_MAX_HEIGHT,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 5,
    width: 'auto',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 100,
  },
  productImage: {
    height: 50,
    width: 80,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  flatListContent: {
    paddingBottom: 190,
  },
  separator: {
    height: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  skeletonItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 5,
    width: 'auto',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 100,
  },
  skeletonImage: {
    height: 50,
    width: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  skeletonText: {
    height: 14,
    width: 60,
    borderRadius: 4,
  },
});

export default Home;
