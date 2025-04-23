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
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 100 : 80,
          paddingBottom: Platform.OS === 'ios' ? 25 : 16,
          paddingTop: 16, // Increased padding top to move items up slightly
          position: 'absolute',
          bottom: 0, // Attaches to the bottom of the screen
          left: 0,
          right: 0,
          elevation: 5,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          zIndex: 1000,
          borderTopLeftRadius: 25, // Only round the top corners
          borderTopRightRadius: 25,
          overflow: 'hidden',
          // Extended to full width and height
          width: '100%',
          // Add extra bottom spacing to ensure the tab bar extends all the way to the bottom of the screen
          marginBottom: -10, // This helps ensure the tab bar extends all the way down
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
          height: Platform.OS === 'ios' ? 60 : 50, // Reduced height to move items up
          marginTop: -10, // Move tabs up more significantly
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