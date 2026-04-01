"use client";

interface AvatarProps {
  src?: string;
  username: string;
  size?: number;
  showRing?: boolean;
  onClick?: () => void;
}

export default function Avatar({ src, username, size = 40, showRing = false, onClick }: AvatarProps) {
  const initials = username?.charAt(0).toUpperCase() || "?";

  return (
    <div
      onClick={onClick}
      className={`relative flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${showRing ? "avatar-ring" : ""}`}
      style={{ width: size, height: size, border: showRing ? "2px solid #00BFB3" : "2px solid rgba(255,255,255,0.3)" }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={username} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-mono font-bold text-white"
          style={{ background: `hsl(${(username.charCodeAt(0) * 37) % 360}, 50%, 35%)`, fontSize: size * 0.4 }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
