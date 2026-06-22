import { useEffect, useState } from 'react'
import { Globe, Shield, Gavel, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchComplianceRules, fetchTransferRestrictions } from '@/lib/contracts/services'
import type { ComplianceRule, TransferRestriction } from '@/types'

const iconMap: Record<string, typeof Shield> = {
  kyc: Shield,
  transfer_limit: Gavel,
  investor_tier: Users,
  jurisdiction: Globe,
  custom: Shield,
}

export default function Compliance() {
  const [rules, setRules] = useState<ComplianceRule[]>([])
  const [restrictions, setRestrictions] = useState<TransferRestriction | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingJurisdictions, setEditingJurisdictions] = useState(false)
  const [jurisdictionInput, setJurisdictionInput] = useState('')

  useEffect(() => {
    Promise.all([fetchComplianceRules(), fetchTransferRestrictions()]).then(([r, t]) => {
      setRules(r)
      setRestrictions(t)
      setJurisdictionInput(t.rules.approvedJurisdictions.join(', '))
      setLoading(false)
    })
  }, [])

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  function updateRestrictions(updates: Partial<TransferRestriction['rules']>) {
    if (!restrictions) return
    setRestrictions({ ...restrictions, rules: { ...restrictions.rules, ...updates } })
  }

  if (loading) return <ComplianceSkeleton />

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Compliance Controls</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage KYC, transfer restrictions, and regulatory compliance settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => {
            const Icon = iconMap[rule.type] ?? Shield
            return (
              <div key={rule.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{rule.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{rule.description}</p>
                  </div>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  onClick={() => toggleRule(rule.id)}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      rule.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            Transfer Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Transfer Restrictions</p>
              <p className="text-xs text-slate-500">Apply transfer limits, holding periods, and jurisdiction rules</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                restrictions?.enabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              onClick={() =>
                setRestrictions((prev) => prev ? { ...prev, enabled: !prev.enabled } : null)
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  restrictions?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="max-transfer"
              label="Max Transfer Amount (USD)"
              type="number"
              value={restrictions?.rules.maxTransferAmount ?? ''}
              onChange={(e) => updateRestrictions({ maxTransferAmount: e.target.value })}
            />
            <Input
              id="min-hold"
              label="Min Holding Period (days)"
              type="number"
              value={restrictions?.rules.minHoldingPeriod ?? 0}
              onChange={(e) => updateRestrictions({ minHoldingPeriod: Number(e.target.value) })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Approved Jurisdictions</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (editingJurisdictions && jurisdictionInput) {
                    updateRestrictions({
                      approvedJurisdictions: jurisdictionInput.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  setEditingJurisdictions(!editingJurisdictions)
                }}
              >
                {editingJurisdictions ? 'Save' : 'Edit'}
              </Button>
            </div>
            {editingJurisdictions ? (
              <Input
                id="jurisdictions"
                placeholder="US, UK, DE, FR, SG"
                value={jurisdictionInput}
                onChange={(e) => setJurisdictionInput(e.target.value)}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {restrictions?.rules.approvedJurisdictions.map((j) => (
                  <Badge key={j} variant="outline">{j}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Require KYC for Transfers</p>
              <p className="text-xs text-slate-500">Both sender and receiver must have completed KYC</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                restrictions?.rules.requireKYC ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              onClick={() => updateRestrictions({ requireKYC: !restrictions?.rules.requireKYC })}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  restrictions?.rules.requireKYC ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary">Save All Changes</Button>
      </div>
    </div>
  )
}

function ComplianceSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  )
}
