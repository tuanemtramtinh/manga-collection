import { eq, asc, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { sections, sectionItems } from '../db/schema.js';
export const sectionRepository = {
    async findByBookId(bookId) {
        const sectionRows = await db
            .select()
            .from(sections)
            .where(eq(sections.bookId, bookId))
            .orderBy(asc(sections.position), asc(sections.id));
        if (sectionRows.length === 0)
            return [];
        const sectionIds = sectionRows.map(s => s.id);
        // Fetch all items for all sections of this book in one query
        const allItems = await db.execute(sql `
      SELECT * FROM section_items
      WHERE section_id = ANY(${sql.raw(`ARRAY[${sectionIds.join(',')}]`)}::int[])
      ORDER BY id ASC
    `);
        const itemList = [...allItems];
        // Group items by sectionId
        const itemsBySectionId = new Map();
        for (const item of itemList) {
            const sid = item.section_id;
            if (!itemsBySectionId.has(sid))
                itemsBySectionId.set(sid, []);
            itemsBySectionId.get(sid).push({
                id: item.id,
                sectionId: sid,
                name: item.name,
                type: item.type,
                imageUrl: item.image_url,
                purchaseDate: item.purchase_date,
                price: item.price,
            });
        }
        return sectionRows.map(s => ({
            id: s.id,
            bookId: s.bookId,
            name: s.name,
            position: s.position,
            items: itemsBySectionId.get(s.id) ?? [],
        }));
    },
    async findById(id) {
        const [row] = await db.select().from(sections).where(eq(sections.id, id));
        if (!row)
            return undefined;
        const items = await db
            .select()
            .from(sectionItems)
            .where(eq(sectionItems.sectionId, id))
            .orderBy(asc(sectionItems.id));
        return {
            ...row,
            items: items.map(i => ({
                id: i.id,
                sectionId: i.sectionId,
                name: i.name,
                type: i.type,
                imageUrl: i.imageUrl,
                purchaseDate: i.purchaseDate,
                price: i.price,
            })),
        };
    },
    async create(input) {
        const [row] = await db.insert(sections).values(input).returning();
        return { ...row, items: [] };
    },
    async delete(id) {
        await db.delete(sections).where(eq(sections.id, id));
    },
    // ─── Items ──────────────────────────────────────────────────────────────────
    async findItemById(id) {
        const [row] = await db.select().from(sectionItems).where(eq(sectionItems.id, id));
        if (!row)
            return undefined;
        return {
            id: row.id,
            sectionId: row.sectionId,
            name: row.name,
            type: row.type,
            imageUrl: row.imageUrl,
            purchaseDate: row.purchaseDate,
            price: row.price,
        };
    },
    async createItem(input) {
        const [row] = await db.insert(sectionItems).values(input).returning();
        return {
            id: row.id,
            sectionId: row.sectionId,
            name: row.name,
            type: row.type,
            imageUrl: row.imageUrl,
            purchaseDate: row.purchaseDate,
            price: row.price,
        };
    },
    async updateItem(id, input) {
        const [row] = await db
            .update(sectionItems)
            .set(input)
            .where(eq(sectionItems.id, id))
            .returning();
        if (!row)
            return undefined;
        return {
            id: row.id,
            sectionId: row.sectionId,
            name: row.name,
            type: row.type,
            imageUrl: row.imageUrl,
            purchaseDate: row.purchaseDate,
            price: row.price,
        };
    },
    async deleteItem(id) {
        await db.delete(sectionItems).where(eq(sectionItems.id, id));
    },
};
