// src/types/database.ts
// AUTO-GENERATED — reemplazar con: npx supabase gen types typescript --project-id TU_REF > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          wallet_pubkey: string | null;
          role: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          wallet_pubkey?: string | null;
          role?: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet_pubkey?: string | null;
          role?: string;
          display_name?: string | null;
          created_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          wallet_pubkey: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          name: string;
          wallet_pubkey?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          name?: string;
          wallet_pubkey?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          business_id: string;
          text: string;
          solana_memo_signature: string | null;
          aurios_rewarded: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id: string;
          text: string;
          solana_memo_signature?: string | null;
          aurios_rewarded?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_id?: string;
          text?: string;
          solana_memo_signature?: string | null;
          aurios_rewarded?: number;
          created_at?: string;
        };
      };
      audio_reports: {
        Row: {
          id: string;
          business_id: string;
          storage_path: string;
          generated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          storage_path: string;
          generated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          storage_path?: string;
          generated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
