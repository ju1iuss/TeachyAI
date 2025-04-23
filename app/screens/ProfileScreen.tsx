import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase, safeSupabaseOperation } from '../../lib/supabase';
import { errorLogger } from '../utils/errorLogger';

interface Profile {
  id: string;
  username: string;
  // Add other profile fields as needed
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await safeSupabaseOperation(
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .single();

        if (error) throw error;
        return data;
      },
      'Loading Profile'
    );

    if (error) {
      setError(error.message);
      errorLogger.logError(error, { context: 'Profile Screen' });
    } else {
      setProfile(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={loadProfile}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.text}>Username: {profile.username}</Text>
          {/* Add other profile information */}
        </View>
      ) : (
        <Text style={styles.text}>No profile found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  retryText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 