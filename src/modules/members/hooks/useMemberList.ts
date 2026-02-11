import { useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/core/store';
import { fetchAllMembers, setFilter, setSearchTerm } from '@/modules/members/store';
import { FilterType } from '../types';

export function useMemberList() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    members,
    filteredMembers,
    isLoading,
    error,
    filter,
    searchTerm,
    totalMembers,
  } = useSelector((state: RootState) => state.members);

  useEffect(() => {
    dispatch(fetchAllMembers({ filter: 'all' }));
  }, [dispatch]);

  const handleFilterChange = (newFilter: FilterType) => {
    dispatch(setFilter(newFilter));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const membersCount = members.filter(m => m.isMember).length;
  const nonMembersCount = members.filter(m => !m.isMember).length;

  return {
    members,
    filteredMembers,
    isLoading,
    error,
    filter,
    searchTerm,
    totalMembers,
    membersCount,
    nonMembersCount,
    handleFilterChange,
    handleSearchChange,
  };
}