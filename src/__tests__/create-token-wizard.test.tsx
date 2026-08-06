import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateTokenWizard } from '@/components/tokens/create-token-wizard'

vi.mock('@/lib/errors/toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

const deployTokenMock = vi.fn().mockResolvedValue('CC12345678')
vi.mock('@/lib/contracts/services', () => ({
  deployToken: (...args: unknown[]) => deployTokenMock(...args),
}))

describe('CreateTokenWizard', () => {
  it('walks through all three steps and deploys the token', async () => {
    const onCreated = vi.fn()
    const onClose = vi.fn()
    render(<CreateTokenWizard onClose={onClose} onCreated={onCreated} />)

    expect(screen.getByText(/Step 1 of 3/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText(/Step 2 of 3/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText(/Step 3 of 3/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /deploy contract/i }))
    await waitFor(() => expect(deployTokenMock).toHaveBeenCalled())
    expect(onCreated).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('cancels from the first step', () => {
    const onClose = vi.fn()
    render(<CreateTokenWizard onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalled()
  })
})
