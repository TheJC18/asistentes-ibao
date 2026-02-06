import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/modules/auth/store/authSlice";
import userReducer from "@/modules/user/store/userSlice";
import memberReducer from "@/modules/members/store/memberSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    members: memberReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
