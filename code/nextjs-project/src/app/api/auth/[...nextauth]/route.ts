import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Runs when a user signs in
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists in database
          const [rows]: any = await db.execute(
            "SELECT user_id, username FROM users WHERE email = ?",
            [user.email ?? ""]
          );

          if (rows.length === 0) {
            // New user — create them in the database
            const username = user.email?.split("@")[0] || `user_${Date.now()}`;
            const profilePic = user.image || null;

            await db.execute(
              `INSERT INTO users (username, email, password_hash, profile_pic_url)
               VALUES (?, ?, ?, ?)`,
              [username, user.email ?? "", "google-oauth", profilePic]
            );
          }
          return true;
        } catch (error) {
          console.error("Database error during sign in:", error);
          return false;
        }
      }
      return true;
    },

    // Runs when JWT token is created/updated
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        try {
          const [rows]: any = await db.execute(
            "SELECT user_id, username, profile_pic_url FROM users WHERE email = ?",
            [token.email ?? ""]
          );
          if (rows.length > 0) {
            token.userId = rows[0].user_id;
            token.username = rows[0].username;
            token.profilePic = rows[0].profile_pic_url;
          }
        } catch (error) {
          console.error("Database error during JWT:", error);
        }
      }
      return token;
    },

    // Runs when session is checked — exposes data to the client
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.userId;
        (session.user as any).username = token.username;
        (session.user as any).profilePic = token.profilePic;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
