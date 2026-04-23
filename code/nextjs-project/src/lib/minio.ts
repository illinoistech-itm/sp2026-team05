import * as Minio from 'minio'
import https from 'https'

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function isPrivateOrLocalHost(hostname: string): boolean {
  const normalizedHost = hostname.toLowerCase()

  return (
    normalizedHost === 'localhost' ||
    normalizedHost === '127.0.0.1' ||
    normalizedHost === '::1' ||
    normalizedHost.endsWith('.local') ||
    normalizedHost.endsWith('.consul') ||
    /^10\./.test(normalizedHost) ||
    /^192\.168\./.test(normalizedHost) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalizedHost)
  )
}

function parseMinioEndpoint(rawEndpoint: string): URL {
  const normalizedEndpoint = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(rawEndpoint)
    ? rawEndpoint
    : `${isPrivateOrLocalHost(rawEndpoint.split(':')[0]) ? 'http' : 'https'}://${rawEndpoint}`

  try {
    return new URL(normalizedEndpoint)
  } catch {
    throw new Error('MINIO_ENDPOINT must be a valid URL or hostname')
  }
}

export function getMinioEndpoint(): string {
  return parseMinioEndpoint(getRequiredEnv('MINIO_ENDPOINT')).toString()
}

export function getMinioClient(): Minio.Client {
  const { hostname, port, protocol } = parseMinioEndpoint(getRequiredEnv('MINIO_ENDPOINT'))
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
