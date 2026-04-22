import * as Minio from 'minio'
import https from 'https'

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getMinioEndpoint(): string {
  const endpoint = getRequiredEnv('MINIO_ENDPOINT')

  try {
    new URL(endpoint)
  } catch {
    throw new Error('MINIO_ENDPOINT must be a valid absolute URL')
  }

  return endpoint
}

export function getMinioClient(): Minio.Client {
  const endpoint = getMinioEndpoint()
  const { hostname, port, protocol } = new URL(endpoint)
  const isSSL = protocol === 'https:'

  return new Minio.Client({
    endPoint: hostname,
    ...(port && { port: parseInt(port, 10) }),
    useSSL: isSSL,
    accessKey: getRequiredEnv('MINIO_ACCESS_KEY'),
    secretKey: getRequiredEnv('MINIO_SECRET_KEY'),
    // Accept self-signed certificates
    ...(isSSL && {
      transportAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
  })
}