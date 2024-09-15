import { Tabs } from 'expo-router';
import {
  IconCarrot,
  IconNews,
  IconCategory2,
  IconUser,
  IconColumns,
  IconWaveSquare,
  IconHeartFilled,
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
            bottom: 10,
            left: 10,
            right: 10,
            elevation: 1,
            borderRadius: 15,
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
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconCarrot color={color} size={24} strokeWidth={1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name='liked'
          options={{
            title: 'Liked',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconHeartFilled color={color} size={24} strokeWidth={1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name='news'
          options={{
            title: 'News',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconNews color={color} size={24} strokeWidth={1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconUser color={color} size={24} strokeWidth={1.5} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
