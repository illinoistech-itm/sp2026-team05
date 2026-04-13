"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Post, Comment } from "@/types";
import Avatar from "./Avatar";
import { addComment, fetchComments } from "@/lib/interactions";
import { currentUser } from "@/lib/mockData";
import "./CommentModal.css";

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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="comment-overlay" onClick={onClose}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="comment-modal-header">
          <div className="comment-modal-author">
            <Avatar src={post.author.avatar} username={post.author.username} size={36} showRing />
            <span className="comment-modal-username">{post.author.username}</span>
          </div>
          <button className="comment-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Image */}
        <div className="comment-modal-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt="post" />
          {post.description && (
            <div className="comment-modal-image-caption">
              <p>{post.description}</p>
            </div>
          )}
        </div>

        {/* Comments list */}
        <div className="comment-modal-list">
          {loading ? (
            <p className="comment-modal-loading">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="comment-modal-empty">No comments yet. Be first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <Avatar src={comment.author.avatar} username={comment.author.username} size={32} />
                <div className="comment-item-bubble">
                  <span className="comment-item-author">{comment.author.username}</span>
                  <p className="comment-item-text">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="comment-modal-input-row">
          <Avatar src={currentUser.avatar} username={currentUser.username} size={32} showRing />
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="comment-modal-input"
            maxLength={500}
          />
          <button
            className="comment-modal-send"
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
