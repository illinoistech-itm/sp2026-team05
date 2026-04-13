"use client";

import "./Avatar.css";

interface AvatarProps {
  src?: string;
  username: string;
  size?: number;
  showRing?: boolean;
  onClick?: () => void;
}

export default function Avatar({ src, username, size = 40, showRing = false, onClick }: AvatarProps) {
  const initials = username?.charAt(0).toUpperCase() || "?";
  const bgColor = `hsl(${(username.charCodeAt(0) * 37) % 360}, 50%, 35%)`;

  return (
    <div
      className={`avatar ${showRing ? "with-ring" : ""}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={username} />
      ) : (
        <div
          className="avatar-initials"
          style={{ background: bgColor, fontSize: size * 0.4 }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
