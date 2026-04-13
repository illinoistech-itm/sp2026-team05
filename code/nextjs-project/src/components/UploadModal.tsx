"use client";

import { useState, useCallback, useRef } from "react";
import { X, Upload } from "lucide-react";
import TagPill from "./TagPill";
import { validateImageFile, createImagePreview } from "@/lib/upload";
import { addTag, removeTag } from "@/lib/hashtags";
import { createPost } from "@/lib/interactions";
import "./UploadModal.css";

interface UploadModalProps {
  onClose: () => void;
  onSuccess?: (post: any) => void;
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) { setError(validation.error || "Invalid file"); return; }
    setError("");
    setImageFile(file);
    setImagePreview(createImagePreview(file));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        const result = addTag(tags, tagInput.trim());
        if (result.error) setError(result.error);
        else { setTags(result.tags); setTagInput(""); setError(""); }
      }
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(removeTag(tags, tags[tags.length - 1]));
    }
  };

  const handlePost = async () => {
    if (!imagePreview) { setError("Please select an image"); return; }
    setUploading(true);
    try {
      const post = await createPost({ imageUrl: imagePreview, description, tags });
      onSuccess?.(post);
      onClose();
    } catch {
      setError("Failed to post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="upload-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Drop zone */}
        <div
          className={`upload-drop-zone ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Preview" />
          ) : (
            <div className="upload-drop-placeholder">
              <Upload size={32} />
              <span>Upload image</span>
              <small>or drag & drop</small>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {/* Tags */}
        <div className="upload-tags-box">
          <div className="upload-tags-pills">
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} onRemove={() => setTags(removeTag(tags, tag))} />
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "Add Tags (press Enter)" : "Add more tags..."}
            className="upload-tags-input"
          />
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description"
          rows={3}
          className="upload-desc-input"
          maxLength={500}
        />

        {error && <p className="upload-error">{error}</p>}

        <div className="upload-actions">
          <button className="upload-post-btn" onClick={handlePost} disabled={uploading}>
            {uploading ? "Posting..." : "Post"}
          </button>
          <button className="upload-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
