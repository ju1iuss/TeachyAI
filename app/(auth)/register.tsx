import { StyleSheet, View, Pressable, TextInput, ScrollView, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useOnboarding } from '../../contexts/onboarding';
import Animated from 'react-native-reanimated';

type CountryCode = {
  code: string;
  flag: string;
  dial_code: string;
};

const countryCodes: CountryCode[] = [
  { code: 'DE', flag: '🇩🇪', dial_code: '+49' },
  { code: 'AT', flag: '🇦🇹', dial_code: '+43' },
  { code: 'CH', flag: '🇨🇭', dial_code: '+41' },
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: onboardingData, reset: resetOnboarding } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      phone: '',
      password: '',
    };

    if (!email) {
      newErrors.email = 'Email ist erforderlich';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ungültige Email-Adresse';
      isValid = false;
    }

    if (!phoneNumber) {
      newErrors.phone = 'Telefonnummer ist erforderlich';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Passwort ist erforderlich';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen lang sein';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const signUpWithEmail = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const fullPhoneNumber = `${selectedCountry.dial_code}${phoneNumber}`;
    
    try {
      console.log('Starting signup process with metadata:', {
        phone: fullPhoneNumber,
        herausforderungen: onboardingData.herausforderungen,
        job: onboardingData.job,
        subjects: onboardingData.subjects
      });

      // Signup with all metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: fullPhoneNumber,
            herausforderungen: onboardingData.herausforderungen || '',
            job: onboardingData.job || '',
            subjects: onboardingData.subjects || ''
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        alert(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        console.error('No user data returned');
        alert('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
        setLoading(false);
        return;
      }

      console.log('User created successfully with metadata:', {
        userId: authData.user.id,
        metadata: authData.user.user_metadata
      });
      
      // Redirect to verify screen since email confirmation is now enabled
      router.push({
        pathname: '/(auth)/verify',
        params: { email }
      });
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.replace('/(onboarding)')}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </Pressable>

      <Text style={styles.title}>Erstelle dein{'\n'}Konto</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors(prev => ({ ...prev, email: '' }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.phoneContainer}>
          <Pressable 
            style={styles.countryButton}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={styles.countryButtonText}>
              {selectedCountry.flag} {selectedCountry.dial_code}
            </Text>
          </Pressable>
          <View style={styles.phoneInputContainer}>
            <TextInput
              style={styles.phoneInput}
              placeholder="Telefonnummer"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text.replace(/[^0-9]/g, ''));
                setErrors(prev => ({ ...prev, phone: '' }));
              }}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors(prev => ({ ...prev, password: '' }));
            }}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <Pressable 
          style={[
            styles.registerButton,
            loading && styles.registerButtonDisabled
          ]}
          onPress={signUpWithEmail}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            {loading ? 'Lädt...' : 'Registrieren'}
          </Text>
        </Pressable>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Bereits registriert? </Text>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.loginLink}>Anmelden</Text>
          </Link>
        </View>
      </View>

      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowCountryModal(false)}
        >
          <Animated.View 
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Land auswählen</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowCountryModal(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#000000" />
              </Pressable>
            </View>

            {countryCodes.map((country) => (
              <Pressable
                key={country.code}
                style={styles.countryOption}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryModal(false);
                }}
              >
                <Text style={styles.countryOptionText}>
                  {country.flag} {country.code}
                </Text>
                <Text style={styles.countryDialCode}>
                  {country.dial_code}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </ScrollView>
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
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginTop: 120,
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countryButton: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  countryButtonText: {
    fontSize: 16,
  },
  phoneInputContainer: {
    flex: 1,
    gap: 4,
  },
  phoneInput: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#000000',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#000000',
  },
  loginLink: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 8,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  countryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  countryOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  countryDialCode: {
    fontSize: 16,
    color: '#666666',
  },
}); 