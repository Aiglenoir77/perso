import { useState } from 'react'
import { CATEGORIES, FREQUENCIES, getPeriodKey } from '../utils/creditUtils'

const DEFAULT_FORM = {
  name: '',
  amount: '',
  currency: '€',
  frequency: 'monthly',
  category: 'other',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  description: '',
  active: true,
}

export default function CreditForm({ initial = null, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? { ...DEFAULT_FORM, ...initial, endDate: initial.endDate ?? '' }
      : DEFAULT_FORM
  )
  const [error, setError] = useState('')

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Le nom est requis.'); return }
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setError('Le montant doit être un nombre positif.'); return
    }
    onSave({
      ...form,
      amount: parseFloat(form.amount),
      endDate: form.endDate || null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? 'Modifier le crédit' : 'Nouveau crédit récurrent'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer bg-transparent border-0 p-0"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div>
            <label className="label">Nom *</label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Ex: Salaire, Loyer studio, Cashback Amex…"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Montant *</label>
              <div className="relative">
                <input
                  className="input pr-8"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  placeholder="0,00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{form.currency}</span>
              </div>
            </div>
            <div>
              <label className="label">Fréquence</label>
              <select className="input" value={form.frequency} onChange={e => set('frequency', e.target.value)}>
                {Object.entries(FREQUENCIES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Catégorie</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORIES).map(([key, { label, icon, color }]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => set('category', key)}
                  className={`px-2 py-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer
                    ${form.category === key
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                    }`}
                >
                  <span>{icon}</span>
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date de début</label>
              <input
                className="input"
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Date de fin <span className="text-gray-400 font-normal">(optionnel)</span></label>
              <input
                className="input"
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={e => set('endDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Description <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <input
              className="input"
              type="text"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Note ou détail…"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={e => set('active', e.target.checked)}
              className="w-4 h-4 accent-green-600 cursor-pointer"
            />
            <label htmlFor="active" className="text-sm text-gray-700 cursor-pointer">Crédit actif</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {initial ? 'Enregistrer' : 'Ajouter'}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
