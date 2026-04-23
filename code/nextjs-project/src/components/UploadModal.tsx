"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, CloudUpload } from "lucide-react";
import { uploadImage, validateImageFile, createImagePreview, revokeImagePreview } from "@/lib/upload";
import "./UploadModal.css";

interface UploadModalProps {
  onClose: () => void;
  onSuccess?: (post?: any) => void;
}


export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  // --- Image state ---
  const [file, setFile] = useState<File | null>(null);
  // Local blob URL used only for the preview <img>; revoked on cleanup
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // --- Form fields ---
  // Tags are stored as an array; the input field tracks the current draft tag
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");

  // --- Upload lifecycle ---
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hidden <input type="file"> triggered by clicking the drop zone
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke the blob URL when the modal unmounts or the file changes,
  // so we don't leak memory from orphaned object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) revokeImagePreview(previewUrl);
    };
  }, [previewUrl]);

  // Close the modal when the user presses Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // --- File selection helpers ---

  // Shared logic for handling a newly chosen file from either the file picker
  // or a drag-and-drop event
  const handleFile = useCallback((selected: File) => {
    const result = validateImageFile(selected);
    if (!result.valid) {
      setError(result.error ?? "Invalid file.");
      return;
    }
    // Revoke any existing preview before creating a new one
    if (previewUrl) revokeImagePreview(previewUrl);
    setFile(selected);
    setPreviewUrl(createImagePreview(selected));
    setError(null);
  }, [previewUrl]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  // --- Drag-and-drop handlers ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  // --- Tag management ---

  // Commit the current draft tag on Enter or comma; ignore empty/duplicate tags
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/,/g, "");
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
      }
      setTagInput("");
    }
    // Backspace on an empty input removes the last tag
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  // --- Form submission ---

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Step 1: Upload the image to MinIO and get back its public URL
      const imageUrl = await uploadImage(file);

      // Step 2: Save the post (image URL + metadata) to the database
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, description, tags }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save post.");
      }

      // Notify the parent so it can refresh the post feed, then close
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    // Backdrop: clicking outside the modal card closes it
    <div className="upload-overlay" onClick={onClose}>
      {/* Stop click propagation so clicking inside the card doesn't close the modal */}
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>

        {/* Close button — top-right corner */}
        <button className="upload-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Drop zone / image preview */}
        <div
          className={`upload-drop-zone${isDragOver ? " drag-over" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            // Show a preview once the user has selected a file
            <img src={previewUrl} alt="Preview" />
          ) : (
            // Placeholder shown before any file is selected
            <div className="upload-drop-placeholder">
              <CloudUpload size={32} />
              <span>Click or drag &amp; drop an image</span>
              <small>JPEG, PNG, WEBP, GIF — max 10 MB</small>
            </div>
          )}
        </div>

        {/* Hidden native file input — triggered by clicking the drop zone */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />

        {/* Tags input — pill-style multi-value field */}
        <div className="upload-tags-box">
          <div className="upload-tags-pills">
            {tags.map((tag) => (
              // Each committed tag renders as a removable pill
              <span key={tag} className="upload-tag-pill">
                #{tag}
                <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>×</button>
              </span>
            ))}
          </div>
          <input
            className="upload-tags-input"
            type="text"
            placeholder="Add tags (Enter or comma to confirm)…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>

        {/* Description textarea */}
        <textarea
          className="upload-desc-input"
          rows={3}
          placeholder="Write a description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Inline error message */}
        {error && <div className="upload-error">{error}</div>}

        {/* Action buttons */}
        <div className="upload-actions">
          <button
            className="upload-post-btn"
            onClick={handleSubmit}
            disabled={uploading || !file}
          >
            {uploading ? "Uploading…" : "Post"}
          </button>
          <button className="upload-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
