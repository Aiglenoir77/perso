import { useState, useEffect, useCallback } from 'react'
import { generateId } from '../utils/creditUtils'

const STORAGE_KEY = 'recurring-credits'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(credits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credits))
}

export function useCredits() {
  const [credits, setCredits] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(credits)
  }, [credits])

  const addCredit = useCallback((data) => {
    const credit = { ...data, id: generateId(), receipts: {}, createdAt: new Date().toISOString() }
    setCredits(prev => [...prev, credit])
    return credit
  }, [])

  const updateCredit = useCallback((id, data) => {
    setCredits(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }, [])

  const deleteCredit = useCallback((id) => {
    setCredits(prev => prev.filter(c => c.id !== id))
  }, [])

  const toggleReceipt = useCallback((creditId, periodKey, amount) => {
    setCredits(prev => prev.map(c => {
      if (c.id !== creditId) return c
      const receipts = { ...c.receipts }
      if (receipts[periodKey]) {
        delete receipts[periodKey]
      } else {
        receipts[periodKey] = {
          receivedAt: new Date().toISOString(),
          amount: amount ?? c.amount,
        }
      }
      return { ...c, receipts }
    }))
  }, [])

  const updateReceiptAmount = useCallback((creditId, periodKey, amount) => {
    setCredits(prev => prev.map(c => {
      if (c.id !== creditId) return c
      const receipts = { ...c.receipts }
      receipts[periodKey] = { ...receipts[periodKey], amount }
      return { ...c, receipts }
    }))
  }, [])

  return { credits, addCredit, updateCredit, deleteCredit, toggleReceipt, updateReceiptAmount }
}
