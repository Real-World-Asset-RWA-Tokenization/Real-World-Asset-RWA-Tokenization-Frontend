import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DividendForm } from '@/components/dividends/dividend-form'
import { fetchDividends } from '@/lib/contracts/services'
import { formatCurrency, formatDate, formatCompactNumber } from '@/lib/utils'
import type { DividendDistribution } from '@/types'

export default function Dividends() {
  const [dividends, setDividends] = useState<DividendDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchDividends().then((data) => {
      setDividends(data)
      setLoading(false)
    })
  }, [])

  const totalDistributed = dividends
    .filter((d) => d.status === 'completed')
    .reduce((acc, d) => acc + Number(d.totalAmount), 0)

  const pendingCount = dividends.filter((d) => d.status === 'pending').length

  if (loading) return <DividendsSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dividend Distribution</h2>
          <p className="text-sm text-slate-500 mt-1">Manage yield and dividend distributions to investors</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          New Distribution
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Total Distributed</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalDistributed)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Total Distributions</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{dividends.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribution History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Per Share</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dividends.map((div) => (
                <TableRow key={div.id}>
                  <TableCell className="font-medium text-slate-900">{div.assetName}</TableCell>
                  <TableCell>{formatCurrency(div.totalAmount)}</TableCell>
                  <TableCell>{formatCurrency(div.perShare, 4)}</TableCell>
                  <TableCell>{formatCompactNumber(div.recipientsCount)}</TableCell>
                  <TableCell className="text-sm text-slate-500">{formatDate(div.date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={div.status === 'completed' ? 'success' : div.status === 'pending' ? 'warning' : 'danger'}
                    >
                      {div.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onClose={() => setShowForm(false)} title="New Dividend Distribution">
        <DividendForm onClose={() => setShowForm(false)} onDistributed={() => fetchDividends().then(setDividends)} />
      </Dialog>
    </div>
  )
}

function DividendsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}
