import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../modules/auth/store';
import { userSlice } from '../modules/user/store';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
