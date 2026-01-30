import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice"; 

// Configure the Store
export const store = configureStore({
  reducer: {
    global: globalReducer,      // UI State (Sidebar)
    auth: authReducer,          // User State (Login/Loyalty)
    [api.reducerPath]: api.reducer, // API Cache
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Enable listener behavior for the API (required for refetchOnFocus/Reconnect)
setupListeners(store.dispatch);

// Export Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;