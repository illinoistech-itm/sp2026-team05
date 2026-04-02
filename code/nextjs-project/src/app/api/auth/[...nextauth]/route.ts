/**Quick fix */
import NextAuth from "next-auth";
/**import { authOptions } from "@/lib/auth";**/
import { NextRequest } from "next/server";
/**import NextAuth, { type NextAuthOptions } from "next-auth";*/
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
        // Generate username from email if not set
        if (!( session.user as any).username) {
          (session.user as any).username = session.user.email?.split("@")[0] || "user";
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
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
};
/*** Delete this if code at bottom works
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
***/

const handle = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: any) {
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  return handler(req, ctx);
}