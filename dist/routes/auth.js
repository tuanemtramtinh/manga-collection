import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import config from '../config.js';
import { userRepository } from '../repositories/userRepository.js';
import LoginPage from '../pages/Login.js';
import RegisterPage from '../pages/Register.js';
const app = new Hono();
const COOKIE_NAME = 'session';
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
};
// ─── Login ────────────────────────────────────────────────────────────────────
app.get('/login', async (c) => {
    // Nếu đã đăng nhập thì redirect về trang chủ
    const token = getCookie(c, COOKIE_NAME);
    if (token) {
        try {
            await verify(token, config.jwtSecret, 'HS256');
            return c.redirect('/');
        }
        catch { /* token hết hạn hoặc invalid */ }
    }
    return c.html(_jsx(LoginPage, {}));
});
app.post('/login', async (c) => {
    const body = await c.req.parseBody();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const user = await userRepository.findByEmail(email);
    if (!user || !(await userRepository.verifyPassword(user, password))) {
        return c.html(_jsx(LoginPage, { error: "Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\u00F4ng \u0111\u00FAng." }), 401);
    }
    const token = await sign({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, config.jwtSecret, 'HS256');
    setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);
    return c.redirect('/?login=1');
});
// ─── Register ─────────────────────────────────────────────────────────────────
app.get('/register', async (c) => {
    const token = getCookie(c, COOKIE_NAME);
    if (token) {
        try {
            await verify(token, config.jwtSecret, 'HS256');
            return c.redirect('/');
        }
        catch { /* ignore */ }
    }
    return c.html(_jsx(RegisterPage, {}));
});
app.post('/register', async (c) => {
    const body = await c.req.parseBody();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const confirm = String(body.confirm ?? '');
    if (password.length < 8) {
        return c.html(_jsx(RegisterPage, { error: "M\u1EADt kh\u1EA9u ph\u1EA3i \u00EDt nh\u1EA5t 8 k\u00FD t\u1EF1.", email: email }), 400);
    }
    if (password !== confirm) {
        return c.html(_jsx(RegisterPage, { error: "M\u1EADt kh\u1EA9u x\u00E1c nh\u1EADn kh\u00F4ng kh\u1EDBp.", email: email }), 400);
    }
    const existing = await userRepository.findByEmail(email);
    if (existing) {
        return c.html(_jsx(RegisterPage, { error: "Email n\u00E0y \u0111\u00E3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng.", email: email }), 409);
    }
    const user = await userRepository.create(email, password);
    const token = await sign({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, config.jwtSecret, 'HS256');
    setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);
    return c.redirect('/?welcome=1');
});
// ─── Logout ───────────────────────────────────────────────────────────────────
app.post('/logout', (c) => {
    deleteCookie(c, COOKIE_NAME, { path: '/' });
    return c.redirect('/login');
});
export default app;
