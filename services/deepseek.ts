export type LessonPlanRequest = {
  gradeLevel: string;
  subject: string;
  duration: string;
  topic?: string;
  learningObjectives?: string;
  teachingMethods: string[];
};

export async function generateLessonPlan(request: LessonPlanRequest): Promise<string> {
  try {
    const systemPrompt = `Du bist ein erfahrener Lehrer und Experte für Unterrichtsplanung. 
Du erstellst detaillierte, praxisnahe und gut strukturierte Unterrichtspläne.
Deine Antworten sind klar gegliedert und folgen immer diesem Format:

# Lernziele
[Liste der konkreten Lernziele]

# Unterrichtsablauf
[Detaillierter, zeitlich gegliederter Ablaufplan]

# Materialien
[Liste aller benötigten Materialien]

# Differenzierung
[Vorschläge zur Differenzierung nach oben und unten]

# Hausaufgaben
[Sinnvolle, zum Unterricht passende Hausaufgaben]`;

    const userPrompt = `Erstelle einen Unterrichtsplan für:
- Klassenstufe: ${request.gradeLevel}
- Fach: ${request.subject}
- Dauer: ${request.duration}
${request.topic ? `- Thema: ${request.topic}` : ''}
${request.learningObjectives ? `- Gewünschte Lernziele: ${request.learningObjectives}` : ''}
- Unterrichtsmethoden: ${request.teachingMethods.join(', ')}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY?.trim()}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('DeepSeek API error:', error);
      if (error.error?.type === 'authentication_error') {
        throw new Error('API-Schlüssel ungültig. Bitte überprüfen Sie Ihre Einstellungen.');
      }
      throw new Error(`API-Fehler: ${error.error?.message || 'Unbekannter Fehler'}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Keine Antwort vom API-Server erhalten');
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Fehler bei der Generierung des Unterrichtsplans. Bitte versuche es später erneut.');
  }
} 