import { StyleSheet, View, Pressable, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptics } from '../../utils/haptics';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;

  const handleLogin = async () => {
    await haptics.light();
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.upperSection, { marginTop: -insets.top }]}>
        <Image 
          source={require('../../assets/screen.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.lowerSectionContainer}>
        <View style={styles.lowerSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Dein idealer Unterricht,{'\n'}leicht gemacht.</Text>
            <Text style={styles.subtitle}>Erstelle einzigartige Unterrichtsstunden{'\n'}mit modernster KI-Unterstützung</Text>
          </View>

          <Pressable 
            style={styles.getStartedButton}
            onPress={() => router.push('/(onboarding)/goals')}
          >
            <Text style={styles.getStartedText}>Jetzt starten</Text>
          </Pressable>

          <Pressable 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Schon registriert? <Text style={styles.loginTextBold}>Login</Text></Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperSection: {
    height: '85%',
    overflow: 'hidden',
    zIndex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  lowerSectionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  lowerSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 34,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
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
  getStartedText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginTextBold: {
    fontWeight: '600',
    color: '#000000',
  },
}); 