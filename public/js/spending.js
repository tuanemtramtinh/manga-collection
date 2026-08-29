const raw = document.getElementById('chart-data')
if (!raw) throw new Error('No chart data')
const { monthLabels, monthTotals, bookLabels, bookTotals, bookColors } = JSON.parse(raw.textContent)

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark'
const gridColor  = () => isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
const tickColor  = () => isDark() ? 'rgba(255,255,255,0.4)'  : 'rgba(0,0,0,0.4)'

// ─── Bar chart: chi theo tháng ────────────────────────────────────────────────

const monthCtx = document.getElementById('chart-monthly')
if (monthCtx && monthLabels.length) {
  new Chart(monthCtx, {
    type: 'bar',
    data: {
      labels:   monthLabels,
      datasets: [{
        label:           'Chi tiêu (₫)',
        data:            monthTotals,
        backgroundColor: 'rgba(99,102,241,0.75)',
        borderRadius:    6,
        borderSkipped:   false,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.raw.toLocaleString('vi-VN') + '₫',
          },
        },
      },
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: tickColor() } },
        y: {
          grid: { color: gridColor() },
          ticks: {
            color: tickColor(),
            callback: v => (v / 1000) + 'k₫',
          },
        },
      },
    },
  })
}

// ─── Doughnut chart: top bộ tốn tiền ─────────────────────────────────────────

const bookCtx = document.getElementById('chart-books')
if (bookCtx && bookLabels.length) {
  new Chart(bookCtx, {
    type: 'doughnut',
    data: {
      labels:   bookLabels,
      datasets: [{
        data:             bookTotals,
        backgroundColor:  bookColors,
        borderWidth:      2,
        borderColor:      isDark() ? '#1d232a' : '#ffffff',
        hoverOffset:      6,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color:    tickColor(),
            boxWidth: 12,
            padding:  12,
            font:     { size: 11 },
          },
        },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.raw.toLocaleString('vi-VN') + '₫',
          },
        },
      },
    },
  })
}
