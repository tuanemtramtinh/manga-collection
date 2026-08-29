import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from 'hono';
import SpendingPage from '../pages/Spending.js';
import { spendingRepository, groupByMonth } from '../repositories/spendingRepository.js';
import { getUserEmail } from '../lib/ctx.js';
const router = new Hono();
router.get('/', async (c) => {
    const selectedMonth = c.req.query('month') ?? '';
    const [rows, monthly, byBook, availableMonths] = await Promise.all([
        spendingRepository.findAll(selectedMonth || undefined),
        spendingRepository.monthlyTotals(),
        spendingRepository.totalByBook(),
        spendingRepository.availableMonths(),
    ]);
    const months = groupByMonth(rows);
    const grandTotal = rows.reduce((s, r) => s + r.price, 0);
    const now = new Date();
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonth = monthly.find(m => m.month === thisMonthKey)?.total ?? 0;
    const topBook = byBook[0]?.bookTitle ?? null;
    return c.html(_jsx(SpendingPage, { months: months, chartData: { monthly, byBook }, grandTotal: grandTotal, thisMonth: thisMonth, topBook: topBook, availableMonths: availableMonths, selectedMonth: selectedMonth, userEmail: getUserEmail(c) }));
});
export default router;
