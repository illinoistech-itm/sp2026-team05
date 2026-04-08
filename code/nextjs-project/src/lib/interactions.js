// ============================================================
// interactions.js - Likes, saves, follows, comments utilities
// ============================================================

/**
 * Toggles like on a post
 * @param {string} postId
 * @param {boolean} isCurrentlyLiked
 * @returns {Promise<{ liked: boolean, likesCount: number }>}
 */
export async function toggleLike(postId, isCurrentlyLiked) {
  // In a real app, call your API:
  // const res = await fetch(`/api/posts/${postId}/like`, { method: isCurrentlyLiked ? 'DELETE' : 'POST' });
  // return res.json();

  // Mock implementation:
  return { liked: !isCurrentlyLiked };
}

/**
 * Toggles save/bookmark on a post
 * @param {string} postId
 * @param {boolean} isCurrentlySaved
 * @returns {Promise<{ saved: boolean }>}
 */
export async function toggleSave(postId, isCurrentlySaved) {
  // const res = await fetch(`/api/posts/${postId}/save`, { method: isCurrentlySaved ? 'DELETE' : 'POST' });
  return { saved: !isCurrentlySaved };
}

/**
 * Toggles follow on a user
 * @param {string} userId
 * @param {boolean} isCurrentlyFollowing
 * @returns {Promise<{ following: boolean }>}
 */
export async function toggleFollow(userId, isCurrentlyFollowing) {
  // const res = await fetch(`/api/users/${userId}/follow`, { method: isCurrentlyFollowing ? 'DELETE' : 'POST' });
  return { following: !isCurrentlyFollowing };
}

/**
 * Adds a comment to a post
 * @param {string} postId
 * @param {string} text
 * @param {Object} author
 * @returns {Promise<Object>} The new comment object
 */
export async function addComment(postId, text, author) {
  if (!text.trim()) throw new Error("Comment cannot be empty");
  if (text.length > 500) throw new Error("Comment too long (max 500 chars)");

  // const res = await fetch(`/api/posts/${postId}/comments`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ text }),
  // });
  // return res.json();

  return {
    id: Date.now().toString(),
    text,
    author,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Fetches comments for a post
 * @param {string} postId
 * @returns {Promise<Array>}
 */
export async function fetchComments(postId) {
  // const res = await fetch(`/api/posts/${postId}/comments`);
  // return res.json();
  return [
    {
      id: "c1",
      text: "Amazing shot! 🌊",
      author: { id: "2", username: "DolphJoy", avatar: "" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "c2",
      text: "This is so beautiful",
      author: { id: "3", username: "Swim1!!!", avatar: "" },
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Formats like count for display (1000 -> 1k, 10000 -> 10k)
 * @param {number} count
 * @returns {string}
 */
export function formatCount(count) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}m`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

/**
 * Creates a new post
 * @param {{ imageUrl: string, description: string, tags: string[] }} postData
 * @returns {Promise<Object>}
 */
export async function createPost(postData) {
  // const res = await fetch('/api/posts', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(postData),
  // });
  // return res.json();
  return { id: Date.now().toString(), ...postData, createdAt: new Date().toISOString() };
}

/**
 * Deletes a post
 * @param {string} postId
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  // await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  console.log(`Post ${postId} deleted`);
}
