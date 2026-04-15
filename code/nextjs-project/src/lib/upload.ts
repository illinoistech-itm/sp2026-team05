// ============================================================
// upload.ts - Image upload utilities
// ============================================================

/**
 * Uploads image to MinIO via presigned URL
 * @param file - The image file to upload
 * @returns The public image URL
 */
export async function uploadImage(file: File): Promise<string> {
  // Step 1: Get presigned upload URL from our API
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  })
  if (!res.ok) throw new Error('Failed to get upload URL')

  const { presignedUrl, publicUrl }: { presignedUrl: string; publicUrl: string } = await res.json()

  // Step 2: Upload file directly to MinIO
  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!uploadRes.ok) throw new Error('Upload to MinIO failed')

  return publicUrl
}

/**
 * Validates image file (type + size)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WEBP, and GIF files are allowed.' }
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be under 10MB.' }
  }
  return { valid: true }
}

/**
 * Creates a local preview URL for a file
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Revokes an object URL to free memory
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}
