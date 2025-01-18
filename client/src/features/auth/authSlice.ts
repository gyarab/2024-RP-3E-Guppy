import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { User } from "../../shared/interfaces/User";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
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
  },
});

export const { setAuthCredentials, setIsAuth, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuth = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;