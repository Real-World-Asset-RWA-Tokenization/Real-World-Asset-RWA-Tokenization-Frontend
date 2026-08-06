import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { shortenAddress } from '@/lib/utils'

export function WalletConnect() {
  const { session, loading, error, connect, disconnect } = useAuth()
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    if (!session || session.isDemo) return
    let cancelled = false
    // stellar-sdk (Horizon) is loaded on demand so it never blocks startup.
    import('@/lib/stellar-account').then(({ getAccountBalance }) =>
      getAccountBalance(session.walletAddress).then((value) => {
        if (!cancelled) setBalance(value)
      }),
    )
    return () => {
      cancelled = true
    }
  }, [session])

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Spinner className="mr-2" size={16} />
        Connecting...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session.isDemo && <Badge variant="warning">Demo Mode</Badge>}
        {!session.isDemo && balance !== null && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {Number(balance).toLocaleString(undefined, { maximumFractionDigits: 2 })} XLM
          </span>
        )}
        <Badge variant="success">Connected</Badge>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {shortenAddress(session.walletAddress)}
        </span>
        <button
          onClick={disconnect}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Disconnect wallet"
          title="Disconnect"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="primary" size="sm" onClick={connect}>
        <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4 4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Connect Wallet
      </Button>
      {error && <p className="text-xs text-red-500 max-w-[220px] text-right">{error}</p>}
    </div>
  )
}
