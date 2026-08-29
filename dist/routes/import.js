import { Hono } from 'hono';
import * as XLSX from 'xlsx';
import { bookRepository } from '../repositories/bookRepository.js';
const router = new Hono();
const statusByLabel = {
    ongoing: 'ongoing',
    complete: 'complete',
    dropped: 'dropped',
    'đang tiếp tục': 'ongoing',
    'đang mua tiếp': 'ongoing',
    'hoàn thành': 'complete',
    'đã đủ bộ': 'complete',
    'đã bỏ': 'dropped',
    'ngừng sưu tập': 'dropped',
};
function text(value) {
    return String(value ?? '').trim();
}
function number(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
}
function column(row, ...names) {
    const key = Object.keys(row).find(k => names.includes(k.trim().toLowerCase()));
    return key ? row[key] : undefined;
}
router.post('/books', async (c) => {
    const body = await c.req.parseBody();
    const file = body.file;
    if (!file || typeof file === 'string')
        return c.redirect('/?import=error');
    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet)
        return c.redirect('/?import=error');
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const existing = await bookRepository.findAll();
    const titles = new Set(existing.map(book => book.title.trim().toLocaleLowerCase()));
    let imported = 0;
    for (const row of rows) {
        const title = text(column(row, 'tên truyện', 'title', 'name'));
        if (!title)
            continue;
        const normalizedTitle = title.toLocaleLowerCase();
        if (titles.has(normalizedTitle))
            continue;
        const statusValue = text(column(row, 'trạng thái', 'status')).toLocaleLowerCase();
        const status = statusByLabel[statusValue] ?? 'ongoing';
        await bookRepository.create({
            title,
            author: text(column(row, 'tác giả', 'author')),
            status,
            totalVolumes: number(column(row, 'tổng tập', 'tổng số tập', 'total volumes')),
            ownedVolumes: number(column(row, 'đang có', 'số tập', 'owned volumes')),
            notes: text(column(row, 'ghi chú', 'notes')) || null,
            color: '#2563eb',
            hasGoods: false,
            goodsCount: 0,
            coverUrl: null,
        });
        titles.add(normalizedTitle);
        imported++;
    }
    return c.redirect(`/?imported=${imported}`);
});
export default router;
