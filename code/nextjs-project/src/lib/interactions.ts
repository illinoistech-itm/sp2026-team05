// interactions.ts - Real API calls replacing mock data

/**
 * Toggles like on a post
 */
export async function toggleLike(postId: string, isCurrentlyLiked: boolean) {
  const method = isCurrentlyLiked ? "DELETE" : "POST";
  const res = await fetch(`/api/posts/${postId}/like`, { method });
  if (!res.ok) throw new Error("Failed to toggle like");
  return res.json();
}

/**
 * Toggles save on a post
 */
export async function toggleSave(postId: string, isCurrentlySaved: boolean) {
  const method = isCurrentlySaved ? "DELETE" : "POST";
  const res = await fetch(`/api/posts/${postId}/save`, { method });
  if (!res.ok) throw new Error("Failed to toggle save");
  return res.json();
}

/**
 * Fetches comments for a post
 */
export async function fetchComments(postId: string) {
  const res = await fetch(`/api/posts/${postId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  const data = await res.json();
  return data.comments;
}

/**
 * Adds a comment to a post
 */
export async function addComment(postId: string, text: string, author: any) {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  const data = await res.json();
  return data.comment;
}

/**
 * Creates a new post
 */
export async function createPost(postData: {
  imageUrl: string;
  description: string;
  tags: string[];
}) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

/**
 * Formats like count for display (2800 -> 2.8k)
 */
export function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}m`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}
