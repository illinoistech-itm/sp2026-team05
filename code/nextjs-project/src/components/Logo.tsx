import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  href?: string;
}

export default function Logo({ size = 60, href = "/home" }: LogoProps) {
  const inner = (
    <div style={{ width: size, height: size, background: "transparent" }} 
         className="cursor-pointer transition-transform hover:scale-105">
      <Image
        src="/icon.png"
        alt="Photo League logo"
        width={size}
        height={size}
        priority
      />
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}