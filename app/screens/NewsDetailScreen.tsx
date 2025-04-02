import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Pressable, Linking, Share, Image } from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useCallback, useEffect, useRef } from 'react';
import { ContentType } from '../../types/models';
import { WebView } from 'react-native-webview';
import { Audio } from 'expo-av';
import { haptics } from '../../utils/haptics';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PodcastPlayer = ({ fileUrl, title }: { fileUrl: string; title: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    loadAudio();
  }, [fileUrl]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Unload any existing audio
      if (sound) {
        await sound.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: fileUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      }
    } catch (err) {
      setError('Error loading audio');
      console.error('Error loading audio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis / 1000);
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await Promise.all([
          sound.pauseAsync(),
          haptics.medium()
        ]);
      } else {
        await Promise.all([
          sound.playAsync(),
          haptics.medium()
        ]);
      }
    } catch (err) {
      console.error('Error toggling playback:', err);
      haptics.error();
    }
  };

  const skipForward = async () => {
    if (!sound) return;
    try {
      const newPosition = Math.min(position + 10, duration);
      await Promise.all([
        sound.setPositionAsync(newPosition * 1000),
        haptics.light()
      ]);
    } catch (err) {
      console.error('Error skipping forward:', err);
      haptics.error();
    }
  };

  const skipBackward = async () => {
    if (!sound) return;
    try {
      const newPosition = Math.max(0, position - 10);
      await Promise.all([
        sound.setPositionAsync(newPosition * 1000),
        haptics.light()
      ]);
    } catch (err) {
      console.error('Error skipping backward:', err);
      haptics.error();
    }
  };

  if (error) {
    return (
      <View style={styles.playerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadAudio} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.playerContainer}>
        <Text style={styles.loadingText}>Loading audio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.playerContainer}>
      <View style={styles.playerControls}>
        <Pressable
          style={styles.playButton}
          onPress={togglePlayback}
        >
          <Icon 
            name={isPlaying ? "pause-circle" : "play-circle"} 
            size={64} 
            color="#000000" 
          />
        </Pressable>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={duration > 0 ? position / duration : 0}
          color="#000000"
          style={styles.progressBar}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.additionalControls}>
        <Pressable style={styles.controlButton} onPress={skipBackward}>
          <Icon name="rewind-10" size={32} color="#000000" />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={skipForward}>
          <Icon name="fast-forward-10" size={32} color="#000000" />
        </Pressable>
      </View>
    </View>
  );
};

export default function NewsDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Ensure all params are properly typed
  const imageUrl = typeof params.image_url === 'string' ? params.image_url : '';
  const fileUrl = typeof params.file_url === 'string' ? params.file_url : '';
  const videoUrl = typeof params.video_url === 'string' ? params.video_url : '';
  const externalUrl = typeof params.external_url === 'string' ? params.external_url : '';
  const contentType = typeof params.content_type === 'string' ? params.content_type as ContentType : 'news-lehrer';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleBack = async () => {
    await haptics.light();
    router.back();
  };

  const handleShare = async () => {
    try {
      await haptics.light();
      const result = await Share.share({
        message: 'Check out this content on Teachy!',
        url: 'https://teachy.app'
      });
      
      if (result.action === Share.sharedAction) {
        haptics.success();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      haptics.error();
    }
  };

  const handleOpenLink = async (url: string) => {
    try {
      await haptics.medium();
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening link:', error);
      haptics.error();
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case 'podcast-lehrer':
      case 'podcast-finanz':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.content}>{params.content}</Text>
            {fileUrl && (
              <PodcastPlayer fileUrl={fileUrl} title={params.title as string} />
            )}
          </View>
        );

      case 'news-lehrer':
      case 'news-finanz':
      case 'contest':
        return (
          <>
            {imageUrl && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: imageUrl }}
                  style={styles.coverImage}
                  resizeMode="cover"
                />
              </View>
            )}
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{params.title}</Text>
              <Text style={styles.content}>{params.content}</Text>
            </View>
          </>
        );

      case 'guide':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.content}>{params.content}</Text>
            {fileUrl && (
              <Button
                mode="contained"
                onPress={() => handleOpenLink(fileUrl)}
                style={styles.actionButton}
              >
                <Icon name="file-document" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                Guide öffnen
              </Button>
            )}
          </View>
        );

      case 'ebook':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.content}>{params.content}</Text>
            {fileUrl && (
              <Button
                mode="contained"
                onPress={() => handleOpenLink(fileUrl)}
                style={styles.actionButton}
              >
                <Icon name="book-open-variant" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                E-Book öffnen
              </Button>
            )}
          </View>
        );

      case 'calculator':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.content}>{params.content}</Text>
            {externalUrl && (
              <Button
                mode="contained"
                onPress={() => handleOpenLink(externalUrl)}
                style={styles.actionButton}
              >
                <Icon name="calculator" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                Rechner öffnen
              </Button>
            )}
          </View>
        );

      case 'tutorial':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.content}>{params.content}</Text>
            {videoUrl && (
              <View style={styles.videoContainer}>
                <WebView
                  source={{ uri: videoUrl }}
                  style={styles.video}
                  allowsFullscreenVideo
                />
              </View>
            )}
          </View>
        );

      case 'calendly':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.content}>{params.content}</Text>
            {externalUrl && (
              <View style={styles.calendlyContainer}>
                <WebView
                  source={{ uri: externalUrl }}
                  style={styles.calendly}
                  allowsFullscreenVideo
                />
              </View>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.content}>{params.content}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={[styles.header, { marginTop: insets.top + 20 }]}>
        <Icon name="arrow-left" size={24} color="#000" onPress={handleBack} />
        <Icon name="share-variant" size={24} color="#000" onPress={handleShare} />
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
        {renderContent()}
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
    backgroundColor: '#FFFFFF',
  },
  coverImage: {
    width: '100%',
    height: 300,
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
  actionButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  videoContainer: {
    marginTop: 24,
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  calendlyContainer: {
    marginTop: 24,
    width: '100%',
    height: 600,
    borderRadius: 16,
    overflow: 'hidden',
  },
  calendly: {
    flex: 1,
  },
  playerContainer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
  },
  playerControls: {
    alignItems: 'center',
    marginBottom: 24,
  },
  playButton: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  controlButton: {
    padding: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#FF0000',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    alignSelf: 'center',
  },
}); 