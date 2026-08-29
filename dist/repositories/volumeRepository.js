import { eq, sum } from 'drizzle-orm';
import { db } from '../db/index.js';
import { volumes } from '../db/schema.js';
export const volumeRepository = {
    async findByBookId(bookId) {
        const rows = await db
            .select()
            .from(volumes)
            .where(eq(volumes.bookId, bookId))
            .orderBy(volumes.volumeNumber);
        return rows;
    },
    async findById(id) {
        const [row] = await db.select().from(volumes).where(eq(volumes.id, id));
        return row;
    },
    async create(input) {
        const [row] = await db.insert(volumes).values(input).returning();
        return row;
    },
    async update(id, input) {
        const [row] = await db
            .update(volumes)
            .set(input)
            .where(eq(volumes.id, id))
            .returning();
        return row;
    },
    async delete(id) {
        await db.delete(volumes).where(eq(volumes.id, id));
    },
    async sumAllPrices() {
        const [row] = await db.select({ total: sum(volumes.price) }).from(volumes);
        return Number(row?.total ?? 0);
    },
};
