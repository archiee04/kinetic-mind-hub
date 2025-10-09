export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_at: string | null
          badge_name: string
          description: string | null
          id: string
          points: number | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          badge_name: string
          description?: string | null
          id?: string
          points?: number | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          badge_name?: string
          description?: string | null
          id?: string
          points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_logs: {
        Row: {
          duration: number | null
          exercise_name: string
          id: string
          logged_at: string | null
          reps: number | null
          sets: number | null
          user_id: string
          video_url: string | null
          weight: number | null
          workout_plan_id: string | null
        }
        Insert: {
          duration?: number | null
          exercise_name: string
          id?: string
          logged_at?: string | null
          reps?: number | null
          sets?: number | null
          user_id: string
          video_url?: string | null
          weight?: number | null
          workout_plan_id?: string | null
        }
        Update: {
          duration?: number | null
          exercise_name?: string
          id?: string
          logged_at?: string | null
          reps?: number | null
          sets?: number | null
          user_id?: string
          video_url?: string | null
          weight?: number | null
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          deadline: string | null
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          progress: number | null
          target_value: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          goal_type: Database["public"]["Enums"]["goal_type"]
          id?: string
          progress?: number | null
          target_value: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          progress?: number | null
          target_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number | null
          carbs: number | null
          fats: number | null
          id: string
          logged_at: string | null
          name: string
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          id?: string
          logged_at?: string | null
          name: string
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          id?: string
          logged_at?: string | null
          name?: string
          protein?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_goals: {
        Row: {
          carb_target: number | null
          created_at: string | null
          daily_calories_target: number | null
          fat_target: number | null
          id: string
          protein_target: number | null
          user_id: string
        }
        Insert: {
          carb_target?: number | null
          created_at?: string | null
          daily_calories_target?: number | null
          fat_target?: number | null
          id?: string
          protein_target?: number | null
          user_id: string
        }
        Update: {
          carb_target?: number | null
          created_at?: string | null
          daily_calories_target?: number | null
          fat_target?: number | null
          id?: string
          protein_target?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          gender: string | null
          height: number | null
          id: string
          name: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          gender?: string | null
          height?: number | null
          id: string
          name: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          name?: string
          weight?: number | null
        }
        Relationships: []
      }
      vitals_logs: {
        Row: {
          blood_pressure: string | null
          body_fat: number | null
          heart_rate: number | null
          id: string
          logged_at: string | null
          sleep_hours: number | null
          stress_level: number | null
          user_id: string
          weight: number | null
        }
        Insert: {
          blood_pressure?: string | null
          body_fat?: number | null
          heart_rate?: number | null
          id?: string
          logged_at?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id: string
          weight?: number | null
        }
        Update: {
          blood_pressure?: string | null
          body_fat?: number | null
          heart_rate?: number | null
          id?: string
          logged_at?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vitals_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          duration: string | null
          id: string
          plan_name: string
          schedule: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          duration?: string | null
          id?: string
          plan_name: string
          schedule?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          duration?: string | null
          id?: string
          plan_name?: string
          schedule?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
      goal_type:
        | "weight_loss"
        | "muscle_gain"
        | "endurance"
        | "flexibility"
        | "general_fitness"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      difficulty_level: ["beginner", "intermediate", "advanced"],
      goal_type: [
        "weight_loss",
        "muscle_gain",
        "endurance",
        "flexibility",
        "general_fitness",
      ],
    },
  },
} as const
