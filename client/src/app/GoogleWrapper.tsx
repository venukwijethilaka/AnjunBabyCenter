"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace this with your actual Client ID
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export const GoogleWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};