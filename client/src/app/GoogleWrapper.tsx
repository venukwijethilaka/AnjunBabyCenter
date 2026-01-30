"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace this with your actual Client ID
const CLIENT_ID = "401709061609-n47l4jrr5oos65rslumdc2b5m5pkjufc.apps.googleusercontent.com";

export const GoogleWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};