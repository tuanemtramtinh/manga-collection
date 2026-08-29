import { eq, asc, and } from 'drizzle-orm'
import { db } from '../db/index.js'
import { wishlist, books } from '../db/schema.js'
import type { WishlistRow, NewWishlist } from '../db/schema.js'

export type WishlistItem = WishlistRow & {
  resolvedTitle: string
  bookColor: string
}

export type CreateWishlistInput = Omit<NewWishlist, 'id' | 'userId'>

export const wishlistRepository = {

  async findAll(userId: number): Promise<WishlistItem[]> {
    const rows = await db
      .select()
      .from(wishlist)
      .leftJoin(books, and(eq(wishlist.bookId, books.id), eq(books.userId, userId)))
      .where(eq(wishlist.userId, userId))
      .orderBy(asc(wishlist.id))

    return rows.map(r => ({
      ...r.wishlist,
      resolvedTitle: r.wishlist.bookTitle || r.books?.title || '',
      bookColor:     r.books?.color ?? '#2563eb',
    }))
  },

  async create(input: CreateWishlistInput, userId: number): Promise<WishlistRow> {
    const [row] = await db.insert(wishlist).values({ ...input, userId }).returning()
    return row
  },

  async delete(id: number, userId: number): Promise<void> {
    await db.delete(wishlist).where(and(eq(wishlist.id, id), eq(wishlist.userId, userId)))
  },
}
