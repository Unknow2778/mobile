import { View, StyleSheet, Dimensions, Text } from 'react-native';
import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const News = () => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Comming soon</Text>
    </View>
  );
};

// export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: width * 0.8, // Set a specific width relative to the screen
    height: width * 0.8, // Set the height proportionally
  },
});
