import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from 'hono';
import HomePage from '../pages/Home.js';
import { bookRepository } from '../repositories/bookRepository.js';
import { volumeRepository } from '../repositories/volumeRepository.js';
import { getUserEmail } from '../lib/ctx.js';
const router = new Hono();
const validStatuses = ['ongoing', 'complete', 'dropped'];
const validSorts = ['newest', 'title', 'volumes'];
router.get('/', async (c) => {
    const qParam = c.req.query('q') ?? '';
    const q = qParam.trim();
    const statusParam = c.req.query('status') ?? '';
    const status = validStatuses.includes(statusParam)
        ? statusParam
        : '';
    const sortParam = c.req.query('sort') ?? '';
    const sort = validSorts.includes(sortParam)
        ? sortParam
        : 'newest';
    const view = c.req.query('view') === 'shelf' ? 'shelf' : 'grid';
    const returnParams = new URLSearchParams();
    if (q)
        returnParams.set('q', q);
    if (status)
        returnParams.set('status', status);
    if (sort)
        returnParams.set('sort', sort);
    if (view === 'grid')
        returnParams.set('view', view);
    const [books, totalSpent] = await Promise.all([
        bookRepository.findAll({ q, status, sort }),
        volumeRepository.sumAllPrices(),
    ]);
    return c.html(_jsx(HomePage, { books: books, totalSpent: totalSpent, userEmail: getUserEmail(c), q: q, status: status, sort: sort, view: view, returnQuery: returnParams.toString() }));
});
export default router;
