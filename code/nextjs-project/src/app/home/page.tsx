"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { filterPostsByTag } from "@/lib/hashtags";
import "./home.css";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTag, setSearchTag] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // Fetch posts from real API
  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
    }
  }, [status]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePostSuccess = () => {
    window.location.reload();
  };

  if (status === "loading" || loading) {
    return (
      <div className="home-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ fontFamily: "Courier New, monospace", color: "white", fontSize: "1.1rem" }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navbar showPost showAvatar onPostSuccess={handlePostSuccess} />

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
          <div className="home-empty">
            {activeFilter ? `No posts found for #${activeFilter}` : "No posts yet. Be the first to post!"}
          </div>
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
