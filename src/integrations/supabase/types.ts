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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          actor_id: string | null
          actor_label: string | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          type: string
        }
        Update: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          type?: string
        }
        Relationships: []
      }
      affiliate_applications: {
        Row: {
          amount: number | null
          approved_at: string | null
          audience_size: string | null
          commission_rate: number | null
          country: string | null
          created_at: string
          email: string | null
          experience: string | null
          full_name: string | null
          id: string
          marketing_channels: string | null
          package_name: string | null
          payment_reference: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          approved_at?: string | null
          audience_size?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          full_name?: string | null
          id?: string
          marketing_channels?: string | null
          package_name?: string | null
          payment_reference?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          approved_at?: string | null
          audience_size?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          full_name?: string | null
          id?: string
          marketing_channels?: string | null
          package_name?: string | null
          payment_reference?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_goals: {
        Row: {
          created_at: string
          id: string
          month: number
          target_amount: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          target_amount?: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          target_amount?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      affiliate_links: {
        Row: {
          affiliate_id: string
          clicks: number | null
          created_at: string
          custom_slug: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          product_id: string
          short_code: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          affiliate_id: string
          clicks?: number | null
          created_at?: string
          custom_slug?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          product_id: string
          short_code: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          affiliate_id?: string
          clicks?: number | null
          created_at?: string
          custom_slug?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          product_id?: string
          short_code?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          audience: string
          body: string
          created_at: string
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          starts_at: string
          title: string
          variant: string
        }
        Insert: {
          audience?: string
          body: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string
          title: string
          variant?: string
        }
        Update: {
          audience?: string
          body?: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string
          title?: string
          variant?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          admin_email: string | null
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_email?: string | null
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_email?: string | null
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      broadcasts: {
        Row: {
          audience: string
          audience_filter: Json | null
          body: string
          created_at: string
          created_by: string | null
          id: string
          recipient_count: number | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          audience?: string
          audience_filter?: Json | null
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          recipient_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          audience?: string
          audience_filter?: Json | null
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          recipient_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      commission_overrides: {
        Row: {
          affiliate_id: string
          commission_rate: number
          created_at: string
          id: string
          product_id: string | null
          seller_id: string
        }
        Insert: {
          affiliate_id: string
          commission_rate: number
          created_at?: string
          id?: string
          product_id?: string | null
          seller_id: string
        }
        Update: {
          affiliate_id?: string
          commission_rate?: number
          created_at?: string
          id?: string
          product_id?: string | null
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_overrides_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          order_id: string
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          order_id: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          status: string
          topic: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          status?: string
          topic: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          status?: string
          topic?: string
        }
        Relationships: []
      }
      contests: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          participation_rules: string | null
          prize_image_url: string | null
          reward_value: number | null
          start_date: string | null
          status: string | null
          target: number | null
          title: string
          winners_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          participation_rules?: string | null
          prize_image_url?: string | null
          reward_value?: number | null
          start_date?: string | null
          status?: string | null
          target?: number | null
          title: string
          winners_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          participation_rules?: string | null
          prize_image_url?: string | null
          reward_value?: number | null
          start_date?: string | null
          status?: string | null
          target?: number | null
          title?: string
          winners_count?: number | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          applies_to: string
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          starts_at: string | null
          used_count: number
        }
        Insert: {
          applies_to?: string
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          starts_at?: string | null
          used_count?: number
        }
        Update: {
          applies_to?: string
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          starts_at?: string | null
          used_count?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          instructor_id: string | null
          product_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructor_id?: string | null
          product_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructor_id?: string | null
          product_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string | null
          enrolled_at: string
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          enrolled_at?: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          enrolled_at?: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_events: {
        Row: {
          affiliate_id: string
          channel: string | null
          created_at: string
          event_type: string
          id: string
          link_id: string | null
          metadata: Json | null
          product_id: string | null
          session_id: string | null
        }
        Insert: {
          affiliate_id: string
          channel?: string | null
          created_at?: string
          event_type: string
          id?: string
          link_id?: string | null
          metadata?: Json | null
          product_id?: string | null
          session_id?: string | null
        }
        Update: {
          affiliate_id?: string
          channel?: string | null
          created_at?: string
          event_type?: string
          id?: string
          link_id?: string | null
          metadata?: Json | null
          product_id?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funnel_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string
          id: string
          order_index: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          order_index?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          order_index?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      link_clicks: {
        Row: {
          affiliate_id: string
          channel: string | null
          converted: boolean | null
          created_at: string
          id: string
          ip_address: unknown
          link_id: string
          order_id: string | null
          product_id: string | null
          referrer: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          affiliate_id: string
          channel?: string | null
          converted?: boolean | null
          created_at?: string
          id?: string
          ip_address?: unknown
          link_id: string
          order_id?: string | null
          product_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          affiliate_id?: string
          channel?: string | null
          converted?: boolean | null
          created_at?: string
          id?: string
          ip_address?: unknown
          link_id?: string
          order_id?: string | null
          product_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_clicks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          id: string
          is_read: boolean
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          affiliate_id: string | null
          affiliate_link_id: string | null
          amount: number
          buyer_email: string
          channel: string | null
          commission_amount: number | null
          created_at: string
          funnel_stage: string | null
          id: string
          payment_reference: string | null
          platform_fee: number | null
          product_id: string
          seller_earnings: number | null
          seller_id: string | null
          status: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          affiliate_id?: string | null
          affiliate_link_id?: string | null
          amount: number
          buyer_email: string
          channel?: string | null
          commission_amount?: number | null
          created_at?: string
          funnel_stage?: string | null
          id?: string
          payment_reference?: string | null
          platform_fee?: number | null
          product_id: string
          seller_earnings?: number | null
          seller_id?: string | null
          status?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          affiliate_id?: string | null
          affiliate_link_id?: string | null
          amount?: number
          buyer_email?: string
          channel?: string | null
          commission_amount?: number | null
          created_at?: string
          funnel_stage?: string | null
          id?: string
          payment_reference?: string | null
          platform_fee?: number | null
          product_id?: string
          seller_earnings?: number | null
          seller_id?: string | null
          status?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_link_id_fkey"
            columns: ["affiliate_link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          processed_at: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          buyer_email: string
          comment: string | null
          created_at: string
          id: string
          is_public: boolean | null
          order_id: string | null
          product_id: string
          rating: number
          responded_at: string | null
          seller_response: string | null
        }
        Insert: {
          buyer_email: string
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          order_id?: string | null
          product_id: string
          rating: number
          responded_at?: string | null
          seller_response?: string | null
        }
        Update: {
          buyer_email?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          order_id?: string | null
          product_id?: string
          rating?: number
          responded_at?: string | null
          seller_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ab_test_active: boolean | null
          approval_status: string
          business_name: string | null
          category: string
          commission_rate: number
          conversion_rate: number | null
          created_at: string
          created_by: string | null
          description: string | null
          epc: number | null
          features: string[] | null
          id: string
          image_url: string | null
          image_url_b: string | null
          is_featured: boolean | null
          low_stock_threshold: number | null
          min_tier: string | null
          price: number
          refund_rate: number | null
          sales_a: number | null
          sales_b: number | null
          seller_id: string | null
          status: string
          stock_quantity: number | null
          title: string
          title_b: string | null
          trust_score: number | null
          updated_at: string
          views_a: number | null
          views_b: number | null
        }
        Insert: {
          ab_test_active?: boolean | null
          approval_status?: string
          business_name?: string | null
          category?: string
          commission_rate?: number
          conversion_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          epc?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          image_url_b?: string | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          min_tier?: string | null
          price?: number
          refund_rate?: number | null
          sales_a?: number | null
          sales_b?: number | null
          seller_id?: string | null
          status?: string
          stock_quantity?: number | null
          title: string
          title_b?: string | null
          trust_score?: number | null
          updated_at?: string
          views_a?: number | null
          views_b?: number | null
        }
        Update: {
          ab_test_active?: boolean | null
          approval_status?: string
          business_name?: string | null
          category?: string
          commission_rate?: number
          conversion_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          epc?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          image_url_b?: string | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          min_tier?: string | null
          price?: number
          refund_rate?: number | null
          sales_a?: number | null
          sales_b?: number | null
          seller_id?: string | null
          status?: string
          stock_quantity?: number | null
          title?: string
          title_b?: string | null
          trust_score?: number | null
          updated_at?: string
          views_a?: number | null
          views_b?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          affiliate_link: string | null
          avatar_url: string | null
          bio: string | null
          business_description: string | null
          business_name: string | null
          business_website: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          invited_by: string | null
          momo_number: string | null
          momo_provider: string | null
          package_tier: string | null
          phone: string | null
          referral_code: string | null
          skrill_email: string | null
          store_banner_url: string | null
          store_color_hex: string | null
          store_logo_url: string | null
          subscription_plan: string | null
          subscription_renewal_date: string | null
          tax_regions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_link?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_description?: string | null
          business_name?: string | null
          business_website?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          momo_number?: string | null
          momo_provider?: string | null
          package_tier?: string | null
          phone?: string | null
          referral_code?: string | null
          skrill_email?: string | null
          store_banner_url?: string | null
          store_color_hex?: string | null
          store_logo_url?: string | null
          subscription_plan?: string | null
          subscription_renewal_date?: string | null
          tax_regions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_link?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_description?: string | null
          business_name?: string | null
          business_website?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          momo_number?: string | null
          momo_provider?: string | null
          package_tier?: string | null
          phone?: string | null
          referral_code?: string | null
          skrill_email?: string | null
          store_banner_url?: string | null
          store_color_hex?: string | null
          store_logo_url?: string | null
          subscription_plan?: string | null
          subscription_renewal_date?: string | null
          tax_regions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          attempted_at: string
          id: string
          is_pass: boolean
          quiz_id: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          attempted_at?: string
          id?: string
          is_pass: boolean
          quiz_id?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          attempted_at?: string
          id?: string
          is_pass?: boolean
          quiz_id?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_option_index: number
          created_at: string
          id: string
          options: Json
          question: string
          quiz_id: string | null
        }
        Insert: {
          correct_option_index: number
          created_at?: string
          id?: string
          options: Json
          question: string
          quiz_id?: string | null
        }
        Update: {
          correct_option_index?: number
          created_at?: string
          id?: string
          options?: Json
          question?: string
          quiz_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          passing_score: number | null
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          passing_score?: number | null
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          passing_score?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          activated_at: string | null
          bonus_amount: number | null
          bonus_paid: boolean | null
          created_at: string
          id: string
          invite_code: string
          referred_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          activated_at?: string | null
          bonus_amount?: number | null
          bonus_paid?: boolean | null
          created_at?: string
          id?: string
          invite_code: string
          referred_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          activated_at?: string | null
          bonus_amount?: number | null
          bonus_paid?: boolean | null
          created_at?: string
          id?: string
          invite_code?: string
          referred_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          reverse_commission: boolean
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          reverse_commission?: boolean
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          reverse_commission?: boolean
          status?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          description: string | null
          dimensions: string | null
          file_size: string | null
          file_url: string | null
          id: string
          min_tier: string | null
          preview_url: string | null
          product_id: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          min_tier?: string | null
          preview_url?: string | null
          product_id?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          min_tier?: string | null
          preview_url?: string | null
          product_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_coupons: {
        Row: {
          affiliate_id: string | null
          code: string
          created_at: string
          current_uses: number | null
          discount_percent: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          product_id: string | null
          seller_id: string
          valid_until: string | null
        }
        Insert: {
          affiliate_id?: string | null
          code: string
          created_at?: string
          current_uses?: number | null
          discount_percent: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          product_id?: string | null
          seller_id: string
          valid_until?: string | null
        }
        Update: {
          affiliate_id?: string | null
          code?: string
          created_at?: string
          current_uses?: number | null
          discount_percent?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          product_id?: string | null
          seller_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_coupons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_payouts: {
        Row: {
          amount: number
          created_at: string
          id: string
          processed_at: string | null
          seller_id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          processed_at?: string | null
          seller_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          processed_at?: string | null
          seller_id?: string
          status?: string
        }
        Relationships: []
      }
      seller_subscriptions: {
        Row: {
          amount: number
          created_at: string
          expires_at: string
          id: string
          payment_reference: string | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          payment_reference?: string | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          payment_reference?: string | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      tax_documents: {
        Row: {
          address: string | null
          business_name: string | null
          created_at: string
          generated_at: string
          gross_earnings: number
          id: string
          monthly_breakdown: Json | null
          net_earnings: number
          tax_year: number
          tin: string | null
          total_fees: number
          total_orders: number
          user_id: string
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          created_at?: string
          generated_at?: string
          gross_earnings?: number
          id?: string
          monthly_breakdown?: Json | null
          net_earnings?: number
          tax_year: number
          tin?: string | null
          total_fees?: number
          total_orders?: number
          user_id: string
        }
        Update: {
          address?: string | null
          business_name?: string | null
          created_at?: string
          generated_at?: string
          gross_earnings?: number
          id?: string
          monthly_breakdown?: Json | null
          net_earnings?: number
          tax_year?: number
          tin?: string | null
          total_fees?: number
          total_orders?: number
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          rating: number | null
          role: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          rating?: number | null
          role: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          rating?: number | null
          role?: string
        }
        Relationships: []
      }
      tier_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_tier: string | null
          id: string
          reason: string | null
          to_tier: string
          user_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_tier?: string | null
          id?: string
          reason?: string | null
          to_tier: string
          user_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_tier?: string | null
          id?: string
          reason?: string | null
          to_tier?: string
          user_id?: string
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
      withdrawal_settings: {
        Row: {
          auto_withdraw: boolean
          created_at: string
          id: string
          min_payout_amount: number
          preferred_method: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_withdraw?: boolean
          created_at?: string
          id?: string
          min_payout_amount?: number
          preferred_method?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_withdraw?: boolean
          created_at?: string
          id?: string
          min_payout_amount?: number
          preferred_method?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          account_name: string | null
          account_number: string
          affiliate_id: string
          amount: number
          created_at: string
          currency: string | null
          error_message: string | null
          ghs_amount: number | null
          id: string
          method: string
          processed_at: string | null
          provider: string | null
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_name?: string | null
          account_number: string
          affiliate_id: string
          amount: number
          created_at?: string
          currency?: string | null
          error_message?: string | null
          ghs_amount?: number | null
          id?: string
          method: string
          processed_at?: string | null
          provider?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_name?: string | null
          account_number?: string
          affiliate_id?: string
          amount?: number
          created_at?: string
          currency?: string | null
          error_message?: string | null
          ghs_amount?: number | null
          id?: string
          method?: string
          processed_at?: string | null
          provider?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      channel_stats: {
        Row: {
          affiliate_id: string | null
          channel: string | null
          conversions: number | null
          revenue: number | null
          total_clicks: number | null
        }
        Relationships: []
      }
      daily_earnings: {
        Row: {
          affiliate_id: string | null
          earn_date: string | null
          order_count: number | null
          total_amount: number | null
        }
        Relationships: []
      }
      leaderboard_stats: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          package_tier: string | null
          sales_count: number | null
          total_earnings: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_affiliate_stats: { Args: { u_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "affiliate" | "user" | "seller" | "learner"
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
      app_role: ["admin", "affiliate", "user", "seller", "learner"],
    },
  },
} as const
