"use client";

import { useState, useCallback, useRef } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import TagPill from "./TagPill";
import { validateImageFile, createImagePreview } from "@/lib/upload";
import { addTag, removeTag } from "@/lib/hashtags";
import { createPost } from "@/lib/interactions";

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
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }
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
    if (!imageFile && !imagePreview) { setError("Please select an image"); return; }
    setUploading(true);
    try {
      // In production: upload to Cloudinary first, get URL
      // const imageUrl = await uploadImage(imageFile!);
      const imageUrl = imagePreview || ""; // Mock: use preview
      const post = await createPost({ imageUrl, description, tags });
      onSuccess?.(post);
      onClose();
    } catch {
      setError("Failed to post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl p-6 animate-slide-up relative"
        style={{ background: "linear-gradient(135deg, #00BFB3, #007A75)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image upload area */}
        <div
          className="relative rounded-2xl overflow-hidden mb-4 cursor-pointer transition-all"
          style={{
            background: dragOver ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.7)",
            height: 200,
            border: dragOver ? "2px dashed #fff" : "2px dashed rgba(255,255,255,0.3)",
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-white/60">
              <Upload size={32} />
              <span className="font-mono text-sm">Upload image</span>
              <span className="font-mono text-xs opacity-60">or drag & drop</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {/* Tags input */}
        <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "rgba(255,255,255,0.9)" }}>
          <div className="flex flex-wrap gap-1 mb-1">
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} onRemove={() => setTags(removeTag(tags, tag))} />
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "Add Tags (press Enter)" : "Add more..."}
            className="w-full bg-transparent font-mono text-sm text-gray-700 outline-none placeholder-gray-400"
          />
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description"
          rows={3}
          className="w-full rounded-2xl px-4 py-3 font-mono text-sm text-gray-700 outline-none resize-none mb-4"
          style={{ background: "rgba(255,255,255,0.9)" }}
          maxLength={500}
        />

        {/* Error */}
        {error && (
          <p className="font-mono text-xs text-red-200 mb-3 bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handlePost}
            disabled={uploading}
            className="flex-1 py-2 rounded-full font-mono font-bold transition-all hover:scale-105 disabled:opacity-60"
            style={{ background: "rgba(0,0,0,0.3)", color: "white", border: "2px solid rgba(255,255,255,0.4)" }}
          >
            {uploading ? "Posting..." : "Post"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-full font-mono font-bold transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid rgba(255,255,255,0.3)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
