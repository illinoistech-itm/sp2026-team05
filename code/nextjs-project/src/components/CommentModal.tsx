"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Post, Comment } from "@/types";
import Avatar from "./Avatar";
import { addComment, fetchComments } from "@/lib/interactions";
import { currentUser } from "@/lib/mockData";

interface CommentModalProps {
  post: Post;
  onClose: () => void;
}

export default function CommentModal({ post, onClose }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchComments(post.id).then((c) => {
      setComments(c);
      setLoading(false);
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [post.id]);

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const comment = await addComment(post.id, newComment, currentUser);
      setComments((prev) => [...prev, comment as Comment]);
      setNewComment("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: "#1a1a2e", border: "1px solid rgba(0,191,179,0.3)", maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(0,191,179,0.2)" }}>
          <div className="flex items-center gap-3">
            <Avatar src={post.author.avatar} username={post.author.username} size={36} showRing />
            <span className="font-mono text-white font-bold">{post.author.username}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Post image thumbnail */}
        <div className="relative" style={{ height: 200 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />
          {post.description && (
            <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
              <p className="font-mono text-white text-sm">{post.description}</p>
            </div>
          )}
        </div>

        {/* Comments list */}
        <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 240 }}>
          {loading ? (
            <div className="text-center font-mono text-gray-400 py-4">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center font-mono text-gray-400 py-4">No comments yet. Be first!</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 animate-fade-in">
                <Avatar src={comment.author.avatar} username={comment.author.username} size={32} />
                <div className="flex-1 rounded-xl p-3" style={{ background: "rgba(0,191,179,0.1)" }}>
                  <span className="font-mono text-sm font-bold" style={{ color: "#00BFB3" }}>
                    {comment.author.username}
                  </span>
                  <p className="font-mono text-sm text-white mt-1">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 flex gap-3 items-center" style={{ borderTop: "1px solid rgba(0,191,179,0.2)" }}>
          <Avatar src={currentUser.avatar} username={currentUser.username} size={32} showRing />
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="input-field flex-1"
            maxLength={500}
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
            className="p-2 rounded-full transition-all hover:scale-110 disabled:opacity-40"
            style={{ background: "#00BFB3", color: "#0a2a28" }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
