import { StyleSheet, View, Animated, Easing } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ONBOARDING_COMPLETE = 'onboarding_complete';

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const completeOnboarding = async () => {
      try {
        await AsyncStorage.setItem(ONBOARDING_COMPLETE, 'true');
        setTimeout(() => {
          router.replace('/(auth)/register');
        }, 2000);
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    };

    completeOnboarding();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View 
        style={[
          styles.contentContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.title}>Wir richten alles für{'\n'}dich ein</Text>
        <Text style={styles.subtitle}>Personalisierung deines Lehrplans</Text>
        
        <View style={styles.loaderContainer}>
          <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]}>
            <MaterialCommunityIcons name="cog" size={48} color="#000000" />
          </Animated.View>
          <View style={styles.loaderOverlay}>
            <MaterialCommunityIcons name="school" size={24} color="#000000" />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  loaderContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
  },
  loaderOverlay: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
  },
}); 