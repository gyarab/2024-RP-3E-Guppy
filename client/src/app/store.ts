import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import { apiSlice } from "../shared/api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
