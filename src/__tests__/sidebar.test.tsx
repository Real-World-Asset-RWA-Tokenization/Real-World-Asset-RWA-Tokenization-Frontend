import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Sidebar } from '@/components/layout/sidebar'

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    for (const label of ['Dashboard', 'Assets', 'Investors', 'Dividends', 'Compliance', 'Settings']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
    expect(screen.getByText('Stellar Testnet')).toBeInTheDocument()
  })
})
