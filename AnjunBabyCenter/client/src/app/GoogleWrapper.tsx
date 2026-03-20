"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Directly check the variable
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export const GoogleWrapper = ({ children }: { children: React.ReactNode }) => {

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};