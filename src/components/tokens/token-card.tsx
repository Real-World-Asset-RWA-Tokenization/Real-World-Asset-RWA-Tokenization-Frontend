import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatCompactNumber, getAssetClassColor, getAssetClassLabel } from '@/lib/utils'
import type { Asset } from '@/types'

interface TokenCardProps {
  asset: Asset
  onClick?: () => void
}

const TokenCard = memo(function TokenCard({ asset, onClick }: TokenCardProps) {
  return (
    <div
      className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{asset.name}</h3>
            <span className={getAssetClassColor(asset.assetClass)}>
              <Badge variant="outline" className="text-xs">
                {getAssetClassLabel(asset.assetClass)}
              </Badge>
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{asset.symbol}</p>
        </div>
        <Badge variant={asset.status === 'active' ? 'success' : asset.status === 'paused' ? 'warning' : 'danger'}>
          {asset.status}
        </Badge>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Price</span>
          <span className="text-sm font-semibold text-slate-900">{formatCurrency(asset.price)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Supply</span>
          <span className="text-sm font-medium text-slate-700">{formatCompactNumber(asset.circulatingSupply)} / {formatCompactNumber(asset.totalSupply)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">APR</span>
          <span className="text-sm font-medium text-emerald-600">{asset.distribution.apr}%</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Contract: {asset.contractId}</span>
        <span>Issuer: {asset.issuer}</span>
      </div>
    </div>
  )
})

export { TokenCard }
