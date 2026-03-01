import { useMemo } from 'react'
import { CATEGORIES, FREQUENCIES, formatCurrency, toMonthlyAmount, toYearlyAmount, isCreditActive, getPeriodKey } from '../utils/creditUtils'

function StatCard({ label, value, sub, color = 'green' }) {
  const colors = {
    green: 'border-green-500 bg-green-50',
    blue: 'border-blue-500 bg-blue-50',
    purple: 'border-purple-500 bg-purple-50',
    orange: 'border-orange-500 bg-orange-50',
  }
  return (
    <div className={`card border-l-4 ${colors[color]}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Dashboard({ credits }) {
  const currentPeriod = getPeriodKey()

  const stats = useMemo(() => {
    const active = credits.filter(isCreditActive)
    const totalMonthly = active.reduce((sum, c) => sum + toMonthlyAmount(c.amount, c.frequency), 0)
    const totalYearly = active.reduce((sum, c) => sum + toYearlyAmount(c.amount, c.frequency), 0)

    const receivedThisMonth = active
      .filter(c => c.receipts?.[currentPeriod])
      .reduce((sum, c) => sum + (c.receipts[currentPeriod].amount ?? c.amount), 0)

    const pendingThisMonth = active
      .filter(c => {
        const freq = FREQUENCIES[c.frequency]
        if (!freq) return false
        // Check if this credit is expected this month
        const now = new Date()
        const start = new Date(c.startDate)
        const diff = (now.getFullYear() * 12 + now.getMonth()) - (start.getFullYear() * 12 + start.getMonth())
        const interval = 12 / freq.perYear
        return diff % interval === 0 && !c.receipts?.[currentPeriod]
      })
      .reduce((sum, c) => sum + c.amount, 0)

    const byCategory = {}
    active.forEach(c => {
      if (!byCategory[c.category]) byCategory[c.category] = 0
      byCategory[c.category] += toMonthlyAmount(c.amount, c.frequency)
    })

    return { active: active.length, totalMonthly, totalYearly, receivedThisMonth, pendingThisMonth, byCategory }
  }, [credits, currentPeriod])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Revenus mensuels"
          value={formatCurrency(stats.totalMonthly)}
          sub={`${stats.active} crédit${stats.active > 1 ? 's' : ''} actif${stats.active > 1 ? 's' : ''}`}
          color="green"
        />
        <StatCard
          label="Revenus annuels"
          value={formatCurrency(stats.totalYearly)}
          color="blue"
        />
        <StatCard
          label="Reçus ce mois"
          value={formatCurrency(stats.receivedThisMonth)}
          color="purple"
        />
        <StatCard
          label="En attente"
          value={formatCurrency(stats.pendingThisMonth)}
          sub="ce mois-ci"
          color="orange"
        />
      </div>

      {Object.keys(stats.byCategory).length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Répartition mensuelle par catégorie</h3>
          <div className="space-y-2">
            {Object.entries(stats.byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const pct = stats.totalMonthly > 0 ? (amount / stats.totalMonthly) * 100 : 0
                const meta = CATEGORIES[cat] ?? CATEGORIES.other
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{meta.icon} {meta.label}</span>
                      <span className="text-gray-500">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
