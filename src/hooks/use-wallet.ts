import { useState, useEffect, useCallback } from 'react'
import { getWalletAddress, getAccountBalance } from '@/lib/stellar'
import { isConnected } from '@stellar/freighter-api'
import type { WalletInfo } from '@/types'

export function useWallet() {
  const [wallet, setWallet] = useState<WalletInfo>(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('rwa_wallet') : null
    return stored ? JSON.parse(stored) : { connected: false, address: '', network: '', balance: '0' }
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const result = await isConnected()
      if (result.isConnected) {
        const address = await getWalletAddress()
        const balance = address ? await getAccountBalance(address) : '0'
        const info = { connected: true, address: address ?? '', network: 'Stellar Testnet', balance }
        setWallet(info)
        sessionStorage.setItem('rwa_wallet', JSON.stringify(info))
      } else {
        setWallet((prev) => ({ ...prev, connected: false }))
        sessionStorage.removeItem('rwa_wallet')
      }
    } catch {
      setWallet((prev) => ({ ...prev, connected: false }))
      sessionStorage.removeItem('rwa_wallet')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { wallet, loading, refresh }
}
