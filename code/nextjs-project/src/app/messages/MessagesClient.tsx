"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MessagesClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("user");
    console.log("User param:", userId);
  }, [searchParams]);

  return <div>Messages UI here</div>;
}