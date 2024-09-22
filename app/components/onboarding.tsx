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
import { useAppContext } from '../appStore/context';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({
  setHasSeenOnboarding,
  language,
}: {
  setHasSeenOnboarding: (hasSeen: boolean) => void;
  language: string;
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const animation = useRef<LottieView>(null);
  const slidesRef = useRef<FlatList>(null);
  const { t } = useAppContext();

  useEffect(() => {
    animation.current?.play();
  }, []);
  const arraylist = [
    {
      title: `${
        language == 'en' ? 'Welcome to FramPrice24!' : 'ಫಾರ್ಮ್ 24 ಗೆ ಸುಸ್ವಾಗತ!'
      }`,
      description: `${
        language == 'en'
          ? 'We provide a platform where you can view the latest prices for farming-related products.'
          : 'ನಾವು ಕೃಷಿ ಸಂಬಂಧಿತ ಉತ್ಪನ್ನಗಳ ಇತ್ತೀಚಿನ ಬೆಲೆಗಳನ್ನು ನೋಡುವ ಮೂಲಕ ಒದಗಿಸುವ ವೇದಿಕೆಯನ್ನು ನೀಡುತ್ತೇವೆ.'
      } `,
      lottie: tractor,
    },
    {
      title: `${
        language == 'en' ? 'Real-Time Price Updates' : 'ತಕ್ಷಣದ ಬೆಲೆ ನವೀಕರಣಗಳು'
      }`,
      description: `${
        language == 'en'
          ? 'We continuously analyze and update prices for farming-related products, providing accurate information for every region, every day.'
          : 'ನಾವು ಕೃಷಿ ಸಂಬಂಧಿತ ಉತ್ಪನ್ನಗಳ ಬೆಲೆಗಳನ್ನು ನಿರಂತರವಾಗಿ ವಿಶ್ಲೇಷಿಸಿ ನವೀಕರಿಸುತ್ತೇವೆ, ಪ್ರತಿಯೊಂದು ಪ್ರದೇಶಕ್ಕೆ ನಿಖರವಾದ ಮಾಹಿತಿಯನ್ನು ಪ್ರತಿದಿನ ಒದಗಿಸುತ್ತೇವೆ.'
      }`,
      lottie: data,
    },
    {
      title: `${language == 'en' ? 'Disclaimer' : 'ನಿರಾಕರಣೆ'}`,
      description: `${
        language == 'en'
          ? 'The prices displayed are for reference purposes only. It can be vary from the actual price.'
          : 'ಪ್ರದರ್ಶಿಸಲಾದ ಬೆಲೆಗಳು ಕೇವಲ ಮಾಹಿತಿ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ. ಈ ಬೆಲೆಗಳು ವಾಸ್ತವಿಕ ಬೆಲೆಯಿಂದ ಭಿನ್ನವಾಗಿರಬಹುದು.'
      }`,
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
