import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { shortenAddress } from '@/lib/utils'

export function WalletConnect() {
  const { session, loading, connect } = useAuth()

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Connecting...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="success">Connected</Badge>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {shortenAddress(session.walletAddress)}
        </span>
      </div>
    )
  }

  return (
    <Button variant="primary" size="sm" onClick={connect}>
      <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      Connect Wallet
    </Button>
  )
}
