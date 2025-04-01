import { Tabs } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#F5F5F5',
    }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: '#FFFFFF',
        opacity: 0.9,
      }} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#999999',
          headerShown: false,
          tabBarStyle: {
            height: 70 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
          },
          tabBarItemStyle: {
            paddingTop: 10,
          },
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
            fontWeight: '500',
          }
        }}
      >
        <Tabs.Screen
          name="lieblingslehrer"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="book-open-variant" size={28} color={color} />
            ),
            tabBarLabel: "Lehrer",
          }}
        />
        
        <Tabs.Screen
          name="finanzlehrer"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="cash" size={28} color={color} />
            ),
            tabBarLabel: "Finanzen",
          }}
        />
        
        <Tabs.Screen
          name="ai"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="robot" size={28} color={color} />
            ),
            tabBarLabel: "AI",
          }}
        />
      </Tabs>
    </View>
  );
} 