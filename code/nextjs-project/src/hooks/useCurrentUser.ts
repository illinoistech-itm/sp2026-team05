"use client";

import { useSession } from "next-auth/react";

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  profilePic?: string;
  image?: string;
}

export function useCurrentUser() {
  const { data: session, status } = useSession();

  const user: CurrentUser | null = session?.user
    ? {
        id: (session.user as any).id,
        username: (session.user as any).username || session.user.email?.split("@")[0] || "user",
        email: session.user.email || "",
        profilePic: (session.user as any).profilePic || session.user.image || "",
        image: session.user.image || "",
      }
    : null;

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
