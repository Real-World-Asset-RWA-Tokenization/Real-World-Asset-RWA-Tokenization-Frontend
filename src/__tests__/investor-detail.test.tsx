import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import InvestorDetail from '@/pages/investor-detail'

vi.mock('@/lib/errors/toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

const approveKycMock = vi.fn().mockResolvedValue(undefined)
const rejectKycMock = vi.fn().mockResolvedValue(undefined)
const toggleWhitelistMock = vi.fn().mockResolvedValue(undefined)

vi.mock('@/lib/contracts/services', () => ({
  fetchInvestorById: async (id: string) =>
    id === '1'
      ? {
          id: '1',
          address: 'GA2X...8J9F',
          name: 'Alpha Ventures Ltd',
          email: 'alpha@example.com',
          kycStatus: 'pending',
          kycProvider: 'sep12',
          whitelisted: false,
          balance: '2500000',
          tokensHeld: 3,
          joinedAt: '2025-01-20T10:00:00Z',
          lastActivity: '2025-06-10T14:00:00Z',
        }
      : undefined,
  approveInvestorKyc: (...args: unknown[]) => approveKycMock(...args),
  rejectInvestorKyc: (...args: unknown[]) => rejectKycMock(...args),
  toggleWhitelist: (...args: unknown[]) => toggleWhitelistMock(...args),
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/investors/:id" element={<InvestorDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('InvestorDetail', () => {
  it('renders investor info, KYC details, and whitelist management', async () => {
    renderAt('/investors/1')

    expect(await screen.findByText('Alpha Ventures Ltd')).toBeInTheDocument()
    expect(screen.getByText('KYC / AML Details')).toBeInTheDocument()
    expect(screen.getByText('Whitelist Management')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /approve kyc/i })).toBeInTheDocument()
  })

  it('approves KYC through the service layer', async () => {
    renderAt('/investors/1')
    await screen.findByText('Alpha Ventures Ltd')

    fireEvent.click(screen.getByRole('button', { name: /approve kyc/i }))

    await waitFor(() => expect(approveKycMock).toHaveBeenCalledWith('1'))
    const approvedBadges = await screen.findAllByText('approved')
    expect(approvedBadges.length).toBeGreaterThan(0)
  })

  it('toggles the transfer whitelist', async () => {
    renderAt('/investors/1')
    await screen.findByText('Alpha Ventures Ltd')

    fireEvent.click(screen.getByRole('button', { name: /add to whitelist/i }))

    await waitFor(() => expect(toggleWhitelistMock).toHaveBeenCalledWith('1', true))
  })
})
