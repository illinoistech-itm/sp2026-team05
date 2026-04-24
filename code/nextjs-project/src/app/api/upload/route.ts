import { NextRequest, NextResponse } from 'next/server'
import { getMinioClient } from '@/lib/minio'
import { getMinioObjectUrl } from '@/lib/minio-url'

export async function POST(req: NextRequest) {
  try {
    const bucket = process.env.S3_BUCKET_NAME?.trim()
    if (!bucket) {
      throw new Error('Missing required environment variable: S3_BUCKET_NAME')
    }

    const minioClient = getMinioClient()
    const { filename } = await req.json()

    const ext = filename.split('.').pop()
    const objectName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Presigned URL expires in 5 minutes
    const presignedUrl = await minioClient.presignedPutObject(bucket, objectName, 60 * 5)
    const publicUrl = getMinioObjectUrl(bucket, objectName)

    return NextResponse.json({ presignedUrl, publicUrl })
  } catch (err) {
    console.error('Upload presign error:', err)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
