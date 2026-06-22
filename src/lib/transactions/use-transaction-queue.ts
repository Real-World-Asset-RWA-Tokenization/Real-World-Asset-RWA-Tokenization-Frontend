import { useState, useCallback, useRef } from 'react'

export type TxStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'failed'

export interface Transaction {
  id: string
  label: string
  status: TxStatus
  hash?: string
  error?: string
  timestamp: number
}

interface TxState {
  items: Transaction[]
  activeCount: number
}

let txCounter = 0

export function useTransactionQueue() {
  const [state, setState] = useState<TxState>({ items: [], activeCount: 0 })
  const pollingRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map())

  const addTx = useCallback((label: string, txHash?: string): string => {
    const id = `tx_${++txCounter}_${Date.now()}`
    const tx: Transaction = {
      id,
      label,
      status: txHash ? 'confirming' : 'pending',
      hash: txHash,
      timestamp: Date.now(),
    }
    setState((prev) => ({
      items: [tx, ...prev.items],
      activeCount: prev.activeCount + 1,
    }))
    return id
  }, [])

  const updateTx = useCallback((id: string, updates: Partial<Transaction>) => {
    setState((prev) => {
      const items = prev.items.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
      const activeCount = items.filter((tx) => tx.status === 'pending' || tx.status === 'confirming').length
      return { items, activeCount }
    })
  }, [])

  const removeTx = useCallback((id: string) => {
    setState((prev) => {
      const items = prev.items.filter((tx) => tx.id !== id)
      const activeCount = items.filter((tx) => tx.status === 'pending' || tx.status === 'confirming').length
      return { items, activeCount }
    })
  }, [])

  const startPolling = useCallback((id: string, pollFn: () => Promise<string>, interval = 2000) => {
    const intervalId = setInterval(async () => {
      try {
        const hash = await pollFn()
        updateTx(id, { status: 'success', hash })
        clearInterval(intervalId)
        pollingRef.current.delete(id)
      } catch {
        // still pending
      }
    }, interval)
    pollingRef.current.set(id, intervalId)
  }, [updateTx])

  const clearCompleted = useCallback(() => {
    setState((prev) => {
      const items = prev.items.filter((tx) => tx.status === 'pending' || tx.status === 'confirming')
      return { items, activeCount: items.length }
    })
  }, [])

  const clearAll = useCallback(() => {
    pollingRef.current.forEach((id) => clearInterval(id))
    pollingRef.current.clear()
    setState({ items: [], activeCount: 0 })
  }, [])

  return {
    transactions: state.items,
    activeCount: state.activeCount,
    addTx,
    updateTx,
    removeTx,
    startPolling,
    clearCompleted,
    clearAll,
  }
}
