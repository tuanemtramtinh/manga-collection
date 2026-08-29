import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import config from '../config.js'
import * as schema from './schema.js'

// Singleton — module cache của ESM đảm bảo chỉ khởi tạo 1 lần
const client = postgres(config.databaseUrl, {
  prepare: false, // bắt buộc khi dùng Supabase Transaction pooler
})

export const db = drizzle({ client, schema })
