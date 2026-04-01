// ============================================================
// upload.js - Image upload utilities
// ============================================================

/**
 * Uploads image to Cloudinary (or your preferred storage)
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The uploaded image URL
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "photo_league"); // Set in Cloudinary dashboard

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) throw new Error("Upload failed");
  const data = await response.json();
  return data.secure_url;
}

/**
 * Validates image file (type + size)
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, WEBP, and GIF files are allowed." };
  }
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be under 10MB." };
  }
  return { valid: true };
}

/**
 * Creates a local preview URL for a file
 * @param {File} file
 * @returns {string}
 */
export function createImagePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Revokes an object URL to free memory
 * @param {string} url
 */
export function revokeImagePreview(url) {
  URL.revokeObjectURL(url);
}
