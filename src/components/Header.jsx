export default function Header({ onAdd }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
            💰
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Crédits Récurrents</h1>
            <p className="text-xs text-gray-500">Suivi de vos revenus réguliers</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={onAdd}>
          <span className="text-lg leading-none">+</span>
          Ajouter un crédit
        </button>
      </div>
    </header>
  )
}
