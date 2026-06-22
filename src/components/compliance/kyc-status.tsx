import { Badge } from '@/components/ui/badge'
import { timeAgo } from '@/lib/utils'
import type { ComplianceStatus, KYCProvider } from '@/types'

interface KYCStatusProps {
  status: ComplianceStatus
  provider: KYCProvider
  updatedAt?: string
}

const statusVariant: Record<ComplianceStatus, 'danger' | 'success' | 'warning' | 'default'> = {
  approved: 'success',
  rejected: 'danger',
  pending: 'warning',
  expired: 'default',
}

const providerLabel: Record<KYCProvider, string> = {
  sep12: 'SEP-12',
  custom: 'Custom',
}

export function KYCStatusBadge({ status, provider, updatedAt }: KYCStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={statusVariant[status]}>{status}</Badge>
      <span className="text-xs text-slate-500">{providerLabel[provider]}</span>
      {updatedAt && <span className="text-xs text-slate-400">{timeAgo(updatedAt)}</span>}
    </div>
  )
}
