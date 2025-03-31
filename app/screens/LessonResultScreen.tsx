import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

type LessonResultScreenProps = {
  route: {
    params: {
      formData: {
        gradeLevel: string | null;
        subject: string | null;
        duration: string | null;
        topic: string;
        learningObjectives: string;
        teachingMethods: string[];
      }
    }
  }
}

export default function LessonResultScreen({ route }: LessonResultScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { formData } = route.params;
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={24} color="#000000" onPress={() => navigation.goBack()} />
        <Text style={styles.headline}>Dein Unterricht</Text>
        <Icon name="share-variant" size={24} color="#000000" />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Überblick</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {formData.gradeLevel} • {formData.subject} • {formData.duration}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lernziele</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {formData.learningObjectives || 'Keine spezifischen Lernziele angegeben'}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unterrichtsablauf</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Thema: {formData.topic || 'Kein spezifisches Thema angegeben'}
            </Text>
            {formData.teachingMethods.length > 0 && (
              <Text style={[styles.cardText, styles.methodsText]}>
                Methoden: {formData.teachingMethods.join(', ')}
              </Text>
            )}
          </View>
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
    marginTop: 70,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666666',
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
  },
  methodsText: {
    marginTop: 8,
  },
}); 