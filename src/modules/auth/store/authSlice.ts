import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    status: 'checking' | 'not-authenticated' | 'authenticated';
    uid: string | null;
    email: string | null;
    birthdate: string | null;
    displayName: string | null;
    photoURL: string | null;
    errorMessage: string | null;
    role: string | null;
    profileCompleted: boolean | null;
    nationality: string | null;
    isMember: boolean;
}

interface LoginPayload {
    uid: string;
    email: string;
    birthdate?: string;
    displayName: string;
    photoURL?: string;
    profileCompleted?: boolean;
    nationality?: string;
    isMember?: boolean;
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
    birthdate: null,
    displayName: null,
    photoURL: null,
    errorMessage: null,
    role: null,
    profileCompleted: null,
    nationality: null,
    isMember: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload }: PayloadAction<LoginPayload>) => {
            state.status = 'authenticated';
            state.uid = payload.uid;
            state.email = payload.email;
            state.birthdate = payload.birthdate || null;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL || null;
            state.errorMessage = null;
            state.profileCompleted = payload.profileCompleted || false;
            state.nationality = payload.nationality || null;
            state.isMember = payload.isMember || false;
        },

        logout: (state, action?: PayloadAction<LogoutPayload | undefined>) => {
            state.status = 'not-authenticated';
            state.uid = null;
            state.email = null;
            state.birthdate = null;
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = action?.payload?.errorMessage || null;
            state.role = null;
            state.profileCompleted = null;
            state.nationality = null;
            state.isMember = false;
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
