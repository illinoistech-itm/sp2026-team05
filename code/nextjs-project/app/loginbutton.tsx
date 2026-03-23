"use client"  // MUST be first line

import { signIn } from "next-auth/react"

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/home/page.tsx" })}
      className="bg-photoblue text-white text-sm underline rounded-sm h-9 px-9"
    >
      Log in with Google
    </button>
  )
}