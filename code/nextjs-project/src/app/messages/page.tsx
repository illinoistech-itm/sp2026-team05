"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Avatar from "@/components/Avatar";
import { mockConversations, currentUser } from "@/lib/mockData";
import { Message, Conversation } from "@/types";
import { fetchMessages, sendMessage, formatMessageTime } from "@/lib/messages";

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-open conversation if user param is present
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) {
      const conv = mockConversations.find((c) => c.participant.id === userId);
      if (conv) openConversation(conv);
    }
  }, []);

  const openConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    setLoading(true);
    const msgs = await fetchMessages(conv.id);
    setMessages(msgs as Message[]);
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;
    const msg = await sendMessage(activeConv.id, input, currentUser.id);
    setMessages((prev) => [...prev, msg as Message]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Chat screen view
  if (activeConv) {
    return (
      <div
        className="min-h-screen flex flex-col max-w-sm mx-auto"
        style={{ background: "linear-gradient(180deg, #00BFB3 0%, #007A75 40%, #003D3A 100%)" }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10"
          style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(10px)" }}
        >
          <button
            onClick={() => setActiveConv(null)}
            className="text-white hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="relative">
            <Avatar src={activeConv.participant.avatar} username={activeConv.participant.username} size={46} showRing />
            <div className="online-dot" />
          </div>
          <span className="font-mono text-white font-bold text-base">{activeConv.participant.username}</span>
        </div>

        <div className="h-px" style={{ background: "rgba(255,255,255,0.2)" }} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center font-mono text-white/50 py-8">Loading...</div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div
                    className="max-w-xs px-4 py-2 rounded-2xl font-mono text-sm"
                    style={{
                      background: isMe ? "#00BFB3" : "#F5F0E8",
                      color: isMe ? "#0a2a28" : "#1a1a1a",
                      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 sticky bottom-0">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-full"
            style={{ background: "rgba(255,255,255,0.95)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type"
              className="flex-1 bg-transparent font-mono text-sm text-gray-700 outline-none placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="disabled:opacity-40 transition-all hover:scale-110"
              style={{ color: "#00BFB3" }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversation list view
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #00BFB3 0%, #007A75 40%, #003D3A 100%)" }}
    >
      {/* Header */}
      <div className="px-4 py-4">
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 text-white font-mono text-sm hover:opacity-80"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="max-w-sm mx-auto px-4">
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00BFB3, #007A75)" }}
        >
          <h2 className="font-mono text-2xl font-bold text-white text-center pt-6 pb-4">
            {currentUser.followersCount} Follows
          </h2>

          <div className="px-4 pb-4 space-y-0">
            {mockConversations.slice(0, visibleCount).map((conv, i) => (
              <div
                key={conv.id}
                className="flex items-center gap-4 py-4 cursor-pointer hover:bg-white/10 px-2 rounded-xl transition-all"
                style={{ borderBottom: i < visibleCount - 1 ? "1px solid rgba(255,255,255,0.15)" : "none" }}
                onClick={() => openConversation(conv)}
              >
                <div className="relative">
                  <Avatar src={conv.participant.avatar} username={conv.participant.username} size={56} showRing />
                  {conv.unreadCount > 0 && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                      style={{ background: "#ff4d6d", color: "white" }}
                    >
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                <span className="flex-1 font-mono text-base text-white font-bold">{conv.participant.username}</span>
                {conv.lastMessage && (
                  <div className="text-right">
                    <p className="font-mono text-xs text-white/60 truncate max-w-20">{conv.lastMessage.text}</p>
                    <p className="font-mono text-xs text-white/40">{formatMessageTime(conv.lastMessage.createdAt)}</p>
                  </div>
                )}
                <button className="text-white/60 hover:text-white ml-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {visibleCount < mockConversations.length && (
            <div className="flex justify-center pb-6">
              <button
                onClick={() => setVisibleCount((v) => v + 4)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <ChevronDown size={28} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
