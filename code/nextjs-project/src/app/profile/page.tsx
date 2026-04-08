"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/Avatar";
import UploadModal from "@/components/UploadModal";
import { currentUser, mockPosts, mockConversations } from "@/lib/mockData";
import { Post } from "@/types";

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
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(160deg, #00BFB3 0%, #007A75 40%, #003D3A 100%)" }}
      >
        <Navbar showPost={false} showAvatar={false} />

        <div className="px-6 py-6 max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-6 relative"
            style={{ background: "#0d1117", border: "1px solid rgba(0,191,179,0.2)" }}
          >
            {/* Settings icon */}
            <button
              onClick={() => router.push("/settings")}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors hover:rotate-45 duration-300"
            >
              <Settings size={28} />
            </button>

            {/* Profile header */}
            <div className="flex items-start gap-6 mb-6">
              <Avatar src={currentUser.avatar} username={currentUser.username} size={100} showRing />
              <div className="flex-1">
                <h1 className="font-mono text-2xl text-white font-bold mb-2">{currentUser.username}</h1>
                <p className="font-mono text-sm text-white/70 leading-relaxed mb-4">{currentUser.bio}</p>

                {/* Followers / Following */}
                <div className="flex gap-6">
                  <button
                    onClick={() => setShowFollowers(true)}
                    className="flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Avatar src={mockConversations[0]?.participant.avatar} username="f" size={32} showRing />
                    <span className="font-mono text-sm text-white">Followers {currentUser.followersCount}</span>
                  </button>
                  <button
                    onClick={() => setShowFollowing(true)}
                    className="flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Avatar src={mockConversations[1]?.participant.avatar} username="g" size={32} showRing />
                    <span className="font-mono text-sm text-white">Following {currentUser.followingCount}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Post button */}
            <button
              onClick={() => setShowUpload(true)}
              className="px-8 py-2 rounded-lg font-mono font-bold text-sm mb-8 transition-all hover:scale-105"
              style={{ background: "#00BFB3", color: "#0a2a28" }}
            >
              Post
            </button>

            {/* Tabs */}
            <div className="flex gap-8 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {(["photos", "saved"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="pb-3 font-mono text-sm capitalize transition-all"
                  style={{
                    color: activeTab === tab ? "#00BFB3" : "rgba(255,255,255,0.5)",
                    borderBottom: activeTab === tab ? "2px solid #00BFB3" : "2px solid transparent",
                  }}
                >
                  {tab === "photos" ? "Photos" : "Saved Posts"}
                </button>
              ))}
            </div>

            {/* Photos grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {displayPosts.length === 0 ? (
                <p className="font-mono text-white/40 text-sm col-span-3">
                  {activeTab === "photos" ? "No posts yet." : "No saved posts."}
                </p>
              ) : (
                displayPosts.map((post) => (
                  <div key={post.id} className="relative rounded-xl overflow-hidden group cursor-pointer" style={{ aspectRatio: "1" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.imageUrl} alt={post.description} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    {post.description && (
                      <div
                        className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}
                      >
                        <p className="font-mono text-xs text-white truncate">{post.description}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {/* Followers Modal */}
      {showFollowers && (
        <FollowModal
          title={`${currentUser.followersCount} Followers`}
          users={mockConversations.map((c) => c.participant)}
          onClose={() => setShowFollowers(false)}
          onMessage={(user) => router.push(`/messages?user=${user.id}`)}
        />
      )}

      {/* Following Modal */}
      {showFollowing && (
        <FollowModal
          title={`Following ${currentUser.followingCount}`}
          users={mockConversations.map((c) => c.participant)}
          onClose={() => setShowFollowing(false)}
          onMessage={(user) => router.push(`/messages?user=${user.id}`)}
        />
      )}
    </>
  );
}

// Follow list modal (reusable for followers/following)
function FollowModal({
  title,
  users,
  onClose,
  onMessage,
}: {
  title: string;
  users: any[];
  onClose: () => void;
  onMessage: (user: any) => void;
}) {
  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="w-full max-w-xs rounded-3xl overflow-hidden animate-slide-up"
        style={{ background: "linear-gradient(135deg, #00BFB3, #007A75)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-mono text-xl font-bold text-white text-center pt-6 pb-4">{title}</h2>
        <div className="space-y-1 px-4 pb-4 max-h-80 overflow-y-auto">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="relative">
                <Avatar src={user.avatar} username={user.username} size={48} showRing />
                <div className="online-dot" />
              </div>
              <span className="flex-1 font-mono text-sm text-white font-bold">{user.username}</span>
              <button
                onClick={() => { onMessage(user); onClose(); }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <MessageCircle size={22} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center pb-4">
          <button onClick={onClose} className="text-white/60 hover:text-white">▼</button>
        </div>
      </div>
    </div>
  );
}
