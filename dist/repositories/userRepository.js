import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
export const userRepository = {
    async findByEmail(email) {
        const [row] = await db.select().from(users).where(eq(users.email, email));
        return row;
    },
    async findById(id) {
        const [row] = await db.select().from(users).where(eq(users.id, id));
        return row;
    },
    async create(email, password) {
        const passwordHash = await bcrypt.hash(password, 12);
        const [row] = await db.insert(users).values({ email, passwordHash }).returning();
        return row;
    },
    async verifyPassword(user, password) {
        return bcrypt.compare(password, user.passwordHash);
    },
    async count() {
        const [{ count }] = await db.select({ count: users.id }).from(users);
        return Number(count);
    },
};
