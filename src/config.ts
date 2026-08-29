import 'dotenv/config'

function require_env(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

const config = {
  databaseUrl: require_env('DATABASE_URL'),
  jwtSecret:   require_env('JWT_SECRET'),
  port: Number(process.env.PORT) || 3000,

  s3: {
    endpoint:        require_env('S3_ENDPOINT'),
    region:          process.env.S3_REGION ?? 'auto',
    bucket:          require_env('S3_BUCKET'),
    accessKeyId:     require_env('S3_ACCESS_KEY_ID'),
    secretAccessKey: require_env('S3_SECRET_ACCESS_KEY'),
    publicUrl:       require_env('S3_PUBLIC_URL'), // URL công khai để truy cập file
  },
} as const

export default config
