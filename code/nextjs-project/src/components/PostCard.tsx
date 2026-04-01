"use client";

import { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Post } from "@/types";
import TagPill from "./TagPill";
import Avatar from "./Avatar";
import { toggleLike, toggleSave, formatCount } from "@/lib/interactions";
import CommentModal from "./CommentModal";

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
      <div className="post-card animate-fade-in">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.description || "Photo League post"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Footer */}
        <div className="p-3 flex items-center justify-between gap-2 bg-white">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {post.tags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                onClick={() => onTagClick?.(tag)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 transition-all duration-200"
              style={{ transform: isAnimating ? "scale(1.3)" : "scale(1)" }}
            >
              <Heart
                size={18}
                fill={liked ? "#ff4d6d" : "none"}
                stroke={liked ? "#ff4d6d" : "#888"}
                strokeWidth={2}
              />
              <span className="text-xs font-mono text-gray-600">{formatCount(likesCount)}</span>
            </button>

            {/* Comment */}
            <button onClick={() => setShowComments(true)} className="flex items-center gap-1 transition-all hover:scale-110">
              <MessageCircle size={18} stroke="#888" strokeWidth={2} />
            </button>

            {/* Save */}
            <button onClick={handleSave} className="flex items-center gap-1 transition-all hover:scale-110">
              <Bookmark
                size={18}
                fill={saved ? "#00BFB3" : "none"}
                stroke={saved ? "#00BFB3" : "#888"}
                strokeWidth={2}
              />
            </button>

            {/* Author avatar */}
            <Avatar src={post.author.avatar} username={post.author.username} size={32} showRing />
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {showComments && (
        <CommentModal post={post} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}
