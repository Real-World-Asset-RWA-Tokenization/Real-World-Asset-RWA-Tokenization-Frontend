import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Assets from '@/pages/assets'

describe('Assets', () => {
  it('renders tokenized assets from the service layer', async () => {
    render(
      <MemoryRouter>
        <Assets />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Manhattan Prime Office')).toBeInTheDocument()
    expect(screen.getByText('US Treasury Bill Fund')).toBeInTheDocument()
    expect(screen.getByText(/6 tokenized assets/)).toBeInTheDocument()
  })

  it('filters assets by search query', async () => {
    render(
      <MemoryRouter>
        <Assets />
      </MemoryRouter>,
    )
    await screen.findByText('Manhattan Prime Office')

    const search = screen.getByPlaceholderText('Search assets...')
    fireEvent.change(search, { target: { value: 'Treasury' } })

    expect(screen.queryByText('Manhattan Prime Office')).not.toBeInTheDocument()
    expect(screen.getByText('US Treasury Bill Fund')).toBeInTheDocument()
  })
})
