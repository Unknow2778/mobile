import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ShimmeringTextProps {
  text: string;
  t: (key: string) => string;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderRadius?: number;
}

const ShimmeringText: React.FC<ShimmeringTextProps> = ({
  text,
  t,
  borderTopRightRadius = 0,
  borderBottomLeftRadius = 0,
  borderRadius = 0,
}) => {
  const translateX = useRef(new Animated.Value(-100)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    startAnimation();
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const startAnimation = () => {
    translateX.setValue(-100);
    animationRef.current = Animated.loop(
      Animated.timing(translateX, {
        toValue: 100,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    animationRef.current.start();
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        overflow: 'hidden',
        borderTopRightRadius: borderTopRightRadius,
        borderBottomLeftRadius: borderBottomLeftRadius,
        borderRadius: borderRadius,
      }}
    >
      <LinearGradient
        colors={['#16A34A', '#22C55E', '#16A34A']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          paddingVertical: 2,
          paddingHorizontal: 6,
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <LinearGradient
            colors={[
              'rgba(255,255,255,0)',
              'rgba(255,255,255,0.5)',
              'rgba(255,255,255,0)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
        <Text style={{ fontSize: 12, color: '#fff' }}>{t('demand')}</Text>
      </LinearGradient>
    </View>
  );
};

export default ShimmeringText;
