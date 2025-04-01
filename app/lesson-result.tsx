import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Share, Alert, Clipboard } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { haptics } from '../utils/haptics';

export default function LessonResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const lessonPlan = params.lessonPlan as string;
  const gradeLevel = params.gradeLevel as string;
  const subject = params.subject as string;
  const duration = params.duration as string;
  const topic = params.topic as string;
  const teachingMethods = JSON.parse(params.teachingMethods as string) as string[];

  const handleBack = async () => {
    await haptics.light();
    router.back();
  };

  const handleShare = async () => {
    try {
      await haptics.light();
      const result = await Share.share({
        message: `Unterrichtsplan für ${gradeLevel} - ${subject}\n\n${lessonPlan}`,
        title: 'Teachy - Unterrichtsplan',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await haptics.light();
      await Clipboard.setString(lessonPlan);
      Alert.alert('Erfolg', 'Der Unterrichtsplan wurde in die Zwischenablage kopiert.');
    } catch (error) {
      console.error('Error copying:', error);
      Alert.alert('Fehler', 'Der Unterrichtsplan konnte nicht kopiert werden.');
    }
  };

  const renderLessonPlanContent = () => {
    return lessonPlan.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        // Section headers (e.g., "# Lernziele")
        return (
          <Text key={index} style={styles.sectionHeader}>
            {line.replace('# ', '')}
          </Text>
        );
      } else if (line.startsWith('- ')) {
        // List items
        return (
          <Text key={index} style={styles.listItem}>
            {line}
          </Text>
        );
      } else if (line.startsWith('[') && line.endsWith(']')) {
        // Instructions/placeholders
        return (
          <Text key={index} style={styles.instruction}>
            {line.slice(1, -1)}
          </Text>
        );
      } else if (line.trim().length > 0) {
        // Regular content
        return (
          <Text key={index} style={styles.lessonPlanText}>
            {line}
          </Text>
        );
      }
      // Empty lines for spacing
      return <View key={index} style={styles.emptyLine} />;
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={10}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>Unterrichtsplan</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={handleCopy} hitSlop={10} style={styles.headerButton}>
            <Icon name="content-copy" size={24} color="#000000" />
          </Pressable>
          <Pressable onPress={handleShare} hitSlop={10} style={styles.headerButton}>
            <Icon name="share-variant" size={24} color="#000000" />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Details</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Klassenstufe</Text>
              <Text style={styles.infoValue}>{gradeLevel}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fach</Text>
              <Text style={styles.infoValue}>{subject}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Dauer</Text>
              <Text style={styles.infoValue}>{duration}</Text>
            </View>
            {topic && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Thema</Text>
                <Text style={styles.infoValue}>{topic}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.methodsContainer}>
            <Text style={styles.methodsTitle}>Unterrichtsmethoden</Text>
            <View style={styles.methodsList}>
              {teachingMethods.map((method, index) => (
                <View key={index} style={styles.methodPill}>
                  <Text style={styles.methodText}>{method}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.lessonPlanContainer}>
          {renderLessonPlanContent()}
        </View>
        
        {/* Bottom padding for better scrolling */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  methodsContainer: {
    marginTop: 8,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  methodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  methodPill: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 14,
    color: '#000000',
  },
  lessonPlanContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginTop: 24,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 8,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 8,
    paddingLeft: 16,
  },
  instruction: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  lessonPlanText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 8,
  },
  emptyLine: {
    height: 8,
  },
}); 