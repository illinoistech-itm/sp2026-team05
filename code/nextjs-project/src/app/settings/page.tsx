"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import "./settings.css";

type EditField = "username" | "email" | "password" | null;

type SettingsUser = {
  user_id: number;
  username: string;
  email: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<SettingsUser | null>(null);
  const [editing, setEditing] = useState<EditField>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load settings.");
        }

        setUser({
          user_id: data.user.user_id,
          username: data.user.username,
          email: data.user.email,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, []);

  const startEdit = (field: EditField) => {
    if (!user) return;

    setEditing(field);
    setError("");
    setSuccess("");
    if (field === "username") setTempValue(user.username);
    if (field === "email") setTempValue(user.email);
    if (field === "password") { setNewPassword(""); setConfirmPassword(""); }
  };

  const cancelEdit = () => { setEditing(null); setError(""); };

  const saveEdit = async () => {
    if (!user) return;

    if (editing === "username") {
      if (!tempValue.trim()) { setError("Username cannot be empty."); return; }

      const nextUsername = tempValue.trim();

      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: nextUsername }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to update username.");
        }

        setUser((current) => current ? { ...current, username: nextUsername } : current);
        setSuccess("Username updated!");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update username.");
        return;
      }
    }

    if (editing === "email") {
      if (!tempValue.includes("@")) { setError("Invalid email."); return; }
      setError("Email changes are not supported here yet.");
      return;
    }

    if (editing === "password") {
      if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
      setError("Password changes are not supported here yet.");
      return;
    }

    setEditing(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading) {
    return (
      <div className="settings-page">
        <main className="settings-main">
          <div className="settings-card">Loading settings...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="settings-page">
        <button className="settings-back" onClick={() => router.push("/profile")}>
          <ArrowLeft size={20} /> Back to Profile
        </button>

        <main className="settings-main">
          <div className="settings-card">
            {error || "Unable to load user settings."}
          </div>
        </main>
      </div>
    );
  }

  const rows = [
    { label: "User ID", value: user.user_id.toString(), field: null as EditField },
    { label: "UserName", value: user.username, field: "username" as EditField },
    { label: "Email", value: user.email, field: "email" as EditField },
    { label: "Password", value: "****************", field: "password" as EditField },
  ];

  return (
    <div className="settings-page">
      <button className="settings-back" onClick={() => router.push("/profile")}>
        <ArrowLeft size={20} /> Back to Profile
      </button>

      <main className="settings-main">
        <div className="settings-card">
          {success && (
            <div className="settings-success">
              <Check size={16} /> {success}
            </div>
          )}

          <div className="settings-rows">
            {rows.map(({ label, value, field }) => (
              <div key={label} className="settings-row">
                <div className="settings-row-top">
                  <span className="settings-row-label">{label}</span>
                  <span className="settings-row-value">{value}</span>
                </div>

                {field && editing === field ? (
                  <div className="settings-edit-area">
                    {field === "password" ? (
                      <>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="settings-input"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="settings-input"
                        />
                      </>
                    ) : (
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="settings-input"
                        autoFocus
                      />
                    )}
                    {error && <p className="settings-input-error">{error}</p>}
                    <div className="settings-edit-actions">
                      <button className="settings-save-btn" onClick={() => void saveEdit()}>
                        <Check size={12} /> Save
                      </button>
                      <button className="settings-cancel-btn" onClick={cancelEdit}>
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : field && (
                  <button className="settings-change-btn" onClick={() => startEdit(field)}>
                    Change {label}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="settings-divider" />

          <div className="settings-footer">
            <button className="settings-contact-btn">Contact us</button>
            <button className="settings-logout-btn" onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
