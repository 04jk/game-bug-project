
export type Tables = {
  profiles: {
    Row: {
      id: string;
      name: string | null;
      role: string | null;
      avatar: string | null;
      bio: string | null;
      team: string | null;
      username: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id: string;
      name?: string | null;
      role?: string | null;
      avatar?: string | null;
      bio?: string | null;
      team?: string | null;
      username?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      name?: string | null;
      role?: string | null;
      avatar?: string | null;
      bio?: string | null;
      team?: string | null;
      username?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
  };
};

export type Database = {
  public: {
    Tables: Tables;
    Views: {};
    Functions: {};
    Enums: {};
  };
};
