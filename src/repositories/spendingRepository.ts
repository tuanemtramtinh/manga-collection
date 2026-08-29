import { sql } from 'drizzle-orm'
import { db } from '../db/index.js'

export type PurchaseRow = {
  bookId:       number
  bookSlug:     string
  bookTitle:    string
  bookColor:    string
  type:         'volume' | 'bundle' | 'goods' | 'item'
  label:        string
  volumeNumber: number | null
  price:        number
  purchaseDate: string   // YYYY-MM-DD
}

export type MonthGroup = {
  month:     string        // "2026-08"
  label:     string        // "Tháng 8/2026"
  total:     number
  byBook:    BookGroup[]
}

export type BookGroup = {
  bookId:    number
  bookSlug:  string
  bookTitle: string
  bookColor: string
  total:     number
  items:     PurchaseRow[]
}

export const spendingRepository = {

  /** Tất cả purchases có price + purchaseDate, filter theo tháng nếu có */
  async findAll(month?: string): Promise<PurchaseRow[]> {
    const monthFilter = month
      ? sql`AND to_char(v.purchase_date, 'YYYY-MM') = ${month}`
      : sql``
    const monthFilterG = month
      ? sql`AND to_char(g.purchase_date, 'YYYY-MM') = ${month}`
      : sql``

    const rows = await db.execute(sql`
      SELECT
        b.id          AS "bookId",
        b.slug        AS "bookSlug",
        b.title       AS "bookTitle",
        b.color       AS "bookColor",
        'volume'      AS "type",
        ('Tập ' || v.volume_number || CASE WHEN v.edition <> '' THEN ' · ' || v.edition ELSE '' END) AS "label",
        v.volume_number AS "volumeNumber",
        v.price       AS "price",
        v.purchase_date::text AS "purchaseDate"
      FROM volumes v
      JOIN books b ON b.id = v.book_id
      WHERE v.purchase_batch_id IS NULL AND v.purchase_date IS NOT NULL AND v.price IS NOT NULL AND v.price > 0
      ${monthFilter}

      UNION ALL

      SELECT
        b.id          AS "bookId",
        b.slug        AS "bookSlug",
        b.title       AS "bookTitle",
        b.color       AS "bookColor",
        'bundle'      AS "type",
        ('Bộ Tập ' || MIN(v.volume_number) || CASE WHEN MIN(v.volume_number) <> MAX(v.volume_number) THEN '-' || MAX(v.volume_number) ELSE '' END) AS "label",
        NULL          AS "volumeNumber",
        pb.total_price AS "price",
        pb.purchase_date::text AS "purchaseDate"
      FROM purchase_batches pb
      JOIN books b ON b.id = pb.book_id
      JOIN volumes v ON v.purchase_batch_id = pb.id
      WHERE pb.total_price > 0
      ${month ? sql`AND to_char(pb.purchase_date, 'YYYY-MM') = ${month}` : sql``}
      GROUP BY b.id, b.slug, b.title, b.color, pb.id, pb.total_price, pb.purchase_date

      UNION ALL

      SELECT
        b.id          AS "bookId",
        b.slug        AS "bookSlug",
        b.title       AS "bookTitle",
        b.color       AS "bookColor",
        'goods'       AS "type",
        g.name        AS "label",
        NULL          AS "volumeNumber",
        g.price       AS "price",
        g.purchase_date::text AS "purchaseDate"
      FROM goods g
      JOIN books b ON b.id = g.book_id
      WHERE g.purchase_date IS NOT NULL AND g.price IS NOT NULL AND g.price > 0
      ${monthFilterG}

      UNION ALL

      SELECT
        b.id          AS "bookId",
        b.slug        AS "bookSlug",
        b.title       AS "bookTitle",
        b.color       AS "bookColor",
        'item'        AS "type",
        (s.name || ' › ' || si.name) AS "label",
        NULL          AS "volumeNumber",
        si.price      AS "price",
        si.purchase_date::text AS "purchaseDate"
      FROM section_items si
      JOIN sections s ON s.id = si.section_id
      JOIN books b ON b.id = s.book_id
      WHERE si.purchase_date IS NOT NULL AND si.price IS NOT NULL AND si.price > 0
      ${month ? sql`AND to_char(si.purchase_date, 'YYYY-MM') = ${month}` : sql``}

      ORDER BY "purchaseDate" DESC
    `)
    return [...rows] as unknown as PurchaseRow[]
  },

  /** Danh sách các tháng có dữ liệu (cho dropdown) */
  async availableMonths(): Promise<{ month: string; label: string }[]> {
    const rows = await db.execute(sql`
      SELECT DISTINCT to_char(purchase_date, 'YYYY-MM') AS month
      FROM (
        SELECT purchase_date FROM volumes      WHERE purchase_batch_id IS NULL AND purchase_date IS NOT NULL AND price > 0
        UNION ALL
        SELECT purchase_date FROM purchase_batches WHERE total_price > 0
        UNION ALL
        SELECT purchase_date FROM goods        WHERE purchase_date IS NOT NULL AND price > 0
        UNION ALL
        SELECT purchase_date FROM section_items WHERE purchase_date IS NOT NULL AND price > 0
      ) t
      ORDER BY month DESC
    `)
    return ([...rows] as any[]).map(r => {
      const [y, m] = r.month.split('-')
      return { month: r.month, label: `Tháng ${Number(m)}/${y}` }
    })
  },

  /** Tổng chi theo từng tháng (12 tháng gần nhất) cho chart */
  async monthlyTotals(): Promise<{ month: string; total: number }[]> {
    const rows = await db.execute(sql`
      SELECT
        to_char(purchase_date, 'YYYY-MM') AS month,
        SUM(price)::int                   AS total
      FROM (
        SELECT purchase_date, price FROM volumes
        WHERE purchase_batch_id IS NULL AND purchase_date IS NOT NULL AND price > 0
        UNION ALL
        SELECT purchase_date, total_price FROM purchase_batches
        WHERE total_price > 0
        UNION ALL
        SELECT purchase_date, price FROM goods
        WHERE purchase_date IS NOT NULL AND price > 0
        UNION ALL
        SELECT purchase_date, price FROM section_items
        WHERE purchase_date IS NOT NULL AND price > 0
      ) t
      WHERE purchase_date >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month ASC
    `)
    return [...rows] as unknown as { month: string; total: number }[]
  },

  /** Tổng chi theo từng bộ truyện (top 10) cho chart */
  async totalByBook(): Promise<{ bookId: number; bookTitle: string; bookColor: string; total: number }[]> {
    const rows = await db.execute(sql`
      SELECT
        b.id          AS "bookId",
        b.title       AS "bookTitle",
        b.color       AS "bookColor",
        SUM(t.price)::int AS total
      FROM (
        SELECT book_id, price FROM volumes       WHERE purchase_batch_id IS NULL AND price > 0
        UNION ALL
        SELECT book_id, total_price FROM purchase_batches WHERE total_price > 0
        UNION ALL
        SELECT book_id, price FROM goods         WHERE price > 0
        UNION ALL
        SELECT s.book_id, si.price FROM section_items si
        JOIN sections s ON s.id = si.section_id
        WHERE si.price > 0
      ) t
      JOIN books b ON b.id = t.book_id
      GROUP BY b.id, b.title, b.color
      ORDER BY total DESC
      LIMIT 10
    `)
    return [...rows] as unknown as any[]
  },
}

/** Group danh sách purchases theo tháng → book */
export function groupByMonth(rows: PurchaseRow[]): MonthGroup[] {
  const monthMap = new Map<string, MonthGroup>()

  for (const row of rows) {
    const month = row.purchaseDate.slice(0, 7) // "2026-08"
    const [y, m] = month.split('-')
    const label  = `Tháng ${Number(m)}/${y}`

    if (!monthMap.has(month)) {
      monthMap.set(month, { month, label, total: 0, byBook: [] })
    }
    const mg = monthMap.get(month)!
    mg.total += row.price

    let bg = mg.byBook.find(b => b.bookId === row.bookId)
    if (!bg) {
      bg = { bookId: row.bookId, bookSlug: row.bookSlug, bookTitle: row.bookTitle, bookColor: row.bookColor, total: 0, items: [] }
      mg.byBook.push(bg)
    }
    bg.total += row.price
    bg.items.push(row)
  }

  return [...monthMap.values()]
}
