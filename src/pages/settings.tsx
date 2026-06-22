import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function Settings() {
  const [form, setForm] = useState({
    issuerName: 'RWA Tokenization Inc.',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    kycProvider: 'sep12',
    kycEndpoint: 'https://kyc-provider.example.com/api',
    defaultApr: '5.0',
    notificationEmail: 'admin@rwa-platform.com',
  })

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Platform configuration and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issuer Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="issuer-name"
            label="Issuer Name"
            value={form.issuerName}
            onChange={(e) => updateField('issuerName', e.target.value)}
          />
          <Input
            id="notification-email"
            label="Notification Email"
            type="email"
            value={form.notificationEmail}
            onChange={(e) => updateField('notificationEmail', e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="rpc-url"
            label="Soroban RPC URL"
            value={form.rpcUrl}
            onChange={(e) => updateField('rpcUrl', e.target.value)}
          />
          <Input
            id="network-passphrase"
            label="Network Passphrase"
            value={form.networkPassphrase}
            onChange={(e) => updateField('networkPassphrase', e.target.value)}
          />
          <Button variant="outline" size="sm">Test Connection</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KYC Provider Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            id="kyc-provider"
            label="Provider Type"
            options={[
              { value: 'sep12', label: 'SEP-12 Standard' },
              { value: 'custom', label: 'Custom Provider' },
            ]}
            value={form.kycProvider}
            onChange={(e) => updateField('kycProvider', e.target.value)}
          />
          <Input
            id="kyc-endpoint"
            label="KYC API Endpoint"
            placeholder="https://..."
            value={form.kycEndpoint}
            onChange={(e) => updateField('kycEndpoint', e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Distribution Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="default-apr"
            label="Default APR (%)"
            type="number"
            step="0.1"
            value={form.defaultApr}
            onChange={(e) => updateField('defaultApr', e.target.value)}
          />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset</Button>
        <Button variant="primary">Save Settings</Button>
      </div>
    </div>
  )
}
