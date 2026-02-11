import type { User } from '@/types';
export type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

export interface GetUsersParams {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResult {
  ok: boolean;
  users?: User[];
  currentPage?: number;
  totalPages?: number;
  totalUsers?: number;
  limit?: number;
  errorMessage?: string;
}

export interface GetUserByIdResult {
  ok: boolean;
  user?: User;
  errorMessage?: string;
}

export interface CreateUserData {
  email?: string;
  password?: string;
  name?: string;
  displayName?: string;
  birthdate?: string | null;
  gender?: string;
  nationality?: string;
  isMember?: boolean;
  status?: string;
  role?: string;
  avatar?: string;
  photoURL?: string;
  hasWebAccess?: boolean;
  familyId?: string;
  relation?: string;
  createdBy?: string;
  [key: string]: any;
}

export interface CreateUserResult {
  ok: boolean;
  user?: User;
  message?: string;
  errorMessage?: string;
  email?: string;
  canCleanup?: boolean;
  errorCode?: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  displayName?: string;
  birthdate?: string | null;
  gender?: string;
  nationality?: string;
  isMember?: boolean;
  status?: string;
  role?: string;
  avatar?: string;
  photoURL?: string;
  hasWebAccess?: boolean;
  [key: string]: any;
}

export interface UpdateUserResult {
  ok: boolean;
  user?: User;
  migrated?: boolean;
  oldId?: string;
  newId?: string;
  errorCode?: string;
  errorMessage?: string;
  requiresReauth?: boolean;
}

export interface DeleteUserResult {
  ok: boolean;
  warning?: string | null;
  familiesCleanedUp?: number;
  errorMessage?: string;
  cancelled?: boolean;
}

export interface FindUserByEmailResult {
  ok: boolean;
  user?: any;
  errorMessage?: string;
}

export interface GetUsersByRoleResult {
  ok: boolean;
  users?: User[];
  errorMessage?: string;
}

export interface UserBirthday {
    uid: string;
    name: string;
    birthdate: string;
}

export interface ValidateUserFormParams {
  formData: any;
  password: string;
  confirmPassword: string;
  mode: 'create' | 'edit' | 'view' | 'family';
  hasWebAccess?: boolean;
}

export interface PrepareUserDataParams {
  formData: any;
  password: string;
  mode: string;
  hasWebAccess?: boolean;
}

export interface UserData {
  displayName?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
  department?: string;
  location?: string;
  [key: string]: any;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export interface DisplayUser extends UserData {
  roleLabel: string;
  statusLabel: string;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
}

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'view' | 'edit' | 'create' | 'family';
  user?: Partial<User>;
  onSave?: (data: any) => void;
  onPasswordReset?: (email: string) => Promise<void>;
}

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  nationality: string;
  birthdate: string | null;
  avatar: string;
  isMember: boolean;
  gender: string;
  relation: string;
  phone: string;
}
