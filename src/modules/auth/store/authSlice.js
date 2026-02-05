import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',

    initialState: {
        status: 'checking', // 'checking', 'not-authenticated' 'authenticated'
        uid: null, 
        email: null, 
        birthdate: null, 
        displayName: null,
        photoURL: null,
        errorMessage: null,
        role: null,
        profileCompleted: null, // null = no verificado, true/false = verificado
        nationality: null,
        isMember: false,
    },
    
    reducers: {
        login: (state, { payload }) => {
            state.status = 'authenticated';
            state.uid = payload.uid;
            state.email = payload.email;
            state.birthdate = payload.birthdate;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null;
            state.profileCompleted = payload.profileCompleted || false;
            state.nationality = payload.nationality || null;
            state.isMember = payload.isMember || false;
        },

        logout: (state ) => {
            state.status = 'not-authenticated';
            state.uid = null; 
            state.email = null; 
            state.birthdate = null; 
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = null;
            state.role = null;
            state.profileCompleted = null;
            state.nationality = null;
            state.isMember = false;
        },

        chekingCredentials: (state) => {
            state.status = 'checking';
        },

        setRole: (state, { payload }) => {
            state.role = payload.role;
        },

        setProfileCompleted: (state, { payload }) => {
            state.profileCompleted = payload.profileCompleted;
        },
    }
});


// Action creators are generated for each case reducer function
export const { 
    chekingCredentials, 
    login, 
    logout,
    setRole,
    setProfileCompleted,
} = authSlice.actions;