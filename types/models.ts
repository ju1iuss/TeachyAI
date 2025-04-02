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

export type ContentCategory = 'lieblingslehrer' | 'finanzlehrer';
export type ContentType = 
  | 'news'
  | 'podcast-lehrer' 
  | 'podcast-finanz'
  | 'guide'
  | 'ebook'
  | 'contest'
  | 'calculator'
  | 'tutorial'
  | 'calendly';

export interface Content {
  id: string;
  category: ContentCategory;
  content_type: ContentType;
  title: string;
  text: string;
  image_url: string | null;
  file_url: string | null;
  video_url: string | null;
  external_url: string | null;
  parent_id: string | null;
  order_position: number;
  created_at: string;
  updated_at: string;
} 