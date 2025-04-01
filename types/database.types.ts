export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      lessons: {
        Row: {
          id: string
          user_id: string
          grade_level: string
          subject: string
          duration: string
          topic: string
          learning_objectives: string
          teaching_methods: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          grade_level: string
          subject: string
          duration: string
          topic: string
          learning_objectives: string
          teaching_methods: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          grade_level?: string
          subject?: string
          duration?: string
          topic?: string
          learning_objectives?: string
          teaching_methods?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          school: string | null
          subjects: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          school?: string | null
          subjects?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          school?: string | null
          subjects?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 