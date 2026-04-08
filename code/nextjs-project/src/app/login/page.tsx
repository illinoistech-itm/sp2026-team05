"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    // In production: use credentials provider
    // Mock: redirect to home
    setTimeout(() => {
      router.push("/home");
    }, 800);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #00BFB3 0%, #007A75 40%, #003D3A 80%, #001A18 100%)" }}
    >
      {/* Navbar */}
      <nav className="px-6 py-4">
        <Logo size={55} href="/login" />
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-xs animate-slide-up">
          <p className="font-mono text-white text-sm mb-2 tracking-wide">Log In</p>

          <div
            className="rounded-2xl p-6 space-y-4"
            style={{ background: "#0d1117", border: "1px solid rgba(0,191,179,0.25)" }}
          >
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-mono text-sm font-bold transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: "white", color: "#1a1a1a" }}
            >
              {/* Google icon */}
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="font-mono text-xs text-gray-500">or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* Email field */}
            <div>
              <label className="block font-mono text-xs text-white mb-2 tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@address.com"
                className="input-field"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(0,191,179,0.3)" }}
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block font-mono text-xs text-white mb-2 tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="****************"
                className="input-field"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(0,191,179,0.3)" }}
              />
              <button className="font-mono text-xs mt-1 underline" style={{ color: "#00BFB3", background: "none", border: "none", cursor: "pointer" }}>
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="font-mono text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}

            {/* Log in button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-mono font-bold text-sm transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: "#00BFB3", color: "#0a2a28" }}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {/* Sign up */}
            <button
              onClick={() => router.push("/signup")}
              className="w-full py-3 rounded-xl font-mono font-bold text-sm transition-all hover:scale-105 underline"
              style={{ background: "#F5F0E8", color: "#1a1a1a" }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
