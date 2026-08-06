import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Dashboard from '@/pages/dashboard'

describe('Dashboard', () => {
  it('renders metrics, charts, and lists after loading', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    // Stat cards
    expect(await screen.findByText('Total Assets')).toBeInTheDocument()
    expect(screen.getByText('Total Investors')).toBeInTheDocument()
    expect(screen.getByText('Total Supply')).toBeInTheDocument()
    expect(screen.getByText('24h Volume')).toBeInTheDocument()

    // Sections
    expect(screen.getByText('Recent Assets')).toBeInTheDocument()
    expect(screen.getByText('Pending KYC Approvals')).toBeInTheDocument()

    // Asset list renders known mock data
    expect(screen.getByText('Manhattan Prime Office')).toBeInTheDocument()
  })

  it('renders a loading skeleton while fetching', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )
    // The skeleton is present before async data resolves.
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })
})
