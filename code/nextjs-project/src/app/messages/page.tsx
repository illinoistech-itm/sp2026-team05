import { Suspense } from "react";
import MessagesClient from "./MessagesClient";

export default function MessagesPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading messages...</div>}>
        <MessagesClient />
      </Suspense>
    </div>
  );
}