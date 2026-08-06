import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { checkWalletConnection, getWalletAddress, isDemoModeEnabled, DEMO_WALLET_ADDRESS } from '@/lib/stellar'
import { getUserRole } from '@/lib/contracts/services'

export type Role = 'issuer' | 'investor' | 'admin'

export interface Session {
  walletAddress: string
  role: Role
  isIssuer: boolean
  isInvestor: boolean
  isAdmin: boolean
  /** True when the session was created by demo mode (no Freighter wallet). */
  isDemo: boolean
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

function buildSession(walletAddress: string, role: Role, isDemo = false): Session {
  return {
    walletAddress,
    role,
    isIssuer: role === 'issuer' || role === 'admin',
    isInvestor: role === 'investor' || role === 'admin',
    isAdmin: role === 'admin',
    isDemo,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('rwa_session') : null
    if (!stored) return null
    try {
      return JSON.parse(stored) as Session
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async (skipLoading = false) => {
    if (!skipLoading) setLoading(true)
    setError(null)
    try {
      const connected = await checkWalletConnection()

      // Without a wallet, fall back to a demo session when demo mode is on.
      if (!connected) {
        if (isDemoModeEnabled()) {
          const demoSession = buildSession(DEMO_WALLET_ADDRESS, 'issuer', true)
          setSession(demoSession)
          sessionStorage.setItem('rwa_session', JSON.stringify(demoSession))
          return
        }
        throw new Error('Wallet not connected. Please install Freighter.')
      }

      const address = await getWalletAddress()
      if (!address) throw new Error('Could not get wallet address')

      const role = await getUserRole(address)
      const newSession = buildSession(address, role)
      setSession(newSession)
      sessionStorage.setItem('rwa_session', JSON.stringify(newSession))
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
        const connected = await checkWalletConnection()
        if (cancelled) return

        if (connected) {
          const address = await getWalletAddress()
          if (cancelled || !address) return
          const role = await getUserRole(address)
          if (cancelled) return
          const newSession = buildSession(address, role)
          setSession(newSession)
          sessionStorage.setItem('rwa_session', JSON.stringify(newSession))
        } else if (!sessionStorage.getItem('rwa_session') && isDemoModeEnabled()) {
          // Fresh visit without Freighter: enable demo mode so the app is fully explorable.
          const demoSession = buildSession(DEMO_WALLET_ADDRESS, 'issuer', true)
          setSession(demoSession)
          sessionStorage.setItem('rwa_session', JSON.stringify(demoSession))
        }
        // Otherwise keep any session restored from storage.
      } catch {
        // noop: leave the UI in a safe, unauthenticated state
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
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
