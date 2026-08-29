import { eq, ilike, and, or, sql, asc, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { books } from '../db/schema.js';
import { uniqueSlug } from '../lib/slug.js';
export const bookRepository = {
    async findAll(filters = {}) {
        const { q, status, sort } = filters;
        const conditions = [];
        if (q) {
            conditions.push(or(ilike(books.title, `%${q}%`), ilike(books.author, `%${q}%`)));
        }
        if (status) {
            conditions.push(eq(books.status, status));
        }
        const orderBy = sort === 'title'
            ? asc(books.title)
            : sort === 'volumes'
                ? desc(books.ownedVolumes)
                : desc(books.id); // 'newest' or default
        const rows = conditions.length > 0
            ? await db.select().from(books).where(and(...conditions)).orderBy(orderBy)
            : await db.select().from(books).orderBy(orderBy);
        return rows;
    },
    async findById(id) {
        const [row] = await db.select().from(books).where(eq(books.id, id));
        return row;
    },
    async findBySlug(slug) {
        const [row] = await db.select().from(books).where(eq(books.slug, slug));
        return row;
    },
    async create(input) {
        const slug = await uniqueSlug(input.title ?? '', async (s) => !!(await db.select({ id: books.id }).from(books).where(eq(books.slug, s)))[0]);
        const [row] = await db.insert(books).values({ ...input, slug }).returning();
        return row;
    },
    async update(id, input) {
        const [row] = await db
            .update(books)
            .set(input)
            .where(eq(books.id, id))
            .returning();
        return row;
    },
    async delete(id) {
        await db.delete(books).where(eq(books.id, id));
    },
    // Cập nhật goodsCount sau khi thêm/xóa goods
    async syncGoodsCount(id) {
        await db
            .update(books)
            .set({
            goodsCount: sql `(SELECT COUNT(*) FROM goods WHERE book_id = ${id})`,
            hasGoods: sql `(SELECT COUNT(*) FROM goods WHERE book_id = ${id}) > 0`,
        })
            .where(eq(books.id, id));
    },
    // Cập nhật ownedVolumes sau khi thêm/xóa volumes
    async syncOwnedVolumes(id) {
        await db
            .update(books)
            .set({
            ownedVolumes: sql `(SELECT COUNT(DISTINCT volume_number) FROM volumes WHERE book_id = ${id})`,
        })
            .where(eq(books.id, id));
    },
};
