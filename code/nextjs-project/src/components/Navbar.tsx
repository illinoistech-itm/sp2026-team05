"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import Avatar from "./Avatar";
import UploadModal from "./UploadModal";
import { currentUser } from "@/lib/mockData";
import "./Navbar.css";

interface NavbarProps {
  showPost?: boolean;
  showAvatar?: boolean;
}

export default function Navbar({ showPost = true, showAvatar = true }: NavbarProps) {
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav className="navbar">
        <Logo size={55} href="/home" />
        <div className="navbar-actions">
          {showPost && (
            <button className="navbar-post-btn" onClick={() => setShowUpload(true)}>
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
        <UploadModal onClose={() => setShowUpload(false)} onSuccess={(p) => console.log("posted", p)} />
      )}
    </>
  );
}
