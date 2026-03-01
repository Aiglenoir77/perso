export const CATEGORIES = {
  salary: { label: 'Salaire', color: 'bg-blue-100 text-blue-800', icon: '💼' },
  rent: { label: 'Loyer / Location', color: 'bg-purple-100 text-purple-800', icon: '🏠' },
  cashback: { label: 'Cashback', color: 'bg-yellow-100 text-yellow-800', icon: '💳' },
  dividend: { label: 'Dividende', color: 'bg-green-100 text-green-800', icon: '📈' },
  refund: { label: 'Remboursement', color: 'bg-orange-100 text-orange-800', icon: '🔄' },
  other: { label: 'Autre', color: 'bg-gray-100 text-gray-800', icon: '📋' },
}

export const FREQUENCIES = {
  monthly: { label: 'Mensuel', perYear: 12, short: '/mois' },
  quarterly: { label: 'Trimestriel', perYear: 4, short: '/trim.' },
  biannual: { label: 'Semestriel', perYear: 2, short: '/sem.' },
  yearly: { label: 'Annuel', perYear: 1, short: '/an' },
}

export function formatCurrency(amount, currency = '€') {
  return `${Number(amount).toFixed(2).replace('.', ',')} ${currency}`
}

export function toMonthlyAmount(amount, frequency) {
  const freq = FREQUENCIES[frequency]
  if (!freq) return 0
  return (amount * freq.perYear) / 12
}

export function toYearlyAmount(amount, frequency) {
  const freq = FREQUENCIES[frequency]
  if (!freq) return 0
  return amount * freq.perYear
}

export function getPeriodKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function getPeriodLabel(periodKey) {
  const [year, month] = periodKey.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export function getExpectedPeriods(credit, monthsBack = 6) {
  const periods = []
  const now = new Date()
  const freq = FREQUENCIES[credit.frequency]
  if (!freq) return periods

  for (let i = monthsBack; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const periodKey = getPeriodKey(d)

    const start = new Date(credit.startDate)
    const startPeriod = getPeriodKey(start)
    if (periodKey < startPeriod) continue

    if (credit.endDate) {
      const end = new Date(credit.endDate)
      const endPeriod = getPeriodKey(end)
      if (periodKey > endPeriod) continue
    }

    // Check if this period is expected based on frequency
    const monthIndex = (d.getFullYear() * 12 + d.getMonth())
    const startMonthIndex = (start.getFullYear() * 12 + start.getMonth())
    const diff = monthIndex - startMonthIndex

    const interval = 12 / freq.perYear
    if (diff % interval === 0) {
      periods.push(periodKey)
    }
  }
  return periods
}

export function isCreditActive(credit) {
  if (!credit.active) return false
  const now = getPeriodKey()
  if (credit.endDate) {
    const end = getPeriodKey(new Date(credit.endDate))
    if (now > end) return false
  }
  return true
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
