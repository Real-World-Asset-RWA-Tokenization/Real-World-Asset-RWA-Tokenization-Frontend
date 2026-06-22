import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MOCK_ASSETS } from '@/lib/constants'

interface DividendFormProps {
  onClose: () => void
  onDistributed?: () => void
}

export function DividendForm({ onClose, onDistributed }: DividendFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    assetId: '',
    amount: '',
    perShare: '',
  })

  async function handleDistribute() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setLoading(false)
    onDistributed?.()
    onClose()
  }

  const assetOptions = MOCK_ASSETS.filter((a) => a.status === 'active').map((a) => ({
    value: a.id,
    label: `${a.name} (${a.symbol})`,
  }))

  return (
    <div className="space-y-4">
      <Select
        label="Asset"
        placeholder="Select asset to distribute"
        options={assetOptions}
        value={form.assetId}
        onChange={(e) => setForm((prev) => ({ ...prev, assetId: e.target.value }))}
      />
      <Input
        label="Total Distribution Amount (USD)"
        type="number"
        step="0.01"
        placeholder="e.g. 125000"
        value={form.amount}
        onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
      />
      <Input
        label="Amount Per Share"
        type="number"
        step="0.0001"
        placeholder="e.g. 0.0125"
        value={form.perShare}
        onChange={(e) => setForm((prev) => ({ ...prev, perShare: e.target.value }))}
      />
      <Separator className="my-4" />
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleDistribute} loading={loading}>
          Distribute Dividends
        </Button>
      </div>
    </div>
  )
}
