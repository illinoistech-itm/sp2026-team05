"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { mockPosts } from "@/lib/mockData";
import { filterPostsByTag } from "@/lib/hashtags";
import "./home.css";

export default function HomePage() {
  const [posts] = useState(mockPosts);
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

  const clearFilter = () => {
    setActiveFilter("");
    setSearchTag("");
  };

  return (
    <div className="home-page">
      <Navbar showPost showAvatar />

      <div className="home-search-wrapper">
        <form className="home-search-form" onSubmit={handleSearch}>
          <div className="home-search-input-wrap">
            <Search size={16} className="home-search-icon" />
            <input
              type="text"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              placeholder="Search by tag..."
              className="home-search-input"
            />
          </div>
          {activeFilter && (
            <button type="button" onClick={clearFilter} className="home-clear-btn">
              <X size={12} /> Clear
            </button>
          )}
        </form>
        {activeFilter && (
          <p className="home-filter-label">
            Showing posts tagged <strong>#{activeFilter}</strong>
          </p>
        )}
      </div>

      <main className="home-grid-wrapper">
        {filteredPosts.length === 0 ? (
          <div className="home-empty">No posts found for #{activeFilter}</div>
        ) : (
          <div className="home-grid">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onTagClick={handleTagClick} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
