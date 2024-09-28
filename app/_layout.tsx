import React, { useEffect, useState, useCallback, useContext } from 'react';
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
import { IconWorld } from '@tabler/icons-react-native';
import { LogLevel, OneSignal } from 'react-native-onesignal';

const RootLayout = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [language, setLanguage] = useState('en');

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('f55b8a54-af71-4a8e-92df-f9afbe05e3aa');

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  // OneSignal.Notifications.addEventListener('click', (event) => {
  //   console.log('OneSignal: notification clicked:', event);
  // });

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
    setLanguage(lang);
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
        <OnboardingScreen
          setHasSeenOnboarding={setHasSeenOnboarding}
          language={language}
        />
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <IconWorld size={24} color='green' />
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}
              >
                Select your language
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              {['en', 'kn'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => selectLanguage(lang)}
                  style={{
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: '#F1F5F9',
                    flex: 1,
                    marginHorizontal: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
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
