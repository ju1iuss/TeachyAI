export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  school?: string;
  subjects?: string[];
  federal_state?: string;
  experience_years?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  grade_level: string;
  duration: number;
  content: any;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
} 