import { eq, ilike, and, or, sql, asc, desc } from 'drizzle-orm'
import { db } from '../db/index.js'
import { books } from '../db/schema.js'
import type { Book, BookStatus } from '../types.js'
import type { NewBook } from '../db/schema.js'
import { uniqueSlug } from '../lib/slug.js'

export type BookFilters = {
  q?: string
  status?: BookStatus | ''
  sort?: string
}

export type CreateBookInput = Omit<NewBook, 'id'>
export type UpdateBookInput = Partial<CreateBookInput>

export const bookRepository = {

  async findAll(filters: BookFilters = {}): Promise<Book[]> {
    const { q, status, sort } = filters

    const conditions = []

    if (q) {
      conditions.push(
        or(
          ilike(books.title,  `%${q}%`),
          ilike(books.author, `%${q}%`),
        )
      )
    }

    if (status) {
      conditions.push(eq(books.status, status))
    }

    const orderBy = sort === 'title'
      ? asc(books.title)
      : sort === 'volumes'
        ? desc(books.ownedVolumes)
        : desc(books.id) // 'newest' or default

    const rows = conditions.length > 0
      ? await db.select().from(books).where(and(...conditions)).orderBy(orderBy)
      : await db.select().from(books).orderBy(orderBy)

    return rows as Book[]
  },

  async findById(id: number): Promise<Book | undefined> {
    const [row] = await db.select().from(books).where(eq(books.id, id))
    return row as Book | undefined
  },

  async findBySlug(slug: string): Promise<Book | undefined> {
    const [row] = await db.select().from(books).where(eq(books.slug, slug))
    return row as Book | undefined
  },

  async create(input: CreateBookInput): Promise<Book> {
    const slug = await uniqueSlug(
      (input as any).title ?? '',
      async (s) => !!(await db.select({ id: books.id }).from(books).where(eq(books.slug, s)))[0],
    )
    const [row] = await db.insert(books).values({ ...input, slug }).returning()
    return row as Book
  },

  async update(id: number, input: UpdateBookInput): Promise<Book | undefined> {
    const [row] = await db
      .update(books)
      .set(input)
      .where(eq(books.id, id))
      .returning()
    return row as Book | undefined
  },

  async delete(id: number): Promise<void> {
    await db.delete(books).where(eq(books.id, id))
  },

  // Cập nhật goodsCount sau khi thêm/xóa goods
  async syncGoodsCount(id: number): Promise<void> {
    await db
      .update(books)
      .set({
        goodsCount: sql`(SELECT COUNT(*) FROM goods WHERE book_id = ${id})`,
        hasGoods:   sql`(SELECT COUNT(*) FROM goods WHERE book_id = ${id}) > 0`,
      })
      .where(eq(books.id, id))
  },

  // Cập nhật ownedVolumes sau khi thêm/xóa volumes
  async syncOwnedVolumes(id: number): Promise<void> {
    await db
      .update(books)
      .set({
        ownedVolumes: sql`(SELECT COUNT(DISTINCT volume_number) FROM volumes WHERE book_id = ${id})`,
      })
      .where(eq(books.id, id))
  },
}
