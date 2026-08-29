import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import config from '../config.js'
import { userRepository } from '../repositories/userRepository.js'

export type AuthUser = { id: number; email: string }

/** Bảo vệ route — redirect về /login nếu chưa đăng nhập */
export async function requireAuth(c: Context, next: Next) {
  const token = getCookie(c, 'session')
  if (!token) return c.redirect('/login')

  try {
    const payload = await verify(token, config.jwtSecret, 'HS256') as { sub: number }
    const user = await userRepository.findById(payload.sub)
    if (!user) return c.redirect('/login')

    c.set('user' as any, { id: user.id, email: user.email } satisfies AuthUser)
    await next()
  } catch {
    return c.redirect('/login')
  }
}

/** Đọc user nếu có (không redirect) — cho trang login/register */
export async function loadUser(c: Context, next: Next) {
  const token = getCookie(c, 'session')
  if (token) {
    try {
      const payload = await verify(token, config.jwtSecret, 'HS256') as { sub: number }
      const user = await userRepository.findById(payload.sub)
      if (user) c.set('user' as any, { id: user.id, email: user.email } satisfies AuthUser)
    } catch { /* ignore */ }
  }
  await next()
}
