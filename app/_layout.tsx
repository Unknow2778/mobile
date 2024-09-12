import React, { useEffect, useState } from 'react';
import { NativeWindStyleSheet } from 'nativewind';
import { Stack, useRouter } from 'expo-router';
import { AppProvider } from './appStore/context';
import OnboardingScreen from './components/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

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
      {isLoading ? (
        <ActivityIndicator />
      ) : hasSeenOnboarding ? (
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      ) : (
        <OnboardingScreen setHasSeenOnboarding={setHasSeenOnboarding} />
      )}
    </AppProvider>
  );
};

export default RootLayout;
