import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GET } from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '../helperFun/dateFormatterSimple';
import { currencyFormatter } from '../helperFun/currencyFormatter';
import { LinearGradient } from 'expo-linear-gradient';
import { IconMapPin } from '@tabler/icons-react-native';
import { useAppContext } from '../appStore/context';

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
  const { language, t } = useAppContext();

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await GET('/markets/allMarketProducts');
        setMarkets(response.marketProducts);
      } catch (error) {
        console.error('Error fetching markets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, [language]);

  const renderSkeleton = () => (
    <View style={styles.marketContainer}>
      <View style={[styles.skeleton, styles.marketNameSkeleton]} />
      <View style={styles.headerRow}>
        <View style={[styles.skeleton, styles.headerSkeleton]} />
        <View style={[styles.skeleton, styles.headerSkeleton]} />
        <View style={[styles.skeleton, styles.headerSkeleton]} />
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
                        <Text style={styles.productPrice}>
                          {currencyFormatter(item.currentPrice)}
                        </Text>
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
    gap: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 10,
    justifyContent: 'space-between',
  },
  headerImg: {
    width: '15%',
    fontWeight: 'bold',
  },
  separator: {
    height: 10,
  },
  productImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  headerProduct: {
    width: '40%',
    fontWeight: 'bold',
  },
  headerDate: {
    width: '40%',
    fontWeight: 'bold',
  },
  headerPrice: {
    width: '15%',
    fontWeight: 'bold',
  },
  productImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  productName: {
    textTransform: 'capitalize',
  },

  productDate: {
    width: '40%',
    color: 'gray',
  },
  productPrice: {
    width: '15%',
    fontWeight: 'bold',
    color: 'green',
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  marketNameSkeleton: {
    height: 24,
    width: '60%',
    marginBottom: 10,
  },
  headerSkeleton: {
    height: 16,
    width: '30%',
  },
  productImageSkeleton: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  productNameSkeleton: {
    height: 16,
    width: '60%',
  },
  productDateSkeleton: {
    height: 16,
    width: '30%',
  },
  productPriceSkeleton: {
    height: 16,
    width: '20%',
  },
  productSeparator: {
    height: 10,
  },
});

export default Markets;
