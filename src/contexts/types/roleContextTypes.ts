
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/user';

export interface RoleContextType {
  userRole: UserRole;
  isAdmin: boolean;
  isProjectManager: boolean;
  isDeveloper: boolean;
  isTester: boolean;
  can: (action: string) => boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

