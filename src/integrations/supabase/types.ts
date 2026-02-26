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
      agreements: {
        Row: {
          agreement_type: string
          client_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          monthly_amount: number | null
          quote_id: string | null
          signed_at: string | null
          signed_by_name: string | null
          start_date: string
          status: string | null
          terms_text: string | null
        }
        Insert: {
          agreement_type: string
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          monthly_amount?: number | null
          quote_id?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          start_date: string
          status?: string | null
          terms_text?: string | null
        }
        Update: {
          agreement_type?: string
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          monthly_amount?: number | null
          quote_id?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          start_date?: string
          status?: string | null
          terms_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agreements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          active: boolean | null
          id: string
          label: string
          required: boolean | null
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          id?: string
          label: string
          required?: boolean | null
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          id?: string
          label?: string
          required?: boolean | null
          sort_order?: number | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          additional_comments: string | null
          address: string | null
          assigned_technician_id: string | null
          city: string | null
          company: string | null
          created_at: string
          data_processing_consent: boolean | null
          dog_count: number
          dog_details: Json | null
          dog_names: Json | null
          email: string | null
          first_name: string
          follow_up_date: string | null
          form_part2_completed: boolean | null
          garden_size: string | null
          gate_code: string | null
          gate_entry_type: string | null
          gate_location: string | null
          gate_location_other: string | null
          gate_special_instructions: string | null
          id: string
          inactivated_at: string | null
          internal_notes: string | null
          is_duplicate: boolean | null
          is_recurring: boolean | null
          last_interaction_at: string | null
          last_name: string
          lat: number | null
          lead_source: string | null
          lng: number | null
          mailing_consent: boolean | null
          newsletter_sub: boolean | null
          out_of_zone: boolean | null
          paused_until: string | null
          payment_intent: string | null
          payment_question: string | null
          phone: string | null
          pipeline_stage: string
          postal_code: string | null
          preferred_day: string | null
          promo_code: string | null
          quarterly_billing: boolean | null
          referral_code: string | null
          referral_source: string | null
          referred_by: string | null
          service_frequency: string | null
          status: string
          street_name: string | null
          street_number: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tags: string[] | null
          terms_accepted: boolean | null
          updated_at: string
          user_id: string | null
          winback_sent_at: string | null
          zone_id: string | null
        }
        Insert: {
          additional_comments?: string | null
          address?: string | null
          assigned_technician_id?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          data_processing_consent?: boolean | null
          dog_count?: number
          dog_details?: Json | null
          dog_names?: Json | null
          email?: string | null
          first_name: string
          follow_up_date?: string | null
          form_part2_completed?: boolean | null
          garden_size?: string | null
          gate_code?: string | null
          gate_entry_type?: string | null
          gate_location?: string | null
          gate_location_other?: string | null
          gate_special_instructions?: string | null
          id?: string
          inactivated_at?: string | null
          internal_notes?: string | null
          is_duplicate?: boolean | null
          is_recurring?: boolean | null
          last_interaction_at?: string | null
          last_name: string
          lat?: number | null
          lead_source?: string | null
          lng?: number | null
          mailing_consent?: boolean | null
          newsletter_sub?: boolean | null
          out_of_zone?: boolean | null
          paused_until?: string | null
          payment_intent?: string | null
          payment_question?: string | null
          phone?: string | null
          pipeline_stage?: string
          postal_code?: string | null
          preferred_day?: string | null
          promo_code?: string | null
          quarterly_billing?: boolean | null
          referral_code?: string | null
          referral_source?: string | null
          referred_by?: string | null
          service_frequency?: string | null
          status?: string
          street_name?: string | null
          street_number?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tags?: string[] | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id?: string | null
          winback_sent_at?: string | null
          zone_id?: string | null
        }
        Update: {
          additional_comments?: string | null
          address?: string | null
          assigned_technician_id?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          data_processing_consent?: boolean | null
          dog_count?: number
          dog_details?: Json | null
          dog_names?: Json | null
          email?: string | null
          first_name?: string
          follow_up_date?: string | null
          form_part2_completed?: boolean | null
          garden_size?: string | null
          gate_code?: string | null
          gate_entry_type?: string | null
          gate_location?: string | null
          gate_location_other?: string | null
          gate_special_instructions?: string | null
          id?: string
          inactivated_at?: string | null
          internal_notes?: string | null
          is_duplicate?: boolean | null
          is_recurring?: boolean | null
          last_interaction_at?: string | null
          last_name?: string
          lat?: number | null
          lead_source?: string | null
          lng?: number | null
          mailing_consent?: boolean | null
          newsletter_sub?: boolean | null
          out_of_zone?: boolean | null
          paused_until?: string | null
          payment_intent?: string | null
          payment_question?: string | null
          phone?: string | null
          pipeline_stage?: string
          postal_code?: string | null
          preferred_day?: string | null
          promo_code?: string | null
          quarterly_billing?: boolean | null
          referral_code?: string | null
          referral_source?: string | null
          referred_by?: string | null
          service_frequency?: string | null
          status?: string
          street_name?: string | null
          street_number?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tags?: string[] | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id?: string | null
          winback_sent_at?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
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
      email_logs: {
        Row: {
          client_id: string | null
          email_type: string
          error_message: string | null
          id: string
          sent_at: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          client_id?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          client_id?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          id: string
          subject: string
          type: string
          updated_at: string | null
        }
        Insert: {
          body: string
          id?: string
          subject: string
          type: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          id?: string
          subject?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          client_id: string | null
          comment: string | null
          created_at: string | null
          feedback_type: string | null
          id: string
          intervention_id: string | null
          rating: number | null
        }
        Insert: {
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          intervention_id?: string | null
          rating?: number | null
        }
        Update: {
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          intervention_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
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
          client_notified_at: string | null
          completed_at: string | null
          completion_message: string | null
          created_at: string
          id: string
          job_started_at: string | null
          photo_url: string | null
          portal_visible: boolean | null
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
          client_notified_at?: string | null
          completed_at?: string | null
          completion_message?: string | null
          created_at?: string
          id?: string
          job_started_at?: string | null
          photo_url?: string | null
          portal_visible?: boolean | null
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
          client_notified_at?: string | null
          completed_at?: string | null
          completion_message?: string | null
          created_at?: string
          id?: string
          job_started_at?: string | null
          photo_url?: string | null
          portal_visible?: boolean | null
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
          company_name: string | null
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
          lead_type: string | null
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
          company_name?: string | null
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
          lead_type?: string | null
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
          company_name?: string | null
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
          lead_type?: string | null
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
          attachments: Json | null
          client_id: string
          content: string
          created_at: string
          email_sent_at: string | null
          id: string
          intervention_id: string | null
          is_read: boolean
          photo_url: string | null
          read_at: string | null
          sender_id: string
          sender_name: string | null
          sender_role: string
          sender_user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          client_id: string
          content: string
          created_at?: string
          email_sent_at?: string | null
          id?: string
          intervention_id?: string | null
          is_read?: boolean
          photo_url?: string | null
          read_at?: string | null
          sender_id: string
          sender_name?: string | null
          sender_role: string
          sender_user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          client_id?: string
          content?: string
          created_at?: string
          email_sent_at?: string | null
          id?: string
          intervention_id?: string | null
          is_read?: boolean
          photo_url?: string | null
          read_at?: string | null
          sender_id?: string
          sender_name?: string | null
          sender_role?: string
          sender_user_id?: string | null
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
      promo_codes: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          id: string
          max_uses: number | null
          used_count: number | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          id?: string
          max_uses?: number | null
          used_count?: number | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          used_count?: number | null
          valid_until?: string | null
        }
        Relationships: []
      }
      pwa_checkins: {
        Row: {
          checked_in_at: string | null
          checked_out_at: string | null
          checklist_completed: Json | null
          client_id: string | null
          gps_lat: number | null
          gps_lng: number | null
          id: string
          intervention_id: string | null
          photo_urls: Json | null
          signature_url: string | null
          status: string | null
          technician_notes: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          checklist_completed?: Json | null
          client_id?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          intervention_id?: string | null
          photo_urls?: Json | null
          signature_url?: string | null
          status?: string | null
          technician_notes?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          checklist_completed?: Json | null
          client_id?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          intervention_id?: string | null
          photo_urls?: Json | null
          signature_url?: string | null
          status?: string | null
          technician_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pwa_checkins_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pwa_checkins_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_at: string | null
          accepted_by_name: string | null
          admin_notes: string | null
          agreement_type: string | null
          base_price: number
          client_id: string
          created_at: string | null
          dog_count: number
          followup_sent_at: string | null
          frequency: string
          garden_size: string
          id: string
          line_items: Json | null
          pdf_url: string | null
          preferred_day: string | null
          price_per_visit: number | null
          quarterly_price: number | null
          sent_at: string | null
          status: string | null
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          terms_text: string | null
          token: string
          total_price: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_name?: string | null
          admin_notes?: string | null
          agreement_type?: string | null
          base_price: number
          client_id: string
          created_at?: string | null
          dog_count: number
          followup_sent_at?: string | null
          frequency: string
          garden_size: string
          id?: string
          line_items?: Json | null
          pdf_url?: string | null
          preferred_day?: string | null
          price_per_visit?: number | null
          quarterly_price?: number | null
          sent_at?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          terms_text?: string | null
          token?: string
          total_price: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by_name?: string | null
          admin_notes?: string | null
          agreement_type?: string | null
          base_price?: number
          client_id?: string
          created_at?: string | null
          dog_count?: number
          followup_sent_at?: string | null
          frequency?: string
          garden_size?: string
          id?: string
          line_items?: Json | null
          pdf_url?: string | null
          preferred_day?: string | null
          price_per_visit?: number | null
          quarterly_price?: number | null
          sent_at?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          terms_text?: string | null
          token?: string
          total_price?: number
          updated_at?: string | null
          valid_until?: string | null
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
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_client_id: string | null
          referred_discount_amount: number | null
          referrer_client_id: string | null
          referrer_discount_amount: number | null
          rewarded_at: string | null
          status: string | null
          stripe_coupon_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_client_id?: string | null
          referred_discount_amount?: number | null
          referrer_client_id?: string | null
          referrer_discount_amount?: number | null
          rewarded_at?: string | null
          status?: string | null
          stripe_coupon_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_client_id?: string | null
          referred_discount_amount?: number | null
          referrer_client_id?: string | null
          referrer_discount_amount?: number | null
          rewarded_at?: string | null
          status?: string | null
          stripe_coupon_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_client_id_fkey"
            columns: ["referred_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_client_id_fkey"
            columns: ["referrer_client_id"]
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
      settings: {
        Row: {
          key: string
          label: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          label?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          label?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      sms_logs: {
        Row: {
          client_id: string | null
          id: string
          intervention_id: string | null
          message: string
          phone: string
          sent_at: string | null
          sms_type: string
          status: string | null
          twilio_sid: string | null
        }
        Insert: {
          client_id?: string | null
          id?: string
          intervention_id?: string | null
          message: string
          phone: string
          sent_at?: string | null
          sms_type: string
          status?: string | null
          twilio_sid?: string | null
        }
        Update: {
          client_id?: string | null
          id?: string
          intervention_id?: string | null
          message?: string
          phone?: string
          sent_at?: string | null
          sms_type?: string
          status?: string | null
          twilio_sid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_logs_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
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
