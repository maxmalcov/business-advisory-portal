export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      employee_work_hours: {
        Row: {
          absence_days: number | null;
          client_id: string;
          company_name: string | null;
          created_at: string;
          employee_id: string | null;
          employee_name: string;
          gross_salary: number;
          id: string;
          medical_leave_date: string | null;
          month_year: string;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          absence_days?: number | null;
          client_id: string;
          company_name?: string | null;
          created_at?: string;
          employee_id?: string | null;
          employee_name: string;
          gross_salary: number;
          id?: string;
          medical_leave_date?: string | null;
          month_year: string;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          absence_days?: number | null;
          client_id?: string;
          company_name?: string | null;
          created_at?: string;
          employee_id?: string | null;
          employee_name?: string;
          gross_salary?: number;
          id?: string;
          medical_leave_date?: string | null;
          month_year?: string;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'employee_work_hours_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employees';
            referencedColumns: ['id'];
          },
        ];
      };
      employees: {
        Row: {
          address: string | null;
          comments: string | null;
          company_name: string | null;
          created_at: string | null;
          dni_tie: string | null;
          email: string | null;
          end_date: string | null;
          full_name: string;
          iban: string | null;
          id: string;
          id_document: string | null;
          position: string;
          salary: string | null;
          salary_type: string | null;
          social_security_number: string | null;
          start_date: string;
          status: string;
          updated_at: string | null;
          weekly_schedule: string | null;
        };
        Insert: {
          address?: string | null;
          comments?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          dni_tie?: string | null;
          email?: string | null;
          end_date?: string | null;
          full_name: string;
          iban?: string | null;
          id?: string;
          id_document?: string | null;
          position: string;
          salary?: string | null;
          salary_type?: string | null;
          social_security_number?: string | null;
          start_date: string;
          status: string;
          updated_at?: string | null;
          weekly_schedule?: string | null;
        };
        Update: {
          address?: string | null;
          comments?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          dni_tie?: string | null;
          email?: string | null;
          end_date?: string | null;
          full_name?: string;
          iban?: string | null;
          id?: string;
          id_document?: string | null;
          position?: string;
          salary?: string | null;
          salary_type?: string | null;
          social_security_number?: string | null;
          start_date?: string;
          status?: string;
          updated_at?: string | null;
          weekly_schedule?: string | null;
        };
        Relationships: [];
      };
      invoice_email_logs: {
        Row: {
          file_ids: string[];
          id: string;
          invoice_type: string;
          recipient_email: string;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          file_ids: string[];
          id?: string;
          invoice_type: string;
          recipient_email: string;
          timestamp?: string;
          user_id: string;
        };
        Update: {
          file_ids?: string[];
          id?: string;
          invoice_type?: string;
          recipient_email?: string;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      invoice_files: {
        Row: {
          created_at: string;
          file_name: string;
          file_path: string;
          file_size: number;
          id: string;
          invoice_type: string;
          storage_path: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          file_name: string;
          file_path: string;
          file_size: number;
          id: string;
          invoice_type: string;
          storage_path: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          id?: string;
          invoice_type?: string;
          storage_path?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      invoice_uploads: {
        Row: {
          created_at: string;
          file_id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          id: string;
          invoice_type: string;
          sent_at: string | null;
          sent_to_email: string | null;
          storage_path: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          file_id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          id?: string;
          invoice_type: string;
          sent_at?: string | null;
          sent_to_email?: string | null;
          storage_path: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          file_id?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          id?: string;
          invoice_type?: string;
          sent_at?: string | null;
          sent_to_email?: string | null;
          storage_path?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notification_settings: {
        Row: {
          category: string;
          created_at: string | null;
          email: string;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          email: string;
          id?: string;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          email?: string;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          accounttype: string | null;
          address: string | null;
          city: string | null;
          companyname: string | null;
          country: string | null;
          created_at: string;
          email: string | null;
          id: string;
          iframeurls: string[] | null;
          incominginvoiceemail: string | null;
          name: string | null;
          nif: string | null;
          outgoinginvoiceemail: string | null;
          phone: string | null;
          postalcode: string | null;
          province: string | null;
          updated_at: string;
          usertype: string | null;
        };
        Insert: {
          accounttype?: string | null;
          address?: string | null;
          city?: string | null;
          companyname?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string | null;
          id: string;
          iframeurls?: string[] | null;
          incominginvoiceemail?: string | null;
          name?: string | null;
          nif?: string | null;
          outgoinginvoiceemail?: string | null;
          phone?: string | null;
          postalcode?: string | null;
          province?: string | null;
          updated_at?: string;
          usertype?: string | null;
        };
        Update: {
          accounttype?: string | null;
          address?: string | null;
          city?: string | null;
          companyname?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          iframeurls?: string[] | null;
          incominginvoiceemail?: string | null;
          name?: string | null;
          nif?: string | null;
          outgoinginvoiceemail?: string | null;
          phone?: string | null;
          postalcode?: string | null;
          province?: string | null;
          updated_at?: string;
          usertype?: string | null;
        };
        Relationships: [];
      };
      service_requests: {
        Row: {
          admin_notes: string | null;
          client_id: string;
          client_name: string;
          id: string;
          request_date: string;
          service_id: string;
          service_name: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          client_id: string;
          client_name: string;
          id?: string;
          request_date?: string;
          service_id: string;
          service_name: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          client_id?: string;
          client_name?: string;
          id?: string;
          request_date?: string;
          service_id?: string;
          service_name?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          badges: string[] | null;
          category: string | null;
          created_at: string;
          description: string;
          iconname: string | null;
          id: string;
          popular: boolean | null;
          price: number;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          badges?: string[] | null;
          category?: string | null;
          created_at?: string;
          description: string;
          iconname?: string | null;
          id?: string;
          popular?: boolean | null;
          price: number;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          badges?: string[] | null;
          category?: string | null;
          created_at?: string;
          description?: string;
          iconname?: string | null;
          id?: string;
          popular?: boolean | null;
          price?: number;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscription_types: {
        Row: {
          created_at: string;
          description: string;
          icon_type: string;
          id: string;
          name: string;
          status: string;
          type_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          icon_type: string;
          id?: string;
          name: string;
          status?: string;
          type_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          icon_type?: string;
          id?: string;
          name?: string;
          status?: string;
          type_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      useful_links: {
        Row: {
          category: string;
          created_at: string;
          description: string | null;
          display_order: number | null;
          icon: string | null;
          id: string;
          title: string;
          updated_at: string;
          url: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
          url: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
          url?: string;
        };
        Relationships: [];
      };
      user_tool_subscriptions: {
        Row: {
          activated_at: string | null;
          client_can_request_again: boolean | null;
          demo_video_url: string;
          expires_at: string | null;
          id: string;
          iframe_url: string | null;
          last_request_date: string | null;
          requested_at: string;
          status: string;
          stopped_by_admin: boolean | null;
          tool_id: string;
          tool_name: string;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          activated_at?: string | null;
          client_can_request_again?: boolean | null;
          demo_video_url: string;
          expires_at?: string | null;
          id?: string;
          iframe_url?: string | null;
          last_request_date?: string | null;
          requested_at?: string;
          status?: string;
          stopped_by_admin?: boolean | null;
          tool_id: string;
          tool_name: string;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          activated_at?: string | null;
          client_can_request_again?: boolean | null;
          demo_video_url?: string;
          expires_at?: string | null;
          id?: string;
          iframe_url?: string | null;
          last_request_date?: string | null;
          requested_at?: string;
          status?: string;
          stopped_by_admin?: boolean | null;
          tool_id?: string;
          tool_name?: string;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      work_hours_submissions: {
        Row: {
          client_id: string;
          hr_email: string | null;
          id: string;
          is_locked: boolean;
          month_year: string;
          submitted_at: string;
        };
        Insert: {
          client_id: string;
          hr_email?: string | null;
          id?: string;
          is_locked?: boolean;
          month_year: string;
          submitted_at?: string;
        };
        Update: {
          client_id?: string;
          hr_email?: string | null;
          id?: string;
          is_locked?: boolean;
          month_year?: string;
          submitted_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
