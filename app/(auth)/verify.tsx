import { StyleSheet, View, Pressable, TextInput, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0.5)).current;

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to next input if there's a value
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async () => {
    const token = code.join('');
    if (token.length !== 6) {
      setError('Bitte gib den vollständigen Code ein');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email as string,
        token,
        type: 'email',
      });

      if (error) {
        setError('Der eingegebene Code ist ungültig. Bitte versuche es erneut.');
        // Reset all input fields for better UX when code is wrong
        setCode(['', '', '', '', '', '']);
        // Focus first input again
        inputRefs.current[0]?.focus();
        return;
      }

      if (data.session) {
        router.replace('/tabs');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      // Reset any previous states
      setError(null);
      setResendSuccess(false);
      
      const { error } = await supabase.auth.resend({
        email: email as string,
        type: 'signup',
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Show success animation
      setResendSuccess(true);
      
      // Reset animation values before starting
      checkmarkOpacity.setValue(0);
      checkmarkScale.setValue(0.5);
      
      // Create a more dynamic animation sequence
      Animated.parallel([
        // Fade in
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
        // Scale up
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true
        })
      ]).start();
      
      // After showing the animation, hide it after a delay
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(checkmarkOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(checkmarkScale, {
            toValue: 0.8,
            duration: 250,
            useNativeDriver: true
          })
        ]).start(() => {
          setResendSuccess(false);
        });
      }, 2500);
      
    } catch (error) {
      console.error('Error resending code:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </Pressable>

      <View style={styles.content}>
        <MaterialCommunityIcons name="email-check-outline" size={64} color="#FFE5A5" />
        
        <Text style={styles.title}>Email bestätigen</Text>
        <Text style={styles.subtitle}>
          Wir haben einen 6-stelligen Code an{'\n'}
          {email} gesendet
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <View key={index} style={styles.codeInputContainer}>
              <TextInput
                ref={(ref) => ref && (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text.replace(/[^0-9]/g, ''), index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                selectionColor="#FFE5A5"
              />
            </View>
          ))}
        </View>

        <Pressable 
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
          onPress={verifyCode}
          disabled={loading}
        >
          <Text style={styles.verifyText}>
            {loading ? 'Wird verifiziert...' : 'Code bestätigen'}
          </Text>
        </Pressable>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View style={styles.resendContainer}>
          {resendSuccess ? (
            <Animated.View 
              style={[
                styles.checkmarkContainer, 
                { 
                  opacity: checkmarkOpacity,
                  transform: [{ scale: checkmarkScale }]
                }
              ]}
            >
              <MaterialCommunityIcons name="check-circle" size={28} color="#4CAF50" />
              <Text style={styles.successText}>Code erneut gesendet!</Text>
            </Animated.View>
          ) : (
            <Pressable 
              style={styles.resendButton}
              onPress={resendCode}
            >
              <Text style={styles.resendText}>Code erneut senden</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  codeInputContainer: {
    position: 'relative',
  },
  codeInput: {
    width: 50,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  codeInputFilled: {
    borderColor: '#FFE5A5',
    backgroundColor: '#FFFAF0',
  },
  verifyButton: {
    backgroundColor: '#FFE5A5',
    borderRadius: 30,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 12,
    alignItems: 'center',
    height: 40, // Fixed height for both states
  },
  checkmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  resendButton: {
    padding: 12,
  },
  resendText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
  },
}); 