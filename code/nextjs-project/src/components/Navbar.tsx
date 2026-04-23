"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import UploadModal from "./UploadModal";
import "./Navbar.css";

interface NavbarProps {
  showPost?: boolean;
  showAvatar?: boolean;
}

export default function Navbar({ showPost = true, showAvatar = true }: NavbarProps) {
  const [showUpload, setShowUpload] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const username = (session?.user as any)?.username || session?.user?.email?.split("@")[0] || "U";
  const avatar = (session?.user as any)?.profilePic || session?.user?.image || "";

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
              src={avatar}
              username={username}
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