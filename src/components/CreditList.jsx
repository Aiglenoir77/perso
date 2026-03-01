import { useMemo, useState } from 'react'
import CreditCard from './CreditCard'
import { CATEGORIES, isCreditActive } from '../utils/creditUtils'

export default function CreditList({ credits, onEdit, onDelete, onToggleReceipt, onUpdateReceiptAmount }) {
  const [filter, setFilter] = useState('all') // all | active | inactive | category key
  const [sortBy, setSortBy] = useState('name') // name | amount | frequency

  const filtered = useMemo(() => {
    let list = [...credits]
    if (filter === 'active') list = list.filter(isCreditActive)
    else if (filter === 'inactive') list = list.filter(c => !isCreditActive(c))
    else if (filter !== 'all') list = list.filter(c => c.category === filter)

    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'fr')
      if (sortBy === 'amount') return b.amount - a.amount
      if (sortBy === 'frequency') return a.frequency.localeCompare(b.frequency)
      return 0
    })
    return list
  }, [credits, filter, sortBy])

  const categories = useMemo(() => {
    const used = new Set(credits.map(c => c.category))
    return [...used]
  }, [credits])

  if (credits.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-3">💸</div>
        <p className="text-gray-500 font-medium">Aucun crédit récurrent enregistré</p>
        <p className="text-gray-400 text-sm mt-1">Cliquez sur "Ajouter un crédit" pour commencer</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {[
            { key: 'all', label: `Tous (${credits.length})` },
            { key: 'active', label: `Actifs (${credits.filter(isCreditActive).length})` },
            { key: 'inactive', label: `Inactifs (${credits.filter(c => !isCreditActive(c)).length})` },
            ...categories.map(cat => ({
              key: cat,
              label: `${CATEGORIES[cat]?.icon ?? ''} ${CATEGORIES[cat]?.label ?? cat}`
            }))
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border-0
                ${filter === key
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">Trier :</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer bg-white"
          >
            <option value="name">Nom</option>
            <option value="amount">Montant</option>
            <option value="frequency">Fréquence</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Aucun résultat pour ce filtre.</p>
      ) : (
        filtered.map(credit => (
          <CreditCard
            key={credit.id}
            credit={credit}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleReceipt={onToggleReceipt}
            onUpdateReceiptAmount={onUpdateReceiptAmount}
          />
        ))
      )}
    </div>
  )
}
