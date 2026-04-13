"use client";

import { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Post } from "@/types";
import TagPill from "./TagPill";
import Avatar from "./Avatar";
import { toggleLike, toggleSave, formatCount } from "@/lib/interactions";
import CommentModal from "./CommentModal";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
}

export default function PostCard({ post, onTagClick }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    const result = await toggleLike(post.id, liked);
    setLiked(result.liked);
    setLikesCount((prev) => result.liked ? prev + 1 : prev - 1);
  };

  const handleSave = async () => {
    const result = await toggleSave(post.id, saved);
    setSaved(result.saved);
  };

  return (
    <>
      <div className="post-card">
        <div className="post-card-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt={post.description || "post"} />
        </div>

        <div className="post-card-footer">
          <div className="post-card-tags">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} onClick={() => onTagClick?.(tag)} />
            ))}
          </div>

          <div className="post-card-actions">
            <button
              className="post-card-like-btn"
              onClick={handleLike}
              style={{ transform: isAnimating ? "scale(1.3)" : "scale(1)" }}
            >
              <Heart size={18} fill={liked ? "#ff4d6d" : "none"} stroke={liked ? "#ff4d6d" : "#888"} strokeWidth={2} />
              <span className="post-card-like-count">{formatCount(likesCount)}</span>
            </button>

            <button className="post-card-icon-btn" onClick={() => setShowComments(true)}>
              <MessageCircle size={18} stroke="#888" strokeWidth={2} />
            </button>

            <button className="post-card-icon-btn" onClick={handleSave}>
              <Bookmark size={18} fill={saved ? "#00BFB3" : "none"} stroke={saved ? "#00BFB3" : "#888"} strokeWidth={2} />
            </button>

            <Avatar src={post.author.avatar} username={post.author.username} size={32} showRing />
          </div>
        </div>
      </div>

      {showComments && <CommentModal post={post} onClose={() => setShowComments(false)} />}
    </>
  );
}
