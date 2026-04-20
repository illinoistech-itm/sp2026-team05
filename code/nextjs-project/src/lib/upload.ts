// ============================================================
// upload.ts - Image upload utilities
// ============================================================

/**
 * Uploads an image file to MinIO object storage using a two-step presigned URL flow.
 *
 * Step 1: Requests a presigned PUT URL from our /api/upload endpoint. The server
 *         generates a short-lived URL that allows the browser to upload directly
 *         to MinIO without exposing storage credentials to the client.
 *
 * Step 2: PUTs the raw file bytes directly to MinIO using that presigned URL.
 *         This bypasses our Next.js server for the actual file data, keeping
 *         large uploads off the app server.
 *
 * @param file - The image File object selected by the user
 * @returns The permanent public URL of the uploaded image in MinIO
 * @throws If the presigned URL request fails or the MinIO upload fails
 */
export async function uploadImage(file: File): Promise<string> {
  // Step 1: Ask our API to generate a presigned upload URL for this filename/type.
  // The server signs the URL with MinIO credentials so we never expose them here.
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  })
  if (!res.ok) throw new Error('Failed to get upload URL')

  // presignedUrl: temporary signed URL to PUT the file directly into MinIO
  // publicUrl: the permanent URL we store in the database after upload succeeds
  const { presignedUrl, publicUrl }: { presignedUrl: string; publicUrl: string } = await res.json()

  // Step 2: Upload the raw file bytes directly to MinIO using the presigned URL.
  // We set Content-Type so MinIO stores the correct MIME type with the object.
  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!uploadRes.ok) throw new Error('Upload to MinIO failed')

  // Return the public URL so the caller can save it to the database
  return publicUrl
}

/**
 * Validates that a file is an accepted image type and within the size limit.
 * Run this before showing a preview or attempting an upload so the user gets
 * immediate feedback instead of a server-side error.
 *
 * @param file - The File object to validate
 * @returns { valid: true } on success, or { valid: false, error: string } on failure
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 10 * 1024 * 1024 // 10MB

  // Reject unsupported MIME types before anything hits the network
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WEBP, and GIF files are allowed.' }
  }
  // Reject files that are too large to prevent slow uploads and storage waste
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be under 10MB.' }
  }
  return { valid: true }
}

/**
 * Creates a temporary local URL for previewing an image before it is uploaded.
 * Uses the browser's Blob URL API — the URL is only valid within the current
 * page session and cannot be used by the server or stored in the database.
 * Call revokeImagePreview() when the preview is no longer needed to free memory.
 *
 * @param file - The image File object to preview
 * @returns A blob: URL string suitable for use in an <img> src attribute
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Releases the memory held by a blob URL created with createImagePreview().
 * Should be called when the preview component unmounts or when the user
 * replaces the selected image, to avoid memory leaks from orphaned object URLs.
 *
 * @param url - The blob: URL string previously returned by createImagePreview()
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}
