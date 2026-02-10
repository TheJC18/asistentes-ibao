// Types globales del proyecto
import { RoleType } from '@/core/constants/roles';

export interface User {
  id: string;
  uid?: string;
  name: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  avatar?: string;
  role: RoleType;
  isMember?: boolean;
  gender?: 'male' | 'female' | 'other' | 'neutral';
  birthdate?: string | Date | null;
  nationality?: string;
  phone?: string;
  relation?: string;
  familyId?: string;
  createdBy?: string;
  hasWebAccess?: boolean;
  profileCompleted?: boolean;
  status?: 'active' | 'inactive';
  createdAt?: string | Date;
  updatedAt?: string | Date;
  families?: string[]; // IDs de familias a las que pertenece
}

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: RoleType | null;
  profileCompleted: boolean;
  errorMessage: string | null;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  filters: UserFilters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

export interface UserFilters {
  role?: string;
  isMember?: boolean;
  search?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

export interface Family {
  id: string;
  name: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  photoURL?: string;
  relation?: string;
  gender?: string;
  role: string;
  addedBy?: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface Gender {
  code: string;
  name: string;
}

export interface Relation {
  code: string;
  name: string;
  gender?: string;
}

export interface FirebaseResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  errorMessage?: string;
  requiresReauth?: boolean;
  warning?: string;
}

export interface ColumnConfig<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  visibleOn?: string[] | Array<"base" | "2xs" | "xs" | "ss" | "sm" | "md" | "lg" | "xl">;
}

export interface FormValidation {
  [key: string]: string | null;
}

export type FormValidationRules<T> = {
  [K in keyof T]?: [(value: any, formState?: T) => boolean, string];
};

export interface UseFormReturn<T> {
  formState: T;
  formValidation: FormValidation;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onResetForm: () => void;
  isFormValid: boolean;
  setFormState: React.Dispatch<React.SetStateAction<T>>;
}
