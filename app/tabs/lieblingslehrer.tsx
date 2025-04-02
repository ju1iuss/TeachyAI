import { StyleSheet, View, ScrollView, Pressable, Image, Dimensions, RefreshControl, ActivityIndicator, Share } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Content, ContentType } from '../../types/models';
import { haptics } from '../../utils/haptics';

const formatContentType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'news': 'NEWS',
    'podcast-lehrer': 'PODCAST',
    'guide': 'GUIDES',
    'ebook': 'E-BOOKS',
    'contest': 'WETTBEWERBE',
  };
  return typeMap[type] || type.toUpperCase();
};

export default function LieblingsLehrerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - 48) / 2;

  const [contentData, setContentData] = useState<Content[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchContent = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Fetch content types first
      const { data: typesData, error: typesError } = await supabase
        .from('content')
        .select('content_type')
        .eq('category', 'lieblingslehrer')
        .order('order_position');

      if (typesError) {
        console.error('Error fetching content types:', typesError);
        setError('Fehler beim Laden der Inhalte');
        return;
      }

      // Map news-lehrer to news for consistent type handling
      const mappedTypes = typesData.map(item => ({
        ...item,
        content_type: item.content_type === 'news-lehrer' ? 'news' : item.content_type
      }));

      const uniqueTypes = [...new Set(mappedTypes.map(item => item.content_type))] as ContentType[];
      setContentTypes(uniqueTypes);

      // Fetch content based on selected type or all if none selected
      let query = supabase
        .from('content')
        .select('*')
        .eq('category', 'lieblingslehrer')
        .order('order_position');

      if (selectedType) {
        if (selectedType === 'news') {
          query = query.eq('content_type', 'news-lehrer');
        } else {
          query = query.eq('content_type', selectedType);
        }
      }

      const { data, error: contentError } = await query;
        
      if (contentError) {
        console.error('Error fetching content:', contentError);
        setError('Fehler beim Laden der Inhalte');
        return;
      }
      
      // Map the content types in the fetched data
      const mappedContent = data?.map(item => ({
        ...item,
        content_type: item.content_type === 'news-lehrer' ? 'news' : item.content_type
      })) || [];
      
      setContentData(mappedContent);
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
    await fetchContent();
  }, [selectedType]);

  useEffect(() => {
    fetchContent();
  }, [selectedType]);
  
  const handleLogout = async () => {
    await haptics.medium();
    await signOut();
    router.replace('/login');
  };

  const handleShare = async () => {
    await haptics.light();
    try {
      const result = await Share.share({
        message: 'Entdecke Teachy - die App, die Unterrichtsvorbereitung leicht macht! Mit aktuellen Lehrerressourcen und News.',
        title: 'Teachy - Lehrer News',
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

  const navigateToSettings = async () => {
    await haptics.light();
    router.push('/screens/SettingsScreen');
  };

  const navigateToDetail = async (content: Content) => {
    await haptics.light();
    router.push({
      pathname: '/screens/NewsDetailScreen',
      params: {
        id: content.id,
        title: content.title,
        content: content.text,
        image_url: content.image_url || '',
        content_type: content.content_type,
        file_url: content.file_url,
        video_url: content.video_url,
        external_url: content.external_url,
      }
    });
  };
  
  const renderContentGrid = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.emptyStateText}>Inhalte werden geladen...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Icon name="alert-circle-outline" size={48} color="#666666" />
          <Text style={styles.emptyStateText}>{error}</Text>
          <Pressable onPress={fetchContent} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Erneut versuchen</Text>
          </Pressable>
        </View>
      );
    }

    if (!contentData.length) {
      return (
        <View style={styles.emptyState}>
          <Icon name="newspaper-variant-outline" size={48} color="#666666" />
          <Text style={styles.emptyStateText}>Keine Inhalte verfügbar</Text>
        </View>
      );
    }

    return contentData.map((content, index) => {
      switch (content.content_type) {
        case 'podcast-lehrer':
          return (
            <Pressable
              key={content.id}
              onPress={() => navigateToDetail(content)}
              style={styles.cardContainer}
            >
              <View style={styles.podcastCard}>
                <View style={styles.podcastContent}>
                  {content.image_url ? (
                    <Image source={{ uri: content.image_url }} style={styles.podcastImage} />
                  ) : (
                    <View style={[styles.podcastImage, styles.placeholderImage]}>
                      <Icon name="podcast" size={32} color="#FF6B6B" />
                    </View>
                  )}
                  <View style={styles.podcastTextContent}>
                    <Text style={styles.podcastEpisodeText}>Episode • {content.title}</Text>
                    <Text style={styles.podcastTitle} numberOfLines={2}>{content.text}</Text>
                    <View style={styles.podcastMeta}>
                      <Icon name="clock-outline" size={16} color="#666666" />
                      <Text style={styles.podcastMetaText}>36 min</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          );

        case 'guide':
          return (
            <Pressable
              key={content.id}
              onPress={() => navigateToDetail(content)}
              style={styles.cardContainer}
            >
              <View style={[styles.guideCard, !content.image_url && styles.cardWithoutImage]}>
                {content.image_url && (
                  <Image source={{ uri: content.image_url }} style={styles.guideImage} resizeMode="cover" />
                )}
                <View style={styles.guideContent}>
                  <Text style={styles.guideTag}>Guide</Text>
                  <Text style={styles.guideTitle}>{content.title}</Text>
                  <Text style={styles.guideDescription} numberOfLines={2}>{content.text}</Text>
                </View>
              </View>
            </Pressable>
          );

        case 'ebook':
          return (
            <Pressable
              key={content.id}
              onPress={() => navigateToDetail(content)}
              style={styles.cardContainer}
            >
              <View style={[styles.ebookCard, !content.image_url && styles.cardWithoutImage]}>
                <View style={styles.ebookContent}>
                  {content.image_url ? (
                    <Image source={{ uri: content.image_url }} style={styles.ebookCover} />
                  ) : (
                    <View style={[styles.ebookCover, styles.placeholderImage]}>
                      <Icon name="book" size={32} color="#F57C00" />
                    </View>
                  )}
                  <View style={styles.ebookTextContent}>
                    <Text style={styles.ebookTag}>E-Book</Text>
                    <Text style={styles.ebookTitle}>{content.title}</Text>
                    <Text style={styles.ebookDescription} numberOfLines={2}>{content.text}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );

        case 'news':
        default:
          // Featured news (first item)
          if (index === 0) {
            return (
              <Pressable
                key={content.id}
                onPress={() => navigateToDetail(content)}
                style={styles.cardContainer}
              >
                <View style={[styles.featuredNewsCard, !content.image_url && styles.cardWithoutImage]}>
                  {content.image_url && (
                    <Image 
                      source={{ uri: content.image_url }} 
                      style={styles.featuredNewsImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.featuredNewsContent}>
                    <Text style={styles.newsTag}>NEWS</Text>
                    <Text style={styles.newsTitle}>{content.title}</Text>
                    <Text style={styles.newsDescription} numberOfLines={2}>{content.text}</Text>
                  </View>
                </View>
              </Pressable>
            );
          }

          // Grid items for news (remaining content)
          if (index % 2 === 1) {
            const nextContent = contentData[index + 1];
            return (
              <View key={content.id} style={styles.gridRow}>
                <Pressable
                  style={[styles.gridItem, { width: cardWidth }]}
                  onPress={() => navigateToDetail(content)}
                >
                  <View style={[styles.smallNewsCard, !content.image_url && styles.cardWithoutImage]}>
                    {content.image_url && (
                      <Image source={{ uri: content.image_url }} style={styles.newsSmallImage} />
                    )}
                    <View style={styles.newsSmallContent}>
                      <Text style={styles.newsSmallTitle} numberOfLines={2}>{content.title}</Text>
                      <Text style={styles.newsSmallDescription} numberOfLines={2}>{content.text}</Text>
                    </View>
                  </View>
                </Pressable>

                {nextContent && (
                  <Pressable
                    style={[styles.gridItem, { width: cardWidth }]}
                    onPress={() => navigateToDetail(nextContent)}
                  >
                    <View style={[styles.smallNewsCard, !nextContent.image_url && styles.cardWithoutImage]}>
                      {nextContent.image_url && (
                        <Image source={{ uri: nextContent.image_url }} style={styles.newsSmallImage} />
                      )}
                      <View style={styles.newsSmallContent}>
                        <Text style={styles.newsSmallTitle} numberOfLines={2}>{nextContent.title}</Text>
                        <Text style={styles.newsSmallDescription} numberOfLines={2}>{nextContent.text}</Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              </View>
            );
          }
          return null;
      }
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
        <Text style={styles.headline}>Lehrer News</Text>
        <View style={styles.headerIcons}>
          <Pressable onPress={handleShare} hitSlop={10}>
            <Icon name="share-variant" size={24} color="#000000" style={styles.headerIcon} />
          </Pressable>
          <Pressable onPress={navigateToSettings} hitSlop={10}>
            <Icon name="cog" size={24} color="#000000" />
          </Pressable>
        </View>
      </View>

      {/* Content Type Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.contentTypeContainer}
      >
        <Pressable
          style={[
            styles.contentTypeItem,
            !selectedType && styles.contentTypeItemActive
          ]}
          onPress={async () => {
            await haptics.light();
            setSelectedType(null);
          }}
        >
          <Text style={[
            styles.contentTypeText,
            !selectedType && styles.contentTypeTextActive
          ]}>ALLE</Text>
        </Pressable>
        {contentTypes.map((type) => (
          <Pressable
            key={type}
            style={[
              styles.contentTypeItem,
              selectedType === type && styles.contentTypeItemActive
            ]}
            onPress={async () => {
              await haptics.light();
              setSelectedType(type);
            }}
          >
            <Text style={[
              styles.contentTypeText,
              selectedType === type && styles.contentTypeTextActive
            ]}>
              {formatContentType(type)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {renderContentGrid()}
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
  contentTypeContainer: {
    marginBottom: 16,
  },
  contentTypeItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  contentTypeItemActive: {
    backgroundColor: '#FF6B6B',
  },
  contentTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.5,
  },
  contentTypeTextActive: {
    color: '#FFFFFF',
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
  smallTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
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
  podcastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  podcastContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  podcastImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  podcastTextContent: {
    flex: 1,
  },
  podcastEpisodeText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  podcastMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  podcastMetaText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  guideCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  guideImage: {
    width: '100%',
    height: 160,
  },
  guideContent: {
    padding: 16,
  },
  guideTag: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  guideDescription: {
    fontSize: 14,
    color: '#666666',
  },
  ebookCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  ebookContent: {
    flexDirection: 'row',
    padding: 16,
  },
  ebookCover: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginRight: 16,
  },
  ebookTextContent: {
    flex: 1,
  },
  ebookTag: {
    color: '#F57C00',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  ebookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  ebookDescription: {
    fontSize: 14,
    color: '#666666',
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
  },
  newsCover: {
    height: 200,
    borderRadius: 16,
  },
  newsContent: {
    padding: 16,
  },
  newsTextContent: {
    flex: 1,
  },
  newsTag: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666666',
  },
  newsSmallCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  newsSmallImage: {
    height: 100,
    borderRadius: 12,
  },
  newsSmallContent: {
    padding: 12,
  },
  newsSmallTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  newsSmallDescription: {
    fontSize: 12,
    color: '#666666',
  },
  cardContainer: {
    marginBottom: 16,
  },
  cardWithoutImage: {
    height: 'auto',
    minHeight: 120,
  },
  placeholderImage: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredNewsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredNewsImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF',
  },
  featuredNewsContent: {
    padding: 16,
  },
  smallNewsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
}); 