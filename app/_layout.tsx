import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/auth';
import { OnboardingProvider } from '../contexts/onboarding';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import React from 'react';

// Debug logging
const debugEnv = () => {
  console.log('=== Root Layout Debug ===');
  console.log('Initializing root layout');
  console.log('Current environment:', process.env.NODE_ENV);
  console.log('Expo Router version:', require('expo-router/package.json').version);
  console.log('React Navigation version:', require('@react-navigation/native/package.json').version);
  
  const envVars = {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
  console.log('Environment variables:', envVars);
  console.log('===========================');
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('=== App Error ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('===================');
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Something went wrong!</Text>
          <Text style={{ fontSize: 14, color: '#666' }}>Please restart the app</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  useEffect(() => {
    debugEnv();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthProvider>
          <OnboardingProvider>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: true,
                presentation: 'card',
                contentStyle: {
                  backgroundColor: '#FFFFFF',
                },
                animationDuration: 200,
                gestureDirection: 'horizontal',
              }}
            >
              <Stack.Screen 
                name="(onboarding)" 
                options={{
                  gestureEnabled: false,
                  presentation: 'card',
                  animation: 'none',
                }}
              />
              <Stack.Screen 
                name="(auth)" 
                options={{
                  gestureEnabled: false,
                  presentation: 'card',
                  animation: 'none',
                }}
              />
              <Stack.Screen 
                name="tabs" 
                options={{
                  gestureEnabled: false,
                  presentation: 'card',
                  animation: 'none',
                }}
              />
            </Stack>
          </OnboardingProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 