import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const configuredBaseUrl =
  process.env.AUTH_URL ||
  process.env.NEXTAUTH_URL ||
  (process.env.FQDN ? `https://${process.env.FQDN}` : undefined);

if (configuredBaseUrl) {
  process.env.AUTH_URL ??= configuredBaseUrl;
  process.env.NEXTAUTH_URL ??= configuredBaseUrl;
}

const configuredAuthSecret =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (configuredAuthSecret) {
  process.env.AUTH_SECRET ??= configuredAuthSecret;
  process.env.NEXTAUTH_SECRET ??= configuredAuthSecret;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      issuer: "https://accounts.google.com",
      authorization: {
        params: {
          prompt: "select_account",
          scope: "openid email profile",
          response_type: "code",
        },
      },
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
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export const { GET, POST } = handlers;
