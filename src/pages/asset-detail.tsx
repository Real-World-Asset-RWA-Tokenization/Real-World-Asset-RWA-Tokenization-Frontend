import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Banknote, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchAssetById } from '@/lib/contracts/services'
import { formatCurrency, formatCompactNumber, formatDate, shortenAddress } from '@/lib/utils'
import type { Asset } from '@/types'

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    fetchAssetById(id)
      .then((data) => { if (!cancelled) setAsset(data ?? null) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load asset') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <DetailSkeleton />
  if (error) return <AssetDetailError error={error} />
  if (!asset) return <NotFound />

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
        onClick={() => navigate('/assets')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assets
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">{asset.name}</h2>
            <Badge variant={asset.status === 'active' ? 'success' : 'warning'}>{asset.status}</Badge>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{asset.symbol}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{asset.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span>Issuer: {shortenAddress(asset.issuer, 8)}</span>
            <span>Contract: {shortenAddress(asset.contractId, 8)}</span>
            <span>Created: {formatDate(asset.createdAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            {asset.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {asset.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Price</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(asset.price)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Total Supply</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCompactNumber(asset.totalSupply)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Circulating</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCompactNumber(asset.circulatingSupply)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">APR</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{asset.distribution.apr}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">KYC/AML Required</span>
              <Badge variant={asset.compliance.kycRequired ? 'success' : 'default'}>
                {asset.compliance.kycRequired ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">KYC Provider</span>
              <span className="text-sm font-medium text-slate-900">{asset.compliance.kycProvider === 'sep12' ? 'SEP-12' : 'Custom'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Transfer Restrictions</span>
              <Badge variant={asset.compliance.transferRestrictions ? 'success' : 'default'}>
                {asset.compliance.transferRestrictions ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Investor Whitelist</span>
              <Badge variant={asset.compliance.investorWhitelistRequired ? 'success' : 'default'}>
                {asset.compliance.investorWhitelistRequired ? 'Required' : 'Optional'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Distribution Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Distributed</span>
              <span className="text-sm font-medium text-slate-900">{formatCurrency(asset.distribution.totalDistributed)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Distribution</span>
              <span className="text-sm font-medium text-slate-900">{formatDate(asset.distribution.lastDistribution)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Next Distribution</span>
              <span className="text-sm font-medium text-slate-900">{formatDate(asset.distribution.nextDistribution)}</span>
            </div>
            <Separator />
            <Button variant="primary" className="w-full" onClick={() => navigate('/dividends')}>
              Distribute Yield
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AssetDetailError({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to load asset</h2>
      <p className="text-sm text-slate-500 mb-6">{error}</p>
      <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    </div>
  )
}

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-lg font-medium text-slate-900">Asset not found</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate('/assets')}>Back to Assets</Button>
    </div>
  )
}
