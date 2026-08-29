import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { goods } from '../db/schema.js'
import type { Goods } from '../types.js'
import type { NewGoods } from '../db/schema.js'

export type CreateGoodsInput = Omit<NewGoods, 'id'>
export type UpdateGoodsInput = Partial<CreateGoodsInput>

export const goodsRepository = {

  async findByBookId(bookId: number): Promise<Goods[]> {
    const rows = await db
      .select()
      .from(goods)
      .where(eq(goods.bookId, bookId))
    return rows as Goods[]
  },

  async findById(id: number): Promise<Goods | undefined> {
    const [row] = await db.select().from(goods).where(eq(goods.id, id))
    return row as Goods | undefined
  },

  async create(input: CreateGoodsInput): Promise<Goods> {
    const [row] = await db.insert(goods).values(input).returning()
    return row as Goods
  },

  async update(id: number, input: UpdateGoodsInput): Promise<Goods | undefined> {
    const [row] = await db
      .update(goods)
      .set(input)
      .where(eq(goods.id, id))
      .returning()
    return row as Goods | undefined
  },

  async delete(id: number): Promise<void> {
    await db.delete(goods).where(eq(goods.id, id))
  },
}
