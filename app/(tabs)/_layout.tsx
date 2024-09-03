import { Tabs } from 'expo-router';
import {
  IconHome,
  IconNews,
  IconCategory2,
  IconUser,
  IconColumns,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Image, Text, View } from 'react-native';
import { useAppContext } from '../appStore/context'; // Adjust the path as needed
import { useRef } from 'react';

const logo = require('../../assets/images/logo.png');

const HEADER_HEIGHT = 80; // Adjust this to match your header's height

const Header = () => {
  const { scrollY } = useAppContext();

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: scrollY.interpolate({
              inputRange: [0, HEADER_HEIGHT],
              outputRange: [0, -HEADER_HEIGHT],

              extrapolate: 'clamp',
            }),
          },
        ],
      }}
    >
      <LinearGradient
        colors={['#CEF18C', '#C5FA61']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingTop: 10,
            height: HEADER_HEIGHT,
          }}
        >
          <Image style={{ width: 40, height: 40 }} source={logo} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4D7C0F',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
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
          headerShown: true,
          header: () => <Header />,
          tabBarIcon: ({ color }) => <IconHome color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='tableData'
        options={{
          title: 'Table',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconColumns color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='news'
        options={{
          title: 'News',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconNews color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name='categories'
        options={{
          title: 'Categories',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconCategory2 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconUser color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
