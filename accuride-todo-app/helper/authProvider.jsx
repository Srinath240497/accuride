// src/helper/authProvider.jsx
"use client";

// Import React Library
import { SessionProvider } from "next-auth/react";

/**
 * 
 * @param {children} param0 
 * @returns 
 */
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
