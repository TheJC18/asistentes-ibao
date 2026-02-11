export interface CheckOrCreateUserParams {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
  role?: string;
}

export interface CheckOrCreateUserResult {
  isNewUser: boolean;
}

export interface GetUserByUIDParams {
  uid: string;
}

export interface GetUserByUIDResult {
  ok: boolean;
  exists?: boolean;
  user?: any;
  data?: any;
  error?: string;
}

export interface GetRoleParams {
  uid: string;
}

export interface GetRoleResult {
  ok: boolean;
  role?: string;
  error?: string;
}

export interface GetProfileCompletedParams {
  uid: string;
}

export interface GetProfileCompletedResult {
  ok: boolean;
  profileCompleted?: boolean;
  error?: string;
}

export interface UpdateProfileCompletedParams {
  uid: string;
  profileCompleted?: boolean;
}

export interface UpdateProfileCompletedResult {
  ok: boolean;
  profileCompleted?: boolean;
  error?: string;
}

export interface CreateAuthUserResult {
  ok: boolean;
  uid?: string;
  user?: any;
  errorCode?: string;
  errorMessage?: string;
  email?: string;
  canCleanup?: boolean;
}

export interface LinkEmailPasswordResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
  alreadyLinked?: boolean;
  errorCode?: string;
  requiresReauth?: boolean;
}

export interface LinkGoogleAccountResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
  alreadyLinked?: boolean;
  errorCode?: string;
  requiresReauth?: boolean;
}

export interface UpdateUserPasswordResult {
  ok: boolean;
  errorCode?: string;
  errorMessage?: string;
  requiresReauth?: boolean;
}

export interface SignOutUserResult {
  ok: boolean;
  errorMessage?: string;
}

export interface CleanupOrphanAuthUserResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
}

export interface SendPasswordResetEmailResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
}
export interface CheckOrCreateUserParams {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
  role?: string;
}

export interface CheckOrCreateUserResult {
  isNewUser: boolean;
}

export interface GetUserByUIDParams {
  uid: string;
}

export interface GetUserByUIDResult {
  ok: boolean;
  exists?: boolean;
  user?: any;
  data?: any;
  error?: string;
}

export interface GetRoleParams {
  uid: string;
}

export interface GetRoleResult {
  ok: boolean;
  role?: string;
  error?: string;
}

export interface GetProfileCompletedParams {
  uid: string;
}

export interface GetProfileCompletedResult {
  ok: boolean;
  profileCompleted?: boolean;
  error?: string;
}

export interface UpdateProfileCompletedParams {
  uid: string;
  profileCompleted?: boolean;
}

export interface UpdateProfileCompletedResult {
  ok: boolean;
  profileCompleted?: boolean;
  error?: string;
}

export interface CreateAuthUserResult {
  ok: boolean;
  uid?: string;
  user?: any;
  errorCode?: string;
  errorMessage?: string;
  email?: string;
  canCleanup?: boolean;
}

export interface LinkEmailPasswordResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
  alreadyLinked?: boolean;
  errorCode?: string;
  requiresReauth?: boolean;
}

export interface LinkGoogleAccountResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
  alreadyLinked?: boolean;
  errorCode?: string;
  requiresReauth?: boolean;
}

export interface UpdateUserPasswordResult {
  ok: boolean;
  errorCode?: string;
  errorMessage?: string;
  requiresReauth?: boolean;
}

export interface SignOutUserResult {
  ok: boolean;
  errorMessage?: string;
}

export interface CleanupOrphanAuthUserResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
}

export interface SendPasswordResetEmailResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
}
export interface CreateUserParams {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface GetRoleParams {
  uid: string;
}

export interface UpdateProfileCompletedParams {
  uid: string;
  profileCompleted?: boolean;
}

export interface GetProfileCompletedParams {
  uid: string;
}
export interface AuthState {
  status: 'checking' | 'not-authenticated' | 'authenticated';
  uid: string | null;
  email: string | null;
  name: string | null;
  birthdate: string | null;
  displayName: string | null;
  avatar: string | null;
  photoURL: string | null;
  phone: string | null;
  gender: string | null;
  relation: string | null;
  errorMessage: string | null;
  role: string | null;
  profileCompleted: boolean | null;
  nationality: string | null;
  isMember: boolean;
  hasWebAccess: boolean | null;
}

export interface LoginPayload {
  uid: string;
  email: string;
  name?: string;
  birthdate?: string;
  displayName: string;
  avatar?: string;
  photoURL?: string;
  phone?: string;
  gender?: string;
  relation?: string;
  profileCompleted?: boolean;
  nationality?: string;
  isMember?: boolean;
  hasWebAccess?: boolean;
}

export interface LogoutPayload {
  errorMessage?: string;
}

export interface SetRolePayload {
  role: string;
}

export interface SetProfileCompletedPayload {
  profileCompleted: boolean;
}
import { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
}
// Tipos e interfaces para el módulo de autenticación
export interface SignInFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
