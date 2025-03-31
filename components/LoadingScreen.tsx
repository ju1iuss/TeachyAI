import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoadingScreen() {
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40 }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <ActivityIndicator size="large" color="#000000" />
        </Animated.View>
        
        <Text style={styles.title}>Unterrichtsplan wird erstellt</Text>
        <Text style={styles.subtitle}>Dies kann bis zu 45 Sekunden dauern...</Text>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{seconds} Sekunden</Text>
          <View style={[styles.progressBar, { width: `${Math.min((seconds / 45) * 100, 100)}%` }]} />
        </View>

        <Text style={styles.hint}>
          Wir nutzen modernste KI-Technologie, um einen personalisierten{'\n'}
          Unterrichtsplan für dich zu erstellen.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  timerContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  hint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 