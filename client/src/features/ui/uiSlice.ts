import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

interface UIState {
  theme: string;
  isSidebarOpen: boolean;
}

const initialState: UIState = {
  theme: "light",
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setTheme, toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectIsSidebarOpen = (state: RootState) => state.ui.isSidebarOpen;
