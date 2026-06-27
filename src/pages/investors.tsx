import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShieldCheck, ShieldX, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { fetchInvestors } from '@/lib/contracts/services'
import { shortenAddress, formatCurrency, timeAgo } from '@/lib/utils'
import type { Investor } from '@/types'

export default function Investors() {
  const navigate = useNavigate()
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  useEffect(() => {
    let cancelled = false
    fetchInvestors()
      .then((data) => { if (!cancelled) setInvestors(data) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load investors') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = investors.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.address.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || inv.kycStatus === filter
    return matchesSearch && matchesFilter
  })

  if (loading) return <InvestorsSkeleton />
  if (error) return <InvestorsError error={error} />

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Investors</h2>
        <p className="text-sm text-slate-500 mt-1">{investors.length} registered investors</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <label htmlFor="investor-search" className="sr-only">Search investors</label>
          <input
            id="investor-search"
            type="search"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((f) => (
            <button
              key={f}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-1 text-xs opacity-60">
                  ({investors.filter((i) => i.kycStatus === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Whitelisted</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inv) => (
              <TableRow
                key={inv.id}
                className="cursor-pointer"
                onClick={() => navigate(`/investors/${inv.id}`)}
              >
                <TableCell>
                  <p className="font-medium text-slate-900">{inv.name}</p>
                  <p className="text-xs text-slate-500">{inv.email}</p>
                </TableCell>
                <TableCell>
                  <code className="text-xs text-slate-600">{shortenAddress(inv.address, 8)}</code>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.kycStatus === 'approved' ? 'success' :
                      inv.kycStatus === 'pending' ? 'warning' : 'danger'
                    }
                  >
                    {inv.kycStatus === 'approved' && <ShieldCheck className="h-3 w-3 mr-1" />}
                    {inv.kycStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {inv.kycStatus === 'rejected' && <ShieldX className="h-3 w-3 mr-1" />}
                    {inv.kycStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={inv.whitelisted ? 'success' : 'default'}>
                    {inv.whitelisted ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(inv.balance)}</TableCell>
                <TableCell>{inv.tokensHeld}</TableCell>
                <TableCell className="text-xs text-slate-500">{timeAgo(inv.lastActivity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-slate-900">No investors found</p>
        </div>
      )}
    </div>
  )
}

function InvestorsError({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to load investors</h2>
      <p className="text-sm text-slate-500 mb-6">{error}</p>
      <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  )
}

function InvestorsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}
