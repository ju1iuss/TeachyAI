import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../contexts/onboarding';

type Option = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
};

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setHerausforderungen } = useOnboarding();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const options: Option[] = [
    { icon: 'book-education-outline', text: 'Bessere Unterrichtsvorbereitung' },
    { icon: 'clock-outline', text: 'Zeitmangel im Unterricht' },
    { icon: 'account-group', text: 'Individuelle Schülerförderung' },
    { icon: 'clipboard-text-outline', text: 'Modernere Lehrmethoden' },
    { icon: 'brain', text: 'Digitale Unterrichtsgestaltung' },
  ];

  useEffect(() => {
    Animated.stagger(100, options.map((_, i) => 
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    )).start();
  }, []);

  const handleSelect = async (index: number) => {
    await Haptics.selectionAsync();
    setSelectedOption(index);
    setHerausforderungen(options[index].text);
  };

  // Check if step can continue
  const canContinue = () => {
    return selectedOption !== null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.replace('/(onboarding)')}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </Pressable>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
      </View>

      <Text style={styles.title}>Was sind deine größten Herausforderungen im Unterricht?</Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Animated.View
            key={index}
            style={{
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            }}
          >
            <Pressable
              style={[
                styles.optionButton,
                selectedOption === index && styles.optionButtonSelected
              ]}
              onPress={() => handleSelect(index)}
            >
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={selectedOption === index ? "white" : "black"} 
              />
              <Text style={[
                styles.optionText,
                selectedOption === index && styles.optionTextSelected
              ]}>{option.text}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.getStartedButton,
            !canContinue() && styles.continueButtonDisabled
          ]}
          onPress={() => canContinue() && router.push('/(onboarding)/experience')}
          disabled={!canContinue()}
        >
          <Text style={styles.continueText}>Weiter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 60,
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 40,
  },
  optionsContainer: {
    flex: 1,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#FFE5A5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  optionTextSelected: {
    color: '#000000',
  },
  footer: {
    paddingVertical: 20,
  },
  getStartedButton: {
    backgroundColor: '#FFE5A5',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 