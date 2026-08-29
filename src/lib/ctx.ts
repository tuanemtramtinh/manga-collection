import type { Context } from 'hono'
import type { AuthUser } from '../middleware/auth.js'

/** Lấy email của user đang đăng nhập từ context (dùng trong route handlers) */
export function getUserEmail(c: Context): string | undefined {
  return (c.get('user' as any) as AuthUser | undefined)?.email
}
