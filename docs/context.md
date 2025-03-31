# Teachy – Die KI-gestützte App für Lehrkräfte

## Übersicht
Teachy ist eine innovative Bildungs-App, die speziell für Lehrkräfte entwickelt wurde. Sie kombiniert KI-gestützte Unterrichtsgenerierung mit aktuellen Bildungsnachrichten und Fachinhalten. Die gesamte Benutzeroberfläche ist auf Deutsch und wurde für maximale Benutzerfreundlichkeit optimiert.

## Inhaltsverzeichnis
1. [Onboarding-Prozess](#1-onboarding-prozess)
2. [App-Struktur](#2-app-struktur)
3. [Hauptmodule](#3-hauptmodule)
4. [Benutzeroberfläche](#4-benutzeroberfläche)
5. [Technische Spezifikationen](#5-technische-spezifikationen)
6. [Roadmap](#6-roadmap)
7. [Technische Architektur](#7-technische-architektur)

## Tech Stack
- Frontend: React Native mit TypeScript, Expo und Expo Router
- Backend/Datenbank: Supabase
- UI-Framework: React Native Paper

## 1. Onboarding-Prozess

### 1.1 Authentifizierung
#### SMS-basierte Verifizierung (Clerk)
- **Prozessablauf:**
  1. Eingabe der Mobilnummer
  2. Empfang des One-Time Passwords (OTP)
  3. OTP-Verifizierung
  4. Automatische Weiterleitung

#### Dateneingabe
- **Erfasste Informationen:**
  - Persönliche Daten
    - Vor- und Nachname
    - E-Mail-Adresse
  - Berufliche Informationen
    - Unterrichtsfächer
    - Schulform
    - Bundesland
    - Berufserfahrung
- **UX-Optimierung:**
  - Fortschrittsanzeige
  - Kontextsensitive Hilfe
  - Emoji-Integration für bessere Nutzerführung
  - Validierung in Echtzeit

## 2. App-Struktur

### 2.1 Navigation
- **Persistenter Footer**
  - Drei-Modul-System
  - Schnelle Zugänglichkeit
  - Intuitive Icons
  - Aktive Zustandsanzeige

### 2.2 Hauptbereiche
1. Lieblingslehrer (Links)
2. Finanzlehrer (Mitte)
3. teachy AI (Rechts)

## 3. Hauptmodule

### 3.1 Lieblingslehrer
#### Content-Kategorien
1. **Lehrer Guide**
   - Studiumsphase
     - Praktikumsvorbereitung
     - Studienmaterialien
     - Prüfungsvorbereitung
   - Referendariat
     - Unterrichtsplanung
     - Lehrproben
     - Zeitmanagement
   - Berufseinstieg
     - Klassenführung
     - Elternarbeit
     - Kollegiale Zusammenarbeit

2. **Multimedia-Inhalte**
   - Podcast "Lieblingslehrer werden"
     - Wöchentliche Episoden
     - Expertengespräche
     - Best Practices
   - Video-Tutorials
   - Interaktive Workshops

3. **Ressourcen**
   - Downloadbereich
     - Unterrichtsvorlagen
     - Planungshilfen
     - Bewertungsbögen
   - Linksammlung
     - Bildungsportale
     - Fortbildungsangebote
     - Lehrerverbände

### 3.2 Finanzlehrer
#### Hauptfunktionen
1. **Bildungsinhalte**
   - Video-Tutorials
     - Grundlagen der Finanzbildung
     - Investmentstrategien
     - Altersvorsorge
   - Podcast "Finanzlehrer"
     - Experteninterviews
     - Marktanalysen
     - Praxistipps

2. **Ressourcen**
   - Kalkulationstools
   - Finanzplanungsvorlagen
   - Budgetierungshilfen

3. **Aktuelle Informationen**
   - Finanznachrichten
   - Marktanalysen
   - Gesetzesänderungen

### 3.3 teachy AI
#### KI-gestützte Unterrichtsgenerierung
1. **Formular-Struktur**
   - **Schritt 1: Basisinformationen**
     - Unterrichtsdauer
     - Fach
     - Klassenstufe
   
   - **Schritt 2: Inhaltliche Ausrichtung**
     - Themengebiet
     - Lernziele
     - Kompetenzbereiche
   
   - **Schritt 3: Methodische Gestaltung**
     - Sozialformen
     - Mediennutzung
     - Differenzierungsoptionen
   
   - **Schritt 4: Zusatzoptionen**
     - Förderbedarfe
     - Materialwünsche
     - Besondere Anforderungen

2. **Generierungsprozess**
   - Webhook-Integration
   - Datenverarbeitung
   - Ergebnisdarstellung

## 4. Benutzeroberfläche

### 4.1 Design-Philosophie
- **Farbschema:** Hell und freundlich
- **Typography:** Klar und lesbar
- **Icons:** Intuitiv und konsistent
- **Emoji-Integration:** Gezielt zur UX-Verbesserung

### 4.2 Interaktionselemente
- **Share-Button**
  - Position: Rechte obere Ecke
  - Teilungsoptionen:
    - WhatsApp
    - E-Mail
    - Messenger
    - Social Media

### 4.3 Responsive Design
- **Geräteunterstützung:**
  - Smartphones
  - Tablets
  - Desktop

## 5. Technische Spezifikationen

### 5.1 Backend-Systeme
- Clerk Authentication
- Webhook-System
- Datenbank-Integration

### 5.2 Frontend-Technologien
- React/Next.js
- Responsive Framework
- State Management

### 5.3 Sicherheit
- Ende-zu-Ende-Verschlüsselung
- DSGVO-Konformität
- Regelmäßige Sicherheitsaudits

## 6. Roadmap

### 6.1 Kurzfristige Ziele
- Integration der KI-Engine
- Erweiterung der Contentbasis
- Community-Features

### 6.2 Mittelfristige Ziele
- Kollaborative Funktionen
- Erweiterte Analytics
- Personalisierungsoptionen

### 6.3 Langfristige Vision
- KI-gestützte Lernpfade
- Integrierte Fortbildungsplattform
- Internationalisierung

## 7. Technische Architektur

### 7.1 Datenbankschema (Supabase)

#### Tabellen

##### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  school TEXT,
  subjects TEXT[],
  federal_state TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

##### lessons
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  duration INTEGER NOT NULL,
  content JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

##### resources
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  module TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

##### user_favorites
```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  resource_id UUID REFERENCES resources(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, resource_id)
);
```

##### news_articles
```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  module TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7.2 Projektstruktur

```
teachy/
├── app/                      # Expo Router Dateien
│   ├── (auth)/              # Authentifizierung-bezogene Screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding/
│   ├── (tabs)/              # Tab-Navigation
│   │   ├── index.tsx        # Home Screen
│   │   ├── favorites.tsx
│   │   └── profile.tsx
│   └── _layout.tsx          # Root Layout
├── assets/                   # Statische Assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── components/              # Wiederverwendbare Komponenten
│   ├── common/             # Gemeinsame UI-Komponenten
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── features/           # Feature-spezifische Komponenten
│   │   ├── lessons/
│   │   ├── finance/
│   │   └── ai/
│   └── layout/             # Layout-Komponenten
├── constants/              # Konstanten und Konfiguration
│   ├── colors.ts
│   ├── typography.ts
│   └── config.ts
├── hooks/                  # Custom Hooks
│   ├── useAuth.ts
│   ├── useDatabase.ts
│   └── useTheme.ts
├── services/              # API und Service Layer
│   ├── api/
│   ├── supabase/
│   └── clerk/
├── store/                 # State Management
│   ├── auth/
│   ├── lessons/
│   └── settings/
├── types/                 # TypeScript Typdefinitionen
│   ├── models.ts
│   └── api.ts
├── utils/                 # Hilfsfunktionen
│   ├── formatting.ts
│   └── validation.ts
├── .gitignore
├── app.json
├── App.tsx
├── babel.config.js
├── package.json
└── tsconfig.json
```

### 7.3 Wichtige Technische Konventionen

#### Datenbankzugriff
- Verwendung von Supabase Client für alle Datenbankoperationen
- Row Level Security (RLS) für Datenzugriffskontrolle
- Typed Queries mit TypeScript

#### Authentifizierung
- Clerk.dev für User Management
- JWT-basierte Session Handling
- Sichere Token-Speicherung

#### State Management
- Zustand für globalen State
- React Query für Server State
- AsyncStorage für persistente Daten

#### Styling
- React Native Paper als UI-Framework
- Einheitliches Theming System
- Responsive Design mit flexiblen Layouts

#### Code Organisation
- Feature-first Ordnerstruktur
- Atomic Design für Komponenten
- Strikte Typisierung mit TypeScript

---

*Letzte Aktualisierung: [DATUM]*
