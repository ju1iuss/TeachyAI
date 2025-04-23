import { StyleSheet, View, ScrollView, Pressable, Alert, Modal } from 'react-native';
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
  const { signOut, user, deleteAccount } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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
  
  const handleDeleteAccount = async () => {
    setLoading(true);
    const { error } = await deleteAccount();
    setLoading(false);
    
    if (error) {
      Alert.alert('Fehler', 'Konto konnte nicht gelöscht werden: ' + error.message);
      return;
    }
    
    // Redirect to login after successful deletion
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
        
        <Button 
          mode="outlined" 
          onPress={() => setShowDeleteConfirm(true)}
          style={styles.deleteButton}
          textColor="#FF3B30"
          icon="account-remove"
          labelStyle={styles.deleteButtonText}
          contentStyle={styles.deleteButtonContent}
        >
          Konto löschen
        </Button>
      </View>
      
      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Konto löschen</Text>
            <Text style={styles.modalDescription}>
              Bist du sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </Text>
            
            <View style={styles.modalButtonsContainer}>
              <Button 
                mode="outlined"
                onPress={() => setShowDeleteConfirm(false)}
                style={styles.modalCancelButton}
                textColor="#000000"
              >
                Abbrechen
              </Button>
              
              <Button 
                mode="contained"
                onPress={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteAccount();
                }}
                style={styles.modalDeleteButton}
                buttonColor="#FF3B30"
                textColor="#FFFFFF"
                loading={loading}
                disabled={loading}
              >
                Löschen
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
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
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  logoutSection: {
    padding: 20,
    marginHorizontal: 16,
    gap: 16,
  },
  logoutButton: {
    height: 56,
    borderRadius: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonContent: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    height: 56,
    borderRadius: 28,
    borderColor: '#FF3B30',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonContent: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FF3B30',
  },
  modalDescription: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalCancelButton: {
    flex: 1,
    borderColor: '#CCCCCC',
    height: 50,
    borderRadius: 25,
  },
  modalDeleteButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
  },
}); 