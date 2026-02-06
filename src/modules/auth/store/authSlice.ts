import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
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

interface LoginPayload {
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

interface LogoutPayload {
    errorMessage?: string;
}

interface SetRolePayload {
    role: string;
}

interface SetProfileCompletedPayload {
    profileCompleted: boolean;
}

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