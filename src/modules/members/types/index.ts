import type { User } from "@/types";

export interface GetAllMembersParams {
  filter?: 'all' | 'members' | 'non-members';
}

export interface GetAllMembersResult {
  ok: boolean;
  users?: User[];
  totalUsers?: number;
  errorMessage?: string;
}

export type FilterType = 'all' | 'members' | 'non-members';

export interface MemberState {
  members: User[];
  filteredMembers: User[];
  isLoading: boolean;
  error: string | null;
  filter: FilterType;
  searchTerm: string;
  totalMembers: number;
}