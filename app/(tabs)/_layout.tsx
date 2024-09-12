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
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
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
            elevation: 5,
            borderRadius: 20,
            height: 55,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          tabBarIconStyle: {
            marginBottom: -6,
          },
          tabBarLabelStyle: {
            marginBottom: 8,
            fontSize: 10,
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => <IconCarrot color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name='liked'
          options={{
            title: 'Liked',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <IconHeartFilled color={color} size={24} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name='news'
          options={{
            title: 'News',
            headerShown: false,
            tabBarIcon: ({ color }) => <IconNews color={color} size={24} />,
          }}
        /> */}
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => <IconUser color={color} size={24} />,
          }}
        />
      </Tabs>
    </View>
  );
}
