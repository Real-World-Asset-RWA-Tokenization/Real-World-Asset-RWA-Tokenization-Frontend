import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Compliance from '@/pages/compliance'

vi.mock('@/lib/errors/toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

const updateRuleMock = vi.fn().mockResolvedValue(undefined)
vi.mock('@/lib/contracts/services', () => ({
  fetchComplianceRules: async () => [
    { id: '1', name: 'KYC Verification', type: 'kyc', enabled: true, description: 'desc', config: {} },
    { id: '2', name: 'Transfer Limit', type: 'transfer_limit', enabled: false, description: 'desc', config: {} },
  ],
  fetchTransferRestrictions: async () => ({
    id: '1',
    name: 'Default Transfer Policy',
    description: 'desc',
    enabled: true,
    rules: {
      maxTransferAmount: '500000',
      minHoldingPeriod: 30,
      approvedJurisdictions: ['US', 'UK'],
      requireKYC: true,
    },
  }),
  updateComplianceRule: (...args: unknown[]) => updateRuleMock(...args),
}))

describe('Compliance', () => {
  it('renders compliance rules and transfer restrictions', async () => {
    render(<Compliance />)

    expect(await screen.findByText('KYC Verification')).toBeInTheDocument()
    expect(screen.getByText('Transfer Limit')).toBeInTheDocument()
    expect(screen.getByText('Transfer Restrictions')).toBeInTheDocument()
    expect(screen.getByText('US')).toBeInTheDocument()
    expect(screen.getByText('UK')).toBeInTheDocument()
  })

  it('toggles a rule and saves all changes', async () => {
    render(<Compliance />)
    await screen.findByText('KYC Verification')

    const switches = screen.getAllByRole('switch')
    fireEvent.click(switches[1])

    fireEvent.click(screen.getByRole('button', { name: /save all changes/i }))

    await waitFor(() => {
      expect(updateRuleMock).toHaveBeenCalledWith('1', true)
      expect(updateRuleMock).toHaveBeenCalledWith('2', true)
    })
  })
})
