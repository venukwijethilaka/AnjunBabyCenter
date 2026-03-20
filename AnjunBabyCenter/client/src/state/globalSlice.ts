import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
  isSidebarCollapsed: boolean;
  theme: 'girl' | 'boy';
  themeInitialized: boolean; // true once ThemeWelcome has restored the saved theme
}

const initialState: GlobalState = {
  isSidebarCollapsed: false,
  theme: 'girl',
  themeInitialized: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'girl' ? 'boy' : 'girl';
      state.themeInitialized = true; // toggle always means initialized
    },
    setTheme: (state, action: PayloadAction<'girl' | 'boy'>) => {
      state.theme = action.payload;
    },
    // Used only by ThemeWelcome on first restore — sets theme AND marks initialized
    initializeTheme: (state, action: PayloadAction<'girl' | 'boy'>) => {
      state.theme = action.payload;
      state.themeInitialized = true;
    },
  },
});

export const { setIsSidebarCollapsed, toggleTheme, setTheme, initializeTheme } = globalSlice.actions;
export default globalSlice.reducer;