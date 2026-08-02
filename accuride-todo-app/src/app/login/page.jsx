"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("user1@example.com");
  const [password, setPassword] = useState("Test@123");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (result?.ok) {
        router.push("/calendar");
        router.refresh();
      } else if (result?.error) {
        setErrorMessage("Invalid email or password.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Sign In
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and password to access your Calendar
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>
            User 1:{" "}
            <code className="bg-gray-100 px-1 rounded">user1@example.com</code>{" "}
            / <code className="bg-gray-100 px-1 rounded">Test@123</code>
          </p>
          <p>
            User 2:{" "}
            <code className="bg-gray-100 px-1 rounded">user2@example.com</code>{" "}
            / <code className="bg-gray-100 px-1 rounded">Test@123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
