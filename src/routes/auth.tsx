import { Hono } from 'hono'
import { setCookie, deleteCookie, getCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import config from '../config.js'
import { userRepository } from '../repositories/userRepository.js'
import LoginPage from '../pages/Login.js'
import RegisterPage from '../pages/Register.js'

const app = new Hono()

const COOKIE_NAME = 'session'
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'Lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 ngày
}

// ─── Login ────────────────────────────────────────────────────────────────────

app.get('/login', async (c) => {
  // Nếu đã đăng nhập thì redirect về trang chủ
  const token = getCookie(c, COOKIE_NAME)
  if (token) {
    try {
      await verify(token, config.jwtSecret, 'HS256')
      return c.redirect('/')
    } catch { /* token hết hạn hoặc invalid */ }
  }
  return c.html(<LoginPage />)
})

app.post('/login', async (c) => {
  const body = await c.req.parseBody()
  const email    = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')

  const user = await userRepository.findByEmail(email)
  if (!user || !(await userRepository.verifyPassword(user, password))) {
    return c.html(<LoginPage error="Email hoặc mật khẩu không đúng." />, 401)
  }

  const token = await sign(
    { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 },
    config.jwtSecret,
    'HS256',
  )
  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS)
  return c.redirect('/?login=1')
})

// ─── Register ─────────────────────────────────────────────────────────────────

app.get('/register', async (c) => {
  const token = getCookie(c, COOKIE_NAME)
  if (token) {
    try {
      await verify(token, config.jwtSecret, 'HS256')
      return c.redirect('/')
    } catch { /* ignore */ }
  }
  return c.html(<RegisterPage />)
})

app.post('/register', async (c) => {
  const body = await c.req.parseBody()
  const email    = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  const confirm  = String(body.confirm  ?? '')

  if (password.length < 8) {
    return c.html(<RegisterPage error="Mật khẩu phải ít nhất 8 ký tự." email={email} />, 400)
  }
  if (password !== confirm) {
    return c.html(<RegisterPage error="Mật khẩu xác nhận không khớp." email={email} />, 400)
  }

  const existing = await userRepository.findByEmail(email)
  if (existing) {
    return c.html(<RegisterPage error="Email này đã được sử dụng." email={email} />, 409)
  }

  const user = await userRepository.create(email, password)

  const token = await sign(
    { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 },
    config.jwtSecret,
    'HS256',
  )
  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS)
  return c.redirect('/?welcome=1')
})

// ─── Logout ───────────────────────────────────────────────────────────────────

app.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' })
  return c.redirect('/login')
})

export default app
