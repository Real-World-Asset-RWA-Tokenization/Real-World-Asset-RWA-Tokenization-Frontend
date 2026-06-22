import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, ShieldCheck, ShieldX, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { fetchInvestorById } from '@/lib/contracts/services'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Investor } from '@/types'

export default function InvestorDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [investor, setInvestor] = useState<Investor | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchInvestorById(id).then((data) => {
      setInvestor(data ?? null)
      setLoading(false)
    })
  }, [id])

  async function handleKYCApprove() {
    setActionLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setInvestor((prev) => prev ? { ...prev, kycStatus: 'approved', whitelisted: true } : null)
    setActionLoading(false)
  }

  async function handleKYCReject() {
    setActionLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setInvestor((prev) => prev ? { ...prev, kycStatus: 'rejected' } : null)
    setActionLoading(false)
  }

  if (loading) return <DetailSkeleton />
  if (!investor) return <NotFound />

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
        onClick={() => navigate('/investors')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Investors
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">{investor.name}</h2>
            <Badge
              variant={
                investor.kycStatus === 'approved' ? 'success' :
                investor.kycStatus === 'pending' ? 'warning' : 'danger'
              }
            >
              {investor.kycStatus === 'approved' && <ShieldCheck className="h-3 w-3 mr-1" />}
              {investor.kycStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
              {investor.kycStatus === 'rejected' && <ShieldX className="h-3 w-3 mr-1" />}
              {investor.kycStatus}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">{investor.email}</p>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">{investor.address}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`mailto:${investor.email}`)}
          >
            Contact
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Total Balance</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(investor.balance)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Tokens Held</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{investor.tokensHeld}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">KYC Provider</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{investor.kycProvider === 'sep12' ? 'SEP-12' : 'Custom'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Whitelisted</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{investor.whitelisted ? 'Yes' : 'No'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              KYC / AML Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Status</span>
              <Badge
                variant={
                  investor.kycStatus === 'approved' ? 'success' :
                  investor.kycStatus === 'pending' ? 'warning' : 'danger'
                }
              >
                {investor.kycStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Provider</span>
              <span className="text-sm font-medium">{investor.kycProvider === 'sep12' ? 'SEP-12 Standard' : 'Custom Provider'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Joined</span>
              <span className="text-sm font-medium">{formatDate(investor.joinedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Activity</span>
              <span className="text-sm font-medium">{formatDate(investor.lastActivity)}</span>
            </div>
            <Separator />
            {investor.kycStatus === 'pending' && (
              <div className="flex gap-2">
                <Button variant="success" size="sm" onClick={handleKYCApprove} loading={actionLoading}>
                  <CheckCircle className="h-4 w-4" />
                  Approve KYC
                </Button>
                <Button variant="danger" size="sm" onClick={handleKYCReject} loading={actionLoading}>
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
            {investor.kycStatus === 'approved' && (
              <Button variant="outline" size="sm" onClick={handleKYCReject} loading={actionLoading}>
                Revoke KYC
              </Button>
            )}
            {investor.kycStatus === 'rejected' && (
              <Button variant="primary" size="sm" onClick={handleKYCApprove} loading={actionLoading}>
                Re-verify KYC
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Whitelist Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Whitelist Status</span>
              <Badge variant={investor.whitelisted ? 'success' : 'default'}>
                {investor.whitelisted ? 'Whitelisted' : 'Not Whitelisted'}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              Whitelisted investors can hold and transfer tokens for all assets that require whitelisting.
            </p>
            <Button
              variant={investor.whitelisted ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setInvestor((prev) => prev ? { ...prev, whitelisted: !prev.whitelisted } : null)}
            >
              {investor.whitelisted ? 'Remove from Whitelist' : 'Add to Whitelist'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-48" />
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
      <p className="text-lg font-medium text-slate-900">Investor not found</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate('/investors')}>Back to Investors</Button>
    </div>
  )
}
