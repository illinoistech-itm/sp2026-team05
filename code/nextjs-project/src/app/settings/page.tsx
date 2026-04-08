"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { currentUser } from "@/lib/mockData";

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
    {
      label: "User ID",
      value: currentUser.id.padStart(10, "0"),
      field: null as EditField,
      editable: false,
    },
    { label: "UserName", value: username, field: "username" as EditField, editable: true },
    { label: "Email", value: email, field: "email" as EditField, editable: true },
    { label: "Password", value: "****************", field: "password" as EditField, editable: true },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #00BFB3 0%, #007A75 40%, #003D3A 100%)" }}
    >
      {/* Back nav */}
      <div className="px-4 py-4">
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 text-white font-mono text-sm hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} /> Back to Profile
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div
          className="w-full max-w-md rounded-2xl p-8 animate-slide-up"
          style={{ background: "#0d1117", border: "1px solid rgba(0,191,179,0.2)" }}
        >
          {/* Success message */}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl font-mono text-sm text-green-300 bg-green-900/20 border border-green-700/30 flex items-center gap-2">
              <Check size={16} /> {success}
            </div>
          )}

          {/* Rows */}
          <div className="space-y-6">
            {rows.map(({ label, value, field, editable }) => (
              <div key={label}>
                <div className="flex items-baseline gap-8">
                  <span className="font-mono text-sm text-white/60 w-24 flex-shrink-0">{label}</span>
                  <span className="font-mono text-sm text-white flex-1 break-all">{value}</span>
                </div>

                {/* Edit inline */}
                {editable && editing === field ? (
                  <div className="mt-3 ml-32">
                    {field === "password" ? (
                      <div className="space-y-2">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="input-field text-sm"
                          style={{ background: "rgba(255,255,255,0.07)" }}
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="input-field text-sm"
                          style={{ background: "rgba(255,255,255,0.07)" }}
                        />
                      </div>
                    ) : (
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="input-field text-sm"
                        style={{ background: "rgba(255,255,255,0.07)" }}
                        autoFocus
                      />
                    )}
                    {error && <p className="font-mono text-xs text-red-400 mt-1">{error}</p>}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-1 px-4 py-1 rounded-full font-mono text-xs font-bold transition-all hover:scale-105"
                        style={{ background: "#00BFB3", color: "#0a2a28" }}
                      >
                        <Check size={12} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 px-4 py-1 rounded-full font-mono text-xs transition-all hover:scale-105"
                        style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : editable && (
                  <div className="mt-2 ml-32">
                    <button
                      onClick={() => startEdit(field)}
                      className="px-5 py-1 rounded-full font-mono text-sm font-bold transition-all hover:scale-105"
                      style={{ background: "#00BFB3", color: "#0a2a28" }}
                    >
                      Change {label}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />

          {/* Contact & Logout */}
          <div className="flex flex-col items-center gap-4">
            <button
              className="px-8 py-2 rounded-full font-mono text-sm font-bold transition-all hover:scale-105"
              style={{ background: "#F5F0E8", color: "#1a1a1a" }}
            >
              Contact us
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 font-mono text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
