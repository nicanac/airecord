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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string | null
          started_at: string
          ended_at: string | null
          audio_url: string | null
          status: string
          sentiment_score: number | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          started_at?: string
          ended_at?: string | null
          audio_url?: string | null
          status?: string
          sentiment_score?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          started_at?: string
          ended_at?: string | null
          audio_url?: string | null
          status?: string
          sentiment_score?: number | null
        }
      }
      transcripts: {
        Row: {
          id: string
          meeting_id: string
          speaker: string | null
          content: string
          start_time: number
          end_time: number
          embedding: string | null
        }
        Insert: {
          id?: string
          meeting_id: string
          speaker?: string | null
          content: string
          start_time: number
          end_time: number
          embedding?: string | null
        }
        Update: {
          id?: string
          meeting_id?: string
          speaker?: string | null
          content?: string
          start_time?: number
          end_time?: number
          embedding?: string | null
        }
      }
      action_items: {
        Row: {
          id: string
          meeting_id: string
          description: string
          assignee: string | null
          priority: string
          is_completed: boolean
        }
        Insert: {
          id?: string
          meeting_id: string
          description: string
          assignee?: string | null
          priority?: string
          is_completed?: boolean
        }
        Update: {
          id?: string
          meeting_id?: string
          description?: string
          assignee?: string | null
          priority?: string
          is_completed?: boolean
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
