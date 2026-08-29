import { Hono } from 'hono'
import HomePage from '../pages/Home.js'
import { bookRepository } from '../repositories/bookRepository.js'
import { volumeRepository } from '../repositories/volumeRepository.js'
import { purchaseBatchRepository } from '../repositories/purchaseBatchRepository.js'
import { getUserEmail, getUserId } from '../lib/ctx.js'
import type { BookStatus } from '../types.js'

const router = new Hono()

const validStatuses: BookStatus[] = ['ongoing', 'complete', 'dropped']
const validSorts = ['newest', 'title', 'volumes'] as const

router.get('/', async (c) => {
  const userId = getUserId(c)
  const qParam = c.req.query('q') ?? ''
  const q      = qParam.trim()
  const statusParam = c.req.query('status') ?? ''
  const status = validStatuses.includes(statusParam as BookStatus)
    ? statusParam as BookStatus
    : ''
  const sortParam = c.req.query('sort') ?? ''
  const sort = validSorts.includes(sortParam as typeof validSorts[number])
    ? sortParam
    : 'newest'
  const view   = c.req.query('view') === 'shelf' ? 'shelf' : 'grid'
  const pageParam = Number(c.req.query('page') ?? 1)
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
  const pageSize = 24
  const returnParams = new URLSearchParams()
  if (q) returnParams.set('q', q)
  if (status) returnParams.set('status', status)
  if (sort) returnParams.set('sort', sort)
  if (view === 'grid') returnParams.set('view', view)
  if (page > 1) returnParams.set('page', String(page))

  const [bookPage, quickBooks, individualSpent, bundleSpent] = await Promise.all([
    bookRepository.findPage({ q, status, sort, userId }, page, pageSize),
    bookRepository.findAll({ sort: 'title', userId }),
    volumeRepository.sumAllPrices(),
    purchaseBatchRepository.sumAllPrices(),
  ])
  const totalSpent = individualSpent + bundleSpent
  const totalPages = Math.max(1, Math.ceil(bookPage.total / pageSize))
  const safePage = Math.min(page, totalPages)
  return c.html(<HomePage books={safePage === page ? bookPage.books : []} quickBooks={quickBooks} totalSpent={totalSpent} userEmail={getUserEmail(c)} q={q} status={status} sort={sort} view={view} page={safePage} totalPages={totalPages} returnQuery={returnParams.toString()} />)
})

export default router
