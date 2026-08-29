import { Hono } from 'hono'
import SpendingPage from '../pages/Spending.js'
import { spendingRepository, groupByMonth } from '../repositories/spendingRepository.js'
import { getUserEmail, getUserId } from '../lib/ctx.js'

const router = new Hono()

router.get('/', async (c) => {
  const selectedMonth = c.req.query('month') ?? ''
  const userId = getUserId(c)

  const [rows, monthly, byBook, availableMonths] = await Promise.all([
    spendingRepository.findAll(selectedMonth || undefined, userId),
    spendingRepository.monthlyTotals(userId),
    spendingRepository.totalByBook(userId),
    spendingRepository.availableMonths(userId),
  ])

  const months     = groupByMonth(rows)
  const grandTotal = rows.reduce((s, r) => s + r.price, 0)

  const now          = new Date()
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const thisMonth    = monthly.find(m => m.month === thisMonthKey)?.total ?? 0

  const topBook = byBook[0]?.bookTitle ?? null

  return c.html(
    <SpendingPage
      months={months}
      chartData={{ monthly, byBook }}
      grandTotal={grandTotal}
      thisMonth={thisMonth}
      topBook={topBook}
      availableMonths={availableMonths}
      selectedMonth={selectedMonth}
      userEmail={getUserEmail(c)}
    />
  )
})

export default router
