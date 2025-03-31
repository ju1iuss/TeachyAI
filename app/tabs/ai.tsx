import React from 'react';
import { StyleSheet, View, Image, Pressable, TextInput, ScrollView, Share, ActivityIndicator, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { haptics } from '../../utils/haptics';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { generateLessonPlan } from '../../services/deepseek';
import LoadingScreen from '../../components/LoadingScreen';

// Form data type
export type FormData = {
  gradeLevel: string | null;
  subject: string | null;
  duration: string | null;
  topic: string;
  learningObjectives: string;
  teachingMethods: string[];
}

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    gradeLevel: null,
    subject: null,
    duration: null,
    topic: '',
    learningObjectives: '',
    teachingMethods: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    await haptics.medium();
    setShowOptions(true);
  };
  
  const handleBack = async () => {
    await haptics.light();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowOptions(false);
      setCurrentStep(1);
      setFormData({
        gradeLevel: null,
        subject: null,
        duration: null,
        topic: '',
        learningObjectives: '',
        teachingMethods: []
      });
    }
  };
  
  const handleContinue = async () => {
    await haptics.medium();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        setError(null);
        setIsGenerating(true);
        const lessonPlan = await generateLessonPlan({
          gradeLevel: formData.gradeLevel!,
          subject: formData.subject!,
          duration: formData.duration!,
          topic: formData.topic,
          learningObjectives: formData.learningObjectives,
          teachingMethods: formData.teachingMethods
        });
        
        // Navigate to result screen with form data and lesson plan
        router.push({
          pathname: '/lesson-result',
          params: {
            ...formData,
            teachingMethods: JSON.stringify(formData.teachingMethods),
            lessonPlan
          }
        });

        // Reset form
        setShowOptions(false);
        setCurrentStep(1);
        setFormData({
          gradeLevel: null,
          subject: null,
          duration: null,
          topic: '',
          learningObjectives: '',
          teachingMethods: []
        });
      } catch (error) {
        console.error('Error generating lesson plan:', error);
        setError(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten');
        Alert.alert(
          'Fehler',
          'Bei der Generierung des Unterrichtsplans ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsGenerating(false);
      }
    }
  };
  
  const selectGradeLevel = async (level: string) => {
    await haptics.light();
    setFormData({...formData, gradeLevel: level});
  };
  
  const selectSubject = async (subject: string) => {
    await haptics.light();
    setFormData({...formData, subject});
  };
  
  const selectDuration = async (duration: string) => {
    await haptics.light();
    setFormData({...formData, duration});
  };
  
  const toggleTeachingMethod = async (method: string) => {
    await haptics.light();
    if (formData.teachingMethods.includes(method)) {
      setFormData({
        ...formData, 
        teachingMethods: formData.teachingMethods.filter(m => m !== method)
      });
    } else {
      setFormData({
        ...formData,
        teachingMethods: [...formData.teachingMethods, method]
      });
    }
  };
  
  // Check if step can continue
  const canContinue = () => {
    switch(currentStep) {
      case 1:
        return !!formData.gradeLevel;
      case 2:
        return !!formData.subject;
      case 3:
        return !!formData.duration; // Topic and learning objectives are optional
      default:
        return false;
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };
  
  const handleShare = async () => {
    try {
      await haptics.light();
      const result = await Share.share({
        message: 'Entdecke Teachy - die App, die Unterrichtsvorbereitung leicht macht! Mit KI-gestützten Unterrichtsplänen und Ressourcen für Lehrer.',
        title: 'Teachy - Unterricht leicht gemacht',
        url: 'https://teachy.app'
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.optionsTitle}>
              Für welche Klassenstufe? <Text style={styles.requiredStar}>*</Text>
            </Text>
            
            <ScrollView style={styles.optionsScrollView}>
              <View style={styles.optionsGrid}>
                {['Klasse 5', 'Klasse 6', 'Klasse 7', 'Klasse 8', 'Klasse 9', 'Klasse 10', 
                  'Klasse 11', 'Klasse 12', 'Klasse 13'].map((level) => (
                  <Pressable 
                    key={level}
                    style={[
                      styles.optionPill, 
                      formData.gradeLevel === level && styles.optionPillSelected
                    ]}
                    onPress={() => selectGradeLevel(level)}
                    android_ripple={null}
                  >
                    <Text style={[
                      styles.optionPillText,
                      formData.gradeLevel === level && styles.optionPillTextSelected
                    ]}>{level}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </>
        );
      
      case 2:
        return (
          <>
            <Text style={styles.optionsTitle}>
              Welches Fach? <Text style={styles.requiredStar}>*</Text>
            </Text>
            
            <ScrollView style={styles.optionsScrollView}>
              <View style={styles.optionsGrid}>
                {['Mathematik', 'Deutsch', 'Englisch', 'Französisch', 'Biologie', 
                  'Chemie', 'Physik', 'Geschichte', 'Politik', 'Erdkunde', 'Musik', 'Kunst', 'Sport'].map((subject) => (
                  <Pressable 
                    key={subject}
                    style={[
                      styles.optionPill, 
                      formData.subject === subject && styles.optionPillSelected
                    ]}
                    onPress={() => selectSubject(subject)}
                    android_ripple={null}
                  >
                    <Text style={[
                      styles.optionPillText,
                      formData.subject === subject && styles.optionPillTextSelected
                    ]}>{subject}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </>
        );
      
      case 3:
        return (
          <>
            <Text style={styles.optionsTitle}>Unterrichtsdetails</Text>
            
            <ScrollView style={styles.optionsScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>
                Dauer <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.optionsRow}>
                {['30 min', '45 min', '60 min', '90 min'].map((duration) => (
                  <Pressable 
                    key={duration}
                    style={[
                      styles.optionSmallPill, 
                      formData.duration === duration && styles.optionPillSelected
                    ]}
                    onPress={() => selectDuration(duration)}
                    android_ripple={null}
                  >
                    <Text style={[
                      styles.optionPillText,
                      formData.duration === duration && styles.optionPillTextSelected
                    ]}>{duration}</Text>
                  </Pressable>
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>
                Thema <Text style={styles.optionalText}>(optional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="z.B. Prozentrechnung, Photosynthese..."
                value={formData.topic}
                onChangeText={(text) => setFormData({...formData, topic: text})}
              />
              
              <Text style={styles.sectionTitle}>
                Lernziele <Text style={styles.optionalText}>(optional)</Text>
              </Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                placeholder="z.B. Die Schüler verstehen den Zusammenhang zwischen..."
                value={formData.learningObjectives}
                onChangeText={(text) => setFormData({...formData, learningObjectives: text})}
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.sectionTitle}>Unterrichtsmethode</Text>
              <View style={styles.optionsGrid}>
                {['Frontalunterricht', 'Diskussionsbasiert', 'Interaktiv/Hands-on', 'Projektbasiert', 
                  'Gamification', 'Flipped Classroom', 'Inquiry-based Learning'].map((method) => (
                  <Pressable 
                    key={method}
                    style={[
                      styles.optionPill, 
                      formData.teachingMethods.includes(method) && styles.optionPillSelected
                    ]}
                    onPress={() => toggleTeachingMethod(method)}
                    android_ripple={null}
                  >
                    <Text style={[
                      styles.optionPillText,
                      formData.teachingMethods.includes(method) && styles.optionPillTextSelected
                    ]}>{method}</Text>
                  </Pressable>
                ))}
              </View>
              
              {/* Extra padding to ensure visibility above footer buttons */}
              <View style={{ height: 100 }} />
            </ScrollView>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, { paddingBottom: 0 }]}>
      {isGenerating ? (
        <LoadingScreen />
      ) : (
        <>
          <View style={[styles.header, { marginTop: insets.top + 40 }]}>
            <Text style={styles.headline}>Teachy AI 🤖</Text>
            <View style={styles.headerIcons}>
              <Pressable onPress={handleShare} hitSlop={10}>
                <Icon name="share-variant" size={24} color="#000000" style={styles.headerIcon} />
              </Pressable>
              <Pressable onPress={handleLogout} hitSlop={10}>
                <Icon name="logout" size={24} color="#000000" />
              </Pressable>
            </View>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {!showOptions ? (
            <View style={styles.contentContainer}>
              <View style={styles.welcomeContainer}>
                <Image 
                  source={require('../../assets/pong.png')}
                  style={styles.welcomeImage}
                  resizeMode="contain"
                />
                <Text style={styles.welcomeTitle}>Unterricht{'\n'}leicht gemacht</Text>
              </View>
              <View style={styles.welcomeFooter}>
                <Pressable 
                  style={styles.generateButton}
                  onPress={handleGenerate}
                  android_ripple={null}
                >
                  <Text style={styles.buttonText}>Jetzt starten</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.optionsContainer}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]} />
                  <View style={styles.stepLine} />
                  <View style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]} />
                  <View style={styles.stepLine} />
                  <View style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]} />
                </View>
                
                {renderStepContent()}
              </View>
              
              <View style={[styles.footerButtons, { paddingBottom: insets.bottom }]}>
                <View style={styles.buttonContainer}>
                  <Pressable 
                    style={[styles.backButton, isGenerating && styles.buttonDisabled]}
                    onPress={handleBack}
                    disabled={isGenerating}
                    android_ripple={null}
                  >
                    <Text style={styles.backButtonText}>Zurück</Text>
                  </Pressable>
                </View>
                
                <View style={styles.buttonContainer}>
                  <Pressable 
                    style={[
                      styles.continueButton,
                      (!canContinue() || isGenerating) && styles.continueButtonDisabled
                    ]}
                    onPress={handleContinue}
                    disabled={!canContinue() || isGenerating}
                    android_ripple={null}
                  >
                    {isGenerating ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.continueButtonText}>
                        {currentStep === 3 ? 'Erstellen' : 'Weiter'}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headline: {
    fontSize: 24,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  welcomeContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeImage: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 48,
  },
  welcomeFooter: {
    width: '100%',
    paddingHorizontal: 20,
  },
  generateButton: {
    backgroundColor: '#000000',
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  optionsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  requiredStar: {
    color: 'red',
    fontSize: 16,
  },
  optionalText: {
    color: '#777',
    fontSize: 14,
    fontWeight: 'normal',
  },
  optionsScrollView: {
    flex: 1,
    marginBottom: 16,
  },
  optionsGrid: {
    width: '100%',
    paddingBottom: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionPill: {
    width: '100%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  optionSmallPill: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  optionPillSelected: {
    backgroundColor: '#000000',
  },
  optionPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  optionPillTextSelected: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CCCCCC',
  },
  stepDotActive: {
    backgroundColor: '#000000',
  },
  stepLine: {
    height: 1,
    width: 40,
    backgroundColor: '#CCCCCC',
  },
  footerButtons: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 100,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000000',
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderRadius: 25,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
}); 