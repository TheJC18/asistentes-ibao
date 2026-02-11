import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginPayload, LogoutPayload, SetRolePayload, SetProfileCompletedPayload } from '@/modules/auth/types';

const initialState: AuthState = {
    status: 'checking',
    uid: null,
    email: null,
    name: null,
    birthdate: null,
    displayName: null,
    avatar: null,
    photoURL: null,
    phone: null,
    gender: null,
    relation: null,
    errorMessage: null,
    role: null,
    profileCompleted: null,
    nationality: null,
    isMember: false,
    hasWebAccess: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload }: PayloadAction<LoginPayload>) => {
            state.status = 'authenticated';
            state.uid = payload.uid;
            state.email = payload.email;
            state.name = payload.name || payload.displayName || null;
            state.birthdate = payload.birthdate || null;
            state.displayName = payload.displayName;
            state.avatar = payload.avatar || payload.photoURL || null;
            state.photoURL = payload.photoURL || null;
            state.phone = payload.phone || null;
            state.gender = payload.gender || null;
            state.relation = payload.relation || null;
            state.errorMessage = null;
            state.profileCompleted = payload.profileCompleted || false;
            state.nationality = payload.nationality || null;
            state.isMember = payload.isMember || false;
            state.hasWebAccess = payload.hasWebAccess ?? null;
        },

        logout: (state, action: PayloadAction<LogoutPayload | undefined>) => {
            state.status = 'not-authenticated';
            state.uid = null;
            state.email = null;
            state.name = null;
            state.birthdate = null;
            state.displayName = null;
            state.avatar = null;
            state.photoURL = null;
            state.phone = null;
            state.gender = null;
            state.relation = null;
            state.errorMessage = action.payload?.errorMessage || null;
            state.role = null;
            state.profileCompleted = null;
            state.nationality = null;
            state.isMember = false;
            state.hasWebAccess = null;
        },

        chekingCredentials: (state) => {
            state.status = 'checking';
        },

        setRole: (state, { payload }: PayloadAction<SetRolePayload>) => {
            state.role = payload.role;
        },

        setProfileCompleted: (state, { payload }: PayloadAction<SetProfileCompletedPayload>) => {
            state.profileCompleted = payload.profileCompleted;
        },
    }
});

export const { 
    chekingCredentials, 
    login, 
    logout,
    setRole,
    setProfileCompleted,
} = authSlice.actions;
export default authSlice.reducer;