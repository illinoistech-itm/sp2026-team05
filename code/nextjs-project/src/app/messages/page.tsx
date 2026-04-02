// app/messages/page.tsx
import MessagesClient from "./MessagesClient";

export default function MessagesPage() {
  return (
    <div className="min-h-screen">
      <h1 className="text-white font-mono text-2xl p-4">Messages</h1>
      <MessagesClient />
    </div>
  );
}