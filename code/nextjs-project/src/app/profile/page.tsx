"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/Avatar";
import UploadModal from "@/components/UploadModal";
import { currentUser, mockPosts, mockConversations } from "@/lib/mockData";
import "./profile.css";

export default function ProfilePage() {
  const [showUpload, setShowUpload] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "saved">("photos");
  const router = useRouter();

  const myPosts = mockPosts.filter((p) => p.author.id === currentUser.id);
  const savedPosts = mockPosts.filter((p) => p.isSaved);
  const displayPosts = activeTab === "photos" ? myPosts : savedPosts;

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
              <Avatar src={currentUser.avatar} username={currentUser.username} size={100} showRing />
              <div className="profile-info">
                <h1 className="profile-username">{currentUser.username}</h1>
                <p className="profile-bio">{currentUser.bio}</p>
                <div className="profile-stats">
                  <button className="profile-stat-btn" onClick={() => setShowFollowers(true)}>
                    <Avatar src={mockConversations[0]?.participant.avatar} username="f" size={32} showRing />
                    <span className="profile-stat-label">Followers {currentUser.followersCount}</span>
                  </button>
                  <button className="profile-stat-btn" onClick={() => setShowFollowing(true)}>
                    <Avatar src={mockConversations[1]?.participant.avatar} username="g" size={32} showRing />
                    <span className="profile-stat-label">Following {currentUser.followingCount}</span>
                  </button>
                </div>
              </div>
            </div>

            <button className="profile-post-btn" onClick={() => setShowUpload(true)}>Post</button>

            <div className="profile-tabs">
              {(["photos", "saved"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`profile-tab ${activeTab === tab ? "active" : ""}`}
                >
                  {tab === "photos" ? "Photos" : "Saved Posts"}
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
                  <div key={post.id} className="profile-photo-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.imageUrl} alt={post.description} />
                    <div className="profile-photo-overlay">
                      <p className="profile-photo-caption">{post.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {showFollowers && (
        <FollowModal
          title={`${currentUser.followersCount} Followers`}
          users={mockConversations.map((c) => c.participant)}
          onClose={() => setShowFollowers(false)}
          onMessage={(user) => { router.push(`/messages?user=${user.id}`); setShowFollowers(false); }}
        />
      )}

      {showFollowing && (
        <FollowModal
          title={`Following ${currentUser.followingCount}`}
          users={mockConversations.map((c) => c.participant)}
          onClose={() => setShowFollowing(false)}
          onMessage={(user) => { router.push(`/messages?user=${user.id}`); setShowFollowing(false); }}
        />
      )}
    </>
  );
}

function FollowModal({ title, users, onClose, onMessage }: {
  title: string;
  users: any[];
  onClose: () => void;
  onMessage: (user: any) => void;
}) {
  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="follow-modal-title">{title}</h2>
        <div className="follow-modal-list">
          {users.map((user) => (
            <div key={user.id} className="follow-modal-item">
              <div className="follow-modal-avatar-wrap">
                <Avatar src={user.avatar} username={user.username} size={48} showRing />
                <div className="online-dot" />
              </div>
              <span className="follow-modal-username">{user.username}</span>
              <button className="follow-modal-msg-btn" onClick={() => onMessage(user)}>
                <MessageCircle size={22} />
              </button>
            </div>
          ))}
        </div>
        <div className="follow-modal-footer">
          <button className="follow-modal-close" onClick={onClose}>▼</button>
        </div>
      </div>
    </div>
  );
}
