import React, { useEffect, useState, useCallback } from 'react';
import { NativeWindStyleSheet } from 'nativewind';
import { Stack, useRouter } from 'expo-router';
import { AppProvider } from './appStore/context';
import OnboardingScreen from './components/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';

const RootLayout = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(!!hasSeen);
      setIsLoading(false);
    };
    checkOnboardingStatus();
  }, []);

  return (
    <AppProvider>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      {isLoading ? (
        <ActivityIndicator />
      ) : hasSeenOnboarding ? (
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            // Alternatively, you can use a fade animation:
            // animation: 'fade',
          }}
        >
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      ) : (
        <OnboardingScreen setHasSeenOnboarding={setHasSeenOnboarding} />
      )}
    </AppProvider>
  );
};

export default RootLayout;
