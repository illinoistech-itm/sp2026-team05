"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import "./signup.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) { setError("Please fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => router.push("/home"), 800);
  };

  const fields = [
    { label: "Username", value: username, set: setUsername, type: "text", placeholder: "YourUsername" },
    { label: "Email", value: email, set: setEmail, type: "email", placeholder: "email@address.com" },
    { label: "Password", value: password, set: setPassword, type: "password", placeholder: "Min. 8 characters" },
    { label: "Confirm Password", value: confirm, set: setConfirm, type: "password", placeholder: "Re-enter password" },
  ];

  return (
    <div className="signup-page">
      <nav className="signup-nav">
        <Logo size={55} href="/login" />
      </nav>

      <main className="signup-main">
        <div className="signup-container">
          <span className="signup-page-label">Sign Up</span>

          <div className="signup-card">
            <button className="signup-google-btn" onClick={() => signIn("google", { callbackUrl: "/home" })}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Sign up with Google
            </button>

            <div className="signup-divider">
              <div className="signup-divider-line" />
              <span className="signup-divider-text">or</span>
              <div className="signup-divider-line" />
            </div>

            {fields.map(({ label, value, set, type, placeholder }) => (
              <div key={label} className="signup-field">
                <label className="signup-field-label">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  className="signup-input"
                />
              </div>
            ))}

            {error && <p className="signup-error">{error}</p>}

            <button className="signup-submit-btn" onClick={handleSignup} disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <button className="signup-login-link" onClick={() => router.push("/login")}>
              Already have an account? Log in
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
