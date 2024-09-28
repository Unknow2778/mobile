import { Tabs } from 'expo-router';
import {
  IconChartLine,
  IconNews,
  IconBasketPin,
  IconUser,
} from '@tabler/icons-react-native';
import { StatusBar, View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4D7C0F',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            position: 'absolute',

            height: 55,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: 0.84,
            borderWidth: 0.5,
            borderColor: '#ccc',
          },
          tabBarIconStyle: {
            marginBottom: -6,
          },
          tabBarLabelStyle: {
            marginBottom: 8,
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Rates',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconChartLine color={color} size={24} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name='markets'
          options={{
            title: 'Markets',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconBasketPin color={color} size={24} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name='news'
          options={{
            title: 'News',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconNews color={color} size={24} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconUser color={color} size={24} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
