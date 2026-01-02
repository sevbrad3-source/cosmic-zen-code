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
      attack_campaigns: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          name: string
          objectives: string[] | null
          related_events: string[] | null
          start_time: string | null
          status: string
          targets: Json | null
          techniques_used: string[] | null
          threat_actor_id: string | null
          tools_used: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          name: string
          objectives?: string[] | null
          related_events?: string[] | null
          start_time?: string | null
          status?: string
          targets?: Json | null
          techniques_used?: string[] | null
          threat_actor_id?: string | null
          tools_used?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          name?: string
          objectives?: string[] | null
          related_events?: string[] | null
          start_time?: string | null
          status?: string
          targets?: Json | null
          techniques_used?: string[] | null
          threat_actor_id?: string | null
          tools_used?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attack_campaigns_threat_actor_id_fkey"
            columns: ["threat_actor_id"]
            isOneToOne: false
            referencedRelation: "threat_actors"
            referencedColumns: ["id"]
          },
        ]
      }
      investigations: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          created_at: string
          description: string | null
          findings: string | null
          id: string
          mitre_tactics: string[] | null
          priority: string
          related_events: string[] | null
          related_iocs: string[] | null
          status: string
          timeline: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          findings?: string | null
          id?: string
          mitre_tactics?: string[] | null
          priority?: string
          related_events?: string[] | null
          related_iocs?: string[] | null
          status?: string
          timeline?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          findings?: string | null
          id?: string
          mitre_tactics?: string[] | null
          priority?: string
          related_events?: string[] | null
          related_iocs?: string[] | null
          status?: string
          timeline?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      iocs: {
        Row: {
          created_at: string
          description: string | null
          first_seen: string
          id: string
          ioc_type: string
          is_active: boolean
          last_seen: string
          metadata: Json | null
          source: string | null
          tags: string[] | null
          threat_level: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          first_seen?: string
          id?: string
          ioc_type: string
          is_active?: boolean
          last_seen?: string
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          threat_level: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          first_seen?: string
          id?: string
          ioc_type?: string
          is_active?: boolean
          last_seen?: string
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          threat_level?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      network_assets: {
        Row: {
          asset_type: string
          created_at: string
          hostname: string | null
          id: string
          ip_address: string
          is_compromised: boolean
          last_scan: string | null
          mac_address: string | null
          metadata: Json | null
          operating_system: string | null
          risk_score: number | null
          services: Json | null
          updated_at: string
          vulnerabilities: Json | null
          zone: string | null
        }
        Insert: {
          asset_type: string
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address: string
          is_compromised?: boolean
          last_scan?: string | null
          mac_address?: string | null
          metadata?: Json | null
          operating_system?: string | null
          risk_score?: number | null
          services?: Json | null
          updated_at?: string
          vulnerabilities?: Json | null
          zone?: string | null
        }
        Update: {
          asset_type?: string
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address?: string
          is_compromised?: boolean
          last_scan?: string | null
          mac_address?: string | null
          metadata?: Json | null
          operating_system?: string | null
          risk_score?: number | null
          services?: Json | null
          updated_at?: string
          vulnerabilities?: Json | null
          zone?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          description: string
          destination_ip: string | null
          detected_at: string
          event_type: string
          id: string
          mitre_technique: string | null
          port: number | null
          protocol: string | null
          raw_data: Json | null
          severity: string
          source_ip: string | null
        }
        Insert: {
          created_at?: string
          description: string
          destination_ip?: string | null
          detected_at?: string
          event_type: string
          id?: string
          mitre_technique?: string | null
          port?: number | null
          protocol?: string | null
          raw_data?: Json | null
          severity: string
          source_ip?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          destination_ip?: string | null
          detected_at?: string
          event_type?: string
          id?: string
          mitre_technique?: string | null
          port?: number | null
          protocol?: string | null
          raw_data?: Json | null
          severity?: string
          source_ip?: string | null
        }
        Relationships: []
      }
      threat_actors: {
        Row: {
          aliases: string[] | null
          country_of_origin: string | null
          created_at: string
          description: string | null
          first_observed: string | null
          id: string
          is_active: boolean
          known_ttps: string[] | null
          last_activity: string | null
          motivation: string | null
          name: string
          related_iocs: string[] | null
          sophistication: string | null
          target_industries: string[] | null
          updated_at: string
        }
        Insert: {
          aliases?: string[] | null
          country_of_origin?: string | null
          created_at?: string
          description?: string | null
          first_observed?: string | null
          id?: string
          is_active?: boolean
          known_ttps?: string[] | null
          last_activity?: string | null
          motivation?: string | null
          name: string
          related_iocs?: string[] | null
          sophistication?: string | null
          target_industries?: string[] | null
          updated_at?: string
        }
        Update: {
          aliases?: string[] | null
          country_of_origin?: string | null
          created_at?: string
          description?: string | null
          first_observed?: string | null
          id?: string
          is_active?: boolean
          known_ttps?: string[] | null
          last_activity?: string | null
          motivation?: string | null
          name?: string
          related_iocs?: string[] | null
          sophistication?: string | null
          target_industries?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          color: string
          created_at: string | null
          cursor_x: number | null
          cursor_y: number | null
          id: string
          last_seen: string | null
          panel_id: string
          user_id: string
          username: string
        }
        Insert: {
          color: string
          created_at?: string | null
          cursor_x?: number | null
          cursor_y?: number | null
          id?: string
          last_seen?: string | null
          panel_id: string
          user_id: string
          username: string
        }
        Update: {
          color?: string
          created_at?: string | null
          cursor_x?: number | null
          cursor_y?: number | null
          id?: string
          last_seen?: string | null
          panel_id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_presence: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
