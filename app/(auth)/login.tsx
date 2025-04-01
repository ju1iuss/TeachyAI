import { StyleSheet, View, Pressable, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    console.log('Attempting to sign in with email:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        alert(error.message);
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
      alert('Ein unerwarteter Fehler ist aufgetreten');
      setLoading(false);
      return;
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

      <Text style={styles.title}>Willkommen{'\n'}zurück</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable 
          style={styles.loginButton}
          onPress={signInWithEmail}
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