export interface Database {
  public: {
    Tables: {
      // Define your table structure here
      // Example:
      // users: {
      //   Row: {
      //     id: number
      //     name: string
      //     email: string
      //     created_at: string
      //     status: string
      //   }
      //   Insert: {
      //     id?: number
      //     name: string
      //     email: string
      //     created_at?: string
      //     status?: string
      //   }
      //   Update: {
      //     id?: number
      //     name?: string
      //     email?: string
      //     created_at?: string
      //     status?: string
      //   }
      // }
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    };
  };
}
