import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Hono } from 'hono';
import { bookRepository } from '../repositories/bookRepository.js';
import { volumeRepository } from '../repositories/volumeRepository.js';
import { goodsRepository } from '../repositories/goodsRepository.js';
import { sectionRepository } from '../repositories/sectionRepository.js';
import { BookshelfGrid, BookCoverGrid } from '../pages/Home.js';
import BookDetailPage from '../pages/BookDetail.js';
import ImageUpload from '../components/ImageUpload.js';
import { deleteImage } from '../lib/storage.js';
import { getUserEmail } from '../lib/ctx.js';
import { purchaseBatchRepository } from '../repositories/purchaseBatchRepository.js';
const router = new Hono();
async function bookSlug(bookId) {
    const book = await bookRepository.findById(bookId);
    return book?.slug ?? String(bookId);
}
// ─── Books ────────────────────────────────────────────────────────────────────
// GET /books — bookshelf grid đã lọc (hỗ trợ ?view=shelf|grid)
router.get('/', async (c) => {
    const q = c.req.query('q') ?? '';
    const status = c.req.query('status');
    const sort = c.req.query('sort') ?? '';
    const view = c.req.query('view') ?? 'grid';
    const books = await bookRepository.findAll({ q, status, sort });
    return c.html(view === 'grid' ? _jsx(BookCoverGrid, { books: books }) : _jsx(BookshelfGrid, { books: books }));
});
// GET /books/:slug — Trang chi tiết
router.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const returnParams = new URLSearchParams();
    for (const key of ['q', 'status', 'sort', 'view']) {
        const value = c.req.query(key);
        if (value)
            returnParams.set(key, value);
    }
    const book = await bookRepository.findBySlug(slug);
    if (!book)
        return c.notFound();
    const [volumes, sections, bundleTotal] = await Promise.all([
        volumeRepository.findByBookId(book.id),
        sectionRepository.findByBookId(book.id),
        purchaseBatchRepository.sumByBook(book.id),
    ]);
    return c.html(_jsx(BookDetailPage, { book: book, volumes: volumes, sections: sections, bundleTotal: bundleTotal, userEmail: getUserEmail(c), returnQuery: returnParams.toString() }));
});
// POST /books — Thêm bộ truyện
router.post('/', async (c) => {
    const body = await c.req.parseBody();
    await bookRepository.create({
        title: String(body.title),
        author: String(body.author || ''),
        totalVolumes: Number(body.totalVolumes) || 0,
        ownedVolumes: 0,
        status: body.status || 'ongoing',
        color: String(body.color || '#2563eb'),
        hasGoods: false,
        goodsCount: 0,
        coverUrl: body.coverUrl ? String(body.coverUrl) : null,
        notes: body.notes ? String(body.notes) : null,
    });
    return c.redirect('/');
});
// POST /books/:id — Cập nhật bộ truyện
router.post('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const body = await c.req.parseBody();
    const newUrl = body.coverUrl ? String(body.coverUrl) : null;
    // Xóa ảnh cũ nếu người dùng upload ảnh mới khác
    const existing = await bookRepository.findById(id);
    if (existing?.coverUrl && newUrl && newUrl !== existing.coverUrl) {
        await deleteImage(existing.coverUrl).catch(() => { }); // lỗi xóa không chặn save
    }
    const updated = await bookRepository.update(id, {
        title: String(body.title),
        author: String(body.author || ''),
        totalVolumes: Number(body.totalVolumes) || 0,
        status: body.status || 'ongoing',
        color: String(body.color || '#2563eb'),
        coverUrl: newUrl,
        notes: body.notes ? String(body.notes) : null,
    });
    const slug = updated?.slug ?? existing?.slug ?? String(id);
    return c.redirect(`/books/${slug}`);
});
// POST /books/:id/delete — Xóa bộ truyện (form fallback)
router.post('/:id/delete', async (c) => {
    await bookRepository.delete(Number(c.req.param('id')));
    return c.redirect('/');
});
// DELETE /books/:id — Xóa bộ truyện (fetch)
router.delete('/:id', async (c) => {
    await bookRepository.delete(Number(c.req.param('id')));
    return c.json({ ok: true });
});
// ─── Volumes ──────────────────────────────────────────────────────────────────
// GET /books/:id/volumes/:vid/edit-form — HTMX: form sửa tập
router.get('/:id/volumes/:vid/edit-form', async (c) => {
    const bookId = Number(c.req.param('id'));
    const volId = Number(c.req.param('vid'));
    const [book, volume] = await Promise.all([
        bookRepository.findById(bookId),
        volumeRepository.findById(volId),
    ]);
    if (!book || !volume)
        return c.notFound();
    return c.html(_jsxs(_Fragment, { children: [_jsxs("h3", { class: "font-bold text-lg", children: ["S\u1EEDa t\u1EADp ", volume.volumeNumber] }), _jsx("p", { class: "text-sm text-base-content/50 mb-4", children: book.title }), _jsxs("form", { method: "post", action: `/books/${bookId}/volumes/${volId}`, class: "flex flex-col gap-3", id: "form_volume_edit", children: [_jsxs("div", { class: "grid grid-cols-2 gap-3", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "S\u1ED1 t\u1EADp *" }) }), _jsx("input", { type: "number", name: "volumeNumber", class: "input input-bordered w-full", min: "1", value: volume.volumeNumber, required: true })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Phi\u00EAn b\u1EA3n" }) }), _jsx("input", { type: "text", name: "edition", class: "input input-bordered w-full", placeholder: "\u0110\u1EB7c bi\u1EC7t...", value: volume.edition, list: "edition-options" }), _jsxs("datalist", { id: "edition-options", children: [_jsx("option", { value: "\u0110\u1EB7c bi\u1EC7t" }), _jsx("option", { value: "S\u01B0u t\u1EA7m" }), _jsx("option", { value: "Limited" }), _jsx("option", { value: "B\u00ECa c\u1EE9ng" })] })] })] }), _jsx(ImageUpload, { name: "coverUrl", folder: "volumes", currentUrl: volume.coverUrl, label: "\u1EA2nh b\u00ECa" }), _jsxs("div", { class: "grid grid-cols-2 gap-3", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Ng\u00E0y mua" }) }), _jsx("input", { type: "date", name: "purchaseDate", class: "input input-bordered w-full", value: volume.purchaseDate ?? '' })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Gi\u00E1 (\u20AB)" }) }), _jsx("input", { type: "number", name: "price", class: "input input-bordered w-full", min: "0", value: volume.price ?? '' })] })] })] }), _jsxs("div", { class: "flex items-center justify-between mt-5", children: [_jsx("button", { class: "btn btn-outline btn-error btn-sm", "data-delete-url": `/books/${bookId}/volumes/${volId}`, "data-delete-confirm": "X\u00F3a t\u1EADp n\u00E0y?", "data-delete-redirect": `/books/${book.slug}`, children: "X\u00F3a" }), _jsxs("div", { class: "flex gap-2", children: [_jsx("form", { method: "dialog", children: _jsx("button", { class: "btn btn-ghost", children: "H\u1EE7y" }) }), _jsx("button", { class: "btn btn-primary", type: "submit", form: "form_volume_edit", children: "L\u01B0u" })] })] })] }));
});
// POST /books/:id/volumes — Thêm tập (đơn lẻ)
router.post('/:id/volumes', async (c) => {
    const bookId = Number(c.req.param('id'));
    const body = await c.req.parseBody();
    await volumeRepository.create({
        bookId,
        volumeNumber: Number(body.volumeNumber),
        edition: String(body.edition || ''),
        coverUrl: body.coverUrl ? String(body.coverUrl) : null,
        purchaseDate: body.purchaseDate ? String(body.purchaseDate) : null,
        price: body.price ? Number(body.price) : null,
    });
    await bookRepository.syncOwnedVolumes(bookId);
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// POST /books/:id/volumes/bulk — Thêm nhiều tập cùng lúc
router.post('/:id/volumes/bulk', async (c) => {
    const bookId = Number(c.req.param('id'));
    const body = await c.req.parseBody();
    const raw = String(body.numbers ?? '').trim();
    // Parse "1-10" hoặc "1,3,5" hoặc kết hợp "1,3,5-8,10"
    const nums = new Set();
    for (const part of raw.split(',')) {
        const p = part.trim();
        const range = p.match(/^(\d+)-(\d+)$/);
        if (range) {
            const from = Number(range[1]), to = Number(range[2]);
            for (let i = Math.min(from, to); i <= Math.max(from, to); i++)
                nums.add(i);
        }
        else if (/^\d+$/.test(p)) {
            nums.add(Number(p));
        }
    }
    if (nums.size === 0)
        return c.redirect(`/books/${await bookSlug(bookId)}`);
    const purchaseDate = body.purchaseDate ? String(body.purchaseDate) : null;
    const price = body.price ? Number(body.price) : null;
    await Promise.all([...nums].map(n => volumeRepository.create({ bookId, volumeNumber: n, coverUrl: null, purchaseDate, price })));
    await bookRepository.syncOwnedVolumes(bookId);
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// POST /books/:id/volumes/bundle — Thêm các tập thuộc một giao dịch mua theo bộ
router.post('/:id/volumes/bundle', async (c) => {
    const bookId = Number(c.req.param('id'));
    const body = await c.req.parseBody();
    const nums = new Set();
    for (const part of String(body.numbers ?? '').split(',')) {
        const value = part.trim();
        const range = value.match(/^(\d+)-(\d+)$/);
        if (range) {
            for (let i = Math.min(Number(range[1]), Number(range[2])); i <= Math.max(Number(range[1]), Number(range[2])); i++)
                nums.add(i);
        }
        else if (/^\d+$/.test(value)) {
            nums.add(Number(value));
        }
    }
    const purchaseDate = String(body.purchaseDate ?? '').trim();
    const totalPrice = Number(body.totalPrice);
    if (!nums.size || !purchaseDate || !Number.isFinite(totalPrice) || totalPrice <= 0) {
        return c.redirect(`/books/${await bookSlug(bookId)}`);
    }
    const existing = await volumeRepository.findByBookId(bookId);
    const existingNumbers = new Set(existing.map(volume => volume.volumeNumber));
    const newNumbers = [...nums].filter(number => !existingNumbers.has(number)).sort((a, b) => a - b);
    if (newNumbers.length) {
        await purchaseBatchRepository.createWithVolumes({ bookId, volumeNumbers: newNumbers, purchaseDate, totalPrice, note: body.note ? String(body.note) : null });
        await bookRepository.syncOwnedVolumes(bookId);
    }
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// POST /books/:id/volumes/:vid — Cập nhật tập
router.post('/:id/volumes/:vid', async (c) => {
    const bookId = Number(c.req.param('id'));
    const volId = Number(c.req.param('vid'));
    const body = await c.req.parseBody();
    const newUrl = body.coverUrl ? String(body.coverUrl) : null;
    const existing = await volumeRepository.findById(volId);
    if (existing?.coverUrl && newUrl && newUrl !== existing.coverUrl) {
        await deleteImage(existing.coverUrl).catch(() => { });
    }
    await volumeRepository.update(volId, {
        volumeNumber: Number(body.volumeNumber),
        edition: String(body.edition || ''),
        coverUrl: newUrl,
        purchaseDate: body.purchaseDate ? String(body.purchaseDate) : null,
        price: body.price ? Number(body.price) : null,
    });
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// POST /books/:id/volumes/:vid/delete — Xóa tập (form fallback)
router.post('/:id/volumes/:vid/delete', async (c) => {
    const bookId = Number(c.req.param('id'));
    await volumeRepository.delete(Number(c.req.param('vid')));
    await bookRepository.syncOwnedVolumes(bookId);
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// DELETE /books/:id/volumes/:vid — Xóa tập (fetch)
router.delete('/:id/volumes/:vid', async (c) => {
    const bookId = Number(c.req.param('id'));
    await volumeRepository.delete(Number(c.req.param('vid')));
    await bookRepository.syncOwnedVolumes(bookId);
    return c.json({ ok: true });
});
// ─── Goods ────────────────────────────────────────────────────────────────────
// GET /books/:id/goods/:gid/edit-form — HTMX: form sửa goods
router.get('/:id/goods/:gid/edit-form', async (c) => {
    const bookId = Number(c.req.param('id'));
    const gid = Number(c.req.param('gid'));
    const [book, goods] = await Promise.all([
        bookRepository.findById(bookId),
        goodsRepository.findById(gid),
    ]);
    if (!book || !goods)
        return c.notFound();
    return c.html(_jsxs(_Fragment, { children: [_jsx("h3", { class: "font-bold text-lg", children: "S\u1EEDa goods" }), _jsx("p", { class: "text-sm text-base-content/50 mb-4", children: book.title }), _jsxs("form", { method: "post", action: `/books/${bookId}/goods/${gid}`, class: "flex flex-col gap-3", id: "form_goods_edit", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "T\u00EAn goods *" }) }), _jsx("input", { type: "text", name: "name", class: "input input-bordered w-full", value: goods.name, required: true })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Lo\u1EA1i" }) }), _jsx("input", { type: "text", name: "type", class: "input input-bordered w-full", placeholder: "poster / bookmark / standee...", value: goods.type })] }), _jsx(ImageUpload, { name: "imageUrl", folder: "goods", currentUrl: goods.imageUrl, label: "\u1EA2nh" }), _jsxs("div", { class: "grid grid-cols-2 gap-3", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Ng\u00E0y mua" }) }), _jsx("input", { type: "date", name: "purchaseDate", class: "input input-bordered w-full", value: goods.purchaseDate ?? '' })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Gi\u00E1 (\u20AB)" }) }), _jsx("input", { type: "number", name: "price", class: "input input-bordered w-full", min: "0", value: goods.price ?? '' })] })] })] }), _jsxs("div", { class: "flex items-center justify-between mt-5", children: [_jsx("button", { class: "btn btn-outline btn-error btn-sm", "data-delete-url": `/books/${bookId}/goods/${gid}`, "data-delete-confirm": "X\u00F3a goods n\u00E0y?", "data-delete-redirect": `/books/${book.slug}`, children: "X\u00F3a" }), _jsxs("div", { class: "flex gap-2", children: [_jsx("form", { method: "dialog", children: _jsx("button", { class: "btn btn-ghost", children: "H\u1EE7y" }) }), _jsx("button", { class: "btn btn-primary", type: "submit", form: "form_goods_edit", children: "L\u01B0u" })] })] })] }));
});
// POST /books/:id/goods — Thêm goods
router.post('/:id/goods', async (c) => {
    const bookId = Number(c.req.param('id'));
    const body = await c.req.parseBody();
    await goodsRepository.create({
        bookId,
        name: String(body.name),
        type: String(body.type || ''),
        imageUrl: body.imageUrl ? String(body.imageUrl) : null,
        purchaseDate: body.purchaseDate ? String(body.purchaseDate) : null,
        price: body.price ? Number(body.price) : null,
    });
    await bookRepository.syncGoodsCount(bookId);
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// POST /books/:id/goods/:gid — Cập nhật goods
router.post('/:id/goods/:gid', async (c) => {
    const bookId = Number(c.req.param('id'));
    const gid = Number(c.req.param('gid'));
    const body = await c.req.parseBody();
    const newUrl = body.imageUrl ? String(body.imageUrl) : null;
    const existing = await goodsRepository.findById(gid);
    if (existing?.imageUrl && newUrl && newUrl !== existing.imageUrl) {
        await deleteImage(existing.imageUrl).catch(() => { });
    }
    await goodsRepository.update(gid, {
        name: String(body.name),
        type: String(body.type || ''),
        imageUrl: newUrl,
        purchaseDate: body.purchaseDate ? String(body.purchaseDate) : null,
        price: body.price ? Number(body.price) : null,
    });
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// POST /books/:id/goods/:gid/delete — Xóa goods (form fallback)
router.post('/:id/goods/:gid/delete', async (c) => {
    const bookId = Number(c.req.param('id'));
    await goodsRepository.delete(Number(c.req.param('gid')));
    await bookRepository.syncGoodsCount(bookId);
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// DELETE /books/:id/goods/:gid — Xóa goods (fetch)
router.delete('/:id/goods/:gid', async (c) => {
    const bookId = Number(c.req.param('id'));
    await goodsRepository.delete(Number(c.req.param('gid')));
    await bookRepository.syncGoodsCount(bookId);
    return c.json({ ok: true });
});
// ─── Sections ─────────────────────────────────────────────────────────────────
// POST /books/:id/sections — Tạo section mới
router.post('/:id/sections', async (c) => {
    const bookId = Number(c.req.param('id'));
    const body = await c.req.parseBody();
    const name = String(body.name || '').trim();
    if (!name)
        return c.redirect(`/books/${await bookSlug(bookId)}`);
    await sectionRepository.create({ bookId, name, position: 0 });
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// DELETE /books/:id/sections/:sid — Xóa section (fetch)
router.delete('/:id/sections/:sid', async (c) => {
    await sectionRepository.delete(Number(c.req.param('sid')));
    return c.json({ ok: true });
});
// ─── Section Items ────────────────────────────────────────────────────────────
// GET /books/:id/sections/:sid/add-item-form — Form thêm item
router.get('/:id/sections/:sid/add-item-form', async (c) => {
    const bookId = Number(c.req.param('id'));
    const sectionId = Number(c.req.param('sid'));
    const [book, section] = await Promise.all([
        bookRepository.findById(bookId),
        sectionRepository.findById(sectionId),
    ]);
    if (!book || !section)
        return c.notFound();
    return c.html(_jsxs(_Fragment, { children: [_jsxs("h3", { class: "font-bold text-lg", children: ["Th\u00EAm v\u00E0o ", section.name] }), _jsx("p", { class: "text-sm text-base-content/50 mb-4", children: book.title }), _jsxs("form", { method: "post", action: `/books/${bookId}/sections/${sectionId}/items`, class: "flex flex-col gap-3", id: "form_section_item_add", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "T\u00EAn *" }) }), _jsx("input", { type: "text", name: "name", class: "input input-bordered w-full", placeholder: "Standee, poster...", required: true })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Lo\u1EA1i" }) }), _jsx("input", { type: "text", name: "type", class: "input input-bordered w-full", placeholder: "poster / standee / bookmark..." })] }), _jsx(ImageUpload, { name: "imageUrl", folder: "sections", label: "\u1EA2nh" }), _jsxs("div", { class: "grid grid-cols-2 gap-3", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Ng\u00E0y mua" }) }), _jsx("input", { type: "date", name: "purchaseDate", class: "input input-bordered w-full" })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Gi\u00E1 (\u20AB)" }) }), _jsx("input", { type: "number", name: "price", class: "input input-bordered w-full", min: "0" })] })] })] }), _jsxs("div", { class: "flex justify-end gap-2 mt-5", children: [_jsx("form", { method: "dialog", children: _jsx("button", { class: "btn btn-ghost", children: "H\u1EE7y" }) }), _jsx("button", { class: "btn btn-primary", type: "submit", form: "form_section_item_add", children: "Th\u00EAm" })] })] }));
});
// GET /books/:id/sections/:sid/items/:iid/edit-form — Form sửa item
router.get('/:id/sections/:sid/items/:iid/edit-form', async (c) => {
    const bookId = Number(c.req.param('id'));
    const sectionId = Number(c.req.param('sid'));
    const itemId = Number(c.req.param('iid'));
    const [book, section, item] = await Promise.all([
        bookRepository.findById(bookId),
        sectionRepository.findById(sectionId),
        sectionRepository.findItemById(itemId),
    ]);
    if (!book || !section || !item)
        return c.notFound();
    return c.html(_jsxs(_Fragment, { children: [_jsxs("h3", { class: "font-bold text-lg", children: ["S\u1EEDa \u2014 ", section.name] }), _jsx("p", { class: "text-sm text-base-content/50 mb-4", children: book.title }), _jsxs("form", { method: "post", action: `/books/${bookId}/sections/${sectionId}/items/${itemId}`, class: "flex flex-col gap-3", id: "form_section_item_edit", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "T\u00EAn *" }) }), _jsx("input", { type: "text", name: "name", class: "input input-bordered w-full", value: item.name, required: true })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Lo\u1EA1i" }) }), _jsx("input", { type: "text", name: "type", class: "input input-bordered w-full", value: item.type })] }), _jsx(ImageUpload, { name: "imageUrl", folder: "sections", currentUrl: item.imageUrl, label: "\u1EA2nh" }), _jsxs("div", { class: "grid grid-cols-2 gap-3", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Ng\u00E0y mua" }) }), _jsx("input", { type: "date", name: "purchaseDate", class: "input input-bordered w-full", value: item.purchaseDate ?? '' })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Gi\u00E1 (\u20AB)" }) }), _jsx("input", { type: "number", name: "price", class: "input input-bordered w-full", min: "0", value: item.price ?? '' })] })] })] }), _jsxs("div", { class: "flex items-center justify-between mt-5", children: [_jsx("button", { class: "btn btn-outline btn-error btn-sm", "data-delete-url": `/books/${bookId}/sections/${sectionId}/items/${itemId}`, "data-delete-confirm": "X\u00F3a item n\u00E0y?", "data-delete-redirect": `/books/${book.slug}`, children: "X\u00F3a" }), _jsxs("div", { class: "flex gap-2", children: [_jsx("form", { method: "dialog", children: _jsx("button", { class: "btn btn-ghost", children: "H\u1EE7y" }) }), _jsx("button", { class: "btn btn-primary", type: "submit", form: "form_section_item_edit", children: "L\u01B0u" })] })] })] }));
});
// POST /books/:id/sections/:sid/items — Thêm item
router.post('/:id/sections/:sid/items', async (c) => {
    const bookId = Number(c.req.param('id'));
    const sectionId = Number(c.req.param('sid'));
    const body = await c.req.parseBody();
    await sectionRepository.createItem({
        sectionId,
        name: String(body.name),
        type: String(body.type || ''),
        imageUrl: body.imageUrl ? String(body.imageUrl) : null,
        purchaseDate: body.purchaseDate ? String(body.purchaseDate) : null,
        price: body.price ? Number(body.price) : null,
    });
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// POST /books/:id/sections/:sid/items/:iid — Cập nhật item
router.post('/:id/sections/:sid/items/:iid', async (c) => {
    const bookId = Number(c.req.param('id'));
    const sectionId = Number(c.req.param('sid'));
    const itemId = Number(c.req.param('iid'));
    const body = await c.req.parseBody();
    const newUrl = body.imageUrl ? String(body.imageUrl) : null;
    const existing = await sectionRepository.findItemById(itemId);
    if (existing?.imageUrl && newUrl && newUrl !== existing.imageUrl) {
        await deleteImage(existing.imageUrl).catch(() => { });
    }
    await sectionRepository.updateItem(itemId, {
        name: String(body.name),
        type: String(body.type || ''),
        imageUrl: newUrl,
        purchaseDate: body.purchaseDate ? String(body.purchaseDate) : null,
        price: body.price ? Number(body.price) : null,
    });
    return c.redirect(`/books/${await bookSlug(bookId)}`);
});
// DELETE /books/:id/sections/:sid/items/:iid — Xóa item (fetch)
router.delete('/:id/sections/:sid/items/:iid', async (c) => {
    await sectionRepository.deleteItem(Number(c.req.param('iid')));
    return c.json({ ok: true });
});
export default router;
