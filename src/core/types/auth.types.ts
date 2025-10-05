// Authentication and user related types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SELLER = "SELLER",
}

export interface UserProfile extends AuthUser {
  // Additional profile information can be added here
  phoneNumber?: string;
  dateOfBirth?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
  orderUpdates: boolean;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// Permission types
export type Permission = 
  | "admin:read"
  | "admin:write"
  | "admin:delete"
  | "seller:read"
  | "seller:write"
  | "seller:delete"
  | "user:read"
  | "user:write";

export interface RolePermissions {
  [UserRole.ADMIN]: Permission[];
  [UserRole.SELLER]: Permission[];
  [UserRole.USER]: Permission[];
}