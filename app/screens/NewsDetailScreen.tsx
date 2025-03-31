import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useCallback } from 'react';

export default function NewsDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Ensure image_url is a string
  const imageUrl = typeof params.image_url === 'string' ? params.image_url : '';
  console.log('Image URL:', imageUrl);
  console.log('Params:', params);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={[styles.header, { marginTop: insets.top + 20 }]}>
        <Icon name="arrow-left" size={24} color="#000" onPress={() => router.back()} />
        <Icon name="share-variant" size={24} color="#000" />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            colors={['#000000']}
            progressBackgroundColor="#FFFFFF"
            progressViewOffset={20}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Card style={styles.imageCard} mode="contained">
              <Card.Cover 
                source={{ uri: imageUrl }} 
                style={styles.coverImage}
              />
            </Card>
          </View>
        )}

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{params.title}</Text>
          <Text style={styles.content}>{params.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 300,
  },
  imageCard: {
    elevation: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
}); 