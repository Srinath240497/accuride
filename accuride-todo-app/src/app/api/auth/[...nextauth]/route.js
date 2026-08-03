// src/app/api/auth/[...nextauth]/route.js

// Import Libraties
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Export Auth Options
 */
export const authOptions = {
  // provider
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const users = [
          {
            id: "1",
            name: "User 1",
            email: "user1@example.com",
            password: "Test@123",
          },
          {
            id: "2",
            name: "User 2",
            email: "user2@example.com",
            password: "Test@123",
          },
        ];

        const user = users.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.toLowerCase() &&
            u.password === credentials.password
        );

        if (user) {
          return { id: user.id, name: user.name, email: user.email };
        }

        return null;
      },
    }),
  ],
  // callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  // pages
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // secret
  secret: process.env.NEXTAUTH_SECRET,
};

// Initialise Handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
