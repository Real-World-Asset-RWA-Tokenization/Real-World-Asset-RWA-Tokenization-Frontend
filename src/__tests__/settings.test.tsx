import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Settings from '@/pages/settings'

vi.mock('@/lib/errors/toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads defaults and saves to localStorage', () => {
    render(<Settings />)
    const input = screen.getByLabelText('Issuer Name') as HTMLInputElement
    expect(input.value).toBe('RWA Tokenization Inc.')

    fireEvent.change(input, { target: { value: 'New Co' } })
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }))

    const stored = JSON.parse(localStorage.getItem('rwa_settings') ?? '{}')
    expect(stored.issuerName).toBe('New Co')
  })

  it('resets to defaults and clears storage', () => {
    localStorage.setItem('rwa_settings', JSON.stringify({ issuerName: 'Temporary' }))
    render(<Settings />)

    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect((screen.getByLabelText('Issuer Name') as HTMLInputElement).value).toBe('RWA Tokenization Inc.')
    expect(localStorage.getItem('rwa_settings')).toBeNull()
  })
})
