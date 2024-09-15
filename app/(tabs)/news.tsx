import { View, StyleSheet, Dimensions, Text } from 'react-native';
import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import comingsoon from '../../assets/lottie/coming.json';

const News = () => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          ref={animationRef}
          style={{
            width: 200,
            height: 200,
          }}
          source={comingsoon}
        />
      </View>
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {},
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});
