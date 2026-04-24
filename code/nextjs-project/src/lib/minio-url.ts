import { getMinioClient, getMinioEndpoint } from "@/lib/minio";

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

function joinObjectUrl(endpoint: string, bucket: string, objectName: string): string {
  return `${endpoint.replace(/\/$/, "")}/${trimSlashes(bucket)}/${trimSlashes(objectName)}`;
}

function parseStoredMinioImage(imageUrl: string): { bucket: string; objectName: string } | null {
  if (!imageUrl) return null;

  const endpoint = getMinioEndpoint().replace(/\/$/, "");
  const normalizedUrl = imageUrl.trim();

  if (normalizedUrl.startsWith("/api/images/")) {
    const parts = normalizedUrl
      .slice("/api/images/".length)
      .split("/")
      .map(decodeURIComponent)
      .filter(Boolean);

    if (parts.length < 2) return null;

    const [bucket, ...objectParts] = parts;
    return { bucket, objectName: objectParts.join("/") };
  }

  if (!normalizedUrl.startsWith(`${endpoint}/`)) {
    return null;
  }

  const objectPath = normalizedUrl.slice(endpoint.length + 1);
  const [bucket, ...objectParts] = objectPath.split("/").filter(Boolean);

  if (!bucket || objectParts.length === 0) {
    return null;
  }

  return {
    bucket: decodeURIComponent(bucket),
    objectName: objectParts.map(decodeURIComponent).join("/"),
  };
}

export function getMinioObjectUrl(bucket: string, objectName: string): string {
  return joinObjectUrl(getMinioEndpoint(), bucket, objectName);
}

export async function getPresignedImageUrl(imageUrl: string, expiry = 60 * 60): Promise<string> {
  const imageRef = parseStoredMinioImage(imageUrl);

  if (!imageRef) {
    return imageUrl;
  }

  const minioClient = getMinioClient();
  return minioClient.presignedUrl("GET", imageRef.bucket, imageRef.objectName, expiry);
}
