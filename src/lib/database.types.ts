// 手动定义 Supabase Database 类型——与 SQL migrations 保持同步
// synthmind 版本：subject 替换 phone/home_type，source 为 'contact' | 'chat'

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          ip_address: string | null;
          user_agent: string | null;
          lead_email: string | null;
          lead_phone: string | null;
          lead_name: string | null;
          message_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          lead_email?: string | null;
          lead_phone?: string | null;
          lead_name?: string | null;
          message_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          lead_email?: string | null;
          lead_phone?: string | null;
          lead_name?: string | null;
          message_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: number;
          session_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: never;
          session_id: string;
          role: string;
          content: string;
          created_at?: string;
        };
        Update: {
          session_id?: string;
          role?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "chat_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          password_hash?: string;
        };
        Relationships: [];
      };
      form_submissions: {
        Row: {
          id: number;
          source: string;
          name: string;
          email: string;
          subject: string | null;
          message: string | null;
          session_id: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          source: string;
          name: string;
          email: string;
          subject?: string | null;
          message?: string | null;
          session_id?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          source?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string | null;
          session_id?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "form_submissions_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "chat_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      verify_admin_password: {
        Args: { p_email: string; p_password: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
