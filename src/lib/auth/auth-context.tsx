import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { getWalletAddress } from '@/lib/stellar'
import { isConnected } from '@stellar/freighter-api'
import { getUserRole } from '@/lib/contracts/services'

export type Role = 'issuer' | 'investor' | 'admin'

export interface Session {
  walletAddress: string
  role: Role
  isIssuer: boolean
  isInvestor: boolean
  isAdmin: boolean
}

interface AuthContextValue {
  session: Session | null
  loading: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
  error: null,
  connect: async () => {},
  disconnect: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('rwa_session') : null
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async (skipLoading = false) => {
    if (!skipLoading) setLoading(true)
    setError(null)
    try {
      const connected = await isConnected()
      if (!connected.isConnected) {
        throw new Error('Wallet not connected. Please install Freighter.')
      }
      const address = await getWalletAddress()
      if (!address) throw new Error('Could not get wallet address')

      const role = await getUserRole(address)
      const ses: Session = {
        walletAddress: address,
        role,
        isIssuer: role === 'issuer' || role === 'admin',
        isInvestor: role === 'investor' || role === 'admin',
        isAdmin: role === 'admin',
      }
      setSession(ses)
      sessionStorage.setItem('rwa_session', JSON.stringify(ses))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect'
      setError(msg)
      setSession(null)
      sessionStorage.removeItem('rwa_session')
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setSession(null)
    setError(null)
    sessionStorage.removeItem('rwa_session')
  }, [])

  useEffect(() => {
    let cancelled = false
    async function restore() {
      try {
        const connected = await isConnected()
        if (cancelled) return
        if (connected.isConnected) {
          const address = await getWalletAddress()
          if (cancelled || !address) return
          const role = await getUserRole(address)
          if (cancelled) return
          const ses: Session = {
            walletAddress: address,
            role,
            isIssuer: role === 'issuer' || role === 'admin',
            isInvestor: role === 'investor' || role === 'admin',
            isAdmin: role === 'admin',
          }
          setSession(ses)
          sessionStorage.setItem('rwa_session', JSON.stringify(ses))
        }
      } catch {
        // noop
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    restore()
    return () => { cancelled = true }
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading, error, connect, disconnect }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): Session | null {
  const { session } = useAuth()
  return session
}
