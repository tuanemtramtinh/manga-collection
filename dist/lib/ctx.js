/** Lấy email của user đang đăng nhập từ context (dùng trong route handlers) */
export function getUserEmail(c) {
    return c.get('user')?.email;
}
