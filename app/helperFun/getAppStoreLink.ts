import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Updated type declaration
declare module 'expo-constants' {
  interface ExpoConfig {
    extra?: {
      androidPackage?: string;
      iosAppId?: string;
    };
  }

  interface Constants {
    manifest: ExpoConfig;
  }
}

export const getAppStoreLink = async () => {
  const { androidPackage, iosAppId } = Constants.manifest?.extra || {};

  console.log('androidPackage', androidPackage);

  if (Platform.OS === 'ios' && iosAppId) {
    return `https://apps.apple.com/app/id${iosAppId}`;
  } else if (Platform.OS === 'android' && androidPackage) {
    return `https://play.google.com/store/apps/details?id=${androidPackage}`;
  }

  return `https://play.google.com/store/apps/details?id=com.farmprice24.farmprice24`;
};