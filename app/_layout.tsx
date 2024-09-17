import React, { useEffect, useState, useCallback } from 'react';
import { NativeWindStyleSheet } from 'nativewind';
import { Stack, useRouter } from 'expo-router';
import { AppProvider } from './appStore/context';
import OnboardingScreen from './components/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';

const RootLayout = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const checkOnboardingAndLanguage = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      const language = await AsyncStorage.getItem('lang');
      setHasSeenOnboarding(!!hasSeen);
      setIsLoading(false);
      if (!language) {
        setShowLanguageModal(true);
      }
    };
    checkOnboardingAndLanguage();
  }, []);

  const selectLanguage = async (lang: string) => {
    await AsyncStorage.setItem('lang', lang);
    setShowLanguageModal(false);
  };

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
          }}
        >
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      ) : (
        <OnboardingScreen setHasSeenOnboarding={setHasSeenOnboarding} />
      )}

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType='fade'
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 20, fontWeight: 'bold' }}
            >
              Select your language
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              {['en', 'kn'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => selectLanguage(lang)}
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 5,
                    flex: 1,
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={{ fontSize: 16, textAlign: 'center' }}>
                    {lang === 'en' ? 'English' : 'ಕನ್ನಡ'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AppProvider>
  );
};

export default RootLayout;
