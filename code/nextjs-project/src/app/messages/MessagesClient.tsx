// app/messages/MessagesClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockConversations, currentUser } from "@/lib/mockData";
import { fetchMessages, sendMessage } from "@/lib/messages";
import { Message, Conversation } from "@/types";
import { ArrowLeft, Send } from "lucide-react";
import Avatar from "@/components/Avatar";

export default function MessagesClient() {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) {
      const conv = mockConversations.find((c) => c.participant.id === userId);
      if (conv) openConversation(conv);
    }
  }, [searchParams]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Render your chat or conversation list here, same as your original component
  return (
    <div>{/* copy your chat UI from original MessagesPage */}</div>
  );
}