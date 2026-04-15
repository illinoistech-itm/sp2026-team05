import * as Minio from 'minio'

const { hostname, port, protocol } = new URL(process.env.MINIO_ENDPOINT as string)

const minioClient = new Minio.Client({
  endPoint: hostname,
  ...(port && { port: parseInt(port) }),
  useSSL: protocol === 'https:',
  accessKey: process.env.MINIO_ACCESS_KEY as string,
  secretKey: process.env.MINIO_SECRET_KEY as string,
})

export default minioClient
