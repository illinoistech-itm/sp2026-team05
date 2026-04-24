"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import "./Logo.css";

interface LogoProps {
  size?: number;
  href?: string;
  forceReload?: boolean;
}

export default function Logo({
  size = 60,
  href = "/home",
  forceReload = false,
}: LogoProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href || !forceReload) return;

    event.preventDefault();
    window.location.href = href;
  };

  const inner = (
    <div className="logo-wrap" style={{ width: size, height: size }}>
      <Image
        src="/icon.png"
        alt="Photo League"
        width={size}
        height={size}
        priority
        style={{ background: "transparent" }}
      />
    </div>
  );

  return href ? (
    <Link href={href} onClick={handleClick}>
      {inner}
    </Link>
  ) : inner;
}
