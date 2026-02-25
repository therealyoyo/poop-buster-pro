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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          additional_comments: string | null
          address: string | null
          city: string | null
          created_at: string
          data_processing_consent: boolean | null
          dog_count: number
          dog_details: Json | null
          dog_names: Json | null
          email: string | null
          first_name: string
          garden_size: string | null
          gate_code: string | null
          gate_entry_type: string | null
          gate_location: string | null
          gate_location_other: string | null
          gate_special_instructions: string | null
          id: string
          internal_notes: string | null
          is_recurring: boolean | null
          last_name: string
          lat: number | null
          lng: number | null
          mailing_consent: boolean | null
          paused_until: string | null
          payment_intent: string | null
          payment_question: string | null
          phone: string | null
          pipeline_stage: string
          postal_code: string | null
          preferred_day: string | null
          promo_code: string | null
          quarterly_billing: boolean | null
          referral_source: string | null
          service_frequency: string | null
          status: string
          street_name: string | null
          street_number: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          terms_accepted: boolean | null
          updated_at: string
          user_id: string | null
          zone_id: string | null
        }
        Insert: {
          additional_comments?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          data_processing_consent?: boolean | null
          dog_count?: number
          dog_details?: Json | null
          dog_names?: Json | null
          email?: string | null
          first_name: string
          garden_size?: string | null
          gate_code?: string | null
          gate_entry_type?: string | null
          gate_location?: string | null
          gate_location_other?: string | null
          gate_special_instructions?: string | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          last_name: string
          lat?: number | null
          lng?: number | null
          mailing_consent?: boolean | null
          paused_until?: string | null
          payment_intent?: string | null
          payment_question?: string | null
          phone?: string | null
          pipeline_stage?: string
          postal_code?: string | null
          preferred_day?: string | null
          promo_code?: string | null
          quarterly_billing?: boolean | null
          referral_source?: string | null
          service_frequency?: string | null
          status?: string
          street_name?: string | null
          street_number?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id?: string | null
          zone_id?: string | null
        }
        Update: {
          additional_comments?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          data_processing_consent?: boolean | null
          dog_count?: number
          dog_details?: Json | null
          dog_names?: Json | null
          email?: string | null
          first_name?: string
          garden_size?: string | null
          gate_code?: string | null
          gate_entry_type?: string | null
          gate_location?: string | null
          gate_location_other?: string | null
          gate_special_instructions?: string | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          last_name?: string
          lat?: number | null
          lng?: number | null
          mailing_consent?: boolean | null
          paused_until?: string | null
          payment_intent?: string | null
          payment_question?: string | null
          phone?: string | null
          pipeline_stage?: string
          postal_code?: string | null
          preferred_day?: string | null
          promo_code?: string | null
          quarterly_billing?: boolean | null
          referral_source?: string | null
          service_frequency?: string | null
          status?: string
          street_name?: string | null
          street_number?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "service_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          code_postal: string
          commentaire: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          status: string
        }
        Insert: {
          code_postal: string
          commentaire?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          status?: string
        }
        Update: {
          code_postal?: string
          commentaire?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      financials: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          paid_at: string | null
          stripe_event_id: string | null
          stripe_invoice_id: string | null
          stripe_subscription_id: string | null
          type: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          paid_at?: string | null
          stripe_event_id?: string | null
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          paid_at?: string | null
          stripe_event_id?: string | null
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          admin_id: string | null
          client_id: string
          completed_at: string | null
          completion_message: string | null
          created_at: string
          id: string
          job_started_at: string | null
          photo_url: string | null
          scheduled_date: string
          sms_sent_arrival: boolean | null
          sms_sent_completion: boolean | null
          status: string
          tech_name: string | null
          updated_at: string
        }
        Insert: {
          admin_id?: string | null
          client_id: string
          completed_at?: string | null
          completion_message?: string | null
          created_at?: string
          id?: string
          job_started_at?: string | null
          photo_url?: string | null
          scheduled_date: string
          sms_sent_arrival?: boolean | null
          sms_sent_completion?: boolean | null
          status?: string
          tech_name?: string | null
          updated_at?: string
        }
        Update: {
          admin_id?: string | null
          client_id?: string
          completed_at?: string | null
          completion_message?: string | null
          created_at?: string
          id?: string
          job_started_at?: string | null
          photo_url?: string | null
          scheduled_date?: string
          sms_sent_arrival?: boolean | null
          sms_sent_completion?: boolean | null
          status?: string
          tech_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interventions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          additional_comments: string | null
          address: string | null
          city: string | null
          created_at: string | null
          data_processing_consent: boolean | null
          dog_count: number | null
          dog_details: Json | null
          dog_names: Json | null
          email: string
          first_name: string | null
          garden_size: string | null
          gate_entry_type: string | null
          gate_location: string | null
          gate_location_other: string | null
          gate_special_instructions: string | null
          id: string
          last_name: string | null
          mailing_consent: boolean | null
          payment_intent: string | null
          payment_question: string | null
          phone: string | null
          postal_code: string | null
          promo_code: string | null
          quarterly_billing: boolean | null
          referral_source: string | null
          service_frequency: string | null
          status: string | null
          street_name: string | null
          street_number: string | null
          terms_accepted: boolean | null
          updated_at: string | null
        }
        Insert: {
          additional_comments?: string | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          dog_count?: number | null
          dog_details?: Json | null
          dog_names?: Json | null
          email: string
          first_name?: string | null
          garden_size?: string | null
          gate_entry_type?: string | null
          gate_location?: string | null
          gate_location_other?: string | null
          gate_special_instructions?: string | null
          id?: string
          last_name?: string | null
          mailing_consent?: boolean | null
          payment_intent?: string | null
          payment_question?: string | null
          phone?: string | null
          postal_code?: string | null
          promo_code?: string | null
          quarterly_billing?: boolean | null
          referral_source?: string | null
          service_frequency?: string | null
          status?: string | null
          street_name?: string | null
          street_number?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          additional_comments?: string | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          dog_count?: number | null
          dog_details?: Json | null
          dog_names?: Json | null
          email?: string
          first_name?: string | null
          garden_size?: string | null
          gate_entry_type?: string | null
          gate_location?: string | null
          gate_location_other?: string | null
          gate_special_instructions?: string | null
          id?: string
          last_name?: string | null
          mailing_consent?: boolean | null
          payment_intent?: string | null
          payment_question?: string | null
          phone?: string | null
          postal_code?: string | null
          promo_code?: string | null
          quarterly_billing?: boolean | null
          referral_source?: string | null
          service_frequency?: string | null
          status?: string | null
          street_name?: string | null
          street_number?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          intervention_id: string | null
          is_read: boolean
          photo_url: string | null
          sender_id: string
          sender_role: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          intervention_id?: string | null
          is_read?: boolean
          photo_url?: string | null
          sender_id: string
          sender_role: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          intervention_id?: string | null
          is_read?: boolean
          photo_url?: string | null
          sender_id?: string
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          base_price: number
          created_at: string | null
          dog_count_max: number
          dog_count_min: number
          frequency: string
          garden_size: string
          id: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          created_at?: string | null
          dog_count_max: number
          dog_count_min: number
          frequency: string
          garden_size: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string | null
          dog_count_max?: number
          dog_count_min?: number
          frequency?: string
          garden_size?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          accepted_at: string | null
          accepted_by_name: string | null
          admin_notes: string | null
          base_price: number
          client_id: string
          created_at: string | null
          dog_count: number
          frequency: string
          garden_size: string
          id: string
          line_items: Json | null
          preferred_day: string | null
          sent_at: string | null
          status: string | null
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          terms_text: string | null
          token: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_name?: string | null
          admin_notes?: string | null
          base_price: number
          client_id: string
          created_at?: string | null
          dog_count: number
          frequency: string
          garden_size: string
          id?: string
          line_items?: Json | null
          preferred_day?: string | null
          sent_at?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          terms_text?: string | null
          token?: string
          total_price: number
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by_name?: string | null
          admin_notes?: string | null
          base_price?: number
          client_id?: string
          created_at?: string | null
          dog_count?: number
          frequency?: string
          garden_size?: string
          id?: string
          line_items?: Json | null
          preferred_day?: string | null
          sent_at?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          terms_text?: string | null
          token?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      service_logs: {
        Row: {
          completion_timestamp: string | null
          created_at: string | null
          gate_closed_verified: boolean | null
          id: string
          job_id: string
          notes: string | null
          photo_url: string | null
          tech_name: string | null
        }
        Insert: {
          completion_timestamp?: string | null
          created_at?: string | null
          gate_closed_verified?: boolean | null
          id?: string
          job_id: string
          notes?: string | null
          photo_url?: string | null
          tech_name?: string | null
        }
        Update: {
          completion_timestamp?: string | null
          created_at?: string | null
          gate_closed_verified?: boolean | null
          id?: string
          job_id?: string
          notes?: string | null
          photo_url?: string | null
          tech_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      service_photos: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          intervention_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          intervention_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          intervention_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_photos_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      service_zones: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zones_service: {
        Row: {
          actif: boolean
          code_postal: string
          created_at: string
          id: string
          zone: string
        }
        Insert: {
          actif?: boolean
          code_postal: string
          created_at?: string
          id?: string
          zone: string
        }
        Update: {
          actif?: boolean
          code_postal?: string
          created_at?: string
          id?: string
          zone?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
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
      app_role: ["admin", "client"],
    },
  },
} as const
