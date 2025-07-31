import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        // Estados para lista de usuarios
        users: [],
        isLoading: false,
        error: null,
        
        // Estados para usuario individual
        currentUser: null,
        isUserLoading: false,
        userError: null,
        
        // Estados para operaciones CRUD
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        
        // Filtros y paginación
        filters: {
            searchTerm: '',
            role: '',
            status: 'all'
        },
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalUsers: 0,
            limit: 10
        }
    },
    
    reducers: {
        // === OPERACIONES DE LISTA ===
        setLoadingUsers: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        
        setUsers: (state, { payload }) => {
            state.users = payload.users;
            state.pagination = {
                ...state.pagination,
                ...payload.pagination
            };
            state.isLoading = false;
            state.error = null;
        },
        
        setUsersError: (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        },
        
        // === OPERACIONES DE USUARIO INDIVIDUAL ===
        setLoadingUser: (state) => {
            state.isUserLoading = true;
            state.userError = null;
        },
        
        setCurrentUser: (state, { payload }) => {
            state.currentUser = payload;
            state.isUserLoading = false;
            state.userError = null;
        },
        
        setUserError: (state, { payload }) => {
            state.isUserLoading = false;
            state.userError = payload;
        },
        
        clearCurrentUser: (state) => {
            state.currentUser = null;
            state.userError = null;
        },
        
        // === OPERACIONES CRUD ===
        setCreating: (state, { payload }) => {
            state.isCreating = payload;
        },
        
        setUpdating: (state, { payload }) => {
            state.isUpdating = payload;
        },
        
        setDeleting: (state, { payload }) => {
            state.isDeleting = payload;
        },
        
        // Agregar usuario a la lista después de crear
        addUser: (state, { payload }) => {
            state.users.unshift(payload);
            state.pagination.totalUsers += 1;
        },
        
        // Actualizar usuario en la lista
        updateUser: (state, { payload }) => {
            const index = state.users.findIndex(user => user.id === payload.id);
            if (index !== -1) {
                state.users[index] = payload;
            }
            if (state.currentUser && state.currentUser.id === payload.id) {
                state.currentUser = payload;
            }
        },
        
        // Eliminar usuario de la lista
        removeUser: (state, { payload }) => {
            state.users = state.users.filter(user => user.id !== payload);
            state.pagination.totalUsers -= 1;
            if (state.currentUser && state.currentUser.id === payload) {
                state.currentUser = null;
            }
        },
        
        // === FILTROS Y BÚSQUEDA ===
        setFilters: (state, { payload }) => {
            state.filters = { ...state.filters, ...payload };
        },
        
        clearFilters: (state) => {
            state.filters = {
                searchTerm: '',
                role: '',
                status: 'all'
            };
        },
        
        // === PAGINACIÓN ===
        setCurrentPage: (state, { payload }) => {
            state.pagination.currentPage = payload;
        },
        
        // === LIMPIAR ESTADOS ===
        clearUserState: (state) => {
            state.users = [];
            state.currentUser = null;
            state.error = null;
            state.userError = null;
            state.isLoading = false;
            state.isUserLoading = false;
            state.isCreating = false;
            state.isUpdating = false;
            state.isDeleting = false;
        }
    }
});

export const {
    // Lista de usuarios
    setLoadingUsers,
    setUsers,
    setUsersError,
    
    // Usuario individual
    setLoadingUser,
    setCurrentUser,
    setUserError,
    clearCurrentUser,
    
    // Operaciones CRUD
    setCreating,
    setUpdating,
    setDeleting,
    addUser,
    updateUser,
    removeUser,
    
    // Filtros y búsqueda
    setFilters,
    clearFilters,
    setCurrentPage,
    
    // Limpiar estado
    clearUserState
} = userSlice.actions;
