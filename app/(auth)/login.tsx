import { StyleSheet, View, Pressable, TextInput, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    console.log('Attempting to sign in with:', identifier);
    
    try {
      // Determine if the identifier is an email or phone number
      const isEmail = identifier.includes('@');
      const formattedPhone = isEmail ? null : formatPhoneNumber(identifier);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: isEmail ? identifier : `${formattedPhone}@phone.teachy.app`,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        Alert.alert(error.message);
        setLoading(false);
        return;
      }

      console.log('Sign in successful:', {
        user: data.user?.id,
        session: !!data.session
      });
      router.replace('/tabs');
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      Alert.alert('Ein unerwarteter Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add German country code if not present
    if (!cleaned.startsWith('49')) {
      return `+49${cleaned}`;
    }
    return `+${cleaned}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </Pressable>

      <Text style={styles.title}>Willkommen{'\n'}zurück</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email oder Telefonnummer"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={signIn}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? 'Lädt...' : 'Anmelden'}
          </Text>
        </Pressable>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Noch kein Konto? </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.registerLink}>Registrieren</Text>
          </Link>
        </View>
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
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginTop: 120,
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#000000',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#666666',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#000000',
  },
  registerLink: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
}); 