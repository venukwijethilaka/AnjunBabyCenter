import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./api";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string;
        isRestoring?: boolean; // ✅ Added flag
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }

      // Automatically update the stored token if it's a refresh event (isRestoring = true)
      if (action.payload.isRestoring && typeof window !== 'undefined') {
        // Determine where the user is currently saved (localStorage vs sessionStorage)
        if (localStorage.getItem("token")) {
          localStorage.setItem("token", action.payload.token);
          if (action.payload.refreshToken) localStorage.setItem("refreshToken", action.payload.refreshToken);
        } else if (sessionStorage.getItem("token")) {
          sessionStorage.setItem("token", action.payload.token);
          if (action.payload.refreshToken) sessionStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;

      // ✅ Clear EVERYTHING on logout to be safe
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("persist_auth");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("session_active");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;