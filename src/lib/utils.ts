import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string, chars = 6): string {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatCurrency(value: string | number, decimals = 2): string {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatCompactNumber(value: string | number): string {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return '0'
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`
  return num.toFixed(2)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(date)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'approved':
    case 'completed':
      return 'emerald'
    case 'pending':
      return 'amber'
    case 'paused':
    case 'expired':
      return 'blue'
    case 'rejected':
    case 'failed':
    case 'closed':
      return 'red'
    default:
      return 'slate'
  }
}

export function getAssetClassLabel(assetClass: string): string {
  const labels: Record<string, string> = {
    real_estate: 'Real Estate',
    treasury: 'Treasury',
    invoice: 'Invoice',
    commodity: 'Commodity',
    equity: 'Equity',
    other: 'Other',
  }
  return labels[assetClass] ?? assetClass
}

export function getAssetClassColor(assetClass: string): string {
  const colors: Record<string, string> = {
    real_estate: 'bg-violet-500/10 text-violet-600',
    treasury: 'bg-blue-500/10 text-blue-600',
    invoice: 'bg-amber-500/10 text-amber-600',
    commodity: 'bg-emerald-500/10 text-emerald-600',
    equity: 'bg-rose-500/10 text-rose-600',
    other: 'bg-slate-500/10 text-slate-600',
  }
  return colors[assetClass] ?? colors.other
}
