import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const productionAuthUrl = "https://system22h119.itm.iit.edu";

if (
  process.env.NODE_ENV === "production" &&
  !process.env.AUTH_URL &&
  !process.env.NEXTAUTH_URL
) {
  process.env.AUTH_URL = productionAuthUrl;
  process.env.NEXTAUTH_URL = productionAuthUrl;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        const user = session.user as typeof session.user & {
          id?: string;
          username?: string;
        };

        user.id = token.sub;

        if (!user.username) {
          user.username = user.email?.split("@")[0] || "user";
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
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}/home`;
      }

      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/home`;
      }

      return `${baseUrl}/home`;
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
