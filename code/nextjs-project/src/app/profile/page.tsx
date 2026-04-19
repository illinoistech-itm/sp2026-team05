"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, MessageCircle } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/Avatar";
import UploadModal from "@/components/UploadModal";
import "./profile.css";

interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  profile_pic_url: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

interface Post {
  post_id: number;
  image_url: string;
  caption: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "saved">("photos");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // Fetch profile data
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchMyPosts();
      fetchSavedPosts();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfile(data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const res = await fetch("/api/posts/my-posts");
      const data = await res.json();
      setMyPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const res = await fetch("/api/posts/saved");
      const data = await res.json();
      setSavedPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch saved posts:", error);
    }
  };

  const displayPosts = activeTab === "photos" ? myPosts : savedPosts;

  if (status === "loading" || loading) {
    return (
      <div className="profile-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Courier New, monospace", color: "white" }}>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  const username = profile?.username || session.user?.email?.split("@")[0] || "User";
  const avatar = profile?.profile_pic_url || session.user?.image || "";

  return (
    <>
      <div className="profile-page">
        <Navbar showPost={false} showAvatar={false} />

        <div className="profile-content">
          <div className="profile-card">
            <button className="profile-settings-btn" onClick={() => router.push("/settings")}>
              <Settings size={28} />
            </button>

            <div className="profile-header">
              <Avatar src={avatar} username={username} size={100} showRing />
              <div className="profile-info">
                <h1 className="profile-username">{username}</h1>
                <p className="profile-bio">{session.user?.email}</p>

                <div className="profile-stats">
                  <button className="profile-stat-btn">
                    <span className="profile-stat-label">
                      Followers {profile?.followers_count || 0}
                    </span>
                  </button>
                  <button className="profile-stat-btn">
                    <span className="profile-stat-label">
                      Following {profile?.following_count || 0}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button className="profile-post-btn" onClick={() => setShowUpload(true)}>
              Post
            </button>

            <div className="profile-tabs">
              {(["photos", "saved"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`profile-tab ${activeTab === tab ? "active" : ""}`}
                >
                  {tab === "photos" ? `Photos (${myPosts.length})` : `Saved Posts (${savedPosts.length})`}
                </button>
              ))}
            </div>

            <div className="profile-photos-grid">
              {displayPosts.length === 0 ? (
                <p className="profile-empty">
                  {activeTab === "photos" ? "No posts yet." : "No saved posts."}
                </p>
              ) : (
                displayPosts.map((post) => (
                  <div key={post.post_id} className="profile-photo-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image_url} alt={post.caption} />
                    <div className="profile-photo-overlay">
                      <p className="profile-photo-caption">{post.caption}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={fetchMyPosts} />}
    </>
  );
}
