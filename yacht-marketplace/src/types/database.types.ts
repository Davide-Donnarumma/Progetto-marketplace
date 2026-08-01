export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: "GUEST" | "HOST" | "ADMIN";
          first_name: string;
          last_name: string;
          stripe_account_id: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "GUEST" | "HOST" | "ADMIN";
          first_name: string;
          last_name: string;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "GUEST" | "HOST" | "ADMIN";
          first_name?: string;
          last_name?: string;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      yachts: {
        Row: {
          id: string;
          host_id: string;
          name: string;
          description: string;
          length_meters: number;
          passenger_capacity: number;
          luxury_tier: number;
          price_per_day: number;
          port_location: string;
          images_urls: string[];
          status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          name: string;
          description: string;
          length_meters: number;
          passenger_capacity: number;
          luxury_tier: number;
          price_per_day: number;
          port_location: string;
          images_urls?: string[];
          status?: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          name?: string;
          description?: string;
          length_meters?: number;
          passenger_capacity?: number;
          luxury_tier?: number;
          price_per_day?: number;
          port_location?: string;
          images_urls?: string[];
          status?: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          yacht_id: string;
          guest_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          platform_fee: number;
          stripe_payment_intent_id: string | null;
          status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          yacht_id: string;
          guest_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          platform_fee: number;
          stripe_payment_intent_id?: string | null;
          status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          yacht_id?: string;
          guest_id?: string;
          start_date?: string;
          end_date?: string;
          total_price?: number;
          platform_fee?: number;
          stripe_payment_intent_id?: string | null;
          status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
