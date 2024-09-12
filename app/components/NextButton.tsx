import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';

const NextButton = ({
  percentage,
  handleNext,
}: {
  percentage: number;
  handleNext: () => void;
}) => {
  const size = 90;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0));
  const progressRef = useRef<Circle>(null);

  const animation = (toValue: number) => {
    return Animated.timing(progressAnimation.current, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.current.addListener((value) => {
      const strokeDashoffset =
        circumference - (circumference * value.value) / 100;
      if (progressRef.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
  }, [percentage]);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation='-90' origin={center}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke='#E7E7E7'
            fill='transparent'
          />
          <Circle
            ref={progressRef}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke='green'
            fill='transparent'
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (circumference * percentage) / 100
            }
          />
        </G>
      </Svg>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <AntDesign name='arrowright' size={24} color='white' />
      </TouchableOpacity>
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#34A334',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
