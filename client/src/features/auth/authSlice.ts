import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { User } from "../../shared/interfaces/User";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setIsAuth: (state, action) => {
      const { isAuth, user } = action.payload;
      state.isAuthenticated = isAuth;
      state.user = user;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    checkRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    }
  },
});

export const { setAuthCredentials, setIsAuth, logout, checkRememberMe } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuth = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectRememberMe = (state: RootState) => state.auth.rememberMe;