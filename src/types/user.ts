
export enum UserRole {
  TESTER = "Tester",
  DEVELOPER = "Developer", 
  PROJECT_MANAGER = "Project Manager",
  ADMIN = "Admin"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  team?: string;
}
