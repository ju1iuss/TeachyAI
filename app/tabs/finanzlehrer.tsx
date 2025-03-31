import { StyleSheet, View, ScrollView, Pressable, Image, Dimensions, RefreshControl, ActivityIndicator, Share } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface FinanzNews {
  id: number;
  title: string;
  text: string;
  image?: string;
}

export default function FinanzLehrerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - 48) / 2;

  const [newsData, setNewsData] = useState<FinanzNews[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNews = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('finanznews')
        .select('id, title, text, image');
        
      if (supabaseError) {
        console.error('Error fetching news:', supabaseError);
        setError('Fehler beim Laden der Nachrichten');
        return;
      }
      
      console.log('Fetched news data:', data);
      setNewsData(data || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNews();
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);
  
  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Entdecke Teachy - die App, die Finanzwissen leicht macht! Mit aktuellen Finanz-News und Ressourcen.',
        title: 'Teachy - Finanz News',
        url: 'https://teachy.app'
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const navigateToDetail = (article: FinanzNews) => {
    router.push({
      pathname: '/screens/NewsDetailScreen',
      params: {
        id: article.id.toString(),
        title: article.title,
        content: article.text,
        image_url: article.image || ''
      }
    });
  };
  
  const renderNewsGrid = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.emptyStateText}>Nachrichten werden geladen...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Icon name="alert-circle-outline" size={48} color="#666666" />
          <Text style={styles.emptyStateText}>{error}</Text>
          <Pressable onPress={fetchNews} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Erneut versuchen</Text>
          </Pressable>
        </View>
      );
    }

    if (!newsData.length) {
      return (
        <View style={styles.emptyState}>
          <Icon name="newspaper-variant-outline" size={48} color="#666666" />
          <Text style={styles.emptyStateText}>Keine Nachrichten verfügbar</Text>
        </View>
      );
    }

    return newsData.map((article, index) => {
      // Featured article (first item)
      if (index === 0) {
        return (
          <Pressable
            key={article.id}
            onPress={() => navigateToDetail(article)}
          >
            <Card style={styles.wideCard} mode="contained">
              {article.image && (
                <Card.Cover source={{ uri: article.image }} style={styles.wideCover} />
              )}
              <Card.Content style={styles.wideCardContent}>
                <View style={styles.wideCardText}>
                  <Text style={styles.wideTitle}>{article.title}</Text>
                  <Text style={styles.wideContent} numberOfLines={2}>
                    {article.text}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Pressable>
        );
      }

      // Grid items (remaining articles)
      if (index % 2 === 1) {
        const nextArticle = newsData[index + 1];
        return (
          <View key={article.id} style={styles.gridRow}>
            {/* Left Card */}
            <Pressable
              style={[styles.gridItem, { width: cardWidth }]}
              onPress={() => navigateToDetail(article)}
            >
              <Card style={styles.smallCard} mode="contained">
                {article.image && (
                  <Card.Cover source={{ uri: article.image }} style={styles.smallImage} />
                )}
                <Card.Content style={styles.smallCardContent}>
                  <Text style={styles.smallTitle} numberOfLines={2}>{article.title}</Text>
                  <Text style={styles.smallContent} numberOfLines={2}>{article.text}</Text>
                </Card.Content>
              </Card>
            </Pressable>

            {/* Right Card */}
            {nextArticle && (
              <Pressable
                style={[styles.gridItem, { width: cardWidth }]}
                onPress={() => navigateToDetail(nextArticle)}
              >
                <Card style={styles.smallCard} mode="contained">
                  {nextArticle.image && (
                    <Card.Cover source={{ uri: nextArticle.image }} style={styles.smallImage} />
                  )}
                  <Card.Content style={styles.smallCardContent}>
                    <Text style={styles.smallTitle} numberOfLines={2}>{nextArticle.title}</Text>
                    <Text style={styles.smallContent} numberOfLines={2}>{nextArticle.text}</Text>
                  </Card.Content>
                </Card>
              </Pressable>
            )}
          </View>
        );
      }
      return null;
    });
  };
  
  return (
    <ScrollView 
      style={[styles.container]} 
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
      <View style={[styles.header, { marginTop: insets.top + 40 }]}>
        <Text style={styles.headline}>Finanz News</Text>
        <View style={styles.headerIcons}>
          <Pressable onPress={handleShare} hitSlop={10}>
            <Icon name="share-variant" size={24} color="#000000" style={styles.headerIcon} />
          </Pressable>
          <Pressable onPress={handleLogout} hitSlop={10}>
            <Icon name="logout" size={24} color="#000000" />
          </Pressable>
        </View>
      </View>

      {renderNewsGrid()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  headline: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  smallCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowColor: 'transparent',
    borderWidth: 0,
    overflow: 'hidden',
  },
  smallImage: {
    height: 120,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  smallCategory: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  coloredCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 16,
    height: 120,
  },
  wideCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowColor: 'transparent',
    borderWidth: 0,
  },
  wideCardContent: {
    padding: 16,
  },
  wideCardText: {
    flex: 1,
    marginRight: 16,
  },
  wideCategory: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  wideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  wideCover: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  wideContent: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  smallCardContent: {
    padding: 12,
  },
  smallContent: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 