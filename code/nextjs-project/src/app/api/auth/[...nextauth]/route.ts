/**Quick fix */
/**Note we are using v5 structure**/
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { auth } from "../../../../../auth";

const auth = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;

        if (!(session.user as any).username) {
          (session.user as any).username =
            session.user.email?.split("@")[0] || "user";
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export const { GET, POST } = auth;