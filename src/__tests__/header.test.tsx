import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'

vi.mock('@/components/theme/theme-provider', () => ({
  useTheme: () => ({ theme: 'light', toggle: vi.fn() }),
}))

vi.mock('@/components/wallet/wallet-connect', () => ({
  WalletConnect: () => <span>mock wallet</span>,
}))

describe('Header', () => {
  it('renders the app name, theme toggle, and wallet control', () => {
    render(<Header />)
    expect(screen.getByText('RWA Tokenization Framework')).toBeInTheDocument()
    expect(screen.getByText('mock wallet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })
})
