import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('boots all providers and renders the dashboard', async () => {
    render(<App />)

    // Lazy-loaded dashboard renders after Suspense resolves.
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(await screen.findByText('Total Assets')).toBeInTheDocument()

    // Shell chrome is present.
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
