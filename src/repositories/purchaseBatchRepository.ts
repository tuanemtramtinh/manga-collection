import { eq, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { purchaseBatches, volumes } from '../db/schema.js'

export const purchaseBatchRepository = {
  async createWithVolumes(input: {
    bookId: number
    volumeNumbers: number[]
    purchaseDate: string
    totalPrice: number
    note?: string | null
  }): Promise<void> {
    await db.transaction(async tx => {
      const [batch] = await tx.insert(purchaseBatches).values({
        bookId: input.bookId,
        purchaseDate: input.purchaseDate,
        totalPrice: input.totalPrice,
        note: input.note ?? null,
      }).returning({ id: purchaseBatches.id })

      await tx.insert(volumes).values(input.volumeNumbers.map(volumeNumber => ({
        bookId: input.bookId,
        volumeNumber,
        edition: '',
        coverUrl: null,
        purchaseDate: null,
        price: null,
        purchaseBatchId: batch.id,
      })))
    })
  },

  async sumByBook(bookId: number): Promise<number> {
    const [row] = await db.select({ total: sql<number>`coalesce(sum(${purchaseBatches.totalPrice}), 0)` })
      .from(purchaseBatches)
      .where(eq(purchaseBatches.bookId, bookId))
    return Number(row?.total ?? 0)
  },

  async sumAllPrices(): Promise<number> {
    const [row] = await db.select({ total: sql<number>`coalesce(sum(${purchaseBatches.totalPrice}), 0)` })
      .from(purchaseBatches)
    return Number(row?.total ?? 0)
  },
}
