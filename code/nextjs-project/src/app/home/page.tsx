"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { mockPosts } from "@/lib/mockData";
import { filterPostsByTag } from "@/lib/hashtags";

export default function HomePage() {
  const [posts, setPosts] = useState(mockPosts);
  const [searchTag, setSearchTag] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const filteredPosts = useMemo(() => {
    if (!activeFilter) return posts;
    return filterPostsByTag(posts, activeFilter);
  }, [posts, activeFilter]);

  const handleTagClick = (tag: string) => {
    setActiveFilter(tag === activeFilter ? "" : tag);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilter(searchTag.trim());
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #aee8e5 0%, #00BFB3 20%, #008080 60%, #004D4D 100%)" }}
    >
      <Navbar showPost showAvatar />

      {/* Search bar */}
      <div className="px-6 py-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md mx-auto">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              placeholder="Search by tag..."
              className="w-full pl-9 pr-4 py-2 rounded-full font-mono text-sm text-white outline-none"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.3)" }}
            />
          </div>
          {activeFilter && (
            <button
              type="button"
              onClick={() => { setActiveFilter(""); setSearchTag(""); }}
              className="flex items-center gap-1 px-3 py-2 rounded-full font-mono text-xs font-bold transition-all hover:scale-105"
              style={{ background: "rgba(0,0,0,0.3)", color: "white" }}
            >
              <X size={12} /> Clear
            </button>
          )}
        </form>
        {activeFilter && (
          <p className="text-center font-mono text-sm text-white/70 mt-2">
            Showing posts tagged <span className="text-white font-bold">#{activeFilter}</span>
          </p>
        )}
      </div>

      {/* Posts Grid */}
      <main className="px-6 pb-10">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-white/60 text-lg">No posts found for #{activeFilter}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onTagClick={handleTagClick} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
