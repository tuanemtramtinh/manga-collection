import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'

export type UserRow = typeof users.$inferSelect

export const userRepository = {
  async findByEmail(email: string): Promise<UserRow | undefined> {
    const [row] = await db.select().from(users).where(eq(users.email, email))
    return row
  },

  async findById(id: number): Promise<UserRow | undefined> {
    const [row] = await db.select().from(users).where(eq(users.id, id))
    return row
  },

  async create(email: string, password: string): Promise<UserRow> {
    const passwordHash = await bcrypt.hash(password, 12)
    const [row] = await db.insert(users).values({ email, passwordHash }).returning()
    return row
  },

  async verifyPassword(user: UserRow, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash)
  },

  async count(): Promise<number> {
    const [{ count }] = await db.select({ count: users.id }).from(users)
    return Number(count)
  },
}
