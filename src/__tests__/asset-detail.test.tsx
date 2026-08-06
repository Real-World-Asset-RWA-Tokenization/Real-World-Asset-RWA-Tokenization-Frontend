import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import AssetDetail from '@/pages/asset-detail'

vi.mock('@/lib/errors/toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

vi.mock('@/lib/contracts/services', () => ({
  fetchAssetById: async (id: string) =>
    id === '1'
      ? {
          id: '1',
          name: 'Manhattan Prime Office',
          symbol: 'MPO-01',
          assetClass: 'real_estate',
          description: 'Tokenized commercial real estate',
          totalSupply: '10000000',
          circulatingSupply: '7500000',
          price: '125.00',
          issuer: 'GCK3...8J9F',
          contractId: 'CCX7...4F2A',
          createdAt: '2025-01-15T10:00:00Z',
          status: 'active',
          compliance: {
            kycRequired: true,
            kycProvider: 'sep12',
            transferRestrictions: true,
            investorWhitelistRequired: true,
          },
          distribution: {
            totalDistributed: '450000',
            lastDistribution: '2025-06-01T00:00:00Z',
            nextDistribution: '2025-07-01T00:00:00Z',
            apr: '5.2',
          },
        }
      : undefined,
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/assets/:id" element={<AssetDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AssetDetail', () => {
  it('renders asset details, compliance, and distribution sections', async () => {
    renderAt('/assets/1')

    expect(await screen.findByText('Manhattan Prime Office')).toBeInTheDocument()
    expect(screen.getByText('Compliance Settings')).toBeInTheDocument()
    expect(screen.getByText('Distribution Details')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /distribute yield/i })).toBeInTheDocument()
    expect(screen.getByText('5.2%')).toBeInTheDocument()
  })

  it('renders a not-found state for unknown assets', async () => {
    renderAt('/assets/nope')
    expect(await screen.findByText('Asset not found')).toBeInTheDocument()
  })
})
