// ============================================================
// hashtags.js - Hashtag parsing and management utilities
// ============================================================

/**
 * Parses hashtags from a string of text
 * @param {string} text
 * @returns {string[]} Array of hashtag strings (without #)
 */
export function parseHashtags(text) {
  const regex = /#([a-zA-Z0-9_]+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)]; // deduplicate
}

/**
 * Formats a tag string by removing # if present and trimming
 * @param {string} tag
 * @returns {string}
 */
export function formatTag(tag) {
  return tag.replace(/^#/, "").trim().toLowerCase();
}

/**
 * Validates a hashtag (alphanumeric + underscore only)
 * @param {string} tag
 * @returns {boolean}
 */
export function isValidTag(tag) {
  const cleaned = formatTag(tag);
  return /^[a-zA-Z0-9_]+$/.test(cleaned) && cleaned.length > 0 && cleaned.length <= 30;
}

/**
 * Parses tags from comma-separated or space-separated input
 * @param {string} input
 * @returns {string[]}
 */
export function parseTagInput(input) {
  return input
    .split(/[,\s]+/)
    .map(formatTag)
    .filter(isValidTag);
}

/**
 * Adds a tag to a list if it doesn't already exist (max 10 tags)
 * @param {string[]} currentTags
 * @param {string} newTag
 * @returns {{ tags: string[], error?: string }}
 */
export function addTag(currentTags, newTag) {
  const formatted = formatTag(newTag);
  if (!isValidTag(formatted)) {
    return { tags: currentTags, error: "Invalid tag. Use letters, numbers, and underscores only." };
  }
  if (currentTags.length >= 10) {
    return { tags: currentTags, error: "Maximum 10 tags allowed." };
  }
  if (currentTags.includes(formatted)) {
    return { tags: currentTags, error: "Tag already added." };
  }
  return { tags: [...currentTags, formatted] };
}

/**
 * Removes a tag from a list
 * @param {string[]} currentTags
 * @param {string} tagToRemove
 * @returns {string[]}
 */
export function removeTag(currentTags, tagToRemove) {
  return currentTags.filter((t) => t !== tagToRemove);
}

/**
 * Searches posts by hashtag (client-side filter)
 * @param {Array} posts
 * @param {string} tag
 * @returns {Array}
 */
export function filterPostsByTag(posts, tag) {
  const searchTag = formatTag(tag);
  return posts.filter((post) =>
    post.tags.some((t) => formatTag(t) === searchTag)
  );
}
