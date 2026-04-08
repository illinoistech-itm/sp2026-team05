"use client";

import "./TagPill.css";

interface TagPillProps {
  tag: string;
  onRemove?: () => void;
  onClick?: () => void;
}

export default function TagPill({ tag, onRemove, onClick }: TagPillProps) {
  return (
    <span className={`tag-pill ${onClick ? "clickable" : ""}`} onClick={onClick}>
      #{tag}
      {onRemove && (
        <button
          className="tag-pill-remove"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
        >
          ✕
        </button>
      )}
    </span>
  );
}
