
import { UserRole } from '@/types/user';

export const users = [
  { id: "user1", name: "John Developer", email: "john@example.com", role: UserRole.DEVELOPER },
  { id: "user2", name: "Sarah Tester", email: "sarah@example.com", role: UserRole.TESTER },
  { id: "user3", name: "Michael Manager", email: "michael@example.com", role: UserRole.PROJECT_MANAGER },
  { id: "user4", name: "Emily Designer", email: "emily@example.com", role: UserRole.DEVELOPER },
  { id: "user5", name: "Alex Admin", email: "alex@example.com", role: UserRole.ADMIN }
];

// Changed to admin for testing all features
export const currentUser = {
  id: "user5",
  name: "Alex Admin",
  email: "alex@example.com",
  role: UserRole.ADMIN
};
