import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DividendForm } from '@/components/dividends/dividend-form'

vi.mock('@/lib/errors/toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

const distributeMock = vi.fn().mockResolvedValue('abc123def456')
vi.mock('@/lib/contracts/services', () => ({
  distributeDividend: (...args: unknown[]) => distributeMock(...args),
}))

describe('DividendForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits a distribution with the selected asset and amounts', async () => {
    const onDistributed = vi.fn()
    const onClose = vi.fn()
    render(<DividendForm onClose={onClose} onDistributed={onDistributed} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. 125000'), { target: { value: '125000' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. 0.0125'), { target: { value: '0.0125' } })

    fireEvent.click(screen.getByRole('button', { name: /distribute dividends/i }))

    await waitFor(() => {
      expect(distributeMock).toHaveBeenCalledWith('1', '125000', '0.0125')
    })
    expect(onDistributed).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('cancels without submitting', () => {
    const onClose = vi.fn()
    render(<DividendForm onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalled()
    expect(distributeMock).not.toHaveBeenCalled()
  })
})
