import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { StatCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchDashboardMetrics, fetchAssets, fetchInvestors } from '@/lib/contracts/services'
import { formatCurrency, formatCompactNumber, getAssetClassLabel, timeAgo } from '@/lib/utils'
import type { DashboardMetrics, Asset, Investor } from '@/types'

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1']

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export default function Dashboard() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [m, a, i] = await Promise.all([
          fetchDashboardMetrics(),
          fetchAssets(),
          fetchInvestors(),
        ])
        if (cancelled) return
        setMetrics(m)
        setAssets(a)
        setInvestors(i)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const assetClassDist = useMemo(() => assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.assetClass] = (acc[a.assetClass] ?? 0) + Number(a.totalSupply)
    return acc
  }, {}), [assets])

  const pieData = useMemo(() => Object.entries(assetClassDist).map(([name, value]) => ({
    name: getAssetClassLabel(name),
    value,
  })), [assetClassDist])

  const volumeData = useMemo(() => ['150000', '230000', '180000', '320000', '280000', '210000', '190000'].map((vol, i) => ({
    day: DAYS[i],
    volume: Number(vol),
  })), [])

  const pendingKYC = useMemo(() => investors.filter((i) => i.kycStatus === 'pending'), [investors])

  if (loading) return <DashboardSkeleton />
  if (error) return <DashboardError error={error} />

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Overview of your RWA tokenization platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Assets" value={String(metrics?.totalAssets ?? 0)} change="+2 this month" changeType="positive" />
        <StatCard label="Total Investors" value={formatCompactNumber(metrics?.totalInvestors ?? 0)} change="+18 this week" changeType="positive" />
        <StatCard label="Total Supply" value={formatCurrency(metrics?.totalSupply ?? '0', 0)} change={metrics?.uniqueHolders ? `${metrics.uniqueHolders} holders` : undefined} />
        <StatCard label="24h Volume" value={formatCurrency(metrics?.volume24h ?? '0')} change="+12.5%" changeType="positive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Trading Volume (7 days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                formatter={(v: number) => [formatCurrency(v), 'Volume']}
              />
              <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Asset Class Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                formatter={(v: number) => [formatCurrency(v, 0), 'Supply']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Assets</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer" onClick={() => navigate('/assets')}>
              View All
            </button>
          </div>
          <div className="space-y-3">
            {assets.slice(0, 4).map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => navigate(`/assets/${asset.id}`)}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{asset.name}</p>
                  <p className="text-xs text-slate-500">{asset.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(asset.price)}</p>
                  <p className="text-xs text-emerald-600">{asset.distribution.apr}% APR</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Pending KYC Approvals</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer" onClick={() => navigate('/investors')}>
              View All
            </button>
          </div>
          {pendingKYC.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No pending KYC requests</p>
          ) : (
            <div className="space-y-3">
              {pendingKYC.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => navigate(`/investors/${inv.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{inv.name}</p>
                    <p className="text-xs text-slate-500">{inv.address}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning">Pending</Badge>
                    <p className="text-xs text-slate-400 mt-1">{timeAgo(inv.joinedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardError({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to load dashboard</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-md">{error}</p>
      <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] rounded-xl" />
        ))}
      </div>
    </div>
  )
}
