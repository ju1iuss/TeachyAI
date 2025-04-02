import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '../../contexts/onboarding';

type Subject = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
};

export default function SubjectsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setSubjects } = useOnboarding();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const subjects: Subject[] = [
    { icon: 'calculator', text: 'Mathematik' },
    { icon: 'book-open-variant', text: 'Deutsch' },
    { icon: 'translate', text: 'Englisch' },
    { icon: 'flask', text: 'Biologie' },
    { icon: 'atom', text: 'Chemie' },
    { icon: 'lightning-bolt', text: 'Physik' },
    { icon: 'earth', text: 'Erdkunde' },
    { icon: 'history', text: 'Geschichte' },
    { icon: 'palette', text: 'Kunst' },
    { icon: 'music', text: 'Musik' },
  ];

  useEffect(() => {
    Animated.stagger(100, subjects.map((_, i) => 
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    )).start();
  }, []);

  const handleSelect = async (subject: string) => {
    await Haptics.selectionAsync();
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      }
      return [...prev, subject];
    });
  };

  // Check if step can continue
  const canContinue = () => {
    return selectedSubjects.length > 0;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </Pressable>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
      </View>

      <Text style={styles.title}>Welche Fächer unterrichtest du?</Text>

      <View style={styles.subjectsContainer}>
        {subjects.map((subject, index) => (
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
                styles.subjectButton,
                selectedSubjects.includes(subject.text) && styles.subjectButtonSelected
              ]}
              onPress={() => handleSelect(subject.text)}
            >
              <MaterialCommunityIcons 
                name={subject.icon} 
                size={24} 
                color={selectedSubjects.includes(subject.text) ? "#FFFFFF" : "#000000"} 
              />
              <Text style={[
                styles.subjectText,
                selectedSubjects.includes(subject.text) && styles.subjectTextSelected
              ]}>{subject.text}</Text>
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
          onPress={() => {
            if (canContinue()) {
              setSubjects(selectedSubjects.join(', '));
              router.push('/(onboarding)/setup');
            }
          }}
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
  subjectsContainer: {
    flex: 1,
    gap: 12,
  },
  subjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 12,
  },
  subjectButtonSelected: {
    backgroundColor: '#45B7D1',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  subjectTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    paddingVertical: 20,
  },
  getStartedButton: {
    backgroundColor: '#45B7D1',
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