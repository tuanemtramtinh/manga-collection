import { eq, sum, count } from 'drizzle-orm'
import { db } from '../db/index.js'
import { books, purchaseBatches, volumes } from '../db/schema.js'
import type { Volume } from '../types.js'
import type { NewVolume } from '../db/schema.js'

export type CreateVolumeInput = Omit<NewVolume, 'id'>
export type UpdateVolumeInput = Partial<CreateVolumeInput>
export type VolumePage = { volumes: Volume[]; total: number }

export const volumeRepository = {

  async findByBookId(bookId: number): Promise<Volume[]> {
    const rows = await db
      .select()
      .from(volumes)
      .where(eq(volumes.bookId, bookId))
      .orderBy(volumes.volumeNumber)
    return rows as Volume[]
  },

  async findByBookIdPage(bookId: number, page: number, pageSize: number): Promise<VolumePage> {
    const [rows, countRows] = await Promise.all([
      db.select().from(volumes)
        .where(eq(volumes.bookId, bookId))
        .orderBy(volumes.volumeNumber)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ total: count() }).from(volumes).where(eq(volumes.bookId, bookId)),
    ])
    return { volumes: rows as Volume[], total: Number(countRows[0]?.total ?? 0) }
  },

  async findById(id: number): Promise<Volume | undefined> {
    const [row] = await db.select().from(volumes).where(eq(volumes.id, id))
    return row as Volume | undefined
  },

  async create(input: CreateVolumeInput): Promise<Volume> {
    const [row] = await db.insert(volumes).values(input).returning()
    return row as Volume
  },

  async update(id: number, input: UpdateVolumeInput): Promise<Volume | undefined> {
    const [row] = await db
      .update(volumes)
      .set(input)
      .where(eq(volumes.id, id))
      .returning()
    return row as Volume | undefined
  },

  async delete(id: number): Promise<void> {
    await db.delete(volumes).where(eq(volumes.id, id))
  },

  async deleteWithBatch(id: number): Promise<void> {
    const [volume] = await db.select({ purchaseBatchId: volumes.purchaseBatchId })
      .from(volumes)
      .where(eq(volumes.id, id))

    if (!volume?.purchaseBatchId) {
      await this.delete(id)
      return
    }

    await db.transaction(async tx => {
      await tx.delete(volumes).where(eq(volumes.purchaseBatchId, volume.purchaseBatchId!))
      await tx.delete(purchaseBatches).where(eq(purchaseBatches.id, volume.purchaseBatchId!))
    })
  },

  async sumAllPrices(userId?: number): Promise<number> {
    const [row] = userId
      ? await db.select({ total: sum(volumes.price) }).from(volumes).innerJoin(books, eq(volumes.bookId, books.id)).where(eq(books.userId, userId))
      : await db.select({ total: sum(volumes.price) }).from(volumes)
    return Number(row?.total ?? 0)
  },

  async sumPricesByBook(bookId: number): Promise<number> {
    const [row] = await db.select({ total: sum(volumes.price) }).from(volumes)
      .where(eq(volumes.bookId, bookId))
    return Number(row?.total ?? 0)
  },
}
