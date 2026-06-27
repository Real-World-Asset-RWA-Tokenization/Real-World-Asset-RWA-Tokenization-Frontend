import { useState, useEffect, useCallback, useRef } from 'react'
import { getWalletAddress, getAccountBalance } from '@/lib/stellar'
import { isConnected } from '@stellar/freighter-api'
import type { WalletInfo } from '@/types'

async function fetchWallet(mountedRef: { current: boolean }): Promise<WalletInfo> {
  const result = await isConnected()
  if (!mountedRef.current) throw new DOMException('Aborted', 'AbortError')
  if (result.isConnected) {
    const address = await getWalletAddress()
    if (!mountedRef.current) throw new DOMException('Aborted', 'AbortError')
    const balance = address ? await getAccountBalance(address) : '0'
    return { connected: true, address: address ?? '', network: 'Stellar Testnet', balance }
  }
  return { connected: false, address: '', network: '', balance: '0' }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletInfo>(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('rwa_wallet') : null
    return stored ? JSON.parse(stored) : { connected: false, address: '', network: '', balance: '0' }
  })
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const info = await fetchWallet(mountedRef)
        if (cancelled) return
        setWallet(info)
        if (info.connected) {
          sessionStorage.setItem('rwa_wallet', JSON.stringify(info))
        } else {
          sessionStorage.removeItem('rwa_wallet')
        }
      } catch {
        if (!cancelled) {
          setWallet((prev) => ({ ...prev, connected: false }))
          sessionStorage.removeItem('rwa_wallet')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => { cancelled = true; mountedRef.current = false }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const info = await fetchWallet(mountedRef)
      if (!mountedRef.current) return
      setWallet(info)
      if (info.connected) {
        sessionStorage.setItem('rwa_wallet', JSON.stringify(info))
      } else {
        sessionStorage.removeItem('rwa_wallet')
      }
    } catch {
      if (mountedRef.current) {
        setWallet((prev) => ({ ...prev, connected: false }))
        sessionStorage.removeItem('rwa_wallet')
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  return { wallet, loading, refresh }
}
