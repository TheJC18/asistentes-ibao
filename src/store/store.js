import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../modules/auth/store';
import { userSlice } from '../modules/user/store';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar estas rutas del action para timestamps de Firebase
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignorar estos paths del state para timestamps de Firebase
        ignoredPaths: ['items.dates'],
        // Ignorar actions que contengan timestamps
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})