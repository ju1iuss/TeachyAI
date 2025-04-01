import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AIScreen from '../tabs/ai';
import LessonResultScreen from '../screens/LessonResultScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={AIScreen} />
        <Stack.Screen name="LessonResult" component={LessonResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 