"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { currentUser } from "@/lib/mockData";
import "./settings.css";

type EditField = "username" | "email" | "password" | null;

export default function SettingsPage() {
  const [editing, setEditing] = useState<EditField>(null);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const startEdit = (field: EditField) => {
    setEditing(field);
    setError("");
    setSuccess("");
    if (field === "username") setTempValue(username);
    if (field === "email") setTempValue(email);
    if (field === "password") { setNewPassword(""); setConfirmPassword(""); }
  };

  const cancelEdit = () => { setEditing(null); setError(""); };

  const saveEdit = () => {
    if (editing === "username") {
      if (!tempValue.trim()) { setError("Username cannot be empty."); return; }
      setUsername(tempValue.trim());
      setSuccess("Username updated!");
    }
    if (editing === "email") {
      if (!tempValue.includes("@")) { setError("Invalid email."); return; }
      setEmail(tempValue.trim());
      setSuccess("Email updated!");
    }
    if (editing === "password") {
      if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
      setSuccess("Password updated!");
    }
    setEditing(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const rows = [
    { label: "User ID", value: currentUser.id.padStart(10, "0"), field: null as EditField },
    { label: "UserName", value: username, field: "username" as EditField },
    { label: "Email", value: email, field: "email" as EditField },
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
                      <button className="settings-save-btn" onClick={saveEdit}>
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
