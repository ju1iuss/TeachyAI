import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/auth';
import { OnboardingProvider } from '../contexts/onboarding';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

// Debug logging with safer access to dependencies
const debugEnv = () => {
  try {
    console.log('=== Root Layout Debug ===');
    console.log('Initializing root layout');
    console.log('Current environment:', process.env.NODE_ENV);
    
    // Safely access package versions
    let expoRouterVersion = 'unknown';
    let reactNavigationVersion = 'unknown';
    
    try {
      expoRouterVersion = require('expo-router/package.json').version;
    } catch (e) {
      console.warn('Could not read expo-router version');
    }
    
    try {
      reactNavigationVersion = require('@react-navigation/native/package.json').version;
    } catch (e) {
      console.warn('Could not read react-navigation version');
    }
    
    console.log('Expo Router version:', expoRouterVersion);
    console.log('React Navigation version:', reactNavigationVersion);
    
    // Log environment vars safely without crashing if they're not available
    const envVars = {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'not available',
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '[redacted]' : 'not available',
    };
    
    console.log('Environment variables:', envVars);
    console.log('===========================');
  } catch (error) {
    // If debug logging fails, don't crash the app
    console.warn('Debug logging error:', error);
  }
};

export default function RootLayout() {
  // Wrap initialization in try/catch to prevent startup crashes
  useEffect(() => {
    try {
      debugEnv();
    } catch (error) {
      console.error("Error during app initialization:", error);
    }
  }, []);

  // Wrap the entire app with error handling
  const AppContent = () => {
    try {
      return (
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
      );
    } catch (error) {
      console.error("Error rendering app:", error);
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
            Something went wrong while starting the app.
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            Please try restarting the application.
          </Text>
        </View>
      );
    }
  };

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
} 