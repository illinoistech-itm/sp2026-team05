"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import Avatar from "./Avatar";
import UploadModal from "./UploadModal";
import { currentUser } from "@/lib/mockData";

interface NavbarProps {
  showPost?: boolean;
  showAvatar?: boolean;
}

export default function Navbar({ showPost = true, showAvatar = true }: NavbarProps) {
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav
        className="flex items-center justify-between px-6 py-3 sticky top-0 z-40"
        style={{ background: "#b2dfdb", borderBottom: "none" }}
      >
        <Logo size={55} href="/home" />

        <div className="flex items-center gap-4">
          {showPost && (
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-2 rounded-xl font-mono font-bold text-sm transition-all hover:scale-105"
              style={{ background: "#00BFB3", color: "#0a2a28" }}
            >
              Post
            </button>
          )}
          {showAvatar && (
            <Avatar
              src={currentUser.avatar}
              username={currentUser.username}
              size={50}
              showRing
              onClick={() => router.push("/profile")}
            />
          )}
        </div>
      </nav>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={(post) => {
            console.log("New post created:", post);
          }}
        />
      )}
    </>
  );
}
