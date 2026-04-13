"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, MessageCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { fetchMessages, formatMessageTime, sendMessage } from "@/lib/messages";
import { currentUser, mockConversations } from "@/lib/mockData";
import { Conversation, Message } from "@/types";
import "./messages.css";

type MessagesClientProps = {
  initialUserId?: string;
};

export default function MessagesClient({ initialUserId }: MessagesClientProps) {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!initialUserId) return;

    const conv = mockConversations.find((conversation) => conversation.participant.id === initialUserId);
    if (conv) {
      void openConversation(conv);
    }
  }, [initialUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    setLoading(true);
    const msgs = await fetchMessages(conv.id);
    setMessages(msgs as Message[]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;

    const msg = await sendMessage(activeConv.id, input, currentUser.id);
    setMessages((prev) => [...prev, msg as Message]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  if (activeConv) {
    return (
      <div className="chat-page">
        <div className="chat-header">
          <button className="chat-back-btn" onClick={() => setActiveConv(null)}>
            <ArrowLeft size={22} />
          </button>
          <div className="chat-header-avatar">
            <Avatar src={activeConv.participant.avatar} username={activeConv.participant.username} size={46} showRing />
            <div className="online-dot" />
          </div>
          <span className="chat-header-name">{activeConv.participant.username}</span>
        </div>

        <div className="chat-divider" />

        <div className="chat-messages">
          {loading ? (
            <div className="chat-loading">Loading...</div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`chat-msg-row ${isMe ? "mine" : "theirs"}`}>
                  <div className={`chat-bubble ${isMe ? "mine" : "theirs"}`}>{msg.text}</div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-bar">
          <div className="chat-input-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type"
              className="chat-input"
            />
            <button className="chat-send-btn" onClick={() => void handleSend()} disabled={!input.trim()}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <button className="messages-back" onClick={() => router.push("/profile")}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="messages-list-wrap">
        <div className="messages-list-card">
          <h2 className="messages-list-title">{currentUser.followersCount} Follows</h2>

          <div className="messages-list-items">
            {mockConversations.slice(0, visibleCount).map((conv) => (
              <div key={conv.id} className="messages-list-item" onClick={() => void openConversation(conv)}>
                <div className="messages-avatar-wrap">
                  <Avatar src={conv.participant.avatar} username={conv.participant.username} size={56} showRing />
                  {conv.unreadCount > 0 && (
                    <div className="messages-unread-badge">{conv.unreadCount}</div>
                  )}
                </div>

                <span className="messages-item-name">{conv.participant.username}</span>

                {conv.lastMessage && (
                  <div className="messages-item-preview">
                    <p className="messages-item-last-msg">{conv.lastMessage.text}</p>
                    <p className="messages-item-time">{formatMessageTime(conv.lastMessage.createdAt)}</p>
                  </div>
                )}

                <MessageCircle size={22} className="messages-item-icon" />
              </div>
            ))}
          </div>

          {visibleCount < mockConversations.length && (
            <div className="messages-show-more">
              <button className="messages-show-more-btn" onClick={() => setVisibleCount((value) => value + 4)}>
                <ChevronDown size={28} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
