import { Tabs } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import { haptics } from '../../utils/haptics';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Debug logging
const debugNavigation = () => {
  console.log('=== Tab Navigation Debug ===');
  console.log('Initializing tab navigation');
  console.log('Current environment:', process.env.NODE_ENV);
  console.log('Expo Router version:', require('expo-router/package.json').version);
  console.log('React Navigation version:', require('@react-navigation/native/package.json').version);
  console.log('===========================');
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    debugNavigation();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: Platform.OS === 'ios' ? 100 : 80,
          paddingBottom: Platform.OS === 'ios' ? 25 : 16,
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
          zIndex: 1000,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          height: Platform.OS === 'ios' ? 65 : 55,
        },
      }}
      screenListeners={{
        tabPress: async () => {
          await haptics.light();
        },
      }}
    >
      <Tabs.Screen
        name="lieblingslehrer"
        options={{
          title: "Lieblingslehrer",
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-variant" size={size} color={color} />
          ),
          tabBarActiveTintColor: '#FF6B6B',
        }}
      />
      
      <Tabs.Screen
        name="finanzlehrer"
        options={{
          title: "Finanzlehrer",
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash" size={size} color={color} />
          ),
          tabBarActiveTintColor: '#4ECDC4',
        }}
      />
      
      <Tabs.Screen
        name="ai"
        options={{
          title: "TeachyAI",
          tabBarIcon: ({ color, size }) => (
            <Icon name="robot" size={size} color={color} />
          ),
          tabBarActiveTintColor: '#45B7D1',
        }}
      />
    </Tabs>
  );
} 