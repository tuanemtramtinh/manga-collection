import { Hono } from 'hono';
const router = new Hono();
// GET /api/book-search?q=... — Search manga via Jikan (MyAnimeList)
router.get('/book-search', async (c) => {
    const q = c.req.query('q') ?? '';
    if (!q.trim())
        return c.json([]);
    try {
        const url = `https://api.tenrai.org/v1/manga?q=${encodeURIComponent(q)}&limit=8&sfw`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (res.status === 503 || res.status === 504 || res.status === 502) {
            return c.json({ __error: 'unavailable' });
        }
        if (!res.ok)
            return c.json([]);
        const json = await res.json();
        if (json.status && json.status >= 500) {
            return c.json({ __error: 'unavailable' });
        }
        const results = (json.data ?? []).map((item) => ({
            title: item.title ?? '',
            author: item.authors?.[0]?.name ?? '',
            coverUrl: item.images?.jpg?.large_image_url ?? '',
            totalVolumes: item.volumes ?? 0,
        }));
        return c.json(results);
    }
    catch {
        return c.json({ __error: 'unavailable' });
    }
});
export default router;
