import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.languageContainer}>
        <Text style={styles.languageText}>🇩🇪 DE</Text>
      </View>

      <View style={styles.contentContainer}>
        <Image 
          source={require('../../assets/app.png')}
          style={styles.appImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Unterricht{'\n'}leicht gemacht</Text>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={styles.getStartedButton}
          onPress={() => router.push('/(onboarding)/goals')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </Pressable>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Bereits registriert? </Text>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.signInLink}>Anmelden</Text>
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
  },
  languageContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appImage: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 48,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  getStartedButton: {
    backgroundColor: '#000000',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    color: '#000000',
  },
  signInLink: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
}); 