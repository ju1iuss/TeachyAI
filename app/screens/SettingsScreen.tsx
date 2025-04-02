import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('email, phone')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        setUserProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ScrollView 
      style={[styles.container]} 
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { marginTop: insets.top + 40 }]}>
        <Pressable 
          onPress={() => router.back()} 
          hitSlop={10}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headline}>Einstellungen</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profil</Text>
        <View style={styles.infoItem}>
          <Icon name="email" size={24} color="#666666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>E-Mail</Text>
            <Text style={styles.infoValue}>{userProfile?.email || 'Nicht gesetzt'}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Icon name="phone" size={24} color="#666666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Telefon</Text>
            <Text style={styles.infoValue}>{userProfile?.phone || 'Nicht gesetzt'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.infoItem}>
          <Icon name="information" size={24} color="#666666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
      </View>

      <View style={styles.logoutSection}>
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#FF3B30"
          textColor="#FFFFFF"
          icon="logout"
          labelStyle={styles.logoutButtonText}
          contentStyle={styles.logoutButtonContent}
        >
          Abmelden
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headline: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
  },
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    height: 48,
    borderRadius: 24,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButtonContent: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 