// src/components/LogoutButton.jsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton({ className = "" }) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={`px-4 py-2 bg-blue-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isSigningOut ? "animate-spin" : ""}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {isSigningOut ? "Signing Out..." : "Log Out"}
    </button>
  );
}