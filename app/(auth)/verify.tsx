import { StyleSheet, View, Pressable, TextInput } from 'react-native';
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
  const inputRefs = useRef<TextInput[]>([]);

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
      alert('Bitte geben Sie den vollständigen Code ein');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email as string,
        token,
        type: 'email',
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        router.replace('/tabs');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      const { error } = await supabase.auth.resend({
        email: email as string,
        type: 'signup',
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert('Code wurde erneut gesendet');
    } catch (error) {
      console.error('Error resending code:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
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
            <TextInput
              key={index}
              ref={(ref) => ref && (inputRefs.current[index] = ref)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text.replace(/[^0-9]/g, ''), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              selectionColor="#FFE5A5"
            />
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

        <Pressable 
          style={styles.resendButton}
          onPress={resendCode}
        >
          <Text style={styles.resendText}>Code erneut senden</Text>
        </Pressable>
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
  codeInput: {
    width: 50,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
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
  resendButton: {
    padding: 12,
  },
  resendText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
}); 