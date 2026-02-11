export interface UseFamilyMemberCardProps {
  member: FamilyMember;
  familyId?: string;
  onMemberUpdate?: (updatedMember: FamilyMember) => void;
  onMemberDelete?: (memberId: string) => void;
  translate: any;
}
// User ahora se importa del tipo global
// Definición local de Relation para el módulo family
export interface Relation {
  code: string;
  name: string;
  gender?: string;
}
// Tipos y interfaces para el módulo de familia
import { RoleType } from '@/core/constants/roles';
import { FieldValue } from 'firebase/firestore';

export interface UseAddFamilyMemberModalProps {
  open: boolean;
  familyId: string;
  currentUserId: string;
  onMemberAdded?: () => void;
  translate: any;
  relations: Relation[];
}

export interface UpdateUserIdResult {
  ok: boolean;
  errorMessage?: string;
}

export interface GetUserByIdResult {
  ok: boolean;
  user?: any;
  errorMessage?: string;
}

export interface Family {
  id: string;
  name: string;
  createdBy: string;
  createdAt?: Date | string | FieldValue;
  updatedAt?: Date | string | FieldValue;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  photoURL?: string;
  relation?: string;
  gender?: string;
  role: RoleType | string;
  addedBy?: string;
  email?: string;
  birthdate?: string;
  age?: number | string;
  phone?: string;
  [key: string]: any;
}

export interface CreateFamilyData {
  name?: string;
}

export interface CreateFamilyResult {
  ok: boolean;
  familyId?: string;
  family?: Family;
  errorMessage?: string;
}

export interface AddUserToFamilyResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
}

export interface RemoveUserFromFamilyResult {
  ok: boolean;
  message?: string;
  errorMessage?: string;
}

export interface GetFamilyMembersResult {
  ok: boolean;
  members: FamilyMember[];
  errorMessage?: string;
}

export interface GetUserFamiliesResult {
  ok: boolean;
  families: Family[];
  errorMessage?: string;
}

export interface MemberData {
  relation?: string;
  role?: string;
  addedBy?: string;
  [key: string]: any;
}

// Props para componentes
export interface AddFamilyMemberModalProps {
  open: boolean;
  onClose: () => void;
  familyId: string;
  currentUserId: string;
  onMemberAdded?: () => void;
}

export interface FamilyMemberCardProps {
  member: FamilyMember;
  familyId?: string;
  onMemberUpdate?: (updatedMember: FamilyMember) => void;
  onMemberDelete?: (memberId: string) => void;
}

export interface UseFamilyListOptions {
  currentUserId: string | null;
}