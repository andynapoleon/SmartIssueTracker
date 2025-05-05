import { configureStore } from "@reduxjs/toolkit";
import issuesReducer from "../features/issues/issuesSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
