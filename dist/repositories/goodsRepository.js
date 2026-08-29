import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { goods } from '../db/schema.js';
export const goodsRepository = {
    async findByBookId(bookId) {
        const rows = await db
            .select()
            .from(goods)
            .where(eq(goods.bookId, bookId));
        return rows;
    },
    async findById(id) {
        const [row] = await db.select().from(goods).where(eq(goods.id, id));
        return row;
    },
    async create(input) {
        const [row] = await db.insert(goods).values(input).returning();
        return row;
    },
    async update(id, input) {
        const [row] = await db
            .update(goods)
            .set(input)
            .where(eq(goods.id, id))
            .returning();
        return row;
    },
    async delete(id) {
        await db.delete(goods).where(eq(goods.id, id));
    },
};
