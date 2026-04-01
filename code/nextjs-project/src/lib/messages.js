// ============================================================
// messages.js - Real-time messaging utilities
// ============================================================

/**
 * Fetches conversations for the current user
 * @returns {Promise<Array>}
 */
export async function fetchConversations() {
  // const res = await fetch('/api/messages/conversations');
  // return res.json();
  return [];
}

/**
 * Fetches messages in a conversation
 * @param {string} conversationId
 * @returns {Promise<Array>}
 */
export async function fetchMessages(conversationId) {
  // const res = await fetch(`/api/messages/${conversationId}`);
  // return res.json();
  return [
    {
      id: "m1",
      text: "Hi!!!",
      senderId: "2", // DolphJoy
      createdAt: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: "m2",
      text: "Hello",
      senderId: "1", // current user
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Sends a message in a conversation
 * @param {string} conversationId
 * @param {string} text
 * @param {string} senderId
 * @returns {Promise<Object>}
 */
export async function sendMessage(conversationId, text, senderId) {
  if (!text.trim()) throw new Error("Message cannot be empty");

  // const res = await fetch(`/api/messages/${conversationId}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ text }),
  // });
  // return res.json();

  return {
    id: Date.now().toString(),
    text: text.trim(),
    senderId,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Starts a new conversation with a user
 * @param {string} targetUserId
 * @returns {Promise<{ conversationId: string }>}
 */
export async function startConversation(targetUserId) {
  // const res = await fetch('/api/messages/conversations', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ targetUserId }),
  // });
  // return res.json();
  return { conversationId: `conv_${targetUserId}` };
}

/**
 * Formats a message timestamp for display
 * @param {string} isoString
 * @returns {string}
 */
export function formatMessageTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
