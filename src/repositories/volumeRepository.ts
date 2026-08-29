import { eq, sum } from 'drizzle-orm'
import { db } from '../db/index.js'
import { volumes } from '../db/schema.js'
import type { Volume } from '../types.js'
import type { NewVolume } from '../db/schema.js'

export type CreateVolumeInput = Omit<NewVolume, 'id'>
export type UpdateVolumeInput = Partial<CreateVolumeInput>

export const volumeRepository = {

  async findByBookId(bookId: number): Promise<Volume[]> {
    const rows = await db
      .select()
      .from(volumes)
      .where(eq(volumes.bookId, bookId))
      .orderBy(volumes.volumeNumber)
    return rows as Volume[]
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

  async sumAllPrices(): Promise<number> {
    const [row] = await db.select({ total: sum(volumes.price) }).from(volumes)
    return Number(row?.total ?? 0)
  },
}
