import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { wishlist, books } from '../db/schema.js';
export const wishlistRepository = {
    async findAll() {
        const rows = await db
            .select()
            .from(wishlist)
            .leftJoin(books, eq(wishlist.bookId, books.id))
            .orderBy(asc(wishlist.id));
        return rows.map(r => ({
            ...r.wishlist,
            resolvedTitle: r.wishlist.bookTitle || r.books?.title || '',
            bookColor: r.books?.color ?? '#2563eb',
        }));
    },
    async create(input) {
        const [row] = await db.insert(wishlist).values(input).returning();
        return row;
    },
    async delete(id) {
        await db.delete(wishlist).where(eq(wishlist.id, id));
    },
};
