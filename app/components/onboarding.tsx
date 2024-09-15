import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Paginator from './Paginator';
import NextButton from './NextButton';
import LottieView from 'lottie-react-native';
import tractor from '../../assets/lottie/tractor.json';
import data from '../../assets/lottie/data.json';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({
  setHasSeenOnboarding,
}: {
  setHasSeenOnboarding: (hasSeen: boolean) => void;
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const animation = useRef<LottieView>(null);
  const slidesRef = useRef<FlatList>(null);
  useEffect(() => {
    animation.current?.play();
  }, []);
  const arraylist = [
    {
      title: 'Welcome to FramPrice24!',
      description:
        'We provide a platform where you can view the latest prices for farming-related products.',
      lottie: tractor,
    },
    {
      title: 'Real-Time Price Updates',
      description:
        'We continuously analyze and update prices for farming-related products, providing accurate information for every region, every day.',
      lottie: data,
    },
    {
      title: 'Disclaimer',
      description:
        'The prices displayed are for reference purposes only. We are not liable for any losses or damages resulting from the use of this app.',
      lottie: '',
    },
  ];

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  const handleNext = () => {
    if (currentIndex < arraylist.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
    if (currentIndex === arraylist.length - 1) {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      slidesRef.current?.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
        }}
        source={item.lottie}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        style={{ marginBottom: 10 }}
        data={arraylist}
        ref={slidesRef}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
      />
      <Paginator scrollX={scrollX} arraylist={arraylist} />
      <View style={styles.nextButtonContainer}>
        <NextButton
          handleNext={handleNext}
          percentage={(currentIndex + 1) * (100 / arraylist.length)}
        />
      </View>

      <View style={styles.buttonContainer}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={handleBack}>
            <Text style={{ color: '#005E00' }}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity onPress={completeOnboarding}>
          <Text style={{ color: '#005E00' }}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default OnboardingScreen;
