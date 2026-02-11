import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterType, MemberState } from '../types';
import { User } from '@/modules/family/types';

const initialState: MemberState = {
  members: [],
  filteredMembers: [],
  isLoading: false,
  error: null,
  filter: 'all',
  searchTerm: '',
  totalMembers: 0,
};

export const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    // Cargar miembros
    loadMembers: (state, action: PayloadAction<User[]>) => {
      state.members = action.payload;
      state.totalMembers = action.payload.length;
      // Aplicar filtros actuales
      state.filteredMembers = applyFilters(action.payload, state.filter, state.searchTerm);
      state.isLoading = false;
      state.error = null;
    },
    
    // Establecer estado de carga
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Establecer error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Cambiar filtro
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
      state.filteredMembers = applyFilters(state.members, action.payload, state.searchTerm);
    },
    
    // Cambiar término de búsqueda
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredMembers = applyFilters(state.members, state.filter, action.payload);
    },
    
    // Limpiar estado
    clearMembers: (state) => {
      state.members = [];
      state.filteredMembers = [];
      state.isLoading = false;
      state.error = null;
      state.filter = 'all';
      state.searchTerm = '';
      state.totalMembers = 0;
    },
  },
});

// Función auxiliar para aplicar filtros
const applyFilters = (members: User[], filter: FilterType, searchTerm: string): User[] => {
  let filtered = [...members];
  
  // Aplicar filtro de tipo
  if (filter === 'members') {
    filtered = filtered.filter(member => member.isMember === true);
  } else if (filter === 'non-members') {
    filtered = filtered.filter(member => member.isMember === false);
  }
  
  // Aplicar búsqueda
  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(member => {
      const name = (member.name || '').toLowerCase();
      const email = (member.email || '').toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }
  
  return filtered;
};

export const {
  loadMembers,
  setLoading,
  setError,
  setFilter,
  setSearchTerm,
  clearMembers,
} = memberSlice.actions;

export default memberSlice.reducer;