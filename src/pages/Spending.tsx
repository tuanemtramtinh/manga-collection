import type { FC } from 'hono/jsx'
import BaseLayout from '../layouts/base.js'
import Icon from '../components/Icon.js'
import type { MonthGroup } from '../repositories/spendingRepository.js'

// ─── Types ────────────────────────────────────────────────────────────────────

type ChartData = {
  monthly:  { month: string; total: number }[]
  byBook:   { bookId: number; bookTitle: string; bookColor: string; total: number }[]
}

type Props = {
  months:          MonthGroup[]
  chartData:       ChartData
  grandTotal:      number
  thisMonth:       number
  topBook:         string | null
  availableMonths: { month: string; label: string }[]
  selectedMonth:   string
  userEmail?:      string
}

// ─── Stats cards ──────────────────────────────────────────────────────────────

const StatCard: FC<{ icon: string; label: string; value: string; accent: string }> = ({ icon, label, value, accent }) => (
  <div class="bg-base-100 rounded-2xl shadow px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 border border-base-200">
    <Icon name={icon as any} size={24} class={`${accent} shrink-0`} />
    <div class="flex flex-col gap-0.5 min-w-0">
      <span class={`text-base sm:text-2xl font-bold tracking-tight ${accent} truncate`}>{value}</span>
      <span class="text-xs text-base-content/50 font-medium uppercase tracking-wide">{label}</span>
    </div>
  </div>
)

// ─── Purchase item row ────────────────────────────────────────────────────────

const PurchaseItem: FC<{ type: string; label: string; price: number; date: string }> = ({ type, label, price, date }) => (
  <div class="flex items-center justify-between py-1.5 gap-2 text-sm">
    <div class="flex items-center gap-2 min-w-0">
      <Icon name={type === 'volume' ? 'BookOpen' : 'Gift'} size={13} class="text-base-content/40 shrink-0" />
      <span class="text-base-content/80 truncate">{label}</span>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <span class="text-xs text-base-content/40 hidden sm:block">
        {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
      </span>
      <span class="font-medium text-primary text-right">{price.toLocaleString('vi-VN')}₫</span>
    </div>
  </div>
)

// ─── Month section ────────────────────────────────────────────────────────────

const MonthSection: FC<{ mg: MonthGroup }> = ({ mg }) => (
  <div class="mb-6">
    {/* Month header */}
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base sm:text-lg font-bold">{mg.label}</h2>
      <span class="text-sm sm:text-base font-semibold text-primary">{mg.total.toLocaleString('vi-VN')}₫</span>
    </div>

    {/* Books */}
    <div class="flex flex-col gap-3">
      {mg.byBook.map(bg => (
        <div class="bg-base-100 rounded-xl border border-base-200 overflow-hidden">
          {/* Book header */}
          <div class="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-base-200 gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-2.5 h-2.5 rounded-full shrink-0" style={`background-color:${bg.bookColor}`} />
              <a href={`/books/${bg.bookSlug}`} class="font-semibold text-sm hover:text-primary transition-colors truncate">
                {bg.bookTitle}
              </a>
            </div>
            <span class="text-sm font-medium shrink-0">{bg.total.toLocaleString('vi-VN')}₫</span>
          </div>
          {/* Items */}
          <div class="px-3 sm:px-4 divide-y divide-base-200">
            {bg.items.map(item => (
              <PurchaseItem type={item.type} label={item.label} price={item.price} date={item.purchaseDate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

const SpendingPage: FC<Props> = ({ months, chartData, grandTotal, thisMonth, topBook, availableMonths, selectedMonth, userEmail }) => {
  const monthLabels = JSON.stringify(chartData.monthly.map(m => {
    const [y, mo] = m.month.split('-')
    return `T${Number(mo)}/${y}`
  }))
  const monthTotals = JSON.stringify(chartData.monthly.map(m => m.total))
  const bookLabels  = JSON.stringify(chartData.byBook.map(b => b.bookTitle))
  const bookTotals  = JSON.stringify(chartData.byBook.map(b => b.total))
  const bookColors  = JSON.stringify(chartData.byBook.map(b => b.bookColor))

  return (
    <BaseLayout title="Chi tiêu — Kệ Truyện" userEmail={userEmail}>
      <div class="container mx-auto px-4 py-6 sm:py-8" style="max-width:1080px;">

        {/* Header */}
        <div class="mb-6">
          <a href="/" class="btn btn-ghost btn-sm gap-1 pl-1 mb-4">
            <Icon name="ArrowLeft" size={16} />
            Quay lại kệ
          </a>
          <h1 class="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Icon name="Banknote" size={28} class="text-primary" />
            Chi tiêu
          </h1>
          <p class="text-base-content/50 mt-1 text-sm">Thống kê tiền đã bỏ ra cho bộ sưu tập</p>
        </div>

        {/* Month filter */}
        {availableMonths.length > 0 && (
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
            <select id="month-select" class="select select-bordered select-sm flex-1 sm:flex-none">
              <option value="" selected={!selectedMonth}>Tất cả tháng</option>
              {availableMonths.map(m => (
                <option value={m.month} selected={m.month === selectedMonth}>{m.label}</option>
              ))}
            </select>
            {selectedMonth && (
              <a href="/spending" class="btn btn-ghost btn-sm">Xóa lọc</a>
            )}
          </div>
        )}

        <div class="flex justify-end mb-6">
          <a href={`/export/spending${selectedMonth ? `?month=${selectedMonth}` : ''}`} class="btn btn-ghost btn-sm gap-1.5">
            <Icon name="Download" size={14} />
            <span>Export Excel</span>
          </a>
        </div>

        {/* Stats */}
        <div class="grid grid-cols-3 gap-3 mb-8">
          <StatCard icon="Banknote" label="Tổng đã chi"    value={grandTotal.toLocaleString('vi-VN') + '₫'} accent="text-primary" />
          <StatCard icon="Calendar" label="Tháng này"      value={thisMonth.toLocaleString('vi-VN') + '₫'}  accent="text-secondary" />
          <StatCard icon="Star"     label="Tốn nhất"       value={topBook ?? '—'}                            accent="text-warning" />
        </div>

        {/* Charts */}
        {chartData.monthly.length > 0 && (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10">
            <div class="bg-base-100 rounded-2xl border border-base-200 shadow p-4 sm:p-5">
              <h3 class="font-semibold mb-4 text-sm text-base-content/60 uppercase tracking-wide">Chi theo tháng</h3>
              <canvas id="chart-monthly" height="200"></canvas>
            </div>
            <div class="bg-base-100 rounded-2xl border border-base-200 shadow p-4 sm:p-5">
              <h3 class="font-semibold mb-4 text-sm text-base-content/60 uppercase tracking-wide">Top bộ tốn tiền nhất</h3>
              <canvas id="chart-books" height="200"></canvas>
            </div>
          </div>
        )}

        {/* Monthly list */}
        {months.length === 0
          ? (
            <div class="hero min-h-48 bg-base-100 rounded-xl border border-base-200">
              <div class="hero-content text-center">
                <div>
                  <Icon name="Banknote" size={40} class="text-base-content/20 mx-auto mb-3" />
                  <p class="text-base-content/50">Chưa có dữ liệu chi tiêu.<br />Hãy thêm ngày mua và giá tiền cho các tập truyện!</p>
                </div>
              </div>
            </div>
          )
          : months.map(mg => <MonthSection mg={mg} />)
        }

      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js" defer></script>
      <script src="/public/js/spending.js" defer></script>
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('month-select')?.addEventListener('change', function() {
          const val = this.value
          window.location.href = val ? '/spending?month=' + val : '/spending'
        })
      `}} />
      <script id="chart-data" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        monthLabels: JSON.parse(monthLabels),
        monthTotals: JSON.parse(monthTotals),
        bookLabels:  JSON.parse(bookLabels),
        bookTotals:  JSON.parse(bookTotals),
        bookColors:  JSON.parse(bookColors),
      }) }} />
    </BaseLayout>
  )
}

export default SpendingPage
