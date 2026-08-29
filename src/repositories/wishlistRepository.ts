import { eq, asc } from 'drizzle-orm'
import { db } from '../db/index.js'
import { wishlist, books } from '../db/schema.js'
import type { WishlistRow, NewWishlist } from '../db/schema.js'

export type WishlistItem = WishlistRow & {
  resolvedTitle: string
  bookColor: string
}

export type CreateWishlistInput = Omit<NewWishlist, 'id'>

export const wishlistRepository = {

  async findAll(): Promise<WishlistItem[]> {
    const rows = await db
      .select()
      .from(wishlist)
      .leftJoin(books, eq(wishlist.bookId, books.id))
      .orderBy(asc(wishlist.id))

    return rows.map(r => ({
      ...r.wishlist,
      resolvedTitle: r.wishlist.bookTitle || r.books?.title || '',
      bookColor:     r.books?.color ?? '#2563eb',
    }))
  },

  async create(input: CreateWishlistInput): Promise<WishlistRow> {
    const [row] = await db.insert(wishlist).values(input).returning()
    return row
  },

  async delete(id: number): Promise<void> {
    await db.delete(wishlist).where(eq(wishlist.id, id))
  },
}
