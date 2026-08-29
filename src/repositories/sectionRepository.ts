import { eq, asc, sql, count } from 'drizzle-orm'
import { db } from '../db/index.js'
import { sections, sectionItems } from '../db/schema.js'
import type { Section, SectionItem } from '../types.js'
import type { NewSection, NewSectionItem } from '../db/schema.js'

export type CreateSectionInput = Omit<NewSection, 'id'>
export type CreateItemInput    = Omit<NewSectionItem, 'id'>
export type UpdateItemInput    = Partial<CreateItemInput>
export type PaginatedSections = { sections: Section[]; totals: Record<number, number> }

export const sectionRepository = {

  async findByBookId(bookId: number): Promise<Section[]> {
    const sectionRows = await db
      .select()
      .from(sections)
      .where(eq(sections.bookId, bookId))
      .orderBy(asc(sections.position), asc(sections.id))

    if (sectionRows.length === 0) return []

    const sectionIds = sectionRows.map(s => s.id)

    // Fetch all items for all sections of this book in one query
    const allItems = await db.execute(sql`
      SELECT * FROM section_items
      WHERE section_id = ANY(${sql.raw(`ARRAY[${sectionIds.join(',')}]`)}::int[])
      ORDER BY id ASC
    `)
    const itemList = [...allItems] as unknown as (SectionItem & { section_id: number })[]

    // Group items by sectionId
    const itemsBySectionId = new Map<number, SectionItem[]>()
    for (const item of itemList) {
      const sid = (item as any).section_id
      if (!itemsBySectionId.has(sid)) itemsBySectionId.set(sid, [])
      itemsBySectionId.get(sid)!.push({
        id:           (item as any).id,
        sectionId:    sid,
        name:         (item as any).name,
        type:         (item as any).type,
        imageUrl:     (item as any).image_url,
        purchaseDate: (item as any).purchase_date,
        price:        (item as any).price,
      })
    }

    return sectionRows.map(s => ({
      id:       s.id,
      bookId:   s.bookId,
      name:     s.name,
      position: s.position,
      items:    itemsBySectionId.get(s.id) ?? [],
    }))
  },

  async findByBookIdPaginated(bookId: number, pages: Record<number, number>, pageSize: number): Promise<PaginatedSections> {
    const sectionRows = await db.select().from(sections)
      .where(eq(sections.bookId, bookId))
      .orderBy(asc(sections.position), asc(sections.id))

    const results = await Promise.all(sectionRows.map(async section => {
      const page = pages[section.id] ?? 1
      const [items, countRows] = await Promise.all([
        db.select().from(sectionItems)
          .where(eq(sectionItems.sectionId, section.id))
          .orderBy(asc(sectionItems.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.select({ total: count() }).from(sectionItems)
          .where(eq(sectionItems.sectionId, section.id)),
      ])
      return {
        section: {
          ...section,
          items: items.map(item => ({
            id: item.id,
            sectionId: item.sectionId,
            name: item.name,
            type: item.type,
            imageUrl: item.imageUrl,
            purchaseDate: item.purchaseDate,
            price: item.price,
          })),
        },
        total: Number(countRows[0]?.total ?? 0),
      }
    }))

    return {
      sections: results.map(result => result.section),
      totals: Object.fromEntries(results.map(result => [result.section.id, result.total])),
    }
  },

  async findById(id: number): Promise<Section | undefined> {
    const [row] = await db.select().from(sections).where(eq(sections.id, id))
    if (!row) return undefined
    const items = await db
      .select()
      .from(sectionItems)
      .where(eq(sectionItems.sectionId, id))
      .orderBy(asc(sectionItems.id))
    return {
      ...row,
      items: items.map(i => ({
        id:           i.id,
        sectionId:    i.sectionId,
        name:         i.name,
        type:         i.type,
        imageUrl:     i.imageUrl,
        purchaseDate: i.purchaseDate,
        price:        i.price,
      })),
    }
  },

  async create(input: CreateSectionInput): Promise<Section> {
    const [row] = await db.insert(sections).values(input).returning()
    return { ...row, items: [] }
  },

  async delete(id: number): Promise<void> {
    await db.delete(sections).where(eq(sections.id, id))
  },

  // ─── Items ──────────────────────────────────────────────────────────────────

  async findItemById(id: number): Promise<SectionItem | undefined> {
    const [row] = await db.select().from(sectionItems).where(eq(sectionItems.id, id))
    if (!row) return undefined
    return {
      id:           row.id,
      sectionId:    row.sectionId,
      name:         row.name,
      type:         row.type,
      imageUrl:     row.imageUrl,
      purchaseDate: row.purchaseDate,
      price:        row.price,
    }
  },

  async createItem(input: CreateItemInput): Promise<SectionItem> {
    const [row] = await db.insert(sectionItems).values(input).returning()
    return {
      id:           row.id,
      sectionId:    row.sectionId,
      name:         row.name,
      type:         row.type,
      imageUrl:     row.imageUrl,
      purchaseDate: row.purchaseDate,
      price:        row.price,
    }
  },

  async updateItem(id: number, input: UpdateItemInput): Promise<SectionItem | undefined> {
    const [row] = await db
      .update(sectionItems)
      .set(input)
      .where(eq(sectionItems.id, id))
      .returning()
    if (!row) return undefined
    return {
      id:           row.id,
      sectionId:    row.sectionId,
      name:         row.name,
      type:         row.type,
      imageUrl:     row.imageUrl,
      purchaseDate: row.purchaseDate,
      price:        row.price,
    }
  },

  async deleteItem(id: number): Promise<void> {
    await db.delete(sectionItems).where(eq(sectionItems.id, id))
  },
}
