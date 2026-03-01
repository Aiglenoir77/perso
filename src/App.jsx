import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import CreditList from './components/CreditList'
import CreditForm from './components/CreditForm'
import { useCredits } from './hooks/useCredits'

export default function App() {
  const { credits, addCredit, updateCredit, deleteCredit, toggleReceipt, updateReceiptAmount } = useCredits()
  const [modal, setModal] = useState(null) // null | { mode: 'add' } | { mode: 'edit', credit }

  const handleSave = (data) => {
    if (modal?.mode === 'edit') {
      updateCredit(modal.credit.id, data)
    } else {
      addCredit(data)
    }
    setModal(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdd={() => setModal({ mode: 'add' })} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Dashboard credits={credits} />
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Mes crédits récurrents</h2>
          <CreditList
            credits={credits}
            onEdit={(credit) => setModal({ mode: 'edit', credit })}
            onDelete={deleteCredit}
            onToggleReceipt={toggleReceipt}
            onUpdateReceiptAmount={updateReceiptAmount}
          />
        </div>
      </main>

      {modal && (
        <CreditForm
          initial={modal.mode === 'edit' ? modal.credit : null}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}
