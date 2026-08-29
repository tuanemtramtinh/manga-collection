import { pgTable, serial, text, integer, boolean, date, timestamp } from 'drizzle-orm/pg-core';
export const books = pgTable('books', {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().default(''),
    title: text('title').notNull(),
    author: text('author').notNull().default(''),
    totalVolumes: integer('total_volumes').notNull().default(0),
    ownedVolumes: integer('owned_volumes').notNull().default(0),
    status: text('status', { enum: ['ongoing', 'complete', 'dropped'] }).notNull().default('ongoing'),
    color: text('color').notNull().default('#2563eb'),
    hasGoods: boolean('has_goods').notNull().default(false),
    goodsCount: integer('goods_count').notNull().default(0),
    coverUrl: text('cover_url'),
    notes: text('notes'),
});
export const volumes = pgTable('volumes', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    volumeNumber: integer('volume_number').notNull(),
    edition: text('edition').notNull().default(''),
    coverUrl: text('cover_url'),
    purchaseDate: date('purchase_date'),
    price: integer('price'),
    purchaseBatchId: integer('purchase_batch_id'),
});
export const purchaseBatches = pgTable('purchase_batches', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    purchaseDate: date('purchase_date').notNull(),
    totalPrice: integer('total_price').notNull(),
    note: text('note'),
});
export const goods = pgTable('goods', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: text('type').notNull().default(''),
    imageUrl: text('image_url'),
    purchaseDate: date('purchase_date'),
    price: integer('price'),
});
export const wishlist = pgTable('wishlist', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').references(() => books.id, { onDelete: 'cascade' }),
    bookTitle: text('book_title').notNull().default(''),
    volumeNumber: integer('volume_number').notNull(),
    estimatedPrice: integer('estimated_price'),
    notes: text('notes'),
});
export const sections = pgTable('sections', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    position: integer('position').notNull().default(0),
});
export const sectionItems = pgTable('section_items', {
    id: serial('id').primaryKey(),
    sectionId: integer('section_id').notNull().references(() => sections.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: text('type').notNull().default(''),
    imageUrl: text('image_url'),
    purchaseDate: date('purchase_date'),
    price: integer('price'),
});
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
