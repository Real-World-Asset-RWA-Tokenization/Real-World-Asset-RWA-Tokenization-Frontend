import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Investors from '@/pages/investors'

describe('Investors', () => {
  it('renders the investor registry with KYC badges', async () => {
    render(
      <MemoryRouter>
        <Investors />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Alpha Ventures Ltd')).toBeInTheDocument()
    expect(screen.getByText('Gamma Treasury LLC')).toBeInTheDocument()
    expect(screen.getByText(/8 registered investors/)).toBeInTheDocument()
  })

  it('filters investors by KYC status', async () => {
    render(
      <MemoryRouter>
        <Investors />
      </MemoryRouter>,
    )
    await screen.findByText('Alpha Ventures Ltd')

    fireEvent.click(screen.getByRole('button', { name: /^Pending/ }))

    expect(screen.queryByText('Alpha Ventures Ltd')).not.toBeInTheDocument()
    expect(screen.getByText('Gamma Treasury LLC')).toBeInTheDocument()
  })
})
