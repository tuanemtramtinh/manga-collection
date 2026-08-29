import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';
import config from '../config.js';
import { userRepository } from '../repositories/userRepository.js';
/** Bảo vệ route — redirect về /login nếu chưa đăng nhập */
export async function requireAuth(c, next) {
    const token = getCookie(c, 'session');
    if (!token)
        return c.redirect('/login');
    try {
        const payload = await verify(token, config.jwtSecret, 'HS256');
        const user = await userRepository.findById(payload.sub);
        if (!user)
            return c.redirect('/login');
        c.set('user', { id: user.id, email: user.email });
        await next();
    }
    catch {
        return c.redirect('/login');
    }
}
/** Đọc user nếu có (không redirect) — cho trang login/register */
export async function loadUser(c, next) {
    const token = getCookie(c, 'session');
    if (token) {
        try {
            const payload = await verify(token, config.jwtSecret, 'HS256');
            const user = await userRepository.findById(payload.sub);
            if (user)
                c.set('user', { id: user.id, email: user.email });
        }
        catch { /* ignore */ }
    }
    await next();
}
