import { useState } from 'react'
import {
  CATEGORIES, FREQUENCIES, formatCurrency,
  toMonthlyAmount, getExpectedPeriods, getPeriodLabel, getPeriodKey, isCreditActive
} from '../utils/creditUtils'

export default function CreditCard({ credit, onEdit, onDelete, onToggleReceipt, onUpdateReceiptAmount }) {
  const [expanded, setExpanded] = useState(false)
  const [editingAmount, setEditingAmount] = useState(null) // periodKey being edited

  const cat = CATEGORIES[credit.category] ?? CATEGORIES.other
  const freq = FREQUENCIES[credit.frequency]
  const active = isCreditActive(credit)
  const periods = getExpectedPeriods(credit, 6)
  const currentPeriod = getPeriodKey()

  const receivedCount = periods.filter(p => credit.receipts?.[p]).length
  const monthlyEquiv = toMonthlyAmount(credit.amount, credit.frequency)

  return (
    <div className={`card transition-all ${!active ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">
            {cat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">{credit.name}</h3>
              {!active && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactif</span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>
                {cat.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="text-sm font-bold text-green-700">
                {formatCurrency(credit.amount)}<span className="text-gray-400 font-normal text-xs ml-1">{freq?.short}</span>
              </span>
              {freq && credit.frequency !== 'monthly' && (
                <span className="text-xs text-gray-400">≈ {formatCurrency(monthlyEquiv)}/mois</span>
              )}
              <span className="text-xs text-gray-400">{freq?.label}</span>
            </div>
            {credit.description && (
              <p className="text-xs text-gray-500 mt-0.5">{credit.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer border-0 bg-transparent transition-colors"
            title="Historique"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(credit)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer border-0 bg-transparent transition-colors"
            title="Modifier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Supprimer "${credit.name}" ?`)) onDelete(credit.id)
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer border-0 bg-transparent transition-colors"
            title="Supprimer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Receipt progress bar */}
      {periods.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-1 flex-1">
            {periods.map(p => {
              const received = !!credit.receipts?.[p]
              const isCurrent = p === currentPeriod
              return (
                <button
                  key={p}
                  onClick={() => onToggleReceipt(credit.id, p, credit.amount)}
                  title={`${getPeriodLabel(p)} – ${received ? 'Reçu ✓' : 'Non reçu'}`}
                  className={`h-2 flex-1 rounded-full transition-colors cursor-pointer border-0
                    ${received ? 'bg-green-500' : isCurrent ? 'bg-orange-300' : 'bg-gray-200'}
                    hover:opacity-80`}
                />
              )
            })}
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {receivedCount}/{periods.length}
          </span>
        </div>
      )}

      {/* Expanded history */}
      {expanded && (
        <div className="mt-3 border-t border-gray-100 pt-3 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Historique des réceptions</p>
          {periods.length === 0 ? (
            <p className="text-xs text-gray-400">Aucune période attendue.</p>
          ) : (
            periods.slice().reverse().map(p => {
              const receipt = credit.receipts?.[p]
              const isCurrent = p === currentPeriod
              return (
                <div key={p} className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm
                  ${isCurrent ? 'bg-orange-50 border border-orange-100' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleReceipt(credit.id, p, credit.amount)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors
                        ${receipt ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white hover:border-green-400'}`}
                    >
                      {receipt && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`capitalize ${isCurrent ? 'font-semibold text-orange-800' : 'text-gray-700'}`}>
                      {getPeriodLabel(p)}
                      {isCurrent && <span className="ml-1 text-xs font-normal text-orange-500">(ce mois)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {receipt ? (
                      editingAmount === p ? (
                        <input
                          type="number"
                          className="w-24 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                          defaultValue={receipt.amount}
                          onBlur={e => {
                            onUpdateReceiptAmount(credit.id, p, parseFloat(e.target.value) || credit.amount)
                            setEditingAmount(null)
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') e.target.blur()
                            if (e.key === 'Escape') setEditingAmount(null)
                          }}
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingAmount(p)}
                          className="text-xs text-green-700 font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          {formatCurrency(receipt.amount ?? credit.amount)}
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-gray-400">{formatCurrency(credit.amount)}</span>
                    )}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${receipt ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {receipt ? '✓ Reçu' : 'En attente'}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
