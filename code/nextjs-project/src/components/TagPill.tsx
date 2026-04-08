"use client";

interface TagPillProps {
  tag: string;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: "default" | "removable" | "clickable";
}

export default function TagPill({ tag, onRemove, onClick, variant = "default" }: TagPillProps) {
  return (
    <span
      className="tag-pill"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      #{tag}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-1 hover:opacity-70 transition-opacity font-bold"
          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
        >
          ✕
        </button>
      )}
    </span>
  );
}
