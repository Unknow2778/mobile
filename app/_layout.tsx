import React from 'react';
import { NativeWindStyleSheet } from 'nativewind';
import { Stack } from 'expo-router';
import { AppProvider } from './appStore/context';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const RootLayout = () => {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
};

export default RootLayout;
