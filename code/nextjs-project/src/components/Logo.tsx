"use client";

import Image from "next/image";
import Link from "next/link";
import "./Logo.css";

interface LogoProps {
  size?: number;
  href?: string;
}

export default function Logo({ size = 60, href = "/home" }: LogoProps) {
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

  return href ? <Link href={href}>{inner}</Link> : inner;
}
