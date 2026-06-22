import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { TokenCard } from '@/components/tokens/token-card'
import { CreateTokenWizard } from '@/components/tokens/create-token-wizard'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchAssets } from '@/lib/contracts/services'
import type { Asset } from '@/types'

export default function Assets() {
  const navigate = useNavigate()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchAssets().then((data) => {
      setAssets(data)
      setLoading(false)
    })
  }, [])

  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <AssetsSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Assets</h2>
          <p className="text-sm text-slate-500 mt-1">{assets.length} tokenized assets</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          Tokenize Asset
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <TokenCard key={asset.id} asset={asset} onClick={() => navigate(`/assets/${asset.id}`)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-slate-900">No assets found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search</p>
        </div>
      )}

      <Dialog open={showCreate} onClose={() => setShowCreate(false)} title="Tokenize New Asset" className="max-w-xl">
        <CreateTokenWizard onClose={() => setShowCreate(false)} onCreated={() => fetchAssets().then(setAssets)} />
      </Dialog>
    </div>
  )
}

function AssetsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
