import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ASSET_CLASSES } from '@/lib/constants'
import type { AssetClass } from '@/types'

interface CreateTokenWizardProps {
  onClose: () => void
  onCreated?: () => void
}

export function CreateTokenWizard({ onClose, onCreated }: CreateTokenWizardProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    assetClass: '' as AssetClass | '',
    description: '',
    totalSupply: '',
    price: '',
    kycRequired: true,
    whitelistRequired: true,
    transferRestrictions: true,
  })

  function updateField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleDeploy() {
    setLoading(true)
    // Simulate contract deployment
    await new Promise((r) => setTimeout(r, 2000))
    setLoading(false)
    onCreated?.()
    onClose()
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`h-1 w-12 rounded ${s < step ? 'bg-blue-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Step {step} of 3: {step === 1 ? 'Asset Details' : step === 2 ? 'Tokenomics' : 'Compliance'}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Input
            id="token-name"
            label="Token Name"
            placeholder="e.g. Manhattan Prime Office"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="token-symbol"
              label="Symbol"
              placeholder="e.g. MPO-01"
              value={form.symbol}
              onChange={(e) => updateField('symbol', e.target.value)}
            />
            <Select
              id="asset-class"
              label="Asset Class"
              placeholder="Select class"
              options={ASSET_CLASSES.map((ac) => ({ value: ac.value, label: ac.label }))}
              value={form.assetClass}
              onChange={(e) => updateField('assetClass', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="mt-1.5 flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
              placeholder="Describe the asset being tokenized..."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Input
            id="total-supply"
            label="Total Supply"
            type="number"
            placeholder="e.g. 10000000"
            value={form.totalSupply}
            onChange={(e) => updateField('totalSupply', e.target.value)}
          />
          <Input
            id="token-price"
            label="Initial Price (USD)"
            type="number"
            step="0.01"
            placeholder="e.g. 125.00"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={form.kycRequired}
                onChange={(e) => updateField('kycRequired', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-slate-900">KYC/AML Verification Required</p>
                <p className="text-xs text-slate-500">Investors must pass KYC checks via SEP-12 provider</p>
              </div>
            </label>
          </div>
          <div className="rounded-lg border p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={form.whitelistRequired}
                onChange={(e) => updateField('whitelistRequired', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Investor Whitelist</p>
                <p className="text-xs text-slate-500">Only whitelisted addresses can hold or transfer tokens</p>
              </div>
            </label>
          </div>
          <div className="rounded-lg border p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={form.transferRestrictions}
                onChange={(e) => updateField('transferRestrictions', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Transfer Restrictions</p>
                <p className="text-xs text-slate-500">Enable transfer limits, holding periods, and jurisdiction filters</p>
              </div>
            </label>
          </div>
        </div>
      )}

      <Separator className="my-6" />

      <div className="flex justify-between">
        <Button variant="outline" onClick={step === 1 ? onClose : () => setStep(step - 1)}>
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          variant="primary"
          onClick={step === 3 ? handleDeploy : () => setStep(step + 1)}
          loading={loading}
        >
          {step === 3 ? 'Deploy Contract' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
