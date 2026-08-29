import { Hono } from 'hono';
import { uploadImage } from '../lib/storage.js';
const router = new Hono();
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 5;
router.post('/:folder', async (c) => {
    const folder = c.req.param('folder');
    if (!['books', 'volumes', 'goods', 'sections'].includes(folder)) {
        return c.json({ error: 'Invalid folder' }, 400);
    }
    const body = await c.req.parseBody();
    const file = body.file;
    if (!file || typeof file === 'string') {
        return c.json({ error: 'No file provided' }, 400);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return c.json({ error: 'Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF' }, 400);
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json({ error: `Ảnh không được vượt quá ${MAX_SIZE_MB}MB` }, 400);
    }
    const url = await uploadImage(file, folder);
    return c.json({ url });
});
export default router;
